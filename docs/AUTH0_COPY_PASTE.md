# Auth0 — your app (paste in dashboard)

**Your application:** https://manage.auth0.com/dashboard/us/dev-5k6wn3xfw6lvzvkj/applications/4d8HhuQt62vCakX8rch92Elc6K0HkLYp/settings

| Field | Value |
|-------|--------|
| Domain | `dev-5k6wn3xfw6lvzvkj.us.auth0.com` |
| Client ID | `4d8HhuQt62vCakX8rch92Elc6K0HkLYp` |

---

## Paste into Settings ? Application URIs (all 3 fields)

Replace `YOUR-VERCEL-URL` with your real Vercel domain:

```text
http://localhost:3000,https://YOUR-VERCEL-URL.vercel.app
```

Use in:

1. **Allowed Callback URLs**
2. **Allowed Logout URLs**
3. **Allowed Web Origins**

? **Save Changes**

---

## APIs tab

1. **Applications** ? **APIs** ? **Create API**
   - Identifier: `https://api.foodheaven.app`
   - Signing: RS256
2. **Applications** ? this SPA ? **APIs** ? authorize the API

---

## Vercel (copy all 4)

```text
REACT_APP_AUTH0_DOMAIN=dev-5k6wn3xfw6lvzvkj.us.auth0.com
REACT_APP_AUTH0_CLIENT_ID=4d8HhuQt62vCakX8rch92Elc6K0HkLYp
REACT_APP_AUTH0_AUDIENCE=https://api.foodheaven.app
REACT_APP_API_BASE_URL=https://YOUR-BACKEND.onrender.com/api/v1
```

Redeploy after saving.

---

## Render backend

```text
AUTH0_DOMAIN=dev-5k6wn3xfw6lvzvkj.us.auth0.com
AUTH0_AUDIENCE=https://api.foodheaven.app
CORS_ORIGIN=https://YOUR-VERCEL-URL.vercel.app
```

Manual deploy after saving.
