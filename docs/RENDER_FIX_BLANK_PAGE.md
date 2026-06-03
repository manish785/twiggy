# Fix blank page on Render (foodheaven-*.onrender.com)

## What went wrong

Your Render service ran **`npm start`** ? **`parcel index.html`** (development server).

That does **not** work on Render for production. You need a **Static Site** that runs **`npm run build`** and serves the **`dist/`** folder.

Logs showed:
```
> parcel index.html
Server running at http://localhost:10000
```

A blank page is expected with that setup.

---

## Fix in Render dashboard (do this now)

### Option A � Create a Static Site (recommended)

1. Render dashboard ? **New +** ? **Static Site**
2. Connect repo **manish785/foodHeaven**
3. Settings:

| Field | Value |
|-------|--------|
| Name | `foodheaven-web` |
| Branch | `master` |
| Root Directory | *(leave empty)* |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

4. **Environment** (required for API + Auth0):

| Key | Value |
|-----|--------|
| `REACT_APP_API_BASE_URL` | `https://YOUR-API-SERVICE.onrender.com/api/v1` |
| `REACT_APP_AUTH0_DOMAIN` | `dev-ssvzdizyuhxdvzmr.us.auth0.com` |
| `REACT_APP_AUTH0_CLIENT_ID` | `tWBg4eMwkTui3fUFTtKyip5pnLKrNb0f` |
| `REACT_APP_AUTH0_AUDIENCE` | `https://api.foodheaven.app` |

5. **Redirects/Rewrites** ? add:

| Source | Destination |
|--------|-------------|
| `/*` | `/index.html` |

6. **Create Static Site** ? wait for deploy ? open the **new** URL (not the old Web Service URL).

### Option B � Fix the existing Web Service (if you keep it)

Change **only if** the service is meant to be the API:

| Field | Value |
|-------|--------|
| Root Directory | `backend` |
| Build Command | `npm ci` |
| Start Command | `npm start` |

Then use **Option A** for the frontend separately.

**Delete** or ignore the old frontend Web Service (`parcel` logs).

---

## Correct URLs after fix

| App | Type | URL example |
|-----|------|-------------|
| Frontend | **Static Site** | `https://foodheaven-web.onrender.com` |
| API | **Web Service** (`backend/`) | `https://foodheaven-api.onrender.com` |

Test API: `https://foodheaven-api.onrender.com/health`

---

## Backend API service

If you don't have an API service yet:

1. **New +** ? **Web Service**
2. Repo: **foodHeaven**, Root Directory: **`backend`**
3. Build: `npm ci` � Start: `npm start`
4. Add `DATABASE_URL` and Auth0 env vars
5. Set `CORS_ORIGIN` to your **Static Site** URL

---

## Why `npm start` must not be used on Render for the frontend

| Command | Local | Render |
|---------|-------|--------|
| `npm start` | Parcel dev server | ? Blank / wrong port |
| `npm run build` + serve `dist/` | Production files | ? Static Site |
