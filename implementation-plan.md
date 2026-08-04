 TrustSphere — Implementation Plan
  
 Context

 TrustSphere is a testimonial.to clone. The backend APIs are functional (auth, spaces CRUD, testimonials CRUD), and the frontend UI exists for all pages, but every frontend component uses hardcoded data and
 console.log instead of calling the API. The only working API integration is auth (signup, login, logout, OTP). The embed system (the core product feature) doesn't exist yet.

 This plan covers: (1) wiring all frontend pages to the backend, (2) adding missing backend endpoints, (3) building the embed/Wall of Love system.

 ---
 Phase 1: Frontend API Layer + Backend Gaps

 Create the missing API client functions and fix backend gaps needed for wiring.

 1a. Create Frontend/src/api/spaces.ts

 New file with functions that call the existing backend endpoints:
 - createSpace(formData: FormData) → POST /api/space/create
 - getSpaces() → GET /api/space/spaces
 - editSpace(spaceId: number, formData: FormData) → PUT /api/space/edit/{id}
 - deleteSpace(spaceId: number) → DELETE /api/space/delete/{id}

 Follow the same pattern as src/api/auth.ts (loading toast, error handling, return data).

 1b. Create Frontend/src/api/testimonials.ts

 - getTestimonialsBySpace(spaceId: number) → GET /api/testimonial/space/{id}/testimonials
 - createTestimonial(formData: FormData) → POST /api/testimonial/create
 - deleteTestimonial(testimonialId: number, spaceId: number) → DELETE /api/testimonial/delete/{tid}/{sid}

 1c. Add missing backend endpoint: public space info

 The /collect/[spaceId]/[spaceName] page needs to fetch space info without auth.

 - Backend/routes/space_routes.py: Add GET /api/space/public/<space_id> (no @jwt_required)
 - Backend/services/space_services.py: get_space_by_id_logic already exists but requires JWT. Create get_public_space_logic(space_id) that returns only public-facing fields (spaceName, companyLogo, headerTitle,
 customMessage, questions).

 1d. Add backend endpoint: user profile with plan details

 Dashboard Overview needs user stats. Currently GET /api/auth/user only returns JWT identity.

 - Backend/services/auth_services.py: Update get_user_logic() to return full user data: firstName, lastName, email, plan name, max_spaces, space count.

 ---
 Phase 2: Wire Frontend Components to Backend

 Replace all hardcoded data and console.log with real API calls.

 2a. Dashboard Overview (components/Dashboard/Overview/index.tsx)

 - Fetch spaces via getSpaces() on mount
 - Fetch user profile for plan/credits display
 - Show real spaces count, credits remaining, plan name
 - Render actual spaces list in the grid (replace hardcoded "Studynotion")
 - Link each space card to /dashboard/inbox/[spaceName]

 2b. Create Space Modal (components/Dashboard/Overview/Modal/CreateSpaceModal.tsx)

 - handleSubmit: build FormData from spaceInfo state, call createSpace(formData)
 - On success: close modal, refresh spaces list (callback prop from parent)

 2c. Dashboard Inbox (components/Dashboard/Inbox/index.tsx)

 - Fetch spaces via getSpaces() on mount (replace hardcoded spaceData)
 - Pass real space IDs to delete handler

 2d. Delete Space Modal (components/Dashboard/Inbox/DeleteSpaceModal.tsx)

 - Accept spaceId prop (not just spaceName)
 - handleDeleteSpace: call deleteSpace(spaceId), on success trigger parent refresh

 2e. Inbox/[spaceName] page (app/dashboard/inbox/[spaceName]/page.tsx)

 - Need to resolve spaceName → spaceId (pass via query param or look up from spaces list)
 - Fetch testimonials via getTestimonialsBySpace(spaceId)
 - Replace hardcoded tempSpaceData

 2f. Delete Testimonial Modal (components/Dashboard/Inbox/DeleteTestimonialModal.tsx)

 - Accept testimonialId and spaceId props
 - Call deleteTestimonial(testimonialId, spaceId), trigger parent refresh

 2g. Collect Feedback page (components/CollectFeedback/index.tsx)

 - Fetch space info via new public endpoint GET /api/space/public/{spaceId}
 - Replace hardcoded spaceInfo with fetched data

 2h. Text Modal (components/CollectFeedback/Modal/TextModal.tsx)

 - handleSubmit: build FormData, call createTestimonial(formData)
 - Show success message on completion

 2i. Video Modal (components/CollectFeedback/Modal/VideoModal.tsx)

 - handleSubmit: build FormData with video file, call createTestimonial(formData)
 - Show success message on completion

 ---
 Phase 3: Embed System (Wall of Love) — JS + iframe with auto-resize

 The core product feature — allow users to embed testimonials on external websites using an iframe that auto-resizes to fit content (no scrollbars).

 3a. Backend: Public embed endpoint

 Backend/routes/testimonial_routes.py: Add public endpoint:
 - GET /api/testimonial/embed/<space_id> — returns all testimonials for a space (no auth). Returns JSON with testimonials + space info.

 3b. Host iframeResizer library

 - Install iframe-resizer npm package in Frontend, OR download iframeResizer.min.js and iframeResizer.contentWindow.min.js into Frontend/public/js/
 - The content window script must be loaded inside the embed page (so the iframe can communicate its height to the parent)
 - The parent script is what external sites load via <script> tag

 3c. Frontend: Embed page for rendering testimonials

 New Next.js page: Frontend/src/app/embed/[spaceId]/page.tsx
 - A standalone page with its own layout (no header/footer/sidebar) — needs a separate layout.tsx in app/embed/
 - Fetches testimonials from GET /api/testimonial/embed/{spaceId}
 - Renders testimonials in carousel or masonry grid layout
 - Accepts query params: theme=light|dark, layout=carousel|grid
 - Loads iframeResizer.contentWindow.min.js so the iframe reports its height to the parent page
 - Styled to look clean as an embedded widget

 3d. Frontend: Embed code generator dashboard page

 Update Frontend/src/app/dashboard/embed/page.tsx:
 - Fetch real spaces list via getSpaces()
 - When user selects a space, generate embed code:
 <script src="https://your-domain.com/js/iframeResizer.min.js"></script>
 <iframe id="trustsphere-{spaceId}" src="https://your-domain.com/embed/{spaceId}?theme=light&layout=carousel" frameborder="0" scrolling="no" width="100%"></iframe>
 <script>iFrameResize({log: false, checkOrigin: false}, '#trustsphere-{spaceId}');</script>
 - Copy-to-clipboard button
 - Live preview of the embed below the code
 - Options: theme toggle (light/dark), layout (carousel/grid)

 ---
 Phase 4: Polish

 4a. Fix backend: decrement review count on delete

 services/testimonial_services.py → delete_testimonial_logic does not decrement text_review_count/video_review_count on the space. Add this.

 4b. Seed plans table

 The plans table seed data is commented out in SQL. Either:
 - Uncomment in sql/create_plans_table.sql and handle idempotency, OR
 - Add seed logic in config/database.py after table creation

 ---
 Execution Order (Phase by Phase)

 We build and test one phase at a time. After each phase, verify in browser before moving on.

 Phase 1 — API layer + backend gaps (test with Postman/curl)

 ┌──────┬──────────────────────────────────────────────────────┬────────────────────────────────────────────────────────────────────┐
 │ Step │                         What                         │                               Files                                │
 ├──────┼──────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────┤
 │ 1    │ Create frontend API functions                        │ src/api/spaces.ts, src/api/testimonials.ts                         │
 ├──────┼──────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────┤
 │ 2    │ Add public space endpoint                            │ Backend/routes/space_routes.py, Backend/services/space_services.py │
 ├──────┼──────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────┤
 │ 3    │ Fix user profile endpoint                            │ Backend/services/auth_services.py                                  │
 ├──────┼──────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────┤
 │ 4    │ Fix review count decrement on delete                 │ Backend/services/testimonial_services.py                           │
 ├──────┼──────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────┤
 │ 5    │ Seed plans table                                     │ Backend/config/database.py                                         │
 ├──────┼──────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────┤
 │ Test │ Verify all new/updated endpoints via curl or Postman │                                                                    │
 └──────┴──────────────────────────────────────────────────────┴────────────────────────────────────────────────────────────────────┘

 Phase 2 — Wire frontend to backend (test each page in browser)

 ┌──────┬────────────────────────────────────────────────────────────────────────────────────┬──────────────────────────────────────────────────────────┐
 │ Step │                                        What                                        │                          Files                           │
 ├──────┼────────────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────┤
 │ 6    │ Wire Dashboard Overview + Create Space                                             │ Overview/index.tsx, CreateSpaceModal.tsx                 │
 ├──────┼────────────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────┤
 │ 7    │ Wire Inbox + Delete Space                                                          │ Inbox/index.tsx, DeleteSpaceModal.tsx                    │
 ├──────┼────────────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────┤
 │ 8    │ Wire Inbox/[spaceName] + Delete Testimonial                                        │ [spaceName]/page.tsx, DeleteTestimonialModal.tsx         │
 ├──────┼────────────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────┤
 │ 9    │ Wire Collect Feedback + Text/Video submit                                          │ CollectFeedback/index.tsx, TextModal.tsx, VideoModal.tsx │
 ├──────┼────────────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────┤
 │ Test │ Full flow: create space → share link → submit testimonial → view in inbox → delete │                                                          │
 └──────┴────────────────────────────────────────────────────────────────────────────────────┴──────────────────────────────────────────────────────────┘

 Phase 3 — Embed system (test with external HTML file)

 ┌──────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬────────────────────────────────────────────────────┐
 │ Step │                                                           What                                                           │                       Files                        │
 ├──────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────────────────────────────────────┤
 │ 10   │ Add public embed endpoint                                                                                                │ Backend/routes/testimonial_routes.py               │
 ├──────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────────────────────────────────────┤
 │ 11   │ Add iframeResizer scripts                                                                                                │ Frontend/public/js/                                │
 ├──────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────────────────────────────────────┤
 │ 12   │ Build embed page (standalone, no shell)                                                                                  │ app/embed/[spaceId]/page.tsx, app/embed/layout.tsx │
 ├──────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────────────────────────────────────┤
 │ 13   │ Build embed code generator dashboard page                                                                                │ app/dashboard/embed/page.tsx                       │
 ├──────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────────────────────────────────────┤
 │ Test │ Generate embed code → paste into a test HTML file → open in browser → verify testimonials render and iframe auto-resizes │                                                    │
 └──────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴────────────────────────────────────────────────────┘