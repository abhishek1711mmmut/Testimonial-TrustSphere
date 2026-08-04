# Architecture

## System Overview

TrustSphere is a testimonial collection platform with a decoupled frontend/backend architecture.

```
┌─────────────────────────────────────────────────────────┐
│                      Client Browser                     │
│                                                         │
│  ┌─────────────────────┐    ┌─────────────────────────┐ │
│  │   Landing Pages      │    │   Dashboard (Protected) │ │
│  │   /                  │    │   /dashboard/overview    │ │
│  │   /about             │    │   /dashboard/inbox       │ │
│  │   /how-it-works      │    │   /dashboard/embed       │ │
│  │   /testimonials      │    │                          │ │
│  │   /auth/signin       │    │   Public Collection      │ │
│  │   /auth/signup       │    │   /collect/[id]/[name]   │ │
│  └─────────────────────┘    └─────────────────────────┘ │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP (axios, withCredentials)
                     │ JWT in httpOnly cookie
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Flask Backend (port 5000)                  │
│                                                          │
│  ┌──────────┐   ┌──────────┐   ┌──────────────────────┐ │
│  │ Blueprint │   │ Blueprint│   │ Blueprint            │ │
│  │ /api/auth │   │/api/space│   │ /api/testimonial     │ │
│  └─────┬─────┘  └─────┬────┘   └──────────┬───────────┘ │
│        │              │                    │             │
│  ┌─────▼─────┐  ┌─────▼────┐   ┌──────────▼───────────┐ │
│  │auth_service│  │space_svc │   │testimonial_svc       │ │
│  └─────┬─────┘  └─────┬────┘   └──────────┬───────────┘ │
│        │              │                    │             │
│        ▼              ▼                    ▼             │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                 MySQL (flask_mysqldb)                │ │
│  │  users │ spaces │ testimonials │ plans │ otp        │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌──────────────┐  ┌───────────┐  ┌──────────────────┐  │
│  │  Cloudinary   │  │Flask-Mail │  │ Flask-JWT-Ext    │  │
│  │ (media store) │  │ (OTP/SMTP)│  │ (cookie auth)    │  │
│  └──────────────┘  └───────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Key Design Decisions

### Authentication: JWT in HTTP-only cookies
- Tokens are set as `httpOnly` cookies (not stored in localStorage/headers)
- Frontend axios instance uses `withCredentials: true`
- Next.js middleware checks `access_token` cookie to protect `/dashboard/*`
- Token expires after 3 days
- On 401, axios interceptor redirects to `/auth/signin`

### OTP-based signup
- User fills signup form → frontend calls `/api/auth/send-otp`
- Backend generates 6-digit OTP, stores in `otp` table, emails via Flask-Mail
- User enters OTP in modal → frontend calls `/api/auth/signup` with OTP
- Backend verifies OTP (valid for 10 minutes), then creates user
- MySQL scheduled event auto-deletes expired OTPs every minute

### Media handling
- All images and videos uploaded to Cloudinary via `cloudinary.uploader`
- Company logos stored per space
- Testimonials support: reviewer image, attached images (up to 5), video (up to 2 min)
- Frontend compresses images client-side before upload (canvas-based scaling)
- Multiple image URLs stored as comma-separated strings in DB

### Plan-based limits
- Users have a `plan_id` (default: 1 = Free plan)
- Plans define: `max_spaces`, `max_text_reviews_per_space`, `max_video_reviews_per_space`
- Limits enforced server-side during space/testimonial creation
- `upgrade_plans` service exists but is currently empty

### Frontend architecture
- Next.js 14 App Router with `src/` directory
- Tailwind CSS with dark mode via `next-themes` (class-based)
- `framer-motion` for page/modal animations
- `react-hot-toast` for notifications
- `swiper` for testimonial carousels on landing page

## Data Flow: Collecting a Testimonial

```
1. Space owner creates a space via Dashboard
   POST /api/space/create (multipart/form-data with logo)

2. Owner shares public link: /collect/{spaceId}/{spaceName}

3. Reviewer visits link, sees space info (title, message, questions)

4. Reviewer chooses Text or Video testimonial:
   - Text: fills review, rating, name, email, optional images
   - Video: records via webcam (max 120s) or uploads file

5. Reviewer submits → POST /api/testimonial/create (multipart/form-data)
   - Media uploaded to Cloudinary
   - Review count incremented on space
   - Duplicate check by (space_id, email, type)

6. Owner views testimonials in Dashboard Inbox
   GET /api/testimonial/space/{spaceId}/testimonials
```

## Module Dependencies

```
Frontend:
  layout.tsx
    ├── ThemeProvider (next-themes)
    ├── AppContext (auth state)
    ├── ToastContext (react-hot-toast)
    ├── Header (nav + auth-aware links)
    └── Footer

  apiClient.ts → axios instance → backend API
  middleware.ts → cookie check → protects /dashboard/*

Backend:
  app.py
    ├── database.init_db() → auto-creates tables from sql/*.sql
    ├── init_mail() → Flask-Mail setup
    ├── JWTManager → cookie-based JWT
    ├── CORS → allows localhost:3000
    └── Blueprints: auth, space, testimonial
```
