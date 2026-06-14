from fastapi.testclient import TestClient


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

def test_join_twice(client):
    ...

def test_user_in_game_after_joining(client):
    ...

def test_lobby_deleted_if_not_started_after_while(client):
    ...