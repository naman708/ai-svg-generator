# 🚂 Railway Deployment Guide (Frontend & Backend Monorepo)

This project is configured to deploy both the **React Frontend** and **Node.js Express Backend** from the **same repository** to Railway seamlessly.

---

## ⚡ Method 1: Single Unified Fullstack Service *(Recommended & Most Cost-Effective)*

The backend server is configured to serve both the Express API (`/api/*`) and the compiled production React UI from a single container and single domain.

### Advantages:
- **Zero CORS issues** (frontend and backend share the exact same domain).
- **Uses 1 Railway service** (minimizes usage and costs).
- **1-Click setup**: Railway automatically uses `railway.json`.

### Step-by-Step Deployment:
1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Configure Railway monorepo deployment"
   git push origin main
   ```

2. **Open Railway ([railway.app](https://railway.app/)):**
   - Click **"New Project"** -> **"Deploy from GitHub repo"**.
   - Select your repository (`ai-svg-generator`).

3. **Configure Environment Variables:**
   - In your Railway project, click on your service -> go to the **Variables** tab.
   - Add your Gemini API key (optional if using built-in offline engine):
     ```env
     GEMINI_API_KEY = your_gemini_api_key_here
     GEMINI_MODEL = gemini-2.5-flash
     ```
   - *(Note: Railway automatically sets `PORT`, so you do not need to configure `PORT` yourself).*

4. **Generate Public Domain:**
   - Go to the **Settings** tab -> scroll down to **Networking**.
   - Click **"Generate Domain"** (e.g., `ai-svg-generator.up.railway.app`).

5. **Done!**
   - Railway will run `npm run build` (which compiles the React frontend to `frontend/dist`) and then start the Express server via `npm start`.
   - Visiting your domain will load the full React UI Studio, while `/api/*` handles the generation engine.

---

## 🛠️ Method 2: Two Separate Railway Services *(Alternative)*

If you prefer two separate services in Railway (one for backend and one for frontend):

### Service A: Backend API
1. Create a service from the repo.
2. In **Settings** -> **Source Directory (Root Directory)**: set to `/backend`.
3. Set **Start Command**: `npm start`.
4. Add **Variables**: `GEMINI_API_KEY`.
5. Generate a domain (e.g. `api-production.up.railway.app`).

### Service B: Frontend Static UI
1. Add a second service in the same Railway project from the same GitHub repo.
2. In **Settings** -> **Source Directory (Root Directory)**: set to `/frontend`.
3. Set **Build Command**: `npm run build`.
4. Set **Start Command**: `npx serve -s dist -l $PORT`.
5. Add **Variables**:
   ```env
   VITE_API_BASE = https://api-production.up.railway.app/api
   ```
6. Generate a domain (e.g. `app-production.up.railway.app`).

---

## 🔍 Verification Checklist

| Route | Expected Response |
| :--- | :--- |
| `https://your-domain.railway.app/` | React Studio Designer UI |
| `https://your-domain.railway.app/health` | `{"status":"ok", ...}` |
| `https://your-domain.railway.app/api/templates` | JSON list of 10 SVG layout templates |
| `https://your-domain.railway.app/api/designs` | JSON catalog of 100+ generated SVGs |
