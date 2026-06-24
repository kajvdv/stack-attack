import pytest

from accept.drivers import SeleniumDriver


@pytest.fixture
def player1():
    return SeleniumDriver(9001)


@pytest.fixture
def player2():
    return SeleniumDriver(9002)


def test_(player1: SeleniumDriver, player2: SeleniumDriver):
    code = player1.create_game({
        "name": "test game",
        "size": 2,
        "creator": "player 1"
    })
    print("the code was", code)

    player2.join_game(code)
    
    assert 0