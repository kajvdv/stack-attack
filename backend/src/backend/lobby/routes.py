# TODO: Have a player be replaced by an AI if they don't join back on time
from typing import Annotated
import logging
import random
import string
import urllib.parse

from fastapi import APIRouter, Depends, Form, Request, WebSocket, Response, Body, Path, HTTPException, Cookie, Query
from fastapi.responses import JSONResponse
from jose.exceptions import ExpiredSignatureError

# from backend.auth import get_current_user, generate_access_token, decode_token
from backend.token import generate_token, decode_token
from pesten.lobby import Player, NullConnection, Lobby
from .schemas import LobbyCreate, LobbyResponse, Card, Registration
from .dependencies import Lobbies, HumanConnection, create_game, get_random_code, get_lobbies_ws, get_session_token, decode_session_token

from backend.game.schemas import GamePublic


logger = logging.getLogger(__name__)
router = APIRouter()


@router.post('', response_model=GamePublic)
async def create_lobby_route(
        response: Response,
        lobby_create: LobbyCreate,
        session_content: Annotated[tuple[str, Lobby] | None, Depends(get_session_token)] = None,
        lobbies_crud: Lobbies = Depends(),
        game = Depends(create_game),
        random_code = Depends(get_random_code)
):
    if session_content:
        # Delete user
        username, old_lobby = session_content
        await lobbies_crud.delete_player_from_lobby(old_lobby, username)
    lobby_create.name = random_code
    lobby = await lobbies_crud.create_lobby(lobby_create, game)
    
    response.set_cookie("sessionToken", generate_token(lobby.creator, random_code))
    return {
        'id': random_code,
        'capacity': lobby.capacity,
        'creator': lobby.creator,
        'players': [p.name for p in lobby.players],
        'you': lobby.creator
    }


@router.get("/current")
def get_current_lobby_route(
    session_content: Annotated[tuple[str, Lobby] | None, Depends(get_session_token)] = None,
    lobbies_crud: Lobbies = Depends(),
):
    if not session_content:
        raise HTTPException(400, "Not in a session.")
    cookie_username, lobby = session_content
    return {
        'id': lobbies_crud.get_lobby_code(lobby),
        'capacity': lobby.capacity,
        'creator': lobby.creator,
        'players': [p.name for p in lobby.players],
        'you': cookie_username
    }


@router.post("/join", response_model=GamePublic)
async def register_user_route(
    response: Response,
    username: Annotated[str | None, Body(embed=True)] = None,
    code: Annotated[str | None, Query()] = None,
    session_content: Annotated[tuple[str, Lobby] | None, Depends(get_session_token)] = None,
    lobbies_crud: Lobbies = Depends(),
):
    if code:
        query_lobby = lobbies_crud.get_lobby(code)
        if session_content:
            cookie_username, cookie_lobby = session_content
            await cookie_lobby.delete_player(cookie_username)

        if not username and session_content:
            _, cookie_lobby = session_content
            if cookie_lobby != query_lobby:
                raise HTTPException(422, "No username was given.")
        elif not username:
            raise HTTPException(422, "No username was given.")
        lobby = lobbies_crud.get_lobby(code)
        if lobby.username_taken(username):
            raise HTTPException(409, "Username already taken.")


        await lobby.connect(Player(username, NullConnection()))
        response.set_cookie("sessionToken", generate_token(username, code))
        return {
            'id': code,
            'capacity': lobby.capacity,
            'creator': lobby.creator,
            'players': [p.name for p in lobby.players],
            'you': username
        }
    
    elif session_content:
        cookie_username, lobby = session_content
        return {
            'id': lobbies_crud.get_lobby_code(lobby),
            'capacity': lobby.capacity,
            'creator': lobby.creator,
            'players': [p.name for p in lobby.players],
            'you': cookie_username
        }

    else:
        raise HTTPException(detail="No code or session token.", headers=dict(response.headers), status_code=422)



@router.post("/leave", status_code=204)
async def user_leaves_route(
    response: Response,
    lobbies_crud: Annotated[Lobbies, Depends()],
    session_content: Annotated[tuple[str, Lobby] | None, Depends(get_session_token)] = None,
):
    if session_content:
        username, lobby = session_content
        await lobbies_crud.delete_player_from_lobby(lobby, username)

        response.delete_cookie("sessionToken")


# @router.get('/{lobby_id}/rules')
# def get_lobby_rules(lobby_id, request: Request):
#     lobbies = request.state.lobbies
#     lobby = lobbies[lobby_id]
#     assert lobby
#     return {Card.from_int(value).value: rule for value, rule in lobby.game.rules.items()}


@router.websocket("/connect")
async def connect_to_lobby(
        websocket: WebSocket,
        username_and_lobby_id: Annotated[str, Depends(decode_session_token)],
        lobbies: Annotated[dict[str, Lobby], Depends(get_lobbies_ws)]
):
    username, lobby_id = username_and_lobby_id
    lobbies_crud = Lobbies(lobbies)
    lobby = lobbies_crud.get_lobby(lobby_id)
    connection = HumanConnection(websocket, username)
    player = Player(connection.username, connection)
    await lobby.connect(player)

