# Gym Management System — Architecture

## 1. Project Overview

A full-stack Gym Management System for managing:

- Members
- Membership plans
- Membership subscriptions
- Payments
- Trainers
- Attendance
- Workout plans
- Exercise records
- Member progress
- Staff/admin users
- Notifications/reminders
- Dashboard analytics
- Gym settings

### Core stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript + Vite |
| Styling | Tailwind CSS |
| Backend | Supabase |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth |
| Server-side logic | Supabase Edge Functions |
| Realtime | Supabase Realtime |
| Storage | Supabase Storage |
| Local development | Node.js + Supabase CLI |
| Deployment | Vercel/Netlify for frontend + Supabase |

---

## 2. High-Level Architecture

```text
                         ┌─────────────────────┐
                         │      Frontend       │
                         │ React + TypeScript  │
                         └──────────┬──────────┘
                                    │
                    ┌───────────────┼────────────────┐
                    │               │                │
                    ▼               ▼                ▼
              Supabase Auth     Supabase DB     Supabase Storage
                    │               │                │
                    │               ▼                │
                    │         PostgreSQL             │
                    │               │                │
                    │               ▼                │
                    │          Realtime              │
                    │                                │
                    └──────────────┬─────────────────┘
                                   │
                                   ▼
                         Supabase Edge Functions
                                   │
                     ┌─────────────┼─────────────┐
                     ▼             ▼             ▼
                  Payments     Reminders      Reports
```

---

## 3. Main User Roles

### Admin

Can manage the complete gym:

- Members
- Staff
- Trainers
- Plans
- Payments
- Attendance
- Reports
- Settings

### Receptionist

Can:

- Register members
- Search members
- Record payments
- Mark attendance
- View membership status

### Trainer

Can:

- View assigned members
- Create workout plans
- Record workout progress
- Add exercise records
- View member measurements

### Member

Can:

- View own profile
- View membership
- View attendance
- View workout plan
- View progress
- View payment history

---

## 4. Application Modules

```text
Dashboard
├── Overview
├── Revenue
├── Active Members
├── Expiring Memberships
└── Attendance

Members
├── All Members
├── Add Member
├── Member Profile
├── Membership
├── Attendance
├── Payments
├── Workout Plan
└── Progress

Memberships
├── Plans
├── Active Memberships
├── Expiring Soon
└── Expired

Attendance
├── Daily Attendance
├── Member Attendance
└── Attendance Reports

Trainers
├── Trainer List
├── Assigned Members
└── Trainer Performance

Workouts
├── Workout Plans
├── Exercises
└── Progress

Payments
├── Transactions
├── Pending Payments
├── Revenue
└── Receipts

Reports
├── Member Reports
├── Attendance Reports
├── Revenue Reports
└── Membership Reports

Settings
├── Gym Profile
├── Membership Settings
├── Users
└── System Settings
```

---

## 5. Data Flow

### Adding a member

```text
Frontend
   ↓
Validate form
   ↓
Supabase client
   ↓
members table
   ↓
Create membership if selected
   ↓
Display updated member
```

### Payment

```text
Frontend
   ↓
Payment form
   ↓
Edge Function
   ↓
Validate member + membership
   ↓
Create payment record
   ↓
Update membership/payment state
   ↓
Return result
```

### Attendance

```text
Member lookup
   ↓
Check today's attendance
   ↓
Create attendance record
   ↓
Realtime update
   ↓
Dashboard refresh
```

---

## 6. Security Model

The project will use:

- Supabase Auth
- Environment variables
- Server-side Edge Functions for privileged operations
- Service-role key only in trusted server environments

The project can initially run with RLS disabled as requested.

However:

**Never expose `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_SERVICE_ROLE_KEY` equivalents to the frontend.**

The service-role key bypasses database security policies.

For local development:

```text
Frontend
  └── SUPABASE_URL
  └── SUPABASE_ANON_KEY

Edge Functions / server scripts
  └── SUPABASE_URL
  └── SUPABASE_SERVICE_ROLE_KEY
```

---

## 7. Local Development

Recommended structure:

```text
gym-management/
├── frontend/
├── supabase/
│   ├── migrations/
│   ├── functions/
│   │   ├── create-member/
│   │   ├── record-payment/
│   │   ├── mark-attendance/
│   │   ├── generate-report/
│   │   └── send-reminder/
│   └── config.toml
├── scripts/
├── .env
├── .env.example
└── README.md
```

Database schema changes should be made through SQL migrations.

Example:

```bash
supabase migration new create_members_table
supabase db reset
```

Do not make production schema changes manually if the project is using migrations. Keep the database reproducible.

---

## 8. Important Design Principle

Use direct Supabase queries for normal CRUD where appropriate.

Use Edge Functions for operations that:

- Require service-role privileges
- Need multiple database operations atomically
- Need external APIs
- Need secret credentials
- Generate reports
- Send notifications
- Perform sensitive business logic
- Process payments

This keeps the frontend simple while keeping privileged logic outside the browser.
