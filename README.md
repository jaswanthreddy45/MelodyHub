# MelodyHub — Spotify-inspired demo

A learning project with a React frontend (HTML/CSS/JavaScript), Node.js/Express API, and Python/Flask recommendation service. Includes original synthesized demo audio; it does not use Spotify's private code or commercial music.

## Requirements
- Node.js LTS: https://nodejs.org/
- Python 3.10+: https://www.python.org/downloads/

## Run on Windows (keep 3 terminals open)

### Terminal 1: Python recommendation service
```powershell
cd recommender
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe app.py
```
Runs at http://127.0.0.1:5001. If `python` isn't recognized, create the venv with `py -3 -m venv .venv`.

### Terminal 2: Node API
```powershell
cd backend
npm install
npm start
```
Runs at http://localhost:5000.

### Terminal 3: React frontend
```powershell
cd frontend
npm install
npm run dev
```
Open the URL Vite prints, usually http://localhost:5173.

## Features
- Search tracks by title, artist, album, or genre
- Play/pause, next track, and volume control
- Responsive music-player interface
- “For You” recommendations served by Python through the Node API
- Express endpoints: `/api/tracks`, `/api/recommendations`, `/api/health`
- Flask endpoints: `/recommendations`, `/health`

The sample audio is a short synthesized melody for testing, not a commercial song. To add audio you own or are licensed to use, put it under `frontend/public/audio/` and update the track list in `backend/server.js`.

## Troubleshooting
- Keep all three terminals running.
- If a port is busy, stop the other app using it or change the port in the relevant file.
- If recommendations fail, check that Python is running on port 5001.
- If there is no sound, click Play and check the volume slider.
