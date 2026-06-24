import typer

from bot.browser import start_browser

app = typer.Typer()

@app.command()
def startbrowser(port: int, user: str):
    driver = start_browser(port, user)
    while True:
        try:
            _ = driver.current_url
        except Exception:
            break


@app.command()
def startbrowsers():
    driver1 = start_browser(9001, "user1")
    driver2 = start_browser(9002, "user2")
    while True:
        try:
            _ = driver1.current_url
            _ = driver2.current_url
        except Exception:
            break


def main():
    app()