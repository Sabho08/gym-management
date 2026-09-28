# Gym Management System — Frontend Specification

## 1. Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Supabase JS
- React Hook Form
- Zod
- TanStack Query
- Recharts

---

## 2. Frontend Structure

```text
frontend/src/
├── app/
│   ├── router.tsx
│   └── providers.tsx
├── components/
│   ├── ui/
│   ├── forms/
│   ├── tables/
│   ├── charts/
│   └── layout/
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── members/
│   ├── memberships/
│   ├── attendance/
│   ├── payments/
│   ├── trainers/
│   ├── workouts/
│   ├── progress/
│   └── reports/
├── hooks/
├── lib/
│   ├── supabase.ts
│   ├── query-client.ts
│   └── validators/
├── pages/
├── types/
└── main.tsx
```

---

## 3. Main Routes

```text
/login

/dashboard

/members
/members/new
/members/:id

/members/:id/membership
/members/:id/payments
/members/:id/attendance
/members/:id/workouts
/members/:id/progress

/memberships
/memberships/plans

/attendance
/payments
/trainers
/workouts
/reports
/settings
```

---

## 4. Dashboard

The dashboard should show:

- Total members
- Active members
- New members this month
- Expiring memberships
- Today's attendance
- Today's revenue
- Pending payments
- Recent transactions
- Attendance graph
- Revenue graph
- Membership distribution

Example layout:

```text
┌───────────────────────────────────────────────┐
│ Dashboard                                     │
├──────────┬──────────┬──────────┬──────────────┤
│ Members  │ Active   │ Revenue  │ Attendance   │
│ 1,240    │ 1,085    │ ₹1.2L    │ 87 today    │
├──────────┴──────────┴──────────┴──────────────┤
│ Revenue Chart                                 │
├──────────────────────────┬────────────────────┤
│ Attendance                │ Expiring Soon      │
│ Chart                     │ Members            │
└──────────────────────────┴────────────────────┘
```

---

## 5. Member Management

Member list should support:

- Search
- Filtering
- Sorting
- Pagination
- Status filtering
- Membership expiry filtering

Member profile:

```text
Member
├── Personal Details
├── Contact Details
├── Emergency Contact
├── Membership
├── Payment History
├── Attendance
├── Trainer
├── Workout Plan
├── Measurements
└── Progress Photos
```

---

## 6. Forms

All forms should use:

```text
React Hook Form
        +
Zod validation
        +
Supabase mutation
        +
Toast feedback
        +
Query invalidation
```

Example member fields:

- Full name
- Email
- Phone
- Date of birth
- Gender
- Address
- Emergency contact
- Joining date
- Assigned trainer
- Membership plan

---

## 7. Authentication

Use Supabase Auth.

Flow:

```text
Login
 ↓
Supabase Auth
 ↓
Get authenticated user
 ↓
Fetch profile
 ↓
Determine role
 ↓
Load dashboard
```

Frontend must never contain the service-role key.

Example:

```ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

---

## 8. UI Principles

The interface should feel like a professional gym management SaaS.

Use:

- Clean dashboard
- Clear hierarchy
- Dense but readable data tables
- Consistent forms
- Responsive layout
- Desktop-first admin experience
- Mobile-friendly member pages
- Proper loading states
- Empty states
- Error states
- Confirmation dialogs for destructive actions

Avoid:

- Excessive gradients
- Fake metrics
- Unnecessary animations
- Excessive rounded cards
- Decorative UI that reduces usability

---

## 9. State Management

Use TanStack Query for server state.

Example:

```text
useMembers()
useMember(id)
useMemberships()
useAttendance(date)
usePayments()
useDashboardStats()
```

Mutation examples:

```text
useCreateMember()
useUpdateMember()
useCreateMembership()
useRecordPayment()
useMarkAttendance()
useCreateWorkoutPlan()
```

---

## 10. Realtime

Use Supabase Realtime for:

- Attendance updates
- Payment updates
- Member updates
- Dashboard counters where useful

Do not make every UI element realtime unnecessarily.

Use realtime only where immediate updates improve the workflow.
