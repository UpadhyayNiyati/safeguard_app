# SafeGuard Deployment Guide

Complete guide to deploy SafeGuard to production environments.

## 🚀 Frontend Deployment (Next.js)

### Option 1: Vercel (Recommended)

**Simplest deployment option - takes 5 minutes**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel

# Follow prompts to:
# 1. Connect GitHub account
# 2. Select project
# 3. Configure build settings
# 4. Add environment variables

# Set environment variables in Vercel dashboard:
NEXT_PUBLIC_API_URL=https://your-backend-api.com
```

### Option 2: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Configure in netlify.toml:
[build]
command = "pnpm build"
functions = "netlify/functions"

[[redirects]]
from = "/api/*"
to = "https://your-backend-api.com/api/:splat"
```

### Option 3: Self-Hosted (AWS, DigitalOcean)

```bash
# Build the application
pnpm build

# Install production server
npm i -g pm2

# Start with PM2
pm2 start npm --name "safeguard" -- start

# Setup reverse proxy with nginx
```

**nginx.conf:**
```nginx
server {
    listen 80;
    server_name safeguard.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔧 Backend Deployment (Flask)

### Option 1: Heroku

```bash
# Install Heroku CLI
curl https://cli.heroku.com/install.sh | sh

# Login to Heroku
heroku login

# Create app
heroku create safeguard-api

# Set environment variables
heroku config:set FLASK_SECRET_KEY=your_secret_key
heroku config:set MAIL_USERNAME=your_email@gmail.com
heroku config:set MAIL_PASSWORD=your_app_password
heroku config:set DATABASE_URI=mysql+pymysql://user:pass@host/db

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

**Create Procfile:**
```
web: gunicorn -w 4 app:app
```

**Create runtime.txt:**
```
python-3.11.0
```

### Option 2: Railway.app

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up

# Configure environment in Railway dashboard
```

### Option 3: AWS EC2

```bash
# SSH into EC2 instance
ssh -i your-key.pem ubuntu@your-instance.com

# Install dependencies
sudo apt update
sudo apt install python3 python3-pip python3-venv mysql-server nginx

# Clone repository
git clone https://github.com/your-repo/safeguard.git
cd safeguard/flask_backend

# Setup virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python packages
pip install -r requirements.txt
pip install gunicorn

# Setup systemd service
sudo nano /etc/systemd/system/safeguard.service
```

**safeguard.service:**
```ini
[Unit]
Description=SafeGuard Flask API
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/safeguard/flask_backend
Environment="PATH=/home/ubuntu/safeguard/flask_backend/venv/bin"
ExecStart=/home/ubuntu/safeguard/flask_backend/venv/bin/gunicorn -w 4 app:app

[Install]
WantedBy=multi-user.target
```

```bash
# Enable service
sudo systemctl enable safeguard
sudo systemctl start safeguard

# Setup nginx reverse proxy
sudo nano /etc/nginx/sites-available/safeguard
```

**nginx config:**
```nginx
server {
    listen 80;
    server_name api.safeguard.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/safeguard /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

### Option 4: Docker Deployment

**Create Dockerfile:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    mysql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY flask_backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY flask_backend/ .

# Expose port
EXPOSE 5000

# Run gunicorn
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

**Build and run:**
```bash
# Build image
docker build -t safeguard-api .

# Run container
docker run -d \
  -e FLASK_SECRET_KEY=your_key \
  -e DATABASE_URI=mysql://... \
  -e MAIL_USERNAME=your_email \
  -e MAIL_PASSWORD=your_password \
  -p 5000:5000 \
  safeguard-api

# Or use docker-compose
docker-compose up -d
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: your_password
      MYSQL_DATABASE: accident_finder_2
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  api:
    build: ./flask_backend
    ports:
      - "5000:5000"
    environment:
      FLASK_SECRET_KEY: your_secret_key
      DATABASE_URI: mysql+pymysql://root:your_password@mysql/accident_finder_2
      MAIL_USERNAME: your_email@gmail.com
      MAIL_PASSWORD: your_app_password
    depends_on:
      - mysql
    volumes:
      - ./flask_backend:/app

  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:5000
    depends_on:
      - api

volumes:
  mysql_data:
```

## 🔒 Production Security Checklist

- [ ] Change FLASK_SECRET_KEY to random value
- [ ] Use strong database passwords
- [ ] Enable HTTPS with SSL certificate
- [ ] Set CORS to specific domain only
- [ ] Enable database backups
- [ ] Setup firewall rules
- [ ] Monitor error logs
- [ ] Setup alerting for errors
- [ ] Rate limit API endpoints
- [ ] Hide sensitive error messages
- [ ] Keep dependencies updated
- [ ] Regular security audits

## 🌐 Domain & SSL Configuration

### Get Free SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d safeguard.com -d api.safeguard.com

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### Update Environment Variables

**Frontend:**
```env
NEXT_PUBLIC_API_URL=https://api.safeguard.com
```

**Backend:**
- Update CORS allowed origins
- Update email sender domain

## 📊 Monitoring & Logging

### Application Monitoring

```bash
# PM2 monitoring (frontend)
pm2 monit

# View logs
pm2 logs safeguard

# Setup notification on errors
pm2 install pm2-logrotate
```

### Database Monitoring

```bash
# Monitor MySQL
mysqldumpslow /var/log/mysql/mysql-slow.log

# Backup database
mysqldump -u root -p accident_finder_2 > backup.sql

# Restore database
mysql -u root -p accident_finder_2 < backup.sql
```

### Server Monitoring

- Setup CloudWatch (AWS)
- Setup DataDog
- Setup New Relic
- Monitor CPU, memory, disk usage

## 🔄 Continuous Deployment

### GitHub Actions Example

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Vercel
        run: vercel --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
```

## 📈 Scaling Considerations

### Frontend Scaling
- Use CDN (Vercel, Netlify)
- Enable image optimization
- Cache static assets
- Implement lazy loading

### Backend Scaling
- Use load balancer (nginx, HAProxy)
- Database connection pooling
- Cache frequent queries (Redis)
- Horizontal scaling with multiple instances

## 📱 Performance Optimization

### Frontend
```bash
# Enable compression
pnpm build  # Creates optimized build

# Analyze bundle
npm run build -- --analyze
```

### Backend
```python
# Add caching
from flask_caching import Cache
cache = Cache(app, config={'CACHE_TYPE': 'simple'})

# Use connection pooling
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'pool_size': 20,
    'pool_recycle': 280,
    'pool_pre_ping': True,
}
```

## ⚠️ Common Deployment Issues

### Issue: CORS Errors
**Solution**: Update CORS configuration with production domain
```python
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://safeguard.com"],
        "methods": ["GET", "POST", "OPTIONS"]
    }
})
```

### Issue: Database Connection Timeout
**Solution**: Increase pool size and add connection pooling
```python
'pool_size': 20,
'max_overflow': 40,
'pool_recycle': 280
```

### Issue: High API Response Time
**Solution**: Add caching and optimize database queries
```python
@app.route('/api/find-nearby', methods=['POST'])
@cache.cached(timeout=300)
def find_nearby():
    ...
```

### Issue: Out of Memory
**Solution**: Optimize image processing and implement pagination

## 📞 Support

For deployment issues:
- Check provider documentation
- Review application logs
- Check database connections
- Verify environment variables
- Contact hosting support

## 🎉 Success Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend API running and responding
- [ ] Database connected and populated
- [ ] Email notifications working
- [ ] Maps displaying correctly
- [ ] Emergency services finder functional
- [ ] All contact forms working
- [ ] SSL certificates valid
- [ ] Performance acceptable
- [ ] Error monitoring enabled
- [ ] Backups configured
- [ ] Team notified of launch

---

**SafeGuard** - Keeping You Safe, Every Step of the Way 🛡️
