# from backend.cli import app as cli_app
# from backend.main import app


def get_testgame_config():
    return {
        "size": 2,
        "creator": "player 1"
    }


def test_create_game(client):
    lobby = client.post("/lobbies", json=get_testgame_config()).raise_for_status().json()
    assert client.get(f"/lobbies/{lobby['id']}").raise_for_status().json() == lobby


# def test_game_public_after_first_player_connects(client):
#     lobby = client.post("/lobbies", json=get_testgame_config()).json()
#     with client.websocket_connect(f"/lobbies/{lobby['id']}/connect") as conn:
#         assert client.get("/lobbies").json() == [lobby]


def test_server_responding_properply_on_wrong_code(client):
    response = client.post("/lobbies/WRONG/join")
    assert response.status_code == 404, response.json()

def test_join_twice(client):
    ...

def test_user_in_game_after_joining(client):
    ...

def test_lobby_deleted_if_not_started_after_while(client):
    ...