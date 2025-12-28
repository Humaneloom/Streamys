# Streamys - Production Deployment

> Enterprise-grade streaming management system with microservices architecture

## 🏗️ Architecture

Streamys consists of three separate services orchestrated with Docker and Nginx:

```
┌─────────────────────────────────────────────────────────────┐
│                         Internet                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
                   ┌──────────┐
                   │  Nginx   │ Reverse Proxy
                   │  :80/443 │
                   └─────┬────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
  ┌──────────┐    ┌────────────┐   ┌─────────┐
  │ Landing  │    │  Frontend  │   │ Backend │
  │  :3000   │    │   :3001    │   │  :5000  │
  └──────────┘    └────────────┘   └────┬────┘
                                         │
                                         ▼
                                   ┌──────────┐
                                   │ MongoDB  │
                                   │  :27017  │
                                   └──────────┘
```

### Services

1. **Landing Page** - Vite + React + Express SSR marketing site
2. **Frontend** - React SPA with Material-UI for the main application
3. **Backend** - Express REST API with MongoDB
4. **MongoDB** - Database for user data and content
5. **Nginx** - Reverse proxy and load balancer

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies for each service
cd backend && npm install
cd ../frontend && npm install
cd ../streamys_landing && npm install

# Start services individually
cd backend && npm run dev
cd frontend && npm start
cd streamys_landing && npm run dev
```

### Production Deployment

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for comprehensive deployment guide.

**Quick production deployment:**

```bash
# 1. Setup VPS (Ubuntu)
sudo bash scripts/setup-vps.sh

# 2. Configure environment
cp .env.production .env
nano .env  # Add your production values

# 3. Deploy
bash scripts/deploy.sh

# 4. Setup SSL
sudo certbot certonly --standalone -d yourdomain.com
cp /etc/letsencrypt/live/yourdomain.com/*.pem nginx/ssl/
docker-compose restart nginx
```

## 📋 Prerequisites

### Production Server
- Ubuntu 20.04/22.04/24.04 LTS
- 2+ GB RAM
- 2+ vCPU cores
- 20+ GB SSD
- Static IP address

### Required Services
- Domain name
- MongoDB (included in docker-compose)
- Razorpay account (for payments)
- SMTP email service

## 🛠️ Technology Stack

| Component | Technology |
|-----------|------------|
| Landing Page | Vite, React, TypeScript, Express |
| Frontend | React, Material-UI, Redux |
| Backend | Node.js, Express, MongoDB |
| Database | MongoDB 7.0 |
| Reverse Proxy | Nginx |
| Container | Docker, Docker Compose |
| SSL | Let's Encrypt |

## 📁 Project Structure

```
streamys/
├── backend/                 # Express API server
│   ├── controllers/        # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── Dockerfile         # Production Docker image
│   └── index.js           # Entry point
├── frontend/               # React SPA
│   ├── public/            # Static assets
│   ├── src/               # React components
│   ├── Dockerfile         # Production Docker image
│   └── nginx.conf         # Nginx config for SPA
├── streamys_landing/       # Landing page
│   ├── client/            # React frontend
│   ├── server/            # Express SSR server
│   └── Dockerfile         # Production Docker image
├── nginx/                  # Reverse proxy config
│   ├── nginx.conf         # Main Nginx config
│   ├── conf.d/            # Site configurations
│   └── ssl/               # SSL certificates
├── scripts/                # Deployment automation
│   ├── deploy.sh          # Deployment script
│   ├── setup-vps.sh       # VPS setup script
│   ├── backup.sh          # Backup automation
│   └── health-check.sh    # Health monitoring
├── docs/                   # Documentation
│   ├── DEPLOYMENT.md      # Deployment guide
│   └── PRODUCTION_CHECKLIST.md
├── docker-compose.yml      # Multi-service orchestration
└── .env.production        # Environment template
```

## 🔧 Configuration

### Environment Variables

Copy `.env.production` to `.env` and configure:

```bash
# MongoDB (Development - No Authentication)
# Current setup for easier development
MONGO_URL=mongodb://mongodb:27017/school

# MongoDB (Production - With Authentication)
# Uncomment and configure for production:
# MONGO_ROOT_USER=admin
# MONGO_ROOT_PASSWORD=your_strong_password
# MONGO_URL=mongodb://admin:your_strong_password@mongodb:27017/school?authSource=admin

# Backend
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Domain
DOMAIN=yourdomain.com
CORS_ORIGINS=https://yourdomain.com
```

**Note**: See [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md#mongodb-configuration) for detailed MongoDB configuration.

### Port Mapping

| Service | Internal Port | External Port (Nginx) | Public URL |
|---------|---------------|----------------------|------------|
| Landing | 3000 | - | `/` |
| Frontend | 80 (nginx) | - | `/app` |
| Backend | 5000 | - | `/api` |
| Nginx | - | 80, 443 | All traffic |
| MongoDB | 27017 | Localhost only | - |

## 📊 Monitoring

### Health Checks

```bash
# Run health check script
bash scripts/health-check.sh

# Check individual services
curl http://localhost/health
curl http://localhost/api/health
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f nginx
```

### Resource Monitoring

```bash
# Container stats
docker stats

# Disk usage
df -h

# Memory usage
free -h
```

## 🔄 Maintenance

### Backup MongoDB

```bash
# Manual backup
bash scripts/backup.sh

# Scheduled backups (add to crontab)
0 2 * * * cd /var/www/streamys && bash scripts/backup.sh
```

### Update Application

```bash
# Pull latest code
git pull origin main

# Redeploy
bash scripts/deploy.sh
```

### Restart Services

```bash
# All services
docker-compose restart

# Single service
docker-compose restart backend
```

## 🔒 Security

- ✅ All services run as non-root users
- ✅ Firewall configured (UFW)
- ✅ SSL/TLS encryption with Let's Encrypt
- ✅ Security headers in Nginx
- ✅ Rate limiting on API endpoints
- ✅ CORS restrictions
- ✅ MongoDB authentication enabled
- ✅ JWT for API authentication
- ✅ Environment variables for secrets

## 🐛 Troubleshooting

See [DEPLOYMENT.md](docs/DEPLOYMENT.md#troubleshooting) for detailed troubleshooting guide.

**Common issues:**

```bash
# Service won't start
docker-compose logs [service-name]

# MongoDB connection failed
docker-compose exec backend node -e "require('mongoose').connect(process.env.MONGO_URL)"

# Nginx 502 error
docker-compose ps  # Check backend is running
curl http://localhost:5000/health

# SSL issues
openssl x509 -in nginx/ssl/fullchain.pem -noout -dates
```

## 📝 Documentation

- [Docker Deployment](DOCKER_DEPLOYMENT.md) - Complete Docker setup and troubleshooting
- [Quick Start](QUICK_START.md) - Fast local development setup  
- [Super Admin Setup](SUPER_ADMIN_SETUP_GUIDE.md) - Super admin configuration
- [Deployment Guide](docs/DEPLOYMENT.md) - Production VPS deployment
- [Production Checklist](docs/PRODUCTION_CHECKLIST.md) - Pre-deployment checklist

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test locally with Docker
4. Submit pull request

## 📄 License

[Your License Here]

## 👥 Support

- 📧 Email: support@streamys.com
- 📚 Documentation: [docs/](docs/)
- 🐛 Issues: GitHub Issues

---

**Version**: 1.0.0  
**Last Updated**: December 2025  
**Status**: Production Ready ✅
