import typer
import uvicorn


app = typer.Typer()


@app.callback()
def callback():
    pass


@app.command("list")
def list_lobbies():
    print("hello")


@app.command("run")
def run_server():
    uvicorn.run("backend.main:app", port=8000, log_level="info", env_file=".env", reload=True)


def main():
    app()


if __name__ == "__main__":
    main()