from pathlib import Path
from time import sleep

import pytest

from backend.lobby.schemas import LobbyCreate

pytest.register_assert_rewrite("accept.drivers")




@pytest.fixture(autouse=True)
def reload_server():
    import backend
    yield
    Path(backend.__file__).touch()
    sleep(1)