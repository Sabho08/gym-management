export type UserRole = 'admin' | 'receptionist' | 'trainer' | 'member';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Trainer {
  id: string;
  profile_id?: string;
  full_name: string;
  email: string;
  phone: string;
  specialization: string;
  experience_years: number;
  joining_date: string;
  salary: number;
  bio: string;
  is_active: boolean;
  assigned_members_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Member {
  id: string;
  profile_id?: string;
  member_code: string;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  joining_date: string;
  assigned_trainer_id?: string;
  assigned_trainer_name?: string;
  status: 'active' | 'inactive' | 'blocked';
  notes?: string;
  current_membership?: Membership;
  created_at: string;
  updated_at: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  duration_days: number;
  price: number;
  features: string[];
  is_popular?: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Membership {
  id: string;
  member_id: string;
  member_name?: string;
  member_code?: string;
  plan_id: string;
  plan_name?: string;
  start_date: string;
  end_date: string;
  price: number;
  discount: number;
  final_amount: number;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  auto_renew: boolean;
  days_left?: number;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  member_id: string;
  member_name?: string;
  member_code?: string;
  membership_id?: string;
  plan_name?: string;
  amount: number;
  payment_method: 'cash' | 'upi' | 'card' | 'bank_transfer' | 'other';
  transaction_reference: string;
  payment_date: string;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  notes?: string;
  created_by: string;
  created_at: string;
}

export interface AttendanceRecord {
  id: string;
  member_id: string;
  member_name: string;
  member_code: string;
  attendance_date: string;
  check_in: string;
  check_out?: string | null;
  marked_by: string;
  notes?: string;
  created_at: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: 'Strength' | 'Cardio' | 'HIIT' | 'Flexibility' | 'Core';
  muscle_group: 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Full Body';
  description: string;
  equipment: string;
  created_at: string;
  updated_at: string;
}

export interface WorkoutPlanExercise {
  id: string;
  workout_plan_id: string;
  exercise_id: string;
  exercise_name?: string;
  muscle_group?: string;
  day_name: string;
  sets: number;
  reps: string;
  weight: string;
  rest_seconds: number;
  instructions?: string;
  sort_order: number;
  created_at: string;
}

export interface WorkoutPlan {
  id: string;
  member_id?: string;
  member_name?: string;
  trainer_id?: string;
  trainer_name?: string;
  name: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Elite';
  start_date: string;
  end_date?: string;
  status: 'active' | 'completed' | 'archived';
  exercises?: WorkoutPlanExercise[];
  created_at: string;
  updated_at: string;
}

export interface WorkoutLog {
  id: string;
  member_id: string;
  workout_plan_id?: string;
  exercise_id: string;
  exercise_name?: string;
  performed_at: string;
  sets_completed: number;
  reps_completed: string;
  weight: string;
  notes?: string;
  created_at: string;
}

export interface MemberMeasurement {
  id: string;
  member_id: string;
  measured_at: string;
  weight: number;
  height?: number;
  body_fat_percentage?: number;
  chest?: number;
  waist?: number;
  arms?: number;
  thighs?: number;
  notes?: string;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id?: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'reminder';
  is_read: boolean;
  created_at: string;
}

export interface GymSettings {
  id: string;
  gym_name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  opening_time: string;
  closing_time: string;
  currency: string;
  currency_symbol: string;
  timezone: string;
  tax_rate: number;
  created_at: string;
  updated_at: string;
}
