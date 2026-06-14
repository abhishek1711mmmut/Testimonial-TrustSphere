# API Reference

Base URL: `http://localhost:5000`

All responses follow the format:
```json
{ "success": "true"|"false", "message": "...", "data": ... }
```

Authentication uses JWT stored in an `access_token` httpOnly cookie (3-day expiry).

---

## Auth (`/api/auth`)

### POST `/api/auth/send-otp`
Send a 6-digit OTP to the user's email. OTP is valid for 10 minutes.

**Body:**
```json
{ "email": "user@example.com" }
```

**Response:** `200` on success

---

### POST `/api/auth/signup`
Create a new user account. Requires valid OTP.

**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "password": "secret",
  "otp": "123456"
}
```

**Response:** `201` on success. User gets default plan_id = 1 (Free).

**Errors:** `400` missing fields, invalid OTP, user already exists. `500` server error.

---

### POST `/api/auth/login`
Authenticate and set JWT cookie.

**Body:**
```json
{ "email": "user@example.com", "password": "secret" }
```

**Response:** `200` + sets `access_token` httpOnly cookie.

**Errors:** `404` user not found. `401` invalid password.

---

### GET `/api/auth/logout`
Clear the JWT cookie. **Requires auth.**

**Response:** `200` + clears `access_token` cookie (max_age=0).

---

### GET `/api/auth/user`
Get current authenticated user identity. **Requires auth.**

**Response:** `200` with success message. (Currently returns JWT identity only, not full user profile.)

---

## Spaces (`/api/space`)

All routes require JWT authentication.

### POST `/api/space/create`
Create a new testimonial collection space. **Multipart form data.**

**Form fields:**
| Field | Type | Required |
|-------|------|----------|
| spaceName | string | Yes |
| headerTitle | string | Yes |
| customMessage | string | Yes |
| questions | string[] | No |
| companyLogo | file (image) | No |

**Logic:**
- Checks user's plan limit for max spaces
- Checks for duplicate space name per user
- Uploads logo to Cloudinary if provided

**Response:** `201` on success.

---

### GET `/api/space/spaces`
Get all spaces for the authenticated user, ordered by `created_at DESC`.

**Response:**
```json
{
  "success": "true",
  "data": [
    {
      "id": 1,
      "spaceName": "My Product",
      "companyLogo": "https://res.cloudinary.com/...",
      "headerTitle": "Share your experience",
      "customMessage": "We'd love to hear from you",
      "questions": ["How did you hear about us?", "..."],
      "text_review_count": 5,
      "video_review_count": 2,
      "created_at": "2024-01-01T00:00:00",
      "user_id": 1
    }
  ]
}
```

---

### PUT `/api/space/edit/<space_id>`
Update a space. **Multipart form data.** Same fields as create.

**Response:** `200` on success. `404` if space not found or not owned by user.

---

### DELETE `/api/space/delete/<space_id>`
Delete a space. Also deletes the company logo from Cloudinary.

**Response:** `200` on success. `404` if space not found or not owned by user.

---

## Testimonials (`/api/testimonial`)

### POST `/api/testimonial/create`
Submit a testimonial. **Public endpoint (no auth required).** Multipart form data.

**Form fields:**
| Field | Type | Required |
|-------|------|----------|
| spaceId | int | Yes |
| rating | int | Yes |
| reviewerName | string | Yes |
| reviewerEmail | string | Yes |
| review | string | No (text type) |
| reviewerImage | file | No |
| attachedImages | file[] | No (up to 5) |
| video | file (video) | No |

**Logic:**
- Determines type (`text` or `video`) based on whether video file is present
- Checks plan limits for text/video reviews per space
- Prevents duplicate submissions (same space + email + type)
- Uploads all media to Cloudinary
- Increments `text_review_count` or `video_review_count` on the space

**Response:** `201` on success.

---

### GET `/api/testimonial/space/<space_id>/testimonials`
Get all testimonials for a space. **Requires auth.**

**Response:**
```json
{
  "success": "true",
  "data": [
    {
      "id": 1,
      "rating": 5,
      "reviewer_name": "Jane",
      "reviewer_email": "jane@example.com",
      "reviewer_image": "https://...",
      "review": "Great product!",
      "attached_images": ["https://...", "https://..."],
      "video": null,
      "created_at": "2024-01-01T00:00:00",
      "space_id": 1,
      "type": "text"
    }
  ]
}
```

---

### DELETE `/api/testimonial/delete/<testimonial_id>/<space_id>`
Delete a testimonial by ID. **Requires auth.**

**Response:** Returns the updated list of testimonials for the space.
