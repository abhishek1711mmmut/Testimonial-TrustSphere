# Frontend Architecture

Next.js 14 (App Router) + TypeScript + Tailwind CSS

---

## Routing

### Public Pages
| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `app/page.tsx` | Landing page (Hero, Features, FAQ, Pricing, Testimonials) |
| `/about` | `app/about/page.tsx` | About page |
| `/how-it-works` | `app/how-it-works/page.tsx` | How it works |
| `/testimonials` | `app/testimonials/page.tsx` | Public testimonials showcase |
| `/blog` | `app/blog/page.tsx` | Blog listing |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | Blog post detail |
| `/support` | `app/support/page.tsx` | Contact/support page |

### Auth Pages
| Route | Component | Description |
|-------|-----------|-------------|
| `/auth/signup` | `components/Auth/Signup.tsx` | Registration with OTP verification |
| `/auth/signin` | `components/Auth/Signin.tsx` | Email/password login |

### Protected Pages (require `access_token` cookie)
| Route | Component | Description |
|-------|-----------|-------------|
| `/dashboard/overview` | `components/Dashboard/Overview/` | Space stats + create new space |
| `/dashboard/inbox` | `components/Dashboard/Inbox/` | List all spaces with edit/delete |
| `/dashboard/inbox/[spaceName]` | Testimonials for a specific space |
| `/dashboard/embed` | `app/dashboard/embed/page.tsx` | Embed code generator (placeholder) |

### Public Collection Page
| Route | Component | Description |
|-------|-----------|-------------|
| `/collect/[spaceId]/[spaceName]` | `components/CollectFeedback/` | Public form for submitting testimonials |

---

## Authentication Flow

```
Signup:
  1. User fills form (firstName, lastName, email, password)
  2. Submit → sendOtp(email) → POST /api/auth/send-otp
  3. OTP modal opens with 6 input fields
  4. User enters OTP → signUp({...data, otp}) → POST /api/auth/signup
  5. On success → redirect to /auth/signin

Login:
  1. User fills email + password
  2. Submit → login(data) → POST /api/auth/login
  3. Backend sets httpOnly cookie `access_token`
  4. Frontend sets AppContext: isAuth=true, userId=email prefix
  5. localStorage.setItem('userId', userId)
  6. Redirect to /dashboard/overview

Route Protection:
  - middleware.ts checks for `access_token` cookie on /dashboard/* routes
  - Missing cookie → redirect to /auth/signin
  - apiClient interceptor: 401 response → clear localStorage → redirect to signin
```

---

## State Management

### AppContext (`src/context/AppContext.tsx`)
Global auth state via React Context:
- `isAuth: boolean` — logged in status
- `userId: string | null` — derived from email prefix on login
- `setIsAuth()`, `setUserId()` — setters

### ToastContext (`src/context/ToastContext.tsx`)
Wraps `react-hot-toast` Toaster component for notifications.

### Local State
Most components use `useState` for form data and modal visibility. No global store (Redux, Zustand) is used.

---

## API Layer

### `src/utils/apiClient.ts`
Axios instance configured with:
- `baseURL`: `NEXT_PUBLIC_FLASK_API_URL`
- `withCredentials: true` (sends cookies cross-origin)
- Response interceptor: 401 → clears localStorage → redirects to signin

### `src/api/auth.ts`
Exports: `signUp()`, `sendOtp()`, `login()`, `logout()`, `getUser()`

Each function:
1. Shows loading toast
2. Makes API call via `apiClient`
3. Shows success/error toast
4. Returns response data or null

---

## Key Components

### Dashboard Layout (`app/dashboard/layout.tsx`)
Two-column layout with framer-motion animations:
- Left (1/4): `Sidebar` with navigation links
- Right (3/4): Page content

### Sidebar (`components/Dashboard/Sidebar.tsx`)
Navigation menu from `menuData.tsx`:
1. Overview → `/dashboard/overview`
2. Inbox → `/dashboard/inbox`
3. Embed & Scripts → `/dashboard/embed`

### Overview (`components/Dashboard/Overview/`)
- Stats cards (spaces count, credits, plan)
- "Create a new space" button → `CreateSpaceModal`
- Spaces grid (currently hardcoded data)

### CreateSpaceModal
Form fields: spaceName, companyLogo (file), headerTitle, customMessage, questions (up to 5)
- Currently only logs to console on submit — **not yet connected to API**

### Inbox (`components/Dashboard/Inbox/`)
- Lists spaces with Open/Edit/Delete buttons
- Currently uses **hardcoded space data** — not yet fetching from API
- Delete opens `DeleteSpaceModal`

### CollectFeedback (`components/CollectFeedback/`)
Public page for submitting testimonials:
- Shows space info (logo, title, message, questions)
- Two buttons: "Record a Video" / "Send in Text"
- Currently uses **hardcoded spaceInfo** — not yet fetching from API

### TextModal
- Star rating, text review (20-500 chars), attached images (up to 5), name, email, reviewer photo
- Client-side image compression using canvas
- Image preview with lightbox (framer-motion AnimatePresence)
- Currently only logs to console — **not yet connected to API**

### VideoModal
- Webcam recording via MediaRecorder API (max 120 seconds with countdown)
- Or upload a video file (max 2 minutes)
- Star rating, name, email, reviewer photo
- Currently only logs to console — **not yet connected to API**

---

## Styling

- **Tailwind CSS** with custom theme colors (primary, primaryho, btndark, blackho, blacksection, etc.)
- **Dark mode** via `next-themes` with `attribute="class"` — uses Tailwind `dark:` variants
- **Framer Motion** for page transitions, modal enter/exit animations
- **Inter** font loaded via `next/font/google`

---

## Type Definitions (`src/types/`)

| Type | File | Fields |
|------|------|--------|
| `SpaceInfo` | reviewSpace.ts | spaceName, companyLogo, headerTitle, customMessage, questions |
| `Review` | reviewSpace.ts | rating, reviewerName, reviewerEmail, reviewerImage, review, attachedImages, video |
| `SignupData` | signupData.ts | firstName, lastName, email, password, otp |
| `SigninData` | signupData.ts | email, password |
| `Testimonial` | testimonial.ts | id, name, image, content, designation (for landing page display) |
