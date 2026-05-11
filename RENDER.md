# Deploy CoreBalance on Render

Render har **Web Service** ko ek **`PORT`** deta hai. Is repo ka root **`Dockerfile`** do processes (3000 + 3001) chalata hai — Render ke default **ek-port** model se seedha match nahi karta.

**Recommended:** do alag **Web Services** — **API** (`Dockerfile.api`) aur **Frontend** (`Dockerfile.frontend`).

---

## Order (important)

1. Pehle **API** deploy karo → URL milega (e.g. `https://corebalance-api.onrender.com`).
2. Phir **Frontend** deploy karo → build time par **`NEXT_PUBLIC_API_URL`** = wahi API URL (https, **no trailing slash**).

---

## 1) API service (Express + C++)

1. [Render Dashboard](https://dashboard.render.com) → **New +** → **Web Service**.
2. GitHub repo connect karo (`CoreBalance-Advanced-Multi-Core-Simulator`).
3. Settings:
   - **Runtime:** Docker
   - **Dockerfile path:** `Dockerfile.api`
   - **Docker build context:** `.` (repo root — zaroori hai taaki `COPY cpp` / `COPY api` kaam kare)
4. **Instance type:** Free tier theek hai (cold start hoga).
5. **Environment**
   - `NODE_ENV` = `production` (optional)
   - Render **`PORT`** khud inject karta hai — `api/server.js` already `process.env.PORT` use karta hai.
6. **Create Web Service** → deploy hone do.
7. **Copy** public URL, e.g. `https://corebalance-api-xxxx.onrender.com`  
   - Test: browser ya curl se `https://…/health` → `{"status":"ok",…}`.

---

## 2) Frontend service (Next.js)

1. **New +** → **Web Service** (dusri service).
2. Same repo.
3. Settings:
   - **Runtime:** Docker
   - **Dockerfile path:** `Dockerfile.frontend`
   - **Docker build context:** `.` (root)
4. **Docker build arguments** (Render → *Settings* → *Build* → *Docker Build Args* ya deploy flow ke dauran):

   | Build argument | Value (example) |
   |----------------|-----------------|
   | `NEXT_PUBLIC_API_URL` | `https://corebalance-api-xxxx.onrender.com` |

   **No** trailing slash. Scheme **`https`** hona chahiye (Render HTTPS deta hai).

5. **Create Web Service** — build mein `npm run build` chalega aur API URL client bundle mein bake ho jayega.
6. Frontend URL khol kar **Simulator** try karo.

### Agar frontend pehle deploy ho chuka ho (galat API URL bake ho gaya)

`NEXT_PUBLIC_API_URL` badalne ke baad **Clear build cache & deploy** (Render) ya empty commit push karo taaki **dobara build** ho.

---

## CORS

`api/server.js` mein `cors()` sab origins allow karta hai — alag `*.onrender.com` domains par frontend → API calls local dev jaisi chalni chahiye. Production lock-down ke liye baad mein specific origin allow karna better hai.

---

## Free tier notes

- **Spin down:** kuch der idle ke baad service so jati hai; pehla request slow ho sakta hai.
- **Timeouts:** lambi compare runs agar timeout kha jayein to paid tier / background worker consider karo.

---

## Files reference

| File | Role |
|------|------|
| `Dockerfile.api` | C++ build + Node API, listens on `PORT` |
| `Dockerfile.frontend` | `NEXT_PUBLIC_API_URL` se `next build`, phir `next start` on `PORT` |

---

## Troubleshooting

| Problem | Check |
|---------|--------|
| Simulator se **Failed to fetch** | Frontend build arg = exact API **https** URL; API service **live** hai? `/health` |
| API **500** on schedule | Logs mein “binary not found” — Dockerfile.api se image sahi build hui? |
| **Wrong** API hit | Multiple deploys / purana URL — rebuild frontend with correct `NEXT_PUBLIC_API_URL` |

---

## Optional: monolith on Render (advanced)

Ek hi service + ek `PORT` ke liye reverse proxy (Caddy/Nginx) ya API ko subpath par mount karna padta hai — yeh repo default mein include nahi hai. Do service setup sabse seedha hai.
