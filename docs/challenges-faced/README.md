# Challenges faced while building TrustSphere

Interview preparation based on issues encountered in this project. Each note
describes the symptom, cause, implementation, verification, and tradeoffs.

1. [Login failed in incognito after deployment](./cross-site-cookie-authentication.md)
   — replacing cross-site authentication requests with a same-origin API proxy.
2. [Header showed a logged-in user while dashboard redirected to sign-in](./stale-login-state.md)
   — replacing stale localStorage authentication state with backend session validation.
