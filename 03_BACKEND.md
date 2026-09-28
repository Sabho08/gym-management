# Gym Management System — Backend & Supabase Edge Functions

## 1. Backend Responsibilities

Supabase provides:

- PostgreSQL database
- Authentication
- Storage
- Realtime
- Edge Functions

The backend should be lightweight because most persistent data lives directly in PostgreSQL.

---

## 2. Supabase Client Types

### Browser client

Uses:

```text
SUPABASE_URL
SUPABASE_ANON_KEY
```

### Server/Edge Function client

Uses:

```text
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

The service-role key must never be sent to the browser.

---

## 3. Edge Functions

Recommended functions:

```text
supabase/functions/
├── create-member/
├── update-member/
├── create-membership/
├── record-payment/
├── mark-attendance/
├── calculate-dashboard/
├── generate-report/
├── send-membership-reminder/
├── generate-receipt/
└── create-admin-user/
```

Not every CRUD operation needs an Edge Function. Use direct database operations when no privileged server logic is required.

---

## 4. create-member

Responsibilities:

1. Validate request
2. Validate phone/email
3. Create member
4. Optionally create membership
5. Optionally assign trainer
6. Return created records

Pseudo-flow:

```text
Request
 ↓
Validate input
 ↓
Check duplicate member
 ↓
Insert member
 ↓
Create membership if requested
 ↓
Return member
```

---

## 5. record-payment

Responsibilities:

- Validate member
- Validate membership
- Validate amount
- Create payment
- Update membership payment state
- Generate receipt reference

Example request:

```json
{
  "member_id": "uuid",
  "membership_id": "uuid",
  "amount": 5000,
  "payment_method": "upi",
  "payment_date": "2026-09-28"
}
```

---

## 6. mark-attendance

Rules:

- A member should not have duplicate attendance for the same date unless the system explicitly supports multiple sessions.
- Record check-in time.
- Optionally record check-out time.
- Store the staff/user who marked attendance.

Example:

```json
{
  "member_id": "uuid",
  "attendance_date": "2026-09-28",
  "check_in": "08:32:00"
}
```

---

## 7. calculate-dashboard

Can return:

```json
{
  "total_members": 1240,
  "active_members": 1085,
  "expiring_members": 32,
  "today_attendance": 87,
  "today_revenue": 24500,
  "pending_payments": 18
}
```

For performance, avoid sending thousands of records to the frontend just to calculate these numbers.

Calculate aggregates in PostgreSQL/Edge Functions.

---

## 8. Membership Reminder

An Edge Function can identify memberships that:

- Expire in 7 days
- Expire in 3 days
- Expire tomorrow
- Have already expired

The function can later integrate with:

- Email
- WhatsApp provider
- SMS provider

Keep third-party API keys inside Edge Function secrets.

---

## 9. Report Generation

Reports can include:

### Revenue

```text
Date
Total revenue
Cash
UPI
Card
Other
```

### Attendance

```text
Date
Total check-ins
Unique members
Peak hour
```

### Membership

```text
Active
Expired
Expiring
New
Cancelled
```

The backend should perform aggregation rather than transferring raw rows unnecessarily.

---

## 10. Error Handling

Every Edge Function should return consistent responses.

Success:

```json
{
  "success": true,
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "MEMBER_NOT_FOUND",
    "message": "Member was not found."
  }
}
```

Use appropriate HTTP status codes.

---

## 11. Logging

Log:

- Function name
- Request ID
- Operation
- Error code
- Execution time

Do not log:

- Passwords
- Access tokens
- Service-role keys
- Payment secrets
- Sensitive authentication data

---

## 12. Local Supabase

Recommended workflow:

```bash
supabase start
supabase db reset
supabase functions serve
```

Create migrations:

```bash
supabase migration new initial_schema
```

Apply migrations:

```bash
supabase db reset
```

Deploy functions:

```bash
supabase functions deploy create-member
supabase functions deploy record-payment
```

Set production secrets using Supabase secrets rather than committing `.env` files.

---

## 13. Server-Side Service Role

For local scripts that need unrestricted database administration:

```text
Node.js script
      ↓
SUPABASE_SERVICE_ROLE_KEY
      ↓
Supabase PostgreSQL
```

Use this only in trusted local/server environments.

Never do this:

```ts
// BAD
const serviceRoleKey = "...";
```

Never expose it through:

```text
VITE_*
NEXT_PUBLIC_*
PUBLIC_*
```

---

## 14. Important RLS Note

The requested initial configuration keeps RLS disabled.

That is workable for a controlled local/admin application, but it means database tables do not have policy-level protection.

Before exposing the application to untrusted users or the public internet, enable RLS and create policies based on:

```text
Admin
Receptionist
Trainer
Member
```

The architecture should therefore avoid depending on RLS being permanently disabled.
