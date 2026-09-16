This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## API proxy and authentication

Browser API requests use `/api/...` on the frontend origin. Next.js forwards them
to Flask using an external rewrite, including request bodies, cookies, and
`Set-Cookie` response headers. This keeps authentication first-party when frontend
and backend are deployed on unrelated domains.

Copy `.env.example` to `.env.local` for local development. Configure this value
on your frontend hosting provider **before building/redeploying**:

```dotenv
NEXT_PUBLIC_FLASK_API_URL=https://your-backend.example.com
```

- `NEXT_PUBLIC_FLASK_API_URL` is the public backend origin, without `/api`.
  It is shared by the server-side proxy and anonymous embed iframe URLs.
  Development defaults to `http://127.0.0.1:5000` for the proxy; production requires
  the variable explicitly. No separate `FLASK_API_URL` is needed.
- Browser API requests still use relative `/api/...` URLs. Do not point Axios
  directly at the backend, as that would bypass the first-party cookie proxy.
- Run Next.js with a server or a hosting platform that supports external rewrites;
  a static export cannot provide this proxy.

On the **backend**, set `JWT_COOKIE_SECURE=true` for deployed HTTPS environments
(also the default when `FLASK_ENV=production`). For local HTTP development use
`JWT_COOKIE_SECURE=false`. Remove the old `COOKIE_DOMAIN` setting; it is no longer
used. Access cookies are HttpOnly, host-only, SameSite=Lax, and use Path=/.
Login and logout use the same cookie settings. Invalid or expired JWTs return 401
and clear the cookie, allowing the frontend to return to sign-in without a loop.
The former `ts_auth` browser flag is no longer used or trusted.

Deploy the backend cookie changes and rebuild/redeploy the frontend proxy changes
together. Existing users may need to sign in again. Check in a fresh incognito
window that login creates `access_token` under the **frontend** host, dashboard
requests and refreshes stay authenticated, and logout removes the cookie.

Uploads also pass through the proxy. Verify your frontend host's request-size and
timeout limits with representative image/video files before release. Public
embeds continue to load directly from the backend and need no authentication.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


<!-- challenges -->
Designing custom layout to hide the header and footer on the collect feedback page
