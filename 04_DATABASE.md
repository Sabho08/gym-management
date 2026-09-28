# Gym Management System — Database Specification

## 1. Database

Database:

```text
Supabase PostgreSQL
```

Primary key convention:

```sql
id uuid primary key default gen_random_uuid()
```

Timestamp convention:

```sql
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

---

## 2. profiles

Stores application users.

```text
profiles
---------
id
full_name
email
phone
role
avatar_url
is_active
created_at
updated_at
```

Roles:

```text
admin
receptionist
trainer
member
```

The `id` should correspond to the Supabase Auth user ID.

---

## 3. members

```text
members
---------
id
profile_id
member_code
full_name
email
phone
date_of_birth
gender
address
emergency_contact_name
emergency_contact_phone
joining_date
assigned_trainer_id
status
notes
created_at
updated_at
```

Status:

```text
active
inactive
blocked
```

`member_code` should be unique.

---

## 4. trainers

```text
trainers
---------
id
profile_id
specialization
experience_years
joining_date
salary
bio
is_active
created_at
updated_at
```

---

## 5. membership_plans

```text
membership_plans
-----------------
id
name
description
duration_days
price
is_active
created_at
updated_at
```

Examples:

```text
Monthly
Quarterly
Half-Yearly
Yearly
```

---

## 6. memberships

```text
memberships
------------
id
member_id
plan_id
start_date
end_date
price
discount
final_amount
status
auto_renew
created_at
updated_at
```

Status:

```text
active
expired
cancelled
pending
```

---

## 7. payments

```text
payments
--------
id
member_id
membership_id
amount
payment_method
transaction_reference
payment_date
status
notes
created_by
created_at
```

Payment methods:

```text
cash
upi
card
bank_transfer
other
```

Payment status:

```text
paid
pending
failed
refunded
```

---

## 8. attendance

```text
attendance
----------
id
member_id
attendance_date
check_in
check_out
marked_by
notes
created_at
```

Recommended unique constraint:

```text
(member_id, attendance_date)
```

if only one attendance record per member per day is allowed.

---

## 9. exercises

```text
exercises
---------
id
name
category
muscle_group
description
video_url
created_at
updated_at
```

Examples:

```text
Bench Press
Squat
Deadlift
Lat Pulldown
Bicep Curl
Shoulder Press
```

---

## 10. workout_plans

```text
workout_plans
-------------
id
member_id
trainer_id
name
description
start_date
end_date
status
created_at
updated_at
```

---

## 11. workout_plan_exercises

```text
workout_plan_exercises
----------------------
id
workout_plan_id
exercise_id
day_name
sets
reps
weight
rest_seconds
instructions
sort_order
created_at
```

---

## 12. workout_logs

```text
workout_logs
------------
id
member_id
workout_plan_id
exercise_id
performed_at
sets_completed
reps_completed
weight
notes
created_at
```

---

## 13. member_measurements

```text
member_measurements
-------------------
id
member_id
measured_at
weight
height
body_fat_percentage
chest
waist
arms
thighs
notes
created_at
```

---

## 14. progress_photos

```text
progress_photos
----------------
id
member_id
storage_path
photo_type
captured_at
notes
created_at
```

Photos should be stored in Supabase Storage, not directly inside PostgreSQL.

---

## 15. notifications

```text
notifications
-------------
id
user_id
title
message
type
is_read
created_at
```

---

## 16. gym_settings

```text
gym_settings
------------
id
gym_name
logo_url
phone
email
address
opening_time
closing_time
currency
timezone
created_at
updated_at
```

---

## 17. Relationships

```text
profiles
   │
   ├──────── trainers
   │
   └──────── members
                 │
                 ├──── memberships ──── membership_plans
                 │
                 ├──── payments
                 │
                 ├──── attendance
                 │
                 ├──── workout_plans ──── workout_plan_exercises
                 │                            │
                 │                            └──── exercises
                 │
                 ├──── workout_logs
                 │
                 ├──── member_measurements
                 │
                 └──── progress_photos
```

---

## 18. Recommended Indexes

Create indexes on:

```text
members.member_code
members.phone
members.email
members.status

memberships.member_id
memberships.status
memberships.end_date

payments.member_id
payments.payment_date
payments.status

attendance.member_id
attendance.attendance_date

workout_plans.member_id
workout_logs.member_id

member_measurements.member_id
progress_photos.member_id
```

---

## 19. Database Rules

Use foreign keys wherever relationships exist.

Example:

```text
members.assigned_trainer_id
        ↓
trainers.id
```

Use `ON DELETE` behavior deliberately.

Do not blindly use cascading deletes for financial or attendance records.

For important historical data, prefer:

```text
is_active = false
```

or status-based archival instead of deleting rows.

---

## 20. Migrations

All schema should be stored as migration files:

```text
supabase/migrations/
├── 001_extensions.sql
├── 002_profiles.sql
├── 003_trainers.sql
├── 004_members.sql
├── 005_membership_plans.sql
├── 006_memberships.sql
├── 007_payments.sql
├── 008_attendance.sql
├── 009_exercises.sql
├── 010_workout_plans.sql
├── 011_workout_logs.sql
├── 012_measurements.sql
├── 013_progress_photos.sql
├── 014_notifications.sql
└── 015_gym_settings.sql
```

This makes the complete database reproducible on another machine.

---

## 21. RLS

Initial development configuration:

```text
RLS: DISABLED
```

This matches the requested development setup.

For production, enable RLS and define policies before allowing arbitrary public access to the database.

The service-role key should remain server-side even when RLS is disabled.
