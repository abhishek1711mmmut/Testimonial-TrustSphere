# Database Schema

MySQL database. Tables auto-created on backend startup from `Backend/sql/*.sql`.

---

## Entity Relationship

```
plans (1) ──────< users (1) ──────< spaces (1) ──────< testimonials
                                        │
                                        │
                  otp (standalone)  ─────┘ (no FK, linked by email)
```

---

## Tables

### `plans`
Defines subscription tiers and their limits.

| Column | Type | Notes |
|--------|------|-------|
| id | INT PK AUTO_INCREMENT | |
| name | VARCHAR(50) | e.g., "Free", "Premium" |
| max_spaces | INT | NULL = unlimited |
| max_text_reviews_per_space | INT | NULL = unlimited |
| max_video_reviews_per_space | INT | NULL = unlimited |

**Seed data (commented out in SQL, must be inserted manually):**
```sql
INSERT INTO plans (name, max_spaces, max_text_reviews_per_space, max_video_reviews_per_space)
VALUES
  ('Free', 10, 10, 5),
  ('Premium', NULL, NULL, NULL);
```

---

### `users`

| Column | Type | Notes |
|--------|------|-------|
| id | INT PK AUTO_INCREMENT | |
| firstName | VARCHAR(50) | |
| lastName | VARCHAR(50) | |
| email | VARCHAR(50) UNIQUE | |
| password | VARCHAR(500) | bcrypt hash |
| plan_id | INT DEFAULT 1 | FK → plans.id, ON DELETE SET NULL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

---

### `spaces`

| Column | Type | Notes |
|--------|------|-------|
| id | INT PK AUTO_INCREMENT | |
| spaceName | VARCHAR(255) | |
| companyLogo | VARCHAR(255) | Cloudinary URL |
| headerTitle | VARCHAR(255) | |
| customMessage | TEXT | |
| questions | TEXT | Comma-separated strings |
| text_review_count | INT DEFAULT 0 | Denormalized counter |
| video_review_count | INT DEFAULT 0 | Denormalized counter |
| created_at | TIMESTAMP | |
| user_id | INT FK | → users.id, ON DELETE CASCADE |

---

### `testimonials`

| Column | Type | Notes |
|--------|------|-------|
| id | INT PK AUTO_INCREMENT | |
| rating | INT | 1-5 stars |
| reviewer_name | VARCHAR(255) | |
| reviewer_email | VARCHAR(255) | |
| reviewer_image | VARCHAR(255) | Cloudinary URL |
| review | TEXT | Text content (for text type) |
| attached_images | TEXT | Comma-separated Cloudinary URLs |
| video | VARCHAR(255) | Cloudinary URL (for video type) |
| created_at | TIMESTAMP | |
| space_id | INT FK | → spaces.id, ON DELETE CASCADE |
| type | ENUM('text', 'video') | |

---

### `otp`
Stores one-time passwords for email verification during signup.

| Column | Type | Notes |
|--------|------|-------|
| id | INT PK AUTO_INCREMENT | |
| email | VARCHAR(255) UNIQUE | Upserted on resend |
| otp_code | VARCHAR(6) | 6-digit numeric |
| created_at | TIMESTAMP | Used for 10-min expiry check |

**MySQL scheduled event** runs every minute to delete OTPs older than 10 minutes:
```sql
CREATE EVENT IF NOT EXISTS delete_expired_otps
ON SCHEDULE EVERY 1 MINUTE
DO DELETE FROM otp WHERE TIMESTAMPDIFF(MINUTE, created_at, NOW()) >= 10;
```

---

## Important Notes

- **No ORM** — all queries use raw SQL via `flask_mysqldb` cursors
- **Column access by index** — cursor returns tuples, not dicts. Column order matters:
  - `users`: (id, firstName, lastName, email, password, plan_id, created_at)
  - `spaces`: (id, spaceName, companyLogo, headerTitle, customMessage, questions, text_review_count, video_review_count, created_at, user_id)
  - `testimonials`: (id, rating, reviewer_name, reviewer_email, reviewer_image, review, attached_images, video, created_at, space_id, type)
- **Cascading deletes**: deleting a user cascades to spaces → testimonials
- **Plans table must be seeded** before any user can sign up (default plan_id = 1)
