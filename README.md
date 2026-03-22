# Real Estate Full Stack Platform

Production-ready real estate web application with a React frontend and Flask backend, designed for deployment on AWS EC2 behind Nginx.

## Stack

- Frontend: React + Vite
- Backend: Flask REST API
- WSGI (Linux): Gunicorn
- WSGI (Windows): Waitress
- Reverse Proxy: Nginx
- Database: MongoDB

## Architecture

```text
Browser
  -> Nginx (port 80)
      -> /         static frontend (Vite build)
      -> /api      Flask API (127.0.0.1:5000)
          -> MongoDB
```

## Repository Structure

```text
backend/     Flask API, models, routes, production server entry
frontend/    React app (Vite)
DEPLOYMENT.md
PRODUCTION_READINESS.md
QUICKSTART_PRODUCTION.md
```

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm
- MongoDB (local or Atlas)
- Linux server (Ubuntu) for production deployment

## Local Development

### 1. Backend Setup

```bash
cd backend
python -m venv .venv
```

Activate virtual environment:

Linux/macOS:
```bash
source .venv/bin/activate
```

Windows PowerShell:
```powershell
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run backend (development mode):

```bash
python run.py
```

Health check:

```text
http://localhost:5000/health
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend dev server:

```text
http://localhost:5173
```

## API Base URL Configuration

For Nginx reverse proxy deployments, frontend API calls must use:

```js
const API_URL = "/api";
```

This repository is already configured to fall back to /api in frontend services.

## Production Deployment (AWS EC2 + Nginx)

### 1. Launch and Access EC2

- Create Ubuntu EC2 instance
- Allow inbound traffic for:
  - SSH (22)
  - HTTP (80)

Connect:

```bash
ssh -i "path/to/key.pem" ubuntu@YOUR_PUBLIC_IP
```

### 2. Clone Project

```bash
git clone https://github.com/YOUR_ORG/YOUR_REPO.git
cd real-estate-open-source
```

### 3. Backend on EC2 (Gunicorn)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Start backend:

```bash
gunicorn -w 4 -b 0.0.0.0:5000 run:app
```

Note: Gunicorn is for Linux. On Windows, use Waitress:

```powershell
waitress-serve --listen=0.0.0.0:5000 run:app
```

### 4. Frontend Build

```bash
cd ../frontend
npm install
npm run build
```

### 5. Install and Configure Nginx

```bash
sudo apt update
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

Deploy built frontend:

```bash
sudo rm -rf /var/www/html/*
sudo cp -r dist/* /var/www/html/
```

Update Nginx site config:

```bash
sudo nano /etc/nginx/sites-available/default
```

Use:

```nginx
server {
    listen 80;
    server_name _;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Reload Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Access URLs

- App: http://YOUR_PUBLIC_IP
- API through proxy: http://YOUR_PUBLIC_IP/api
- Backend health (direct): http://YOUR_PUBLIC_IP:5000/health

## Useful Commands

Check backend process:

```bash
ps aux | grep gunicorn
```

Check port usage:

```bash
sudo lsof -i :5000
```

Restart Nginx:

```bash
sudo systemctl restart nginx
```

## Troubleshooting

### Gunicorn error on Windows: No module named fcntl

Gunicorn is not supported on Windows. Use Waitress instead:

```powershell
waitress-serve --listen=0.0.0.0:5000 run:app
```

### Frontend loads but API fails

- Confirm backend is running on port 5000
- Confirm Nginx /api block exists and proxy_pass points to 127.0.0.1:5000
- Confirm frontend API base URL resolves to /api

### CORS errors

- Set allowed origins in backend environment variables
- Verify browser is calling the same host through /api in production

## Related Docs

- DEPLOYMENT.md
- QUICKSTART_PRODUCTION.md
- PRODUCTION_READINESS.md
