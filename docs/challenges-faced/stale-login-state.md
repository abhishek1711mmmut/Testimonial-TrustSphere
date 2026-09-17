# Stale login state after session cookie loss

## Problem and root cause

The header displayed a username from localStorage even though dashboard middleware
correctly redirected requests without an access_token cookie to sign-in. The
username persisted independently of the cookie and was incorrectly treated as
proof of authentication. An isolated browser reproduced the mismatch.

There were two conflicting sources of truth: the header trusted a saved `userId`,
while middleware required the `access_token` cookie and Flask validated its JWT.
Local storage does not automatically expire when a cookie expires or is removed.
The dashboard protection was working; the header's claim of authentication was wrong.
Login also updated the UI after receiving a successful response without checking
whether the browser could make a subsequent authenticated request.

## Fix and request flow

The application now derives header state from GET /api/auth/user, removes the old
localStorage value, and rechecks on navigation and window focus. Unauthorized API
responses clear shared state; only dashboard pages redirect to sign-in, so public
pages remain accessible. Requests cancelled by newer checks cannot overwrite the
new session. Login confirms the cookie with a separate authenticated request
before updating state. Fresh document navigation avoids stale client route caches.
Authentication responses use Cache-Control: no-store. Cookie security attributes
and backend JWT validation remain enforced.

The flow is now:

1. Submit credentials through the same-origin `/api/auth/login` proxy.
2. Flask validates credentials and returns an HttpOnly session cookie.
3. The frontend calls `/api/auth/user`; the browser must send that cookie.
4. Only after successful validation does the UI show the user and navigate to the dashboard.
5. Navigation and window-focus checks refresh session state. A `401` clears it;
   protected dashboard pages redirect to sign-in, while public pages stay accessible.

If the session check fails, login shows an error instead of claiming success.
A fresh dashboard document request also avoids reusing a cached unauthenticated
client-side route redirect. This was a defensive change, not a confirmed cause
of the original incident.

## What remained unconfirmed

The original reason the user's cookie was absent was not established. If login
still cannot establish a session, inspect the login response Set-Cookie and the
browser's blocked-cookie reason, then the /api/auth/user response. Do not treat a
network or server failure as proof of rejected cookies. Production uses HTTPS;
local HTTP development should use JWT_COOKIE_SECURE=false on the backend.

## Verification

Run Backend/venv/bin/python -m unittest discover -s Backend/tests -v from the
repository root with PYTHONPATH=Backend, or run discovery from Backend.

Frontend/tests/auth-session.cjs uses Playwright with mocked API requests and no
real account. Start Next.js, make Playwright available through NODE_PATH or your
test environment, and run node Frontend/tests/auth-session.cjs. TEST_BASE_URL
defaults to http://localhost:3000; CHROME_EXECUTABLE optionally selects installed
Chrome. It covers stale storage, missing cookies after successful login responses,
verified login, and session loss. No credentials or emails are sent to the backend.

At implementation time, both browser scenarios passed, TypeScript checking passed,
and all 13 backend tests passed. Lint reported only two existing unrelated warnings.
Browser authentication responses were mocked, so these checks do not establish
why the original user's cookie disappeared or prove live account login in production.

## Interview answer

“I encountered a case where the header showed a logged-in user, but opening the
dashboard redirected to sign-in. I traced the mismatch to two different sources
of authentication state: the header trusted a username in localStorage, while
the protected route required a session cookie. The username remained after the
cookie was gone. I reproduced that state in an isolated browser, then made the
backend session check the source of truth. Login now verifies the cookie with an
authenticated request before showing success, and unauthorized responses clear
the UI state. I tested stale storage, missing cookies after login, successful
navigation, and session loss. The main lesson was that a saved user identifier
is display data, not proof of an authenticated session.”

## Tradeoffs and lessons

- Session verification adds a request after login and on navigation or window focus.
  That cost keeps the displayed state aligned with backend authentication.
- HttpOnly cookies remain inaccessible to JavaScript. The frontend checks the
  session through the server instead of trying to read the token.
- Network failures are not proof of invalid credentials or blocked cookies; the
  UI reports verification failure without presenting an unverified login as valid.
- This differs from the earlier cross-domain cookie issue: the proxy addressed
  cookie delivery, while this fix addresses stale UI state and verifies delivery.
