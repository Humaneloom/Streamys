# Maintenance Guide: Upgrades & Backups

This guide explains how to safely upgrade your **Streamys** application code and how to backup/restore your database to prevent data loss.

---

## Part 1: Database Backups

It is highly recommended to take a backup **before** any major upgrade.

### 1. Create a Backup (Dump)
This command captures your entire MongoDB database into a file. You can run this while the site is live (it does not stop the database).

```bash
# Create a backup directory with today's date
BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p ~/$BACKUP_DIR

# Run mongodump (Replace <YOUR_PASSWORD> with your real db password)
mongodump --uri="mongodb://streamys_user:<YOUR_PASSWORD>@127.0.0.1:27017/streamys_db?authSource=streamys_db" --out ~/$BACKUP_DIR
```

*Output: You will see a folder created in your home directory containing `.bson` and `.json` files.*

### 2. Download Backup (Optional)
To be extra safe, download this folder to your local computer using **SCP** or **FileZilla**.

```bash
# Run this ON YOUR LOCAL COMPUTER (not the VPS)
scp -r stradmin@your_vps_ip:~/backup_2024... ./my_local_backups/
```

### 3. Restore from Backup
If something catastrophic happens, you can restore your data.

```bash
# Restore specific backup
mongorestore --uri="mongodb://streamys_user:<YOUR_PASSWORD>@127.0.0.1:27017/streamys_db?authSource=streamys_db" ~/$BACKUP_DIR/streamys_db
```

---

## Part 2: Upgrading the Application

When you have new features or bug fixes, follow this process to deploy them without affecting your user data.

**Note on Database:** Your MongoDB data is stored in `/var/lib/mongodb`, which is separate from your code folder (`/var/www/streamys`). Changing code **does not** delete your database.

### Step 1: Update Code
Upload your new files to the VPS (using Git, SCP, or FileZilla), replacing the old files in `/var/www/streamys`.

**Do NOT** overwrite:
*   `.env` files (These contain your secrets)
*   `node_modules` (These should be installed on the server)

### Step 2: Backend Upgrade
If you changed backend code:

```bash
cd /var/www/streamys/backend

# 1. Install new dependencies (if package.json changed)
npm install

# 2. Restart the process
pm2 restart streamys-backend
```

### Step 3: Frontend Upgrade
If you changed frontend code (React), you **must rebuild**:

```bash
cd /var/www/streamys/frontend

# 1. Install new dependencies
npm install

# 2. Rebuild the static files
npm run build

# 3. Reload Nginx (Optional, usually not needed unless Nginx config changed, but good practice)
sudo systemctl reload nginx
```

### Step 4: Landing Page Upgrade
If you changed the landing page:

```bash
cd /var/www/streamys/streamys_landing

# 1. Install dependencies
npm install

# 2. Rebuild
npm run build

# 3. Restart process
pm2 restart streamys-landing
```

---

## Part 3: Troubleshooting Upgrades

### "White Page" after upgrade?
You likely need to rebuild the frontend again or check browser cache.
*   Run `npm run build` in `frontend/` folder.
*   Clear your browser cache (Ctrl+Shift+R).

### "502 Bad Gateway"?
Your backend crashed. Check logs:
```bash
pm2 logs streamys-backend
```

---

## Summary Checklist for Upgrade

1.  [ ] **Backup Database** (`mongodump`)
2.  [ ] **Upload New Code** (Keep `.env` safe)
3.  [ ] **Update Dependencies** (`npm install` in all folders)
4.  [ ] **Rebuild Frontend** (`npm run build`)
5.  [ ] **Restart Processes** (`pm2 restart all`)
6.  [ ] **Verify Site works**
