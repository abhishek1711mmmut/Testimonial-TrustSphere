# Project Status

Last updated: 2026-06-07

---

## What's Working (Backend)

- Auth flow: signup with OTP verification, login (JWT cookie), logout, get user
- Space CRUD: create (with Cloudinary logo upload), list, edit, delete
- Testimonial: create (text/video with Cloudinary uploads), list by space, delete
- Plan-based limits enforced (max spaces, max reviews per space)
- Duplicate prevention (same email can't submit same type twice per space)
- OTP auto-expiry via MySQL scheduled event
- Database auto-initialization on startup

## What's Working (Frontend)

- Landing page with all marketing sections (Hero, Features, FAQ, Pricing, Testimonials)
- Auth pages: signup with OTP modal, signin with redirect to dashboard
- Dashboard layout with sidebar navigation
- Dark/light theme toggle
- Route protection via Next.js middleware (cookie check)
- Axios 401 interceptor for auto-redirect
- Text review modal with image compression and lightbox preview
- Video review modal with webcam recording (MediaRecorder) and file upload

---

## What's NOT Connected Yet (Frontend ↔ Backend gaps)

These frontend features exist in the UI but are **not yet wired to the backend API**:

1. **Dashboard Overview** — spaces count, credits, and plan are hardcoded values (0, 2, "Free"). Needs to fetch from `/api/space/spaces` and user data.

2. **Dashboard Inbox** — uses hardcoded `spaceData` array. Needs to fetch from `/api/space/spaces`.

3. **Create Space Modal** — form captures all data but `handleSubmit` only logs to console. Needs to POST to `/api/space/create` with `FormData`.

4. **Delete Space** — `DeleteSpaceModal` exists but delete handler is not calling the API.

5. **Edit Space** — edit button exists but has no click handler.

6. **Collect Feedback Page** — uses hardcoded `spaceInfo`. Needs to fetch space data by ID from the backend (a public endpoint for this doesn't exist yet — would need a new route like `GET /api/space/<space_id>/public`).

7. **Text/Video Testimonial Submit** — modals capture all form data but `handleSubmit` only logs to console. Need to POST to `/api/testimonial/create` with `FormData`.

8. **Dashboard Inbox/[spaceName]** — testimonial list page exists but is not implemented.

9. **Google/GitHub OAuth** — buttons exist in signup/signin pages but are non-functional.

10. **Forgot Password** — link exists on signin page but points to `#`.

11. **Upgrade Plans** — `upgrade_plans.py` service file is empty. `upgradePlan_routes.py` exists but is not registered in `app.py`.

12. **Profile picture API** — committed but route/service not visible in current codebase.

13. **Embed & Scripts** — dashboard page exists but is a placeholder.

---

## Missing Backend Endpoints

| Need | Suggested Endpoint |
|------|--------------------|
| Get space by ID (public, for /collect page) | `GET /api/space/public/<space_id>` |
| Get full user profile (name, plan, stats) | `GET /api/auth/profile` |
| Forgot password / reset password | `POST /api/auth/forgot-password`, `POST /api/auth/reset-password` |
| Get embed code for a space | `GET /api/space/<space_id>/embed` |

---

## Priority Order for Completion

1. Wire up Create Space modal → `POST /api/space/create`
2. Wire up Dashboard Overview + Inbox → `GET /api/space/spaces`
3. Wire up Collect Feedback page (need public space endpoint)
4. Wire up Text/Video testimonial submit → `POST /api/testimonial/create`
5. Wire up Inbox/[spaceName] → `GET /api/testimonial/space/<id>/testimonials`
6. Wire up Delete Space → `DELETE /api/space/delete/<id>`
7. Implement Embed & Scripts page
8. Implement plan upgrade flow
