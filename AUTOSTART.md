# Auto-Start Configuration Guide

This guide ensures that your **Streamys** application (Backend, Frontend, Landing Page) and all necessary services (Database, Web Server) automatically start if your VPS is rebooted or shuts down.

## 1. Auto-Start Components
We need to enable the following to start on boot:
1.  **Nginx** (Web Server)
2.  **MongoDB** (Database)
3.  **PM2** (Process Manager for Node.js apps)

---

## 2. Enable System Services (Nginx & MongoDB)

Run these commands to tell Ubuntu to start these services immediately when the server turns on.

```bash
# Enable Nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# Enable MongoDB
sudo systemctl enable mongod
sudo systemctl start mongod
```

### Verify Status
You can check if they are set to "enabled" by running:
```bash
systemctl is-enabled nginx
# Output should be: enabled

systemctl is-enabled mongod
# Output should be: enabled
```

---

## 3. Enable Application Auto-Start (PM2)

PM2 is capable of "resurrecting" your Node.js processes after a reboot.

### Step 1: Ensure Apps are Running
First, make sure all your applications are currently running correctly in PM2.

```bash
pm2 list
```
*You should see `streamys-backend` and `streamys-landing` as "online".*

### Step 2: Generate Startup Script (CRITICAL STEP)
Run this command to generate the startup script for your specific system:

```bash
pm2 startup
```

> **⛔ STOP! READ THIS CAREFULLY:**
>
> The command above DOES NOT enable auto-start by itself.
> It will **print a command** in your terminal that looks like this:
>
> `sudo env PATH=$PATH:/usr/bin ... pm2 startup systemd -u stradmin ...`
>
> **YOU MUST COPY THAT COMMAND AND RUN IT.**
> If you skip this, your apps will NOT start on reboot.

### Step 3: Freeze the Process List
Once you have run the command from Step 2 (and it said "Success"), you must save the current list of running processes.

```bash
pm2 save
```
*This dumps the current process list to `~/.pm2/dump.pm2`.*

---

## 4. Testing (Optional)

To verify everything works, you can reboot your VPS (Warning: This will take your site offline for a minute).

```bash
sudo reboot
```

Wait 1-2 minutes, then SSH back in and run:
```bash
pm2 list
```
You should see your apps online with an `uptime` of a few seconds/minutes.

---

## Summary Command List

If you are setting this up for the first time:

```bash
# 1. Enable System Services
sudo systemctl enable nginx
sudo systemctl enable mongod

# 2. Setup PM2 (Requires manual copy-paste step in middle)
pm2 startup
# ... [COPY AND RUN THE COMMAND IT SHOWS NOW] ...
pm2 save
```
