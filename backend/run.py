from app import create_app

app = create_app()

if __name__ == "__main__":
    # Windows + Python 3.13 can raise WinError 10038 when the reloader spins threads.
    # Disable the reloader to avoid the socket select error while keeping debug logs.
    app.run(debug=True, use_reloader=False)
