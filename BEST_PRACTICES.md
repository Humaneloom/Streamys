# Streamys Best Practices Guide

This guide covers "next level" improvements for your project. These aren't strictly required to make it run, but they make your life as a developer much easier and your server much safer.

---

## 1. Professional Workflow (Stop Dragging & Dropping)

Right now, you might be uploading files manually. The "Professional" way is to use **Git**.

### Why?
*   **Sync**: You change a file locally -> Run one command -> It appears on the VPS.
*   **Undo**: Broken code? Revert to the version from 10 minutes ago.
*   **Backup**: Your code lives on GitHub/GitLab, so you never lose it.

### How to set it up:

1.  **Local Computer**:
    ```bash
    git init
    git add .
    git commit -m "Initial backup"
    # Create a repo on GitHub.com and follow instructions to push
    git remote add origin https://github.com/YOUR_USER/Streamys.git
    git push -u origin main
    ```

2.  **VPS (Server)**:
    Instead of uploading files, you just "pull" them.
    ```bash
    cd /var/www/streamys
    git pull origin main
    ```

3.  **Automatic Deployment**:
    You can even set it up so that when you push to GitHub, the server automatically updates itself! (Look up "GitHub Actions for VPS").

---

## 2. Security Hardening (Sleep Better at Night)

You have a public server. Bots *will* try to hack it. Here is how to stop them.

### A. Install Fail2Ban
This tool watches your logs. If someone tries to guess your password 5 times, it bans their IP address permanently.

```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```
*That's it. It works automatically.*

### B. Disable Root Password Login
Hackers always try to login as `root`. Disable it.

1.  **Create a new user** (if you haven't already):
    ```bash
    adduser yourname
    usermod -aG sudo yourname
    ```
2.  **Edit SSH Config**:
    ```bash
    sudo nano /etc/ssh/sshd_config
    ```
    Change `PermitRootLogin yes` to `PermitRootLogin no`.
3.  **Restart SSH**:
    ```bash
    sudo systemctl restart ssh
    ```

---

## 3. Real-Time Monitoring

You don't need to guess if your server is slow. PM2 has a built-in dashboard.

### Run Monitor
```bash
pm2 monit
```

This opens a dashboard in your terminal showing:
*   **CPU Usage**: Is your server overloaded?
*   **Memory**: Is there a leak?
*   **Logs**: Real-time error viewing.

(Press `Q` to exit).

---

## Summary
1.  Use **Git** to move code (safer/faster).
2.  Install **Fail2Ban** (stops hackers).
3.  Use **pm2 monit** (watch performance).
