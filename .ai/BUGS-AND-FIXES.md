# Bugs & Challenges Faced During Development

Documented for interview reference — real issues encountered while building TrustSphere.

---

## 1. TLS Certificate Error on External Image Optimization

**Error:** `UNABLE_TO_GET_ISSUER_CERT_LOCALLY` — Next.js image optimizer failed when proxying external images from `ui-avatars.com`.

**Root Cause:** Next.js `<Image>` component routes external URLs through its server-side image optimizer. Node.js on the dev machine couldn't verify the SSL certificate chain for the external domain.

**Fix:** Added `unoptimized` prop to the `<Image>` tag for `ui-avatars.com` URLs. This tells Next.js to serve the URL directly to the browser instead of proxying it through the server-side optimizer — the browser handles TLS itself.

**File:** `Frontend/src/components/Header/index.tsx`

---

## 2. Login Redirect Failing — Cookie Not Visible to Next.js Middleware

**Error:** After successful login (toast showed "Login successful"), the app stayed on `/auth/signin` instead of navigating to `/dashboard/overview`. The `/dashboard/overview` request returned `307 Temporary Redirect` back to signin.

**Root Cause:** The `access_token` cookie was set by Flask (port 5000) without a `domain` attribute. By default, the browser scopes such cookies to the exact origin that set them (`localhost:5000`). When Next.js middleware on `localhost:3000` checked for the cookie to protect `/dashboard/*` routes, it wasn't there — because the browser never sent it to port 3000.

**Fix:** Added `domain='localhost'`, `samesite='Lax'`, and `path='/'` to the `set_cookie()` call in both `login_logic()` and `logout_logic()`. This tells the browser to send the cookie to any port on `localhost`.

**File:** `Backend/services/auth_services.py`

**Key Takeaway:** In a decoupled frontend/backend setup running on different ports, cookies set by the backend are NOT automatically sent to the frontend server. You must explicitly set the `domain` attribute so the cookie is shared across ports.

---

## 3. CORS Error After Switching API URL from `127.0.0.1` to `localhost`

**Error:** After fixing Bug #2 by changing `NEXT_PUBLIC_FLASK_API_URL` from `http://127.0.0.1:5000` to `http://localhost:5000`, all API calls started failing with CORS errors.

**Root Cause:** `127.0.0.1` and `localhost` are technically different origins from the browser's perspective. Flask was running with `app.run(debug=True)` which binds to `127.0.0.1` only. When the browser resolved `localhost` to `::1` (IPv6 loopback), the connection to Flask failed or returned mismatched CORS headers.

**Fix:** Changed Flask to bind on all interfaces with `app.run(debug=True, host='0.0.0.0')`. This makes Flask listen on both `127.0.0.1` (IPv4) and `::1` (IPv6), so it responds regardless of how the OS resolves `localhost`.

**File:** `Backend/app.py`

**Key Takeaway:** `localhost`, `127.0.0.1`, and `::1` are treated as different origins by browsers. When building cross-origin apps locally, ensure both the frontend and backend use the same hostname consistently, and the backend binds to an address that covers all resolutions of that hostname.

---

## Common Theme

All three bugs stem from the same architectural reality: **a decoupled frontend and backend on different ports behave as cross-origin applications**. This affects TLS proxying (Bug 1), cookie scoping (Bug 2), and DNS/network resolution (Bug 3). Understanding the browser's same-origin policy and how cookies, CORS, and TLS interact across origins is critical for this architecture.
