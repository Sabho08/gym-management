-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text unique not null,
  phone text,
  role text not null check (role in ('admin', 'receptionist', 'trainer', 'member')),
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. TRAINERS
create table if not exists public.trainers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  full_name text not null,
  email text,
  phone text,
  specialization text not null default 'General Fitness',
  experience_years integer not null default 1,
  joining_date date not null default current_date,
  salary numeric(10,2) not null default 0,
  bio text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. MEMBERS
create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  member_code text unique not null,
  full_name text not null,
  email text,
  phone text not null,
  date_of_birth date,
  gender text check (gender in ('male', 'female', 'other', 'prefer_not_to_say')),
  address text,
  emergency_contact_name text,
  emergency_contact_phone text,
  joining_date date not null default current_date,
  assigned_trainer_id uuid references public.trainers(id) on delete set null,
  status text not null default 'active' check (status in ('active', 'inactive', 'blocked')),
  notes text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. MEMBERSHIP PLANS
create table if not exists public.membership_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  duration_days integer not null default 30,
  price numeric(10,2) not null,
  features text[],
  is_popular boolean default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. MEMBERSHIPS
create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  plan_id uuid not null references public.membership_plans(id) on delete restrict,
  start_date date not null default current_date,
  end_date date not null,
  price numeric(10,2) not null,
  discount numeric(10,2) not null default 0,
  final_amount numeric(10,2) not null,
  status text not null default 'active' check (status in ('active', 'expired', 'cancelled', 'pending')),
  auto_renew boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6. PAYMENTS
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  membership_id uuid references public.memberships(id) on delete set null,
  amount numeric(10,2) not null,
  payment_method text not null check (payment_method in ('cash', 'upi', 'card', 'bank_transfer', 'other')),
  transaction_reference text,
  payment_date date not null default current_date,
  status text not null default 'paid' check (status in ('paid', 'pending', 'failed', 'refunded')),
  notes text,
  created_by text default 'Admin',
  created_at timestamptz not null default now()
);

-- 7. ATTENDANCE
create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  attendance_date date not null default current_date,
  check_in time not null default current_time,
  check_out time,
  marked_by text default 'Receptionist',
  notes text,
  created_at timestamptz not null default now(),
  constraint unique_member_attendance_date unique (member_id, attendance_date)
);

-- 8. EXERCISES
create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'Strength',
  muscle_group text not null,
  description text,
  equipment text,
  video_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 9. WORKOUT PLANS
create table if not exists public.workout_plans (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references public.members(id) on delete cascade,
  trainer_id uuid references public.trainers(id) on delete set null,
  name text not null,
  description text,
  difficulty text default 'Intermediate',
  start_date date default current_date,
  end_date date,
  status text not null default 'active' check (status in ('active', 'completed', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 10. WORKOUT PLAN EXERCISES
create table if not exists public.workout_plan_exercises (
  id uuid primary key default gen_random_uuid(),
  workout_plan_id uuid not null references public.workout_plans(id) on delete cascade,
  exercise_id uuid references public.exercises(id) on delete cascade,
  day_name text not null default 'Day 1 - Push',
  sets integer not null default 3,
  reps text not null default '10-12',
  weight text default 'Bodyweight',
  rest_seconds integer not null default 60,
  instructions text,
  sort_order integer not null default 1,
  created_at timestamptz not null default now()
);

-- 11. WORKOUT LOGS
create table if not exists public.workout_logs (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  workout_plan_id uuid references public.workout_plans(id) on delete set null,
  exercise_id uuid references public.exercises(id) on delete cascade,
  performed_at timestamptz not null default now(),
  sets_completed integer not null default 3,
  reps_completed text not null default '12',
  weight text default '50 kg',
  notes text,
  created_at timestamptz not null default now()
);

-- 12. MEMBER MEASUREMENTS
create table if not exists public.member_measurements (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  measured_at date not null default current_date,
  weight numeric(5,2) not null,
  height numeric(5,2),
  body_fat_percentage numeric(4,1),
  chest numeric(5,2),
  waist numeric(5,2),
  arms numeric(5,2),
  thighs numeric(5,2),
  notes text,
  created_at timestamptz not null default now()
);

-- 13. PROGRESS PHOTOS
create table if not exists public.progress_photos (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  storage_path text not null,
  photo_type text not null default 'front' check (photo_type in ('front', 'side', 'back')),
  captured_at date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);

-- 14. NOTIFICATIONS
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  title text not null,
  message text not null,
  type text not null default 'info' check (type in ('info', 'warning', 'success', 'reminder')),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- 15. GYM SETTINGS
create table if not exists public.gym_settings (
  id uuid primary key default gen_random_uuid(),
  gym_name text not null default 'APEXFIT LUXURY PERFORMANCE CLUB',
  logo_url text,
  phone text default '+91 98765 43210',
  email text default 'contact@apexfit.club',
  address text default 'Level 4, High Street Grand Boulevard, Silicon Hub',
  opening_time text default '05:30 AM',
  closing_time text default '11:00 PM',
  currency text not null default 'INR',
  currency_symbol text not null default '₹',
  timezone text not null default 'Asia/Kolkata',
  tax_rate numeric(5,2) not null default 18.00,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- INDEXES
create index if not exists idx_members_code on public.members(member_code);
create index if not exists idx_members_status on public.members(status);
create index if not exists idx_memberships_member_id on public.memberships(member_id);
create index if not exists idx_memberships_status on public.memberships(status);
create index if not exists idx_memberships_end_date on public.memberships(end_date);
create index if not exists idx_payments_member_id on public.payments(member_id);
create index if not exists idx_payments_date on public.payments(payment_date);
create index if not exists idx_attendance_member_date on public.attendance(member_id, attendance_date);
