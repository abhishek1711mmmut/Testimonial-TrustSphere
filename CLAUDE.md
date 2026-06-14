# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TrustSphere is a testimonial collection and management platform. Users create "spaces" (review collection pages), share them via public links, and manage received testimonials (text/video) through a dashboard. Monorepo with separate `Frontend/` and `Backend/` directories.

## Development Commands

### Frontend (Next.js 14 + TypeScript + Tailwind CSS)

```bash
cd Frontend
npm install
npm run dev          # starts on http://localhost:3000
npm run build        # production build
npm run lint         # ESLint
```

### Backend (Flask + MySQL)

```bash
cd Backend
pip install -r requirements.txt
python app.py        # starts on http://localhost:5000 (debug mode)
```

Required environment variables in `Backend/.env`:
- `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_HOST`, `MYSQL_DB`
- `JWT_SECRET_KEY`
- `MAIL_SERVER`, `MAIL_USERNAME`, `MAIL_PASSWORD`
- Cloudinary credentials (for image/video uploads)

Required environment variable in `Frontend/.env.local`:
- `NEXT_PUBLIC_FLASK_API_URL` — backend URL (e.g., `http://localhost:5000`)

## Architecture

### Backend

Flask app with routes → services → MySQL pattern. No ORM — raw SQL via `flask_mysqldb`.

- `app.py` — entry point, registers blueprints and initializes extensions (JWT, CORS, Mail, DB)
- `routes/` — thin blueprint handlers that delegate to service functions
- `services/` — business logic (auth, spaces, testimonials, plan upgrades)
- `config/database.py` — MySQL init; auto-creates tables from `sql/*.sql` on startup
- `config/cloudinary.py` — Cloudinary setup for media uploads
- `utils/` — email templates and mail sender (Flask-Mail)

API prefix: `/api`. Auth uses JWT stored in HTTP-only cookies (`access_token`), not Authorization headers.

Route groups:
- `/api/auth` — signup, login, logout, send-otp, get user
- `/api/space` — CRUD for spaces (all JWT-protected)
- `/api/testimonial` — create (public), list/delete (JWT-protected)

### Frontend

Next.js 14 App Router with `src/` directory structure.

- `src/app/` — pages using App Router (landing, auth, dashboard, blog, collect feedback)
- `src/components/` — React components organized by feature
- `src/api/` — API call functions using axios (via `src/utils/apiClient.ts`)
- `src/context/` — `AppContext` (auth state: isAuth, userId) and `ToastContext` (react-hot-toast)
- `src/types/` — TypeScript type definitions
- `src/middleware.ts` — protects `/dashboard/*` routes by checking `access_token` cookie

Key patterns:
- `apiClient.ts` creates an axios instance with `withCredentials: true` and auto-redirects to signin on 401
- Auth state is managed in `AppContext`; userId also stored in localStorage
- Dark/light theme via `next-themes` with Tailwind `dark:` classes
- Public testimonial collection page: `/collect/[spaceId]/[spaceName]`
- Dashboard pages: `/dashboard/overview` (spaces list), `/dashboard/inbox/[spaceName]` (testimonials)
- Remote images allowed from: Cloudinary, Sanity CDN, Unsplash, ui-avatars.com

### Database Tables

Defined in `Backend/sql/`: users, spaces, testimonials, plans, otp. Tables are auto-created on backend startup.
