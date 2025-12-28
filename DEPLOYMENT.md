# Production Deployment Guide for Streamys

This guide provides a step-by-step walkthrough to deploy the Streamys project on a **Ubuntu 24 VPS** using **Nginx** as a reverse proxy.

## Architecture Overview

-   **Backend**: Node.js/Express API (Port 5000)
-   **Landing Page**: Node.js/Express Server serving a Vite SPA (Port 3000)
-   **Frontend**: Static React Application (Served by Nginx)
-   **Database**: MongoDB (Assumed hosted remotely or installed locally)
-   **Reverse Proxy**: Nginx
-   **Process Manager**: PM2

## Prerequisites

1.  **VPS**: Ubuntu 24 Server with Root/Sudo access.
2.  **Domain**: A valid domain (e.g., `streamys.in`) with DNS records pointing to your VPS IP:
    -   `streamys.in` (A Record)
    -   `api.streamys.in` (A Record or CNAME)
    -   `app.streamys.in` (A Record or CNAME)

---

## Step 1: System Updates & Installation

Connect to your VPS via SSH and run the following commands to update the system and install necessary packages.

```bash
# Update System
sudo apt update && sudo apt upgrade -y

# Install Node.js (v20)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
sudo apt install -y nginx

# Install MongoDB 8.0 (Latest Community Edition)
sudo apt-get install gnupg curl

# Import the public key used by the package management system
curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg \
   --dearmor

# Create a list file for MongoDB
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list

# Reload local package database
sudo apt-get update

# Install the MongoDB packages
sudo apt-get install -y mongodb-org

# Start and Enable MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

---

## Step 2: Secure MongoDB Setup

Before deploying the application, we must secure the database by enabling authentication and creating users.

1.  **Connect to MongoDB Shell**:
    ```bash
    mongosh
    ```

2.  **Create Admin User**:
    Switch to the admin database and create a root user.
    ```javascript
    use admin
    db.createUser({
      user: "admin",
      pwd: passwordPrompt(), // You will be asked to enter a password
      roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
    })
    ```
    *Enter a strong password when prompted.*

3.  **Create Application User**:
    Create a specific user for the Streamys database.
    ```javascript
    use streamys_db
    db.createUser({
      user: "streamys_user",
      pwd: passwordPrompt(), // You will be asked to enter a password
      roles: [ { role: "readWrite", db: "streamys_db" } ]
    })
    ```
    *Enter a strong password when prompted. Remember this for your `.env` file!*

4.  **Exit Shell**:
    ```javascript
    quit()
    ```

5.  **Enable Authentication**:
    Edit the MongoDB configuration file.
    ```bash
    sudo nano /etc/mongod.conf
    ```
    Find the `security:` section and uncomment/edit it to look like this:
    ```yaml
    security:
      authorization: enabled
    ```

6.  **Restart MongoDB**:
    Apply the changes.
    ```bash
    sudo systemctl restart mongod
    ```

**Update your Connection String**:
In your backend `.env` file, your `MONGO_URL` will now look like this:
`mongodb://streamys_user:YOUR_PASSWORD@127.0.0.1:27017/streamys_db?authSource=streamys_db`

# Install PM2 (Process Manager) globally
sudo npm install -g pm2

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

---

## Step 3: Set Project Directory

Create a directory for your project.

```bash
sudo mkdir -p /var/www/streamys
sudo chown -R $USER:$USER /var/www/streamys
```

**Upload your code**: storage to the VPS (e.g., via SCP, Git, or FileZilla). The structure inside `/var/www/streamys` should look like this:

```
/var/www/streamys/
├── backend/
├── frontend/
└── streamys_landing/
```

**IMPORTANT:** Do NOT upload the `node_modules` folders from your local machine. You should run `npm install` on the server to build dependencies for the Linux environment and ensure correct permissions.

---

## Step 3: Configure Environment Variables

Create the `.env` files for each service with the required configurations.

### 1. Backend (.env)
File: `/var/www/streamys/backend/.env`

```env
# Server
PORT=5000
NODE_ENV=production

# Database (Update with your specific User/Password from Step 2)
MONGO_URL=mongodb://streamys_user:YOUR_SECURE_PASSWORD@127.0.0.1:27017/streamys_db?authSource=streamys_db

# Security
JWT_SECRET=input_a_very_long_random_string_here

# Optional: Email (If used)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Optional: Payment Gateway
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# CORS (Allow your domains)
CORS_ORIGINS=https://streamys.in,https://app.streamys.in
```

### 2. Landing Page (.env)
File: `/var/www/streamys/streamys_landing/.env`

```env
PORT=3000
NODE_ENV=production
```

### 3. Frontend (.env)
File: `/var/www/streamys/frontend/.env`

```env
# Since we use Nginx to proxy /api, we can often leave this blank or default.
# But for clarity:
REACT_APP_BASE_URL=/api
```

---

## Step 4: Backend Setup (Node API)

1.  **Navigate to directory**:
    ```bash
    cd /var/www/streamys/backend
    ```

2.  **Clean Install dependencies**:
    If you uploaded `node_modules` by mistake, remove it first.
    ```bash
    rm -rf node_modules package-lock.json
    npm install
    ```

3.  **Start with PM2**:
    ```bash
    pm2 start index.js --name "streamys-backend"
    pm2 save
    ```

---

## Step 5: Landing Page Setup (Node/Vite)

1.  **Navigate to directory**:
    ```bash
    cd /var/www/streamys/streamys_landing
    ```

2.  **Clean Install dependencies**:
    If you uploaded `node_modules` by mistake, remove it first.
    ```bash
    rm -rf node_modules package-lock.json
    npm install
    ```

3.  **Build the Project**:
    ```bash
    npm run build
    ```

4.  **Start with PM2**:
    ```bash
    # The start script is 'node dist/server/node-build.mjs'
    pm2 start dist/server/node-build.mjs --name "streamys-landing"
    pm2 save
    ```

---

## Step 6: Frontend Setup (Static React)

1.  **Navigate to directory**:
    ```bash
    cd /var/www/streamys/frontend
    ```

2.  **Clean Install dependencies**:
    ```bash
    rm -rf node_modules package-lock.json
    npm install
    ```

3.  **Build the Project**:
    ```bash
    # Ensure .env is present (Step 3)
    npm run build
    ```
    This will create a `build` directory.

    > **CRITICAL NODE:** Nginx will serve this at `app.streamys.in`.
    > Ensure your `src/App.js` **does NOT** have a `basename` set (e.g. `<Router basename="/app">`).
    > It should be just `<Router>` or `<Router basename="/">`.
    > If you set a basename, the app will look for that path and show a **White Page** if missing.

---

## Step 7: Nginx Configuration

We will create a single configuration file handling all subdomains.

1.  **Create Config**:
    ```bash
    sudo nano /etc/nginx/sites-available/streamys
    ```

2.  **Paste Configuration**:

```nginx
# 1. Backend API (api.streamys.in)
server {
    server_name api.streamys.in;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# 2. Main Landing Page (streamys.in)
server {
    server_name streamys.in www.streamys.in;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# 3. Application Frontend (app.streamys.in)
server {
    server_name app.streamys.in;
    root /var/www/streamys/frontend/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests from Frontend to Backend
    location /api/ {
        proxy_pass http://localhost:5000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3.  **Enable Site**:
    ```bash
    sudo ln -s /etc/nginx/sites-available/streamys /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
    ```

---

## Step 8: SSL Security (HTTPS)

Secure all domains with Let's Encrypt.

```bash
sudo certbot --nginx -d streamys.in -d www.streamys.in -d api.streamys.in -d app.streamys.in
```

Follow the prompts. Certbot will automatically update your Nginx config.

---

## Step 9: Security Hardening

1.  **Configure Firewall (UFW)**:
    ```bash
    # Allow SSH (IMPORTANT: Don't lock yourself out)
    sudo ufw allow OpenSSH
    # Allow HTTP/HTTPS
    sudo ufw allow 'Nginx Full'
    # Enable Firewall
    sudo ufw enable
    ```

2.  **Secure SSH (Optional but Recommended)**:
    Edit `/etc/ssh/sshd_config`:
    -   `PermitRootLogin no` (Ensure you have a sudo user)
    -   `PasswordAuthentication no` (Use SSH Keys)
    -   Restart SSH: `sudo systemctl restart ssh`

3.  **PM2 Startup Script**:
    Ensure your apps start on reboot.
    ```bash
    pm2 startup
    # Run the command displayed by the output of the above command
    pm2 save
    ```

---

## Troubleshooting

### 'Permission denied' on npm run build
If you see `sh: 1: vite: Permission denied`, it usually means `node_modules` has permission issues or was copied from Windows.
**Fix:**
```bash
# Ensure current user owns the directory
sudo chown -R $USER:$USER .

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Run build WITHOUT sudo
npm run build
```

---

## Verification

1.  Visit `https://streamys.in` -> Should load Landing Page.
2.  Visit `https://app.streamys.in` -> Should load React App.
3.  Visit `https://api.streamys.in/health` -> Should respond with API status.

**Done!** Your project is now fully deployed and secure.
