# Deploy now (your repo is ready)

Code is pushed to: **https://github.com/manish785/twiggy**

---

## One-click links (use your GitHub account)

### 1. Render — backend API

**Open:** https://dashboard.render.com/blueprint/new?repo=https://github.com/manish785/twiggy

1. Click **Apply** (creates `foodheaven-api`)
2. Add environment variables in the dashboard:

| Key | Value |
|-----|--------|
| `DATABASE_URL` | Your MySQL URL (TiDB Cloud free: https://tidbcloud.com) |
| `CORS_ORIGIN` | *(set after Vercel — step 2)* |
| `AUTH0_DOMAIN` | `dev-ssvzdizyuhxdvzmr.us.auth0.com` |
| `AUTH0_AUDIENCE` | `https://api.foodheaven.app` |

3. Wait for deploy ? API: **https://foodheaven-api.onrender.com**

Test: https://foodheaven-api.onrender.com/health

---

### 2. Vercel — frontend

**Open:** https://vercel.com/new/clone?repository-url=https://github.com/manish785/twiggy

1. Import repo (log in with GitHub if asked)
2. Framework: **Other**
3. Build: `npm run build` · Output: `dist`
4. Environment variables:

| Key | Value |
|-----|--------|
| `REACT_APP_API_BASE_URL` | `https://foodheaven-api.onrender.com/api/v1` |
| `REACT_APP_AUTH0_DOMAIN` | `dev-ssvzdizyuhxdvzmr.us.auth0.com` |
| `REACT_APP_AUTH0_CLIENT_ID` | `tWBg4eMwkTui3fUFTtKyip5pnLKrNb0f` |
| `REACT_APP_AUTH0_AUDIENCE` | `https://api.foodheaven.app` |

5. Deploy ? copy your URL (e.g. `https://twiggy.vercel.app`)

---

### 3. Finish wiring

1. **Render:** set `CORS_ORIGIN` = your Vercel URL ? Manual Deploy
2. **Auth0:** add Vercel URL to Callback / Logout / Web Origins (see `scripts/setup-auth0-api.md`)

---

## CLI (optional, on your Mac)

```bash
# Vercel — one-time login
npx vercel@latest login
cd /Users/manish/Documents/2.workspace/reactapp/twiggy
npx vercel@latest --prod
```

---

## Your live URLs (after steps above)

| Service | URL |
|---------|-----|
| Frontend | `https://<your-project>.vercel.app` |
| API | https://foodheaven-api.onrender.com |
| Health | https://foodheaven-api.onrender.com/health |

---

## Automated deploy (GitHub Actions)

Add secrets in https://github.com/manish785/twiggy/settings/secrets/actions then run workflow **Deploy Production**.

See `.github/workflows/deploy-production.yml`
