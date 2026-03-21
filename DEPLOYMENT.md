# AWS EC2 Deployment Guide - Real Estate API

This guide explains how to deploy the Flask Real Estate API on AWS EC2.

## Prerequisites

- AWS Account with EC2 access
- EC2 Instance (Ubuntu 22.04 LTS recommended, t2.micro for testing)
- Security Group allowing:
  - Port 22 (SSH)
  - Port 80 (HTTP) if needed
  - Port 443 (HTTPS) for production
  - Port 5000 (API) for internal testing only

## Step 1: Launch EC2 Instance

1. Go to AWS Console → EC2 → Launch Instance
2. Choose: **Ubuntu Server 22.04 LTS** (free tier eligible)
3. Instance Type: **t2.micro** (free tier) or suitable tier
4. Configure Security Group to allow SSH (22) and HTTP/HTTPS (80/443)
5. Launch and save the key pair (.pem file)

## Step 2: SSH into Instance

```bash
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

## Step 3: Install System Dependencies

```bash
# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install Python and tools
sudo apt-get install -y python3 python3-pip python3-venv
sudo apt-get install -y git curl wget

# Install Node.js for frontend deployment (optional)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## Step 4: Clone Repository and Setup Backend

```bash
# Clone your repository
git clone <your-repo-url>
cd real-estate-open-source/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt
```

## Step 5: Configure Environment Variables

```bash
# Create .env file with production values
nano .env
```

Add the following (replace with your actual values):

```
FLASK_ENV=production
FLASK_DEBUG=False
FLASK_HOST=0.0.0.0
FLASK_PORT=5000

# Generate JWT secret: python -c 'import secrets; print(secrets.token_urlsafe(32))'
JWT_SECRET_KEY=your-generated-secret-key-here

# Use MongoDB Atlas connection string
MONGO_URI=mongodb+srv://username:password@your-cluster.mongodb.net/real_estate?retryWrites=true&w=majority

# Frontend origins (your deployed frontend URL)
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

LOG_LEVEL=INFO
```

Press Ctrl+X, then Y, then Enter to save.

## Step 6: Test Backend Locally

```bash
# Still in venv
python run.py
```

Visit `http://localhost:5000/health` in your browser. You should see JSON response.

Stop with Ctrl+C.

## Step 7: Install and Configure Gunicorn

```bash
# Already installed in requirements.txt, but verify
pip list | grep gunicorn
```

## Step 8: Create Systemd Service for Auto-Start

This ensures your API restarts automatically if it crashes or EC2 reboots.

```bash
# Create systemd service file
sudo nano /etc/systemd/system/real-estate-api.service
```

Add the following content (replace `ubuntu` if using different user, and paths):

```ini
[Unit]
Description=Real Estate API Flask Application
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/real-estate-open-source/backend
Environment="PATH=/home/ubuntu/real-estate-open-source/backend/venv/bin"
ExecStart=/home/ubuntu/real-estate-open-source/backend/venv/bin/gunicorn -w 4 -b 0.0.0.0:5000 --timeout 60 app:app

# Auto-restart on failure
Restart=always
RestartSec=10

# Logging
StandardOutput=journal
StandardError=journal
SyslogIdentifier=real-estate-api

[Install]
WantedBy=multi-user.target
```

Save with Ctrl+X, Y, Enter.

## Step 9: Enable and Start Service

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable service to start on boot
sudo systemctl enable real-estate-api.service

# Start service
sudo systemctl start real-estate-api.service

# Check status
sudo systemctl status real-estate-api.service

# View logs
sudo journalctl -u real-estate-api.service -f
```

## Step 10: Set Up Nginx Reverse Proxy (Optional but Recommended)

Nginx acts as a reverse proxy, handling HTTP/HTTPS and forwarding to Gunicorn.

```bash
# Install Nginx
sudo apt-get install -y nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/real-estate-api
```

Add the following:

```nginx
upstream real_estate_api {
    server 127.0.0.1:5000;
}

server {
    listen 80;
    server_name _;  # Replace with your domain

    client_max_body_size 10M;

    location / {
        proxy_pass http://real_estate_api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support (if needed)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Health check exempt from checks
    location /health {
        proxy_pass http://real_estate_api;
        access_log off;
    }
}
```

Save with Ctrl+X, Y, Enter.

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/real-estate-api /etc/nginx/sites-enabled/

# Test Nginx config
sudo nginx -t

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Restart to apply changes
sudo systemctl restart nginx
```

Now your API is accessible on port 80 (HTTP).

## Step 11: Set Up SSL/HTTPS with Let's Encrypt (Recommended for Production)

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Get certificate (replace with your domain)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal should be configured automatically
sudo systemctl status certbot.timer
```

## Step 12: Verify Deployment

```bash
# Check API is running
curl http://localhost:5000/health

# Check API from public IP
curl http://your-ec2-public-ip/health

# Check logs
sudo journalctl -u real-estate-api.service -n 50
```

## Monitoring and Maintenance

### View logs in real-time
```bash
sudo journalctl -u real-estate-api.service -f
```

### Restart service
```bash
sudo systemctl restart real-estate-api.service
```

### Update code
```bash
cd /home/ubuntu/real-estate-open-source
git pull origin main
cd backend
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart real-estate-api.service
```

### Check service health
```bash
sudo systemctl status real-estate-api.service
curl http://localhost:5000/health
```

## Performance Tuning

### Gunicorn Worker Configuration

In `/etc/systemd/system/real-estate-api.service`, adjust workers based on CPU cores:

```bash
# Get CPU count
nproc

# Typical formula: (2 × CPU_cores) + 1
# For 2 cores: 5 workers
# For 4 cores: 9 workers
```

Update ExecStart:
```
ExecStart=/home/ubuntu/real-estate-open-source/backend/venv/bin/gunicorn -w 9 -b 0.0.0.0:5000 --timeout 60 app:app
```

### Increase file descriptors if needed
```bash
sudo nano /etc/security/limits.conf
# Add at end:
# * soft nofile 65535
# * hard nofile 65535
```

## Troubleshooting

### Port already in use
```bash
sudo lsof -i :5000
sudo kill -9 <PID>
```

### Gunicorn not starting
```bash
# Check service log
sudo journalctl -u real-estate-api.service -n 100

# Run gunicorn manually to see error
cd /home/ubuntu/real-estate-open-source/backend
source venv/bin/activate
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### MongoDB connection issues
- Verify MONGO_URI in .env
- Check if MongoDB Atlas IP whitelist includes EC2 security group
- Test connection: `python -c "from pymongo import MongoClient; MongoClient(os.getenv('MONGO_URI')).admin.command('ping')"`

### CORS errors
- Verify CORS_ORIGINS includes your frontend domain
- Check /health endpoint returns correct environment

## Security Checklist

- [ ] JWT_SECRET_KEY is strong and unique per environment
- [ ] MONGO_URI credentials are secure (use IAM roles if possible)
- [ ] CORS_ORIGINS only includes your actual domains
- [ ] SSL/HTTPS enabled (Let's Encrypt)
- [ ] Security group restricts ports appropriately
- [ ] Regular backups of MongoDB
- [ ] Monitor logs for suspicious activity
- [ ] Keep dependencies updated: `pip list --outdated`

## Scaling Beyond EC2

For higher traffic, consider:
- Load balancing with multiple EC2 instances
- RDS for managed database
- ElastiCache for caching
- CloudFront for CDN
- Auto-scaling groups

## Support

For issues, check:
1. Service logs: `sudo journalctl -u real-estate-api.service -f`
2. Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. .env file is correctly configured
4. MongoDB connection is working
5. Frontend CORS_ORIGINS matches deployment
