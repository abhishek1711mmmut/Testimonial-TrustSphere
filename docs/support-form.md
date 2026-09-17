# Support form

The public `/support` page submits JSON to `/api/support/contact` through the
Next.js API proxy. No login is required. Flask validates the request and uses the
existing Flask-Mail service to send a plain-text email to the author.

## Deployment

Backend settings:

```dotenv
# Optional: defaults to the contact address already displayed on the site.
SUPPORT_EMAIL=abhishek002kvs@gmail.com

# Existing SMTP configuration, also used for signup OTP emails.
MAIL_SERVER=your-smtp-host
MAIL_USERNAME=your-smtp-account
MAIL_PASSWORD=your-smtp-password
```

The existing mail setup uses port 587 with STARTTLS. The sender is the configured
SMTP account, not the visitor's address. Reply-To contains the visitor's email so
the author can reply normally. The client cannot choose a recipient. If changing
the public contact address, also update the displayed support/footer mailto links.

Restart/redeploy the backend: database initialization creates the InnoDB
`support_rate_limits` table from `Backend/sql/create_support_rate_limits_table.sql`.
The database account needs table-creation permissions, or apply that SQL using
your deployment migration process. Deploy the frontend changes too. The existing
`NEXT_PUBLIC_FLASK_API_URL` proxy configuration is reused.

## Behavior

- Required: name, email, subject, message, and consent to a response.
- Phone is optional and accepts international formats.
- Limits: name 100 characters, email 254, subject 150, message 5000, phone 30;
  total JSON body at most 64 KiB.
- Header fields reject line breaks. Message content is plain text, not HTML.
- A hidden honeypot rejects basic automated form submissions.
- MySQL counters enforce 3 send attempts per normalized email and 30 total per
  15-minute fixed window. Atomic updates share limits across workers and restarts.
  There can be a burst across a window boundary. Email variation can bypass the
  per-email limit, but not the global limit; this is not a CAPTCHA or DDoS defense.
- Counters store an email hash, not message content; old windows are cleaned up
  during later accepted submissions. Hashes are not a guarantee of anonymity.
- Attempts consume quota even if SMTP fails. A 429 includes Retry-After.
- The browser disables the form while sending. Validation errors and mail failures
  preserve the fields; success resets them. Network timeouts explicitly report
  that delivery could not be confirmed, since the backend might still finish.
- Success means the mail service accepted the send, not proof of inbox delivery.
  There is no database inbox, durable email queue, or automatic retry. Support
  message content is not stored in MySQL.

## Verification

From `Backend`, run `venv/bin/python -m unittest discover -s tests -v`.
Tests cover request validation, fixed recipients, Reply-To, rejection of header
injection, body limits, throttling transactions, mail failure, and compatibility
with existing OTP emails. Test mail is suppressed or mocked; no live email is sent.
