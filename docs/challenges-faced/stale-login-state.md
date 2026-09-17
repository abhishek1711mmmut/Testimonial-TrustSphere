# Stale login state after session cookie loss

The header displayed a username from localStorage even though dashboard middleware
correctly redirected requests without an access_token cookie to sign-in. The
username persisted independently of the cookie and was incorrectly treated as
proof of authentication. An isolated browser reproduced the mismatch.

The application now derives header state from GET /api/auth/user, removes the old
localStorage value, and rechecks on navigation and window focus. Unauthorized API
responses clear shared state; only dashboard pages redirect to sign-in, so public
pages remain accessible. Requests cancelled by newer checks cannot overwrite the
new session. Login confirms the cookie with a separate authenticated request
before updating state. Fresh document navigation avoids stale client route caches.
Authentication responses use Cache-Control: no-store. Cookie security attributes
and backend JWT validation remain enforced.

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
