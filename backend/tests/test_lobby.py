import pytest
from fastapi.testclient import TestClient

from backend.lobby.dependencies import get_lobbies, get_lobbies_ws, get_random_code
from pesten.lobby import Lobby


@pytest.fixture
def lobbies(app):
    lobbies = {}
    app.dependency_overrides[get_lobbies] = lambda: lobbies
    app.dependency_overrides[get_lobbies_ws] = lambda: lobbies
    return lobbies


@pytest.fixture(autouse=True)
def deterministic_code(app):
    i = iter(["AAAA", "AAAB", "AAAC"])
    def get_random_code_override():
        return next(i)
    app.dependency_overrides[get_random_code] = get_random_code_override


def get_testgame_config():
    return {
        "size": 2,
        "creator": "player 1"
    }


def test_create_lobby(client):
    assert client.post("/lobbies", json=get_testgame_config()).raise_for_status().json() == {
        'capacity': 2,
        'creator': 'player 1',
        'id': 'AAAA',
        'players': [
            'player 1',
        ],
        'you': 'player 1'
    }


def test_join_lobby(player_1: TestClient, player_2: TestClient):
    player_1.post("/lobbies", json=get_testgame_config())
    assert player_2.post(f"/lobbies/join?code=AAAA", json={"username": "player 2"}).json() == {
        'capacity': 2,
        'creator': 'player 1',
        'id': 'AAAA',
        'players': [
            'player 1',
            'player 2',
        ],
        'you': 'player 2'
    }


def test_without_a_username(player_1: TestClient, player_2: TestClient):
    player_1.post("/lobbies", json=get_testgame_config())
    assert player_2.post(f"/lobbies/join?code=AAAA").status_code == 422


def test_player_joins_with_the_same_name_gives_error(player_1: TestClient, player_2: TestClient):
    player_1.post("/lobbies", json=get_testgame_config())
    assert player_2.post(f"/lobbies/join?code=AAAA", json={'username': "player 1"}).status_code == 409


def test_player_2_joins_lobby(player_1: TestClient, player_2: TestClient):
    player_1.post("/lobbies", json=get_testgame_config())
    assert player_2.post("/lobbies/join?code=AAAA", json={"username": "player 2"}).json() == {
        'capacity': 2,
        'creator': 'player 1',
        'id': 'AAAA',
        'players': [
            'player 1',
            'player 2',
        ],
        'you': 'player 2'
    }


def test_player_joins_without_code(player_1):
    assert player_1.post("/lobbies/join").status_code == 400


def test_player_2_rejoins(player_1: TestClient, player_2: TestClient):
    player_1.post("/lobbies", json=get_testgame_config())
    player_2.post("/lobbies/join?code=AAAA", json={"username": "player 2"})
    assert player_2.post("/lobbies/join").json() == {
        'capacity': 2,
        'creator': 'player 1',
        'id': 'AAAA',
        'players': [
            'player 1',
            'player 2',
        ],
        "you": "player 2"
    }


def test_server_responding_properply_on_wrong_code(client):
    response = client.post("/lobbies/join?code=WRONG", json={'username': "player"})
    assert response.status_code == 404, response.json()


def test_player_3_joins_as_player_2(player_1: TestClient, player_2: TestClient, player_3: TestClient):
    player_1.post("/lobbies", json=get_testgame_config()).json()
    player_2.post("/lobbies/join?code=AAAA", json={"username": "player 2"})
    response = player_3.post("/lobbies/join?code=AAAA", json={"username": "player 2"})

    assert response.status_code == 409


def test_switch_from_lobbies(player_1: TestClient, player_2: TestClient, player_3: TestClient, lobbies: dict[str, Lobby]):

    # First game is created and joined
    player_1.post("/lobbies", json=get_testgame_config()).json()
    player_2.post(f"/lobbies/join?code=AAAA", json={"username": "player 2"}).raise_for_status()

    # Second game is created by third player
    player_3.post("/lobbies", json={
        "size": 2,
        "creator": "player 3"
    }).json()
    player_2.post(f"/lobbies/join?code=AAAB", json={"username": "player 2"}).raise_for_status()
    
    assert [p.name for p in lobbies['AAAA'].players] == ['player 1']
    assert [p.name for p in lobbies['AAAB'].players] == ['player 3', 'player 2']


def test_creating_two_lobbies_deletes_the_first_one(player_1: TestClient, lobbies: dict[str, Lobby]):
    player_1.post("/lobbies", json=get_testgame_config())
    player_1.post("/lobbies", json=get_testgame_config())
    assert list(lobbies.keys()) == ["AAAB"]


def test_player_2_changes_name_in_lobby():
    ...


def test_user_in_game_after_joining(client):
    ...


def test_lobby_deleted_if_not_started_after_while(client):
    ...


def test_lobby_gets_deleted_after_won():
    ...


def test_player_1_receives_message_after_connecting(player_1: TestClient):
    player_1.post("/lobbies", json={
        "size": 2,
        "creator": "player 1"
    }).raise_for_status()
    with player_1.websocket_connect("/lobbies/connect") as conn:
        game = conn.receive_json()

    assert game['message'] == "player 1 joined the game"


def test_player_1_receives_message_after_player_2_connect(player_1: TestClient, player_2: TestClient):
    player_1.post("/lobbies", json={
        "size": 2,
        "creator": "player 1"
    }).raise_for_status()
    player_2.post("/lobbies/join?code=AAAA", json={'username': 'player 2'})
    with (
        player_1.websocket_connect("/lobbies/connect") as conn_1,
        player_2.websocket_connect("/lobbies/connect"),
    ):
        conn_1.receive_json()
        game = conn_1.receive_json()

    assert game['message'] == "player 2 joined the game"