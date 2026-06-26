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
from .dependencies import Lobbies, HumanConnection, create_game, get_random_code, get_lobbies_ws

from backend.game.schemas import GamePublic


logger = logging.getLogger(__name__)
router = APIRouter()


def decode_session_token(session_token):
    content = decode_token(session_token)
    username = content['sub']
    return username, content['lobby']


@router.post('', response_model=GamePublic)
async def create_lobby_route(
        response: Response,
        lobby_create: LobbyCreate,
        sessionToken: Annotated[str | None, Cookie()] = None,
        lobbies_crud: Lobbies = Depends(),
        game = Depends(create_game),
        random_code = Depends(get_random_code)
):
    if sessionToken:
        # Delete user
        username, lobby_name = decode_session_token(sessionToken)
        old_lobby = lobbies_crud.get_lobby(lobby_name)
        await old_lobby.delete_player(username)
        if not old_lobby.players:
            lobbies_crud.lobbies.pop(lobby_name)
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


@router.post("/join", response_model=GamePublic)
async def register_user_route(
    response: Response,
    username: Annotated[str | None, Body(embed=True)] = None,
    code: Annotated[str | None, Query()] = None,
    sessionToken: Annotated[str | None, Cookie()] = None,
    lobbies_crud: Lobbies = Depends(),
):
    if not sessionToken and not code:
        raise HTTPException(detail="Specify lobby code with query parameter", status_code=400)

    if sessionToken and code and username:
        curr_username, cookie_code = decode_session_token(sessionToken)
        if code != cookie_code:
            # Player switching from lobby
            current_lobby = lobbies_crud.get_lobby(cookie_code)
            new_lobby = lobbies_crud.get_lobby(code)
 
            await current_lobby.delete_player(curr_username)

            await new_lobby.connect(Player(username, NullConnection()))
            response.set_cookie("sessionToken", generate_token(username, code))
            return {
                'id': code,
                'capacity': new_lobby.capacity,
                'creator': new_lobby.creator,
                'players': [p.name for p in new_lobby.players],
                'you': username
            }

    elif sessionToken:
        username, cookie_code = decode_session_token(sessionToken)
        try:
            lobby = lobbies_crud.get_lobby(cookie_code)
        except HTTPException as e:
            print("deleting cookie")
            response.delete_cookie("sessionToken")
            return JSONResponse(content={"detail": e.detail}, headers={**response.headers}, status_code=e.status_code)
        return {
            'id': cookie_code,
            'capacity': lobby.capacity,
            'creator': lobby.creator,
            'players': [p.name for p in lobby.players],
            'you': username
        }
    elif code:
        if not username:
            raise HTTPException(422, "No username given.")
        lobby = lobbies_crud.get_lobby(code)
        usernames = [p.name for p in lobby.players]
        if username in usernames:
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
    raise Exception("Unhandled path")


@router.post("/leave", status_code=204)
async def user_leaves_route(
    response: Response,
    lobbies_crud: Annotated[Lobbies, Depends()],
    sessionToken: Annotated[str, Cookie()],
):
    username, lobby_code = decode_session_token(sessionToken)
    await lobbies_crud.delete_player_from_lobby(lobby_code, username)

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
        sessionToken: Annotated[str, Cookie()],
        lobbies: Annotated[dict[str, Lobby], Depends(get_lobbies_ws)]
):
    lobbies_crud = Lobbies(lobbies)
    username, lobby_id = decode_session_token(sessionToken)
    lobby = lobbies_crud.get_lobby(lobby_id)
    connection = HumanConnection(websocket, username)
    player = Player(connection.username, connection)
    logger.info(f"Connecting {connection.username} to {lobby_id}")
    await lobby.connect(player)

