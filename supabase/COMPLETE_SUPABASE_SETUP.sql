-- ==============================================================================
-- APEXFIT LUXURY GYM MANAGEMENT SYSTEM - DATABASE SCHEMA & INITIAL SEED DATA
-- Run this entire script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/aoikhsiditnurjuwejvh/sql/new
-- ==============================================================================

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- ==============================================================================
-- 2. CREATE TABLES
-- ==============================================================================

-- PROFILES
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

-- TRAINERS / COACHES
create table if not exists public.trainers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  full_name text not null,
  email text,
  phone text,
  specialization text not null default 'General Strength',
  experience_years integer not null default 2,
  joining_date date not null default current_date,
  salary numeric(10,2) not null default 45000,
  bio text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- MEMBERS
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

-- MEMBERSHIP PLANS
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

-- MEMBERSHIPS (Subscriptions)
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
  auto_renew boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- PAYMENTS & INVOICES
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

-- ATTENDANCE LOGS
create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  attendance_date date not null default current_date,
  check_in time not null default current_time,
  check_out time,
  marked_by text default 'Front Desk',
  notes text,
  created_at timestamptz not null default now(),
  constraint unique_member_attendance_date unique (member_id, attendance_date)
);

-- EXERCISES
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

-- WORKOUT PLANS
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

-- WORKOUT PLAN EXERCISES
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

-- WORKOUT LOGS
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

-- MEMBER MEASUREMENTS
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

-- PROGRESS PHOTOS
create table if not exists public.progress_photos (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  storage_path text not null,
  photo_type text not null default 'front' check (photo_type in ('front', 'side', 'back')),
  captured_at date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);

-- NOTIFICATIONS
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  title text not null,
  message text not null,
  type text not null default 'info' check (type in ('info', 'warning', 'success', 'reminder')),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- GYM SETTINGS
create table if not exists public.gym_settings (
  id uuid primary key default gen_random_uuid(),
  gym_name text not null default 'APEXFIT LUXURY PERFORMANCE CLUB',
  logo_url text,
  phone text default '+91 98765 43210',
  email text default 'concierge@apexfit.club',
  address text default 'Level 4, Grand Boulevard Tower, Central Business District, Mumbai, MH',
  opening_time text default '05:30 AM',
  closing_time text default '11:00 PM',
  currency text not null default 'INR',
  currency_symbol text not null default '₹',
  timezone text not null default 'Asia/Kolkata',
  tax_rate numeric(5,2) not null default 18.00,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ==============================================================================
-- 3. ENABLE RLS POLICIES FOR APP PERMISSION
-- ==============================================================================
alter table public.profiles enable row level security;
alter table public.trainers enable row level security;
alter table public.members enable row level security;
alter table public.membership_plans enable row level security;
alter table public.memberships enable row level security;
alter table public.payments enable row level security;
alter table public.attendance enable row level security;
alter table public.exercises enable row level security;
alter table public.workout_plans enable row level security;
alter table public.workout_plan_exercises enable row level security;
alter table public.workout_logs enable row level security;
alter table public.member_measurements enable row level security;
alter table public.progress_photos enable row level security;
alter table public.notifications enable row level security;
alter table public.gym_settings enable row level security;

-- Drop and recreate permissive policies
drop policy if exists "Allow all on profiles" on public.profiles;
create policy "Allow all on profiles" on public.profiles for all using (true) with check (true);

drop policy if exists "Allow all on trainers" on public.trainers;
create policy "Allow all on trainers" on public.trainers for all using (true) with check (true);

drop policy if exists "Allow all on members" on public.members;
create policy "Allow all on members" on public.members for all using (true) with check (true);

drop policy if exists "Allow all on membership_plans" on public.membership_plans;
create policy "Allow all on membership_plans" on public.membership_plans for all using (true) with check (true);

drop policy if exists "Allow all on memberships" on public.memberships;
create policy "Allow all on memberships" on public.memberships for all using (true) with check (true);

drop policy if exists "Allow all on payments" on public.payments;
create policy "Allow all on payments" on public.payments for all using (true) with check (true);

drop policy if exists "Allow all on attendance" on public.attendance;
create policy "Allow all on attendance" on public.attendance for all using (true) with check (true);

drop policy if exists "Allow all on exercises" on public.exercises;
create policy "Allow all on exercises" on public.exercises for all using (true) with check (true);

drop policy if exists "Allow all on workout_plans" on public.workout_plans;
create policy "Allow all on workout_plans" on public.workout_plans for all using (true) with check (true);

drop policy if exists "Allow all on workout_plan_exercises" on public.workout_plan_exercises;
create policy "Allow all on workout_plan_exercises" on public.workout_plan_exercises for all using (true) with check (true);

drop policy if exists "Allow all on workout_logs" on public.workout_logs;
create policy "Allow all on workout_logs" on public.workout_logs for all using (true) with check (true);

drop policy if exists "Allow all on member_measurements" on public.member_measurements;
create policy "Allow all on member_measurements" on public.member_measurements for all using (true) with check (true);

drop policy if exists "Allow all on progress_photos" on public.progress_photos;
create policy "Allow all on progress_photos" on public.progress_photos for all using (true) with check (true);

drop policy if exists "Allow all on notifications" on public.notifications;
create policy "Allow all on notifications" on public.notifications for all using (true) with check (true);

drop policy if exists "Allow all on gym_settings" on public.gym_settings;
create policy "Allow all on gym_settings" on public.gym_settings for all using (true) with check (true);

-- ==============================================================================
-- 4. SEED INITIAL DATA
-- ==============================================================================

-- 4.1 Gym Settings
insert into public.gym_settings (id, gym_name, phone, email, address, opening_time, closing_time, currency, currency_symbol, timezone, tax_rate)
values ('11111111-1111-1111-1111-111111111111', 'APEXFIT LUXURY PERFORMANCE CLUB', '+91 98765 43210', 'concierge@apexfit.club', 'Level 4, Grand Boulevard Tower, Central Business District, Mumbai, MH', '05:30 AM', '11:00 PM', 'INR', '₹', 'Asia/Kolkata', 18.00)
on conflict (id) do nothing;

-- 4.2 Membership Plans
insert into public.membership_plans (id, name, description, duration_days, price, features, is_popular, is_active)
values
  ('22222222-2222-2222-2222-222222222201', 'Standard Monthly', 'Full club access, cardio & strength floor, steam & sauna, locker room.', 30, 3500, array['All Gym Equipment', 'Locker & Shower Access', 'Steam & Sauna', '1 Fitness Assessment', 'Mobile App Access'], false, true),
  ('22222222-2222-2222-2222-222222222202', 'Quarterly Pro', '3 months unlimited access with complimentary personal training sessions.', 90, 9500, array['All Club Areas Access', '2 Personal Trainer Sessions', 'Nutrition Consultation', 'Recovery Zone Access', 'Guest Passes (2/month)'], true, true),
  ('22222222-2222-2222-2222-222222222203', 'Half-Yearly Elite', '6 months full club access, unlimited group classes (HIIT, Spin, Pilates).', 180, 17500, array['Priority Club Access', 'Unlimited Group Classes', 'Monthly Body Composition Scans', '6 PT Sessions Included', 'Dedicated Towel Service'], false, true),
  ('22222222-2222-2222-2222-222222222204', 'Annual Black Tier VIP', '365 days VIP access, dedicated coach, private valet, spa & lounge privileges.', 365, 32000, array['24/7 VIP Access', 'Dedicated Personal Coach', 'Customized Nutrition & Macro Plan', 'Unlimited Recovery Lounge Access', 'Complimentary Valet Parking', 'Free Club Kit'], false, true)
on conflict (id) do nothing;

-- 4.3 Exercises
insert into public.exercises (id, name, category, muscle_group, description, equipment)
values
  ('33333333-3333-3333-3333-333333333301', 'Barbell Incline Bench Press', 'Strength', 'Chest', 'Upper pectoral development on 30-degree incline bench.', 'Olympic Barbell & Incline Bench'),
  ('33333333-3333-3333-3333-333333333302', 'Flat Dumbbell Press', 'Strength', 'Chest', 'Pectoral hypertrophy with deep range of motion.', 'Dumbbells & Flat Bench'),
  ('33333333-3333-3333-3333-333333333303', 'Cable Chest Flyes', 'Strength', 'Chest', 'Peak contraction tension across chest fibers.', 'Dual Adjustable Pulley'),
  ('33333333-3333-3333-3333-333333333304', 'Barbell Conventional Deadlift', 'Strength', 'Back', 'Posterior chain compound strength foundation.', 'Olympic Barbell & Bumper Plates'),
  ('33333333-3333-3333-3333-333333333305', 'Lat Pulldown (Wide Grip)', 'Strength', 'Back', 'Targeting latissimus dorsi width.', 'Lat Pulldown Machine'),
  ('33333333-3333-3333-3333-333333333306', 'Barbell Back Squat', 'Strength', 'Legs', 'Fundamental quad and glute strength exercise.', 'Squat Rack & Barbell'),
  ('33333333-3333-3333-3333-333333333307', 'Leg Press 45 Degree', 'Strength', 'Legs', 'High volume quad and hamstring loading.', '45-degree Leg Press'),
  ('33333333-3333-3333-3333-333333333308', 'Standing Overhead Barbell Press', 'Strength', 'Shoulders', 'Total shoulder girdle and core stability.', 'Barbell'),
  ('33333333-3333-3333-3333-333333333309', 'Dumbbell Lateral Raise', 'Strength', 'Shoulders', 'Lateral deltoid isolation for shoulder width.', 'Dumbbells'),
  ('33333333-3333-3333-3333-333333333310', 'EZ-Bar Bicep Curl', 'Strength', 'Arms', 'Bicep brachii isolation with ergonomic wrist angle.', 'EZ Curl Bar'),
  ('33333333-3333-3333-3333-333333333311', 'Rope Tricep Pushdown', 'Strength', 'Arms', 'Lateral and medial tricep head lockout.', 'Cable Tower'),
  ('33333333-3333-3333-3333-333333333312', 'Hanging Leg Raises', 'Core', 'Core', 'Lower abdominal contraction and hip flexor control.', 'Pull-up Bar'),
  ('33333333-3333-3333-3333-333333333313', 'Assault Air Bike Sprints', 'HIIT', 'Full Body', 'Max wattage sprint intervals for VO2 max development.', 'Assault Air Bike')
on conflict (id) do nothing;

-- 4.4 Master Trainers
insert into public.trainers (id, full_name, email, phone, specialization, experience_years, joining_date, salary, bio, is_active)
values
  ('44444444-4444-4444-4444-444444444401', 'Vikramaditya Rao', 'vikram@apexfit.club', '+91 98111 22334', 'Powerlifting & Hypertrophy', 8, '2024-01-15'::date, 65000, 'National level powerlifter & certified CSCS strength specialist.', true),
  ('44444444-4444-4444-4444-444444444402', 'Natasha Alvares', 'natasha@apexfit.club', '+91 98222 33445', 'Athletic Conditioning & Mobility', 6, '2024-03-01'::date, 58000, 'Former state gymnast, expert in kettlebell dynamics & injury rehab.', true),
  ('44444444-4444-4444-4444-444444444403', 'Kabir Malhotra', 'kabir@apexfit.club', '+91 98333 44556', 'Olympic Weightlifting & HIIT', 5, '2024-06-10'::date, 52000, 'USAW Level 2 sports coach specializing in snatch & clean-and-jerk mechanics.', true)
on conflict (id) do nothing;

-- 4.5 Demo Members
insert into public.members (id, member_code, full_name, email, phone, gender, joining_date, assigned_trainer_id, status, notes)
values
  ('55555555-5555-5555-5555-555555555501', 'APX-1001', 'Aarav Singhania', 'aarav.singhania@apexfit.club', '+91 99001 11223', 'male', '2026-01-10'::date, '44444444-4444-4444-4444-444444444401', 'active', 'VIP Founding Member. Focus on heavy compound lifting.'),
  ('55555555-5555-5555-5555-555555555502', 'APX-1002', 'Rhea Chakraborty', 'rhea.c@apexfit.club', '+91 99002 22334', 'female', '2026-02-01'::date, '44444444-4444-4444-4444-444444444402', 'active', 'Goal: Body recomp & functional flexibility.'),
  ('55555555-5555-5555-5555-555555555503', 'APX-1003', 'Devansh Kapoor', 'devansh.k@apexfit.club', '+91 99003 33445', 'male', '2026-03-05'::date, '44444444-4444-4444-4444-444444444403', 'active', 'Preparing for triathlon endurance training.'),
  ('55555555-5555-5555-5555-555555555504', 'APX-1004', 'Ananya Sharma', 'ananya.s@apexfit.club', '+91 99004 44556', 'female', '2026-03-12'::date, '44444444-4444-4444-4444-444444444402', 'active', 'Corporate wellness executive pass holder.')
on conflict (id) do nothing;

-- 4.6 Active Subscriptions
insert into public.memberships (id, member_id, plan_id, start_date, end_date, price, discount, final_amount, status, auto_renew)
values
  ('66666666-6666-6666-6666-666666666601', '55555555-5555-5555-5555-555555555501', '22222222-2222-2222-2222-222222222204', '2026-01-10'::date, '2027-01-10'::date, 32000, 0, 32000, 'active', true),
  ('66666666-6666-6666-6666-666666666602', '55555555-5555-5555-5555-555555555502', '22222222-2222-2222-2222-222222222202', '2026-02-01'::date, '2026-05-02'::date, 9500, 0, 9500, 'active', true),
  ('66666666-6666-6666-6666-666666666603', '55555555-5555-5555-5555-555555555503', '22222222-2222-2222-2222-222222222203', '2026-03-05'::date, '2026-09-01'::date, 17500, 500, 17000, 'active', true),
  ('66666666-6666-6666-6666-666666666604', '55555555-5555-5555-5555-555555555504', '22222222-2222-2222-2222-222222222201', '2026-03-12'::date, '2026-04-11'::date, 3500, 0, 3500, 'active', true)
on conflict (id) do nothing;

-- 4.7 Payments
insert into public.payments (id, member_id, membership_id, amount, payment_method, transaction_reference, payment_date, status, notes, created_by)
values
  ('77777777-7777-7777-7777-777777777701', '55555555-5555-5555-5555-555555555501', '66666666-6666-6666-6666-666666666601', 32000, 'upi', 'APX/UPI/884920', '2026-01-10'::date, 'paid', 'Annual Black Tier VIP Membership Fee', 'Alexander Sterling'),
  ('77777777-7777-7777-7777-777777777702', '55555555-5555-5555-5555-555555555502', '66666666-6666-6666-6666-666666666602', 9500, 'card', 'APX/POS/492019', '2026-02-01'::date, 'paid', 'Quarterly Pro Membership Fee', 'Alexander Sterling'),
  ('77777777-7777-7777-7777-777777777703', '55555555-5555-5555-5555-555555555503', '66666666-6666-6666-6666-666666666603', 17000, 'upi', 'APX/UPI/772910', '2026-03-05'::date, 'paid', 'Half-Yearly Elite Membership Fee', 'Alexander Sterling'),
  ('77777777-7777-7777-7777-777777777704', '55555555-5555-5555-5555-555555555504', '66666666-6666-6666-6666-666666666604', 3500, 'upi', 'APX/UPI/332190', '2026-03-12'::date, 'paid', 'Monthly Standard Fee', 'Front Desk')
on conflict (id) do nothing;

-- 4.8 Attendance
insert into public.attendance (id, member_id, attendance_date, check_in, check_out, marked_by, notes)
values
  ('88888888-8888-8888-8888-888888888801', '55555555-5555-5555-5555-555555555501', current_date, '06:15:00', '07:45:00', 'Front Desk', 'Morning Hypertrophy Session'),
  ('88888888-8888-8888-8888-888888888802', '55555555-5555-5555-5555-555555555502', current_date, '07:30:00', null, 'Front Desk', 'Active on gym floor')
on conflict (member_id, attendance_date) do nothing;

-- 5. Notify Schema Cache
notify pgrst, 'reload schema';
