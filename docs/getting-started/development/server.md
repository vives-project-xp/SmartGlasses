# Server

This document covers installing server dependencies and running the FastAPI backend.

Prerequisites:

- Python 3.13
- pip

Install dependencies:

```bash
cd server
pip3 install -r requirements.txt
```

Run the server:

```bash
cd server
python3 src/main.py
```

The server will be available at `http://localhost:8000` by default. Adjust ports in `src/main.py` if needed.

Common tasks:

- To add dependencies, update `server/requirements.txt` and re-run the install command.
- For API testing use the interactive docs at `http://localhost:8000/docs` once server is running.
