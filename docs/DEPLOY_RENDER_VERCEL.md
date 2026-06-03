# Deploy FoodHeaven to Render + Vercel

## Architecture

| Service | Platform | URL pattern |
|---------|----------|-------------|
| React frontend | Vercel | `https://foodheaven-*.vercel.app` |
| Node API | Render | `https://foodheaven-api.onrender.com` |
| MySQL | TiDB Cloud (free) or any MySQL host | connection string / env vars |

---

## Step 1 � Push code to GitHub

```bash
git add vercel.json render.yaml backend/scripts/init-db.js docs/
git commit -m "Add Render and Vercel deployment config"
git push origin master
```

Repo: https://github.com/manish785/foodHeaven

---

## Step 2 � Free MySQL (TiDB Cloud)

1. Sign up at https://tidbcloud.com (free tier, MySQL compatible)
2. Create a cluster ? get connection string
3. Set on Render as `DATABASE_URL` (or split into `DB_HOST`, `DB_USER`, etc.)

Alternatively use Railway, Aiven, or PlanetScale MySQL.

---

## Step 3 � Deploy backend on Render

1. https://dashboard.render.com ? **New** ? **Blueprint**
2. Connect **manish785/foodHeaven** repository
3. Render reads `render.yaml` and creates **foodheaven-api**
4. In the service **Environment** tab, set:

| Key | Value |
|-----|--------|
| `CORS_ORIGIN` | Your Vercel URL (set after step 4, then redeploy) |
| `AUTH0_DOMAIN` | `dev-ssvzdizyuhxdvzmr.us.auth0.com` |
| `AUTH0_AUDIENCE` | `https://api.foodheaven.app` |
| `DATABASE_URL` | TiDB / MySQL connection string |

5. Wait for deploy ? copy URL: **`https://foodheaven-api.onrender.com`**
6. Test: `https://foodheaven-api.onrender.com/health`

First boot auto-runs schema + seed if the database is empty.

---

## Step 4 � Deploy frontend on Vercel

1. https://vercel.com/new ? Import **manish785/foodHeaven**
2. Framework: **Other** (Parcel)
3. Root directory: `.` (repo root)
4. Build command: `npm run build`
5. Output directory: `dist`
6. Environment variables:

| Key | Value |
|-----|--------|
| `REACT_APP_API_BASE_URL` | `https://foodheaven-api.onrender.com/api/v1` |
| `REACT_APP_AUTH0_DOMAIN` | `dev-ssvzdizyuhxdvzmr.us.auth0.com` |
| `REACT_APP_AUTH0_CLIENT_ID` | `tWBg4eMwkTui3fUFTtKyip5pnLKrNb0f` |
| `REACT_APP_AUTH0_AUDIENCE` | `https://api.foodheaven.app` |

7. Deploy ? copy URL: **`https://twiggy-*.vercel.app`**

---

## Step 5 � Wire Auth0 + CORS

In [Auth0 Dashboard](https://manage.auth0.com/) ? your SPA ? Settings:

- **Allowed Callback URLs:** `https://YOUR-VERCEL-URL.vercel.app`
- **Allowed Logout URLs:** same
- **Allowed Web Origins:** same

Create API with identifier `https://api.foodheaven.app` and authorize the SPA.

On Render, set `CORS_ORIGIN` to your exact Vercel URL and **Manual Deploy**.

---

## Step 6 � CLI deploy (optional)

```bash
# Vercel (from repo root)
npx vercel@latest login
npx vercel@latest --prod

# Render: use Blueprint in dashboard (no CLI required)
```

---

## Live links (fill in after deploy)

| App | URL |
|-----|-----|
| Frontend | `https://____________.vercel.app` |
| Backend API | `https://foodheaven-api.onrender.com` |
| Health | `https://foodheaven-api.onrender.com/health` |
| API docs | `https://foodheaven-api.onrender.com/api/docs` |

---

## Notes

- Render **free** web services sleep after ~15 min inactivity (first request may take 30�60s).
- Do **not** set `REACT_APP_DEV_AUTH_KEY` on Vercel production.
- Payment requires Auth0 API configured (see `scripts/setup-auth0-api.md`).
