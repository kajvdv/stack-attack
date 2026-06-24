import pytest
from fastapi.testclient import TestClient

from backend.lobby.dependencies import get_lobbies
from pesten.lobby import Lobby


@pytest.fixture
def lobbies(app):
    lobbies = {}
    app.dependency_overrides[get_lobbies] = lambda: lobbies
    return lobbies


def get_testgame_config():
    return {
        "size": 2,
        "creator": "player 1"
    }


def test_create_game(client):
    lobby = client.post("/lobbies", json=get_testgame_config()).raise_for_status().json()
    assert client.get(f"/lobbies/{lobby['id']}").raise_for_status().json() == lobby


def test_second_player_in_game_after_join(player_1: TestClient, player_2: TestClient):
    lobby = player_1.post("/lobbies", json=get_testgame_config()).json()
    player_2.post(f"/lobbies/{lobby['id']}/join", json={"username": "player 2"}).raise_for_status()
    assert player_2.get(f"/lobbies/{lobby['id']}").json()['players'] == ["player 1", "player 2"]


def test_server_responding_properply_on_wrong_code(client):
    response = client.post("/lobbies/WRONG/join", json={'username': "player"})
    assert response.status_code == 404, response.json()


def test_switch_from_lobbies(player_1: TestClient, player_2: TestClient):

    # First game is created
    lobby = player_1.post("/lobbies", json=get_testgame_config()).json()
    player_2.post(f"/lobbies/{lobby['id']}/join", json={"username": "player 2"}).raise_for_status()

    # Second game is created
    lobby = player_1.post("/lobbies", json=get_testgame_config()).json()
    response = player_2.post(f"/lobbies/{lobby['id']}/join", json={"username": "player 2"}).raise_for_status()
    assert response.status_code == 204


def test_creating_two_lobbies_deletes_the_first_one(player_1: TestClient, lobbies: dict[str, Lobby]):
    player_1.post("/lobbies", json=get_testgame_config()).json()['id']
    code_2 = player_1.post("/lobbies", json=get_testgame_config()).json()['id']
    assert list(lobbies.keys()) == [code_2]


def test_player_2_switches_between_lobbies_will_remove_it_from_the_first_one(
        player_1: TestClient,
        player_2: TestClient,
        player_3: TestClient,
        lobbies: dict[str, Lobby]
):
    code_1 = player_1.post("/lobbies", json={
        "size": 2,
        "creator": "player 1"
    }).json()['id']
    code_2 = player_3.post("/lobbies", json={
        "size": 2,
        "creator": "player 3"
    }).json()['id']

    player_2.post(f"/lobbies/{code_1}/join", json={"username": "player 2"}).raise_for_status()
    player_2.post(f"/lobbies/{code_2}/join", json={"username": "player 2"}).raise_for_status()

    assert [p.name for p in list(lobbies.values())[0].players] == ['player_1']
    assert [p.name for p in list(lobbies.values())[1].players] == ['player_3', 'player_2']


def test_handle_expired_token_error():
    ...


def test_user_in_game_after_joining(client):
    ...

def test_lobby_deleted_if_not_started_after_while(client):
    ...