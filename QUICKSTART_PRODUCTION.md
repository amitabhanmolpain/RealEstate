# Quick Start - Production Ready Backend

## What Was Done

Your Flask backend has been refactored for production-ready AWS EC2 deployment. All hardcoded values replaced, error handling added, and Gunicorn support enabled.

## Quick Verification

```bash
cd backend

# Set development environment (avoids JWT key requirement in dev)
export FLASK_ENV=development

# Test the app
python run.py
```

Visit in browser: `http://localhost:5000/health`

Should return:
```json
{
  "status": "ok",
  "database": "connected",
  "environment": "development"
}
```

## Production Deployment (EC2)

### 1. Generate JWT Secret
```bash
python -c 'import secrets; print(secrets.token_urlsafe(32))'
```
(You'll need this for .env file)

### 2. Create .env for Production
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```
FLASK_ENV=production
FLASK_DEBUG=False
JWT_SECRET_KEY=YOUR_GENERATED_SECRET_HERE
MONGO_URI=YOUR_MONGODB_ATLAS_URI
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 3. Test with Gunicorn (Production WSGI)
```bash
cd backend
pip install -r requirements.txt

# Set environment
export FLASK_ENV=production
export JWT_SECRET_KEY=YOUR_SECRET

# Run with Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### 4. Deploy to EC2
1. Follow the full guide in `DEPLOYMENT.md`
2. Set up systemd service for auto-start
3. Configure Nginx reverse proxy
4. Enable HTTPS with Let's Encrypt

## Key Files

| File | Purpose |
|------|---------|
| `backend/run.py` | Entry point - works with both dev and Gunicorn |
| `backend/app/__init__.py` | Flask app factory, error handlers, logging |
| `backend/app/config.py` | Configuration from environment variables |
| `backend/requirements.txt` | Added gunicorn, removed pika |
| `backend/.env.example` | Environment variables template |
| `DEPLOYMENT.md` | Complete EC2 setup guide |
| `PRODUCTION_READINESS.md` | Detailed refactoring documentation |

## What's Configured

✅ **Gunicorn**: Production WSGI server ready
  ```bash
  gunicorn -w 4 -b 0.0.0.0:5000 app:app
  ```

✅ **Environment Variables**: All config from `.env`
  ```python
  JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
  MONGO_URI = os.getenv("MONGO_URI")
  CORS_ORIGINS = os.getenv("CORS_ORIGINS")
  ```

✅ **CORS Support**: Already enabled, origins from environment
  ```
  CORS_ORIGINS=https://domain1.com,https://domain2.com
  ```

✅ **Health Check**: Available at `/health`
  ```bash
  curl http://localhost:5000/health
  ```

✅ **Error Handling**: 404, 401, 403, 500 errors handled gracefully

✅ **Logging**: Centralized, includes DB connection status

✅ **0.0.0.0 Binding**: Works on EC2 (configurable via FLASK_HOST)

✅ **Security**: 
  - No debug=True in production
  - JWT_SECRET_KEY required for production
  - No hardcoded credentials

## Development vs Production

### Development
```bash
export FLASK_ENV=development
python run.py
# Runs on 0.0.0.0:5000 with auto-reload
```

### Production
```bash
export FLASK_ENV=production
export JWT_SECRET_KEY=your-secret-key
gunicorn -w 4 -b 0.0.0.0:5000 app:app
# High-performance with multiple workers
```

## Common Commands

```bash
# Install dependencies
pip install -r requirements.txt

# Generate JWT secret
python -c 'import secrets; print(secrets.token_urlsafe(32))'

# Run development server
python run.py

# Run production server (Gunicorn)
gunicorn -w 4 -b 0.0.0.0:5000 app:app

# Check health
curl http://localhost:5000/health

# View app info
curl http://localhost:5000/
```

## Environment Variables

**Required for Production:**
- `JWT_SECRET_KEY` - Generate with secrets module

**Recommended:**
- `FLASK_ENV=production`
- `MONGO_URI=mongodb+srv://...`
- `CORS_ORIGINS=https://yourdomain.com`

**Optional:**
- `FLASK_HOST=0.0.0.0` (default)
- `FLASK_PORT=5000` (default)
- `LOG_LEVEL=INFO` (default)
- `MONGO_DB_NAME=real_estate` (default)

## Next Steps

1. ✅ Verify app starts: `python run.py`
2. ✅ Check `/health` endpoint works
3. ✅ Read `DEPLOYMENT.md` for EC2 setup
4. ✅ Follow deployment guide for production
5. ✅ Configure CORS_ORIGINS for your frontend domain
6. ✅ Set up monitoring and logging

## Support

**Documentation:**
- `DEPLOYMENT.md` - Full EC2 deployment guide
- `PRODUCTION_READINESS.md` - Detailed refactoring info

**If app won't start:**
1. Check `FLASK_ENV` is set correctly
2. Verify JWT_SECRET_KEY in production
3. Check MongoDB connection string
4. Review logs: `python -m flask --app app run --debug`

**If CORS errors:**
1. Check frontend domain is in `CORS_ORIGINS`
2. Verify HTTP method is allowed (GET, POST, etc.)
3. Check Authorization header is included

---

**Status**: ✓ Production Ready
**Last Updated**: 2026-03-21
