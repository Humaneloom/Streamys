# Debugging Guide

## 1. Fix the "White Page" on Frontend

The white page often happens when the React app cannot find its resources or crashes due to environmental issues.

1.  **Check Browser Console**:
    *   Open `app.streamys.in`.
    *   Right-click -> Inspect -> **Console** tab.
    *   Look for Red Errors. Common issues:
        *   `Failed to load resource`: Check if your `public/index.html` uses `%PUBLIC_URL%` or relative paths.
        *   `Minified React error`: Often means environment variables were missing during build.

2.  **Fix Build**:
    The React build needs `REACT_APP_` variables *during* the build process.
    ```bash
    cd /var/www/streamys/frontend
    
    # 1. Clean Reinstall (Fixes "binary" issues)
    sudo rm -rf node_modules build
    npm install
    
    # 2. Build
    npm run build
    
    # 3. PERMISSIONS (Crucial for 500 Errors)
    sudo chown -R www-data:www-data build
    sudo chmod -R 755 build
    
    sudo systemctl restart nginx
    ```

3.  **Check React Router (Crucial)**:
    If your app is at `app.streamys.in` (subdomain), your `App.js` **must not** have `basename="/app"`.
    *   **Bad**: `<Router basename="/app">` -> Causes White Page
    *   **Good**: `<Router>`

4.  **Check Nginx**:
    Ensure your config has this line in the frontend block:
    `try_files $uri $uri/ /index.html;`

## 2. Fix the 502 Bad Gateway / Backend Crash

The `errored` state in PM2 means your backend crashed.

1.  **Check Logs**:
    ```bash
    pm2 logs streamys-backend --lines 100
    ```
    *Look for `Error: ...` lines.*

2.  **Common Crash Reasons**:
    *   **MongoDB Auth Failed**: You set a password in Mongo but didn't update `.env` or used special characters in password that need URL encoding.
    *   **Port In Use**: If `Error: listen EADDRINUSE: address already in use :::5000`.
        *   Fix: `pm2 stop streamys-backend` then check `sudo lsof -i :5000`. Kill rogue process `kill -9 <PID>`.
    *   **Missing Variables**: Check if `JWT_SECRET` is set.

3.  **Validate Backend Locally**:
    Run it manually without PM2 to see the error instantly:
    ```bash
    cd /var/www/streamys/backend
    node index.js
    ```
    *If it runs, press Ctrl+C and restart with PM2.*

## 3. Fix "Oops! Page not found" on Login

The link on `streamys.in` points to `/app/choose`, which Nginx sends to the Landing Page (localhost:3000), which doesn't have that route. It *should* go to `app.streamys.in`.

**Fix in Code (Landing Page):**

1.  Edit `client/components/Navigation.tsx`:
    ```bash
    nano /var/www/streamys/streamys_landing/client/components/Navigation.tsx
    ```
2.  Find:
    ```jsx
    href="/app/choose"
    ```
3.  Change to:
    ```jsx
    href="https://app.streamys.in/choose"
    ```
    *(Do this for both Desktop and Mobile logic)*

4.  **Rebuild Landing Page**:
    ```bash
    cd /var/www/streamys/streamys_landing
    npm run build
    pm2 restart streamys-landing
    ```
