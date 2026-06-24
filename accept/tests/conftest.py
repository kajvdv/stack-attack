from pathlib import Path
from time import sleep

import pytest

from backend.lobby.schemas import LobbyCreate
from accept.generate import generate_chooses

pytest.register_assert_rewrite("accept.drivers")


@pytest.fixture
def chooses():
    return generate_chooses(LobbyCreate(name="test game", size=2, creator="player 1"), seed=42)


@pytest.fixture(autouse=True)
def reload_server():
    import backend
    yield
    Path(backend.__file__).touch()
    sleep(1)