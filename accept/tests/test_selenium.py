import pytest

from accept.drivers import SeleniumDriver
from accept.driver import Driver


@pytest.fixture
def player1():
    return SeleniumDriver(9001)


@pytest.fixture
def player2():
    return SeleniumDriver(9002)


def test_(player1: Driver, player2: Driver):
    code = player1.create_game({
        "name": "test game",
        "size": 2,
        "creator": "player 1"
    })
    print("the code was", code)

    player2.join_game(code)
    player1.wait_for_game_to_start()
    
    assert 0