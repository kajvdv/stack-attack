from time import sleep

from httpx import Client
from selenium.webdriver.chrome.webdriver import WebDriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support import expected_conditions as EC

from accept.driver import Driver, Connection
from accept.drivers.http import HttpDriver
from backend.lobby.schemas import LobbyResponse
from bot.browser import connect, start_browser

# _WS_INTERCEPTOR = """
# (function() {
#     const orig = EventTarget.prototype.addEventListener;
#     EventTarget.prototype.addEventListener = function(type, listener, ...opts) {
#         if (this instanceof WebSocket && type === 'message') {
#             const wrapped = function(event) {
#                 try {
#                     const data = JSON.parse(event.data);
#                     if (data && data.topcard) window.__gameState = data;
#                 } catch(e) {}
#                 return listener.call(this, event);
#             };
#             return orig.call(this, type, wrapped, ...opts);
#         }
#         return orig.call(this, type, listener, ...opts);
#     };
# })();
# """


# def _inject_interceptor(browser: WebDriver):
#     browser.execute_cdp_cmd("Page.addScriptToEvaluateOnNewDocument", {"source": _WS_INTERCEPTOR})


def parse_card_src(src: str | None):
    if not src:
        raise Exception("Could not parse src")
    value, suit = src.split("/")[-1][:-4].split("_of_")
    return value, suit


class SeleniumDriver(Driver):
    def __init__(self, port: int, user: str) -> None:
        # self.http_driver = HttpDriver(Client(base_url="http://localhost:8000"))
        self.driver = connect(port)
        # options = Options()
        # options.add_argument(f'user-data-dir=data/{user}')
        # self.driver = WebDriver(options)
        self.driver.delete_all_cookies()
        self.driver.execute_cdp_cmd('Page.addScriptToEvaluateOnNewDocument', {
            'source': '''
                window.prompt = function() { return "player 2"; };
                window.alert = function() { return true; };
                window.confirm = function() { return true; };
            '''
        })
        # self.browser2 = start_browser(5002, "user2")
        # _inject_interceptor(self.browser1)
        # _inject_interceptor(self.browser2)
        self._home_count = 0

    def home(self):
        from accept.screens.selenium import SeleniumBrowserHomeScreen
        index = self._home_count
        self._home_count += 1
        browser = self.browser1 if index == 0 else self.browser2
        return SeleniumBrowserHomeScreen(browser)

    def create_and_join_lobby(self, config: dict) -> LobbyResponse:
        return self.http_driver.create_and_join_lobby(config)

    def create_game(self, config: dict) -> str:
        self.driver.get("http://localhost:4173/")

        # Click on create game button
        self.driver.find_element(value="create-game-btn").click()
        sleep(1)
        # Fill config for game
        self.driver.find_element(value="username-input").send_keys("player 1")
        self.driver.find_element(value="player-count-input").send_keys("2")

        # Confirm creating game
        self.driver.find_element(value="confirm-game-btn").click()
        sleep(1)
        code = self.driver.find_element(value='lobby-code-display').text

        return code


    def join_game(self, code: str, username: str) -> Connection:
        self.driver.get("http://localhost:4173/")

        # Fill in code
        self.driver.find_element(value='join-game-input').send_keys(code)
        self.driver.find_element(value='join-game-btn').click()

        WebDriverWait(self.driver, 2).until(
            EC.visibility_of_element_located((By.ID, "prompt-username"))
        ).send_keys(username)
        WebDriverWait(self.driver, 2).until(
            EC.visibility_of_element_located((By.ID, "confirm-username"))
        ).click()

        # Make sure the user sees the same code
        # sleep(1)
        # assert self.driver.find_element(value='lobby-code-display').text == code

    def wait_for_game_to_start(self) -> None:
        # Should be on lobby page
        element = WebDriverWait(self.driver, 2).until(
            lambda driver: "board" in self.driver.current_url
            # EC.visibility_of_element_located((By.ID, "player-item-2"))
        )
        sleep(1)
        # self.driver.find_element(value='player-item-2')

    @property
    def topcard(self):
        return parse_card_src(self.driver.find_element(value="top-card").get_attribute("src"))

    @property
    def hand(self):
        elements = self.driver.find_elements(By.CSS_SELECTOR, value="#own-hand > [data-testid=card]")
        return [parse_card_src(el.get_attribute("src")) for el in elements]


    def draw_card(self) -> None:
        self.driver.find_element(value="draw-stack").click()
        return

    def play_turn(self):
        # print(self.topcard)
        # print(self.hand)
        elements = self.driver.find_elements(By.CSS_SELECTOR, value="#own-hand [data-testid=card]")
        for el in elements:
            card = parse_card_src(el.get_attribute("src"))
            # print(self.topcard, (value, suit))
            if card[0] == self.topcard[0] or card[1] == self.topcard[1]:
                print("playing card", self.topcard, card)
                # el.click()
                ActionChains(self.driver).move_to_element_with_offset(el, -50, 0).click().perform()
                sleep(0.1)
                return
        self.draw_card()
        sleep(0.1)

    def get_lobbies(self) -> list[LobbyResponse]:
        return self.http_driver.get_lobbies()

    def join_lobby(self, lobby: LobbyResponse, username: str) -> Connection:
        return self.http_driver.join_lobby(lobby, username)

