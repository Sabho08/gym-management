import { supabase } from './supabase';
import {
  Profile,
  Trainer,
  Member,
  MembershipPlan,
  Membership,
  Payment,
  AttendanceRecord,
  Exercise,
  WorkoutPlan,
  WorkoutPlanExercise,
  WorkoutLog,
  MemberMeasurement,
  NotificationItem,
  GymSettings,
  UserRole
} from './types';

const STORAGE_KEY = 'apexfit_gym_data_v2';

const DEFAULT_SETTINGS: GymSettings = {
  id: 'settings-01',
  gym_name: 'APEXFIT LUXURY PERFORMANCE CLUB',
  tagline: 'Precision Training • Elite Recovery • Luxury Wellness',
  phone: '+91 98765 43210',
  email: 'concierge@apexfit.club',
  address: 'Level 4, Grand Boulevard Tower, Central Business District, Mumbai, MH',
  opening_time: '05:30 AM',
  closing_time: '11:00 PM',
  currency: 'INR',
  currency_symbol: '₹',
  timezone: 'Asia/Kolkata',
  tax_rate: 18.0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const DEFAULT_PLANS: MembershipPlan[] = [
  {
    id: 'plan-01',
    name: 'Standard Monthly',
    description: 'Full club access, cardio & strength floor, steam & sauna, locker room.',
    duration_days: 30,
    price: 3500,
    features: ['All Gym Equipment', 'Locker & Shower Access', 'Steam & Sauna', '1 Fitness Assessment', 'Mobile Access'],
    is_popular: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'plan-02',
    name: 'Quarterly Pro',
    description: '3 months unlimited access with complimentary personal training sessions.',
    duration_days: 90,
    price: 9500,
    features: ['All Club Areas Access', '2 Personal Trainer Sessions', 'Nutrition Consultation', 'Recovery Zone Access', 'Guest Passes (2/month)'],
    is_popular: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'plan-03',
    name: 'Half-Yearly Elite',
    description: '6 months full club access, unlimited group classes (HIIT, Spin, Pilates).',
    duration_days: 180,
    price: 17500,
    features: ['Priority Club Access', 'Unlimited Group Classes', 'Monthly Body Composition Scans', '6 PT Sessions Included', 'Dedicated Towel Service'],
    is_popular: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'plan-04',
    name: 'Annual Black Tier VIP',
    description: '365 days VIP access, dedicated coach, private valet, spa & lounge privileges.',
    duration_days: 365,
    price: 32000,
    features: ['24/7 VIP Access', 'Dedicated Personal Coach', 'Customized Nutrition & Macro Plan', 'Unlimited Recovery Lounge Access', 'Complimentary Valet Parking', 'Free Club Kit'],
    is_popular: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const DEFAULT_EXERCISES: Exercise[] = [
  { id: 'ex-01', name: 'Barbell Incline Bench Press', category: 'Strength', muscle_group: 'Chest', description: 'Upper pectoral development on 30-degree incline bench.', equipment: 'Olympic Barbell & Incline Bench', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ex-02', name: 'Flat Dumbbell Press', category: 'Strength', muscle_group: 'Chest', description: 'Pectoral hypertrophy with deep range of motion.', equipment: 'Dumbbells & Flat Bench', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ex-03', name: 'Cable Chest Flyes', category: 'Strength', muscle_group: 'Chest', description: 'Peak contraction tension across chest fibers.', equipment: 'Dual Adjustable Pulley', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ex-04', name: 'Barbell Conventional Deadlift', category: 'Strength', muscle_group: 'Back', description: 'Posterior chain compound strength foundation.', equipment: 'Olympic Barbell & Bumper Plates', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ex-05', name: 'Lat Pulldown (Wide Grip)', category: 'Strength', muscle_group: 'Back', description: 'Targeting latissimus dorsi width.', equipment: 'Lat Pulldown Machine', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ex-06', name: 'Barbell Back Squat', category: 'Strength', muscle_group: 'Legs', description: 'Fundamental quad and glute strength exercise.', equipment: 'Squat Rack & Barbell', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ex-07', name: 'Leg Press 45 Degree', category: 'Strength', muscle_group: 'Legs', description: 'High volume quad and hamstring loading.', equipment: '45-degree Leg Press', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ex-08', name: 'Standing Overhead Barbell Press', category: 'Strength', muscle_group: 'Shoulders', description: 'Total shoulder girdle and core stability.', equipment: 'Barbell', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ex-09', name: 'Dumbbell Lateral Raise', category: 'Strength', muscle_group: 'Shoulders', description: 'Lateral deltoid isolation for shoulder width.', equipment: 'Dumbbells', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ex-10', name: 'EZ-Bar Bicep Curl', category: 'Strength', muscle_group: 'Arms', description: 'Bicep brachii isolation with ergonomic wrist angle.', equipment: 'EZ Curl Bar', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ex-11', name: 'Rope Tricep Pushdown', category: 'Strength', muscle_group: 'Arms', description: 'Lateral and medial tricep head lockout.', equipment: 'Cable Tower', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ex-12', name: 'Hanging Leg Raises', category: 'Core', muscle_group: 'Core', description: 'Lower abdominal contraction and hip flexor control.', equipment: 'Pull-up Bar', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ex-13', name: 'Assault Air Bike Sprints', category: 'HIIT', muscle_group: 'Full Body', description: 'Max wattage sprint intervals for VO2 max development.', equipment: 'Assault Air Bike', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

interface DataState {
  currentUser: Profile;
  trainers: Trainer[];
  members: Member[];
  membershipPlans: MembershipPlan[];
  memberships: Membership[];
  payments: Payment[];
  attendance: AttendanceRecord[];
  exercises: Exercise[];
  workoutPlans: WorkoutPlan[];
  workoutPlanExercises: WorkoutPlanExercise[];
  measurements: MemberMeasurement[];
  settings: GymSettings;
}

function loadLocalState(): DataState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Could not parse local data:', e);
  }

  const initial: DataState = {
    currentUser: {
      id: 'user-admin-01',
      full_name: 'Alexander Sterling',
      email: 'admin@apexfit.club',
      phone: '+91 98999 12345',
      role: 'admin',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    trainers: [],
    members: [],
    membershipPlans: DEFAULT_PLANS,
    memberships: [],
    payments: [],
    attendance: [],
    exercises: DEFAULT_EXERCISES,
    workoutPlans: [],
    workoutPlanExercises: [],
    measurements: [],
    settings: DEFAULT_SETTINGS,
  };

  saveLocalState(initial);
  return initial;
}

function saveLocalState(state: DataState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to write to localStorage:', e);
  }
}

let state: DataState = loadLocalState();

export const api = {
  // --- AUTH ---
  getCurrentUser: async (): Promise<{ success: boolean; user: Profile }> => {
    return { success: true, user: state.currentUser };
  },

  switchRole: async (role: UserRole): Promise<{ success: boolean; user: Profile }> => {
    state.currentUser = {
      id: `user-${role}-demo`,
      full_name: role.charAt(0).toUpperCase() + role.slice(1) + ' Persona',
      email: `${role}@apexfit.club`,
      role,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    saveLocalState(state);
    return { success: true, user: state.currentUser };
  },

  // --- DASHBOARD ---
  getDashboard: async () => {
    const totalMembers = state.members.length;
    const activeMembers = state.members.filter(m => m.status === 'active').length;
    const todayStr = new Date().toISOString().split('T')[0];
    const todayAttendance = state.attendance.filter(a => a.attendance_date === todayStr).length;

    const todayRevenue = state.payments
      .filter(p => p.payment_date === todayStr && p.status === 'paid')
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const totalRevenue = state.payments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const expiringMemberships = state.memberships
      .map(ms => {
        const endDate = new Date(ms.end_date);
        const diffDays = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return { ...ms, days_left: diffDays };
      })
      .filter(ms => ms.status === 'active' && ms.days_left >= 0 && ms.days_left <= 7);

    const planDistribution = state.membershipPlans.map(plan => {
      const count = state.memberships.filter(ms => ms.plan_id === plan.id && ms.status === 'active').length;
      return {
        name: plan.name,
        count,
        revenue: count * plan.price,
      };
    });

    const revenue7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

      const dayPayments = state.payments.filter(p => p.payment_date === dStr && p.status === 'paid');
      const cash = dayPayments.filter(p => p.payment_method === 'cash').reduce((s, p) => s + p.amount, 0);
      const upi = dayPayments.filter(p => p.payment_method === 'upi').reduce((s, p) => s + p.amount, 0);
      const card = dayPayments.filter(p => p.payment_method === 'card').reduce((s, p) => s + p.amount, 0);

      revenue7Days.push({
        date: dStr,
        day: dayName,
        total: cash + upi + card,
        upi,
        card,
        cash,
      });
    }

    const attendanceHourly = [
      { hour: '06:00', checkIns: Math.max(1, Math.round(todayAttendance * 0.1)), label: '6 AM' },
      { hour: '07:00', checkIns: Math.max(2, Math.round(todayAttendance * 0.25)), label: '7 AM' },
      { hour: '08:00', checkIns: Math.max(2, Math.round(todayAttendance * 0.2)), label: '8 AM' },
      { hour: '09:00', checkIns: Math.max(1, Math.round(todayAttendance * 0.1)), label: '9 AM' },
      { hour: '11:00', checkIns: Math.round(todayAttendance * 0.05), label: '11 AM' },
      { hour: '16:00', checkIns: Math.round(todayAttendance * 0.08), label: '4 PM' },
      { hour: '18:00', checkIns: Math.max(3, Math.round(todayAttendance * 0.22)), label: '6 PM' },
      { hour: '19:00', checkIns: Math.max(4, Math.round(todayAttendance * 0.28)), label: '7 PM' },
      { hour: '20:00', checkIns: Math.max(2, Math.round(todayAttendance * 0.15)), label: '8 PM' },
      { hour: '21:00', checkIns: Math.round(todayAttendance * 0.08), label: '9 PM' },
    ];

    return {
      stats: {
        total_members: totalMembers,
        active_members: activeMembers,
        expiring_members_count: expiringMemberships.length,
        today_attendance: todayAttendance,
        today_revenue: todayRevenue,
        total_revenue: totalRevenue,
        pending_payments_count: state.payments.filter(p => p.status === 'pending').length,
      },
      charts: {
        revenue_7_days: revenue7Days,
        attendance_hourly: attendanceHourly,
        plan_distribution: planDistribution,
      },
      expiring_soon: expiringMemberships.slice(0, 5),
      recent_payments: state.payments.slice(0, 6),
      recent_attendance: state.attendance.slice(0, 6),
      settings: state.settings,
    };
  },

  // --- MEMBERS ---
  getMembers: async (filter?: { search?: string; status?: string; trainer_id?: string }): Promise<Member[]> => {
    let result = [...state.members];

    if (filter?.status && filter.status !== 'all') {
      result = result.filter(m => m.status === filter.status);
    }
    if (filter?.trainer_id) {
      result = result.filter(m => m.assigned_trainer_id === filter.trainer_id);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(m =>
        m.full_name.toLowerCase().includes(q) ||
        m.member_code.toLowerCase().includes(q) ||
        m.phone.includes(q) ||
        m.email.toLowerCase().includes(q)
      );
    }

    return result.map(m => {
      const current_membership = state.memberships.find(ms => ms.member_id === m.id && ms.status === 'active');
      const trainer = state.trainers.find(t => t.id === m.assigned_trainer_id);
      return {
        ...m,
        assigned_trainer_name: trainer ? trainer.full_name : m.assigned_trainer_name,
        current_membership,
      };
    });
  },

  getMemberById: async (id: string) => {
    const member = state.members.find(m => m.id === id);
    if (!member) return null;

    const current_membership = state.memberships.find(ms => ms.member_id === id && ms.status === 'active');
    const all_memberships = state.memberships.filter(ms => ms.member_id === id);
    const trainer = state.trainers.find(t => t.id === member.assigned_trainer_id);
    const payments = state.payments.filter(p => p.member_id === id);
    const attendance = state.attendance.filter(a => a.member_id === id);
    const measurements = state.measurements.filter(mm => mm.member_id === id);
    const workoutPlans = state.workoutPlans.filter(wp => wp.member_id === id).map(wp => {
      const exercises = state.workoutPlanExercises.filter(wpe => wpe.workout_plan_id === wp.id);
      return { ...wp, exercises };
    });

    return {
      ...member,
      assigned_trainer_name: trainer ? trainer.full_name : member.assigned_trainer_name,
      current_membership,
      all_memberships,
      payments,
      attendance,
      measurements,
      workoutPlans,
    };
  },

  createMember: async (payload: any): Promise<Member> => {
    const nextNum = 1000 + state.members.length + 1;
    const member_code = payload.member_code || `APX-${nextNum}`;
    const id = `mem-${Date.now().toString(36)}`;

    let assignedTrainerName = undefined;
    if (payload.assigned_trainer_id) {
      const tr = state.trainers.find(t => t.id === payload.assigned_trainer_id);
      if (tr) assignedTrainerName = tr.full_name;
    }

    const newMember: Member = {
      id,
      member_code,
      full_name: payload.full_name || 'New Member',
      email: payload.email || '',
      phone: payload.phone || '',
      date_of_birth: payload.date_of_birth,
      gender: payload.gender || 'prefer_not_to_say',
      address: payload.address,
      emergency_contact_name: payload.emergency_contact_name,
      emergency_contact_phone: payload.emergency_contact_phone,
      joining_date: payload.joining_date || new Date().toISOString().split('T')[0],
      assigned_trainer_id: payload.assigned_trainer_id,
      assigned_trainer_name: assignedTrainerName,
      status: payload.status || 'active',
      notes: payload.notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    state.members.unshift(newMember);

    if (payload.plan_id) {
      const plan = state.membershipPlans.find(p => p.id === payload.plan_id);
      if (plan) {
        const start_date = newMember.joining_date;
        const endDateObj = new Date(start_date);
        endDateObj.setDate(endDateObj.getDate() + plan.duration_days);
        const end_date = endDateObj.toISOString().split('T')[0];

        const membershipId = `mship-${Date.now().toString(36)}`;
        const newMembership: Membership = {
          id: membershipId,
          member_id: newMember.id,
          member_name: newMember.full_name,
          member_code: newMember.member_code,
          plan_id: plan.id,
          plan_name: plan.name,
          start_date,
          end_date,
          price: plan.price,
          discount: 0,
          final_amount: plan.price,
          status: 'active',
          auto_renew: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        state.memberships.unshift(newMembership);
        newMember.current_membership = newMembership;

        if (payload.initial_payment !== false) {
          const paymentId = `pay-${Date.now().toString(36)}`;
          const newPayment: Payment = {
            id: paymentId,
            member_id: newMember.id,
            member_name: newMember.full_name,
            member_code: newMember.member_code,
            membership_id: membershipId,
            plan_name: plan.name,
            amount: plan.price,
            payment_method: payload.payment_method || 'upi',
            transaction_reference: `APX/JOIN/${Date.now().toString().slice(-6)}`,
            payment_date: start_date,
            status: 'paid',
            notes: `Initial membership dues for ${plan.name}`,
            created_by: state.currentUser.full_name,
            created_at: new Date().toISOString(),
          };
          state.payments.unshift(newPayment);
        }
      }
    }

    saveLocalState(state);
    return newMember;
  },

  updateMember: async (id: string, payload: Partial<Member>): Promise<Member> => {
    const idx = state.members.findIndex(m => m.id === id);
    if (idx === -1) throw new Error('Member not found');

    let assignedTrainerName = state.members[idx].assigned_trainer_name;
    if (payload.assigned_trainer_id) {
      const tr = state.trainers.find(t => t.id === payload.assigned_trainer_id);
      if (tr) assignedTrainerName = tr.full_name;
    }

    state.members[idx] = {
      ...state.members[idx],
      ...payload,
      assigned_trainer_name: assignedTrainerName,
      updated_at: new Date().toISOString(),
    };

    saveLocalState(state);
    return state.members[idx];
  },

  deleteMember: async (id: string) => {
    const idx = state.members.findIndex(m => m.id === id);
    if (idx === -1) throw new Error('Member not found');
    state.members.splice(idx, 1);
    saveLocalState(state);
    return { success: true };
  },

  toggleMemberStatus: async (id: string, status: 'active' | 'inactive' | 'blocked') => {
    const idx = state.members.findIndex(m => m.id === id);
    if (idx === -1) throw new Error('Member not found');
    state.members[idx].status = status;
    saveLocalState(state);
    return state.members[idx];
  },

  // --- PLANS ---
  getPlans: async (): Promise<MembershipPlan[]> => {
    return state.membershipPlans.map(p => ({
      ...p,
      active_members_count: state.memberships.filter(ms => ms.plan_id === p.id && ms.status === 'active').length,
    }));
  },

  createPlan: async (payload: Partial<MembershipPlan>): Promise<MembershipPlan> => {
    const id = `plan-${Date.now().toString(36)}`;
    const newPlan: MembershipPlan = {
      id,
      name: payload.name || 'New Plan',
      description: payload.description || '',
      duration_days: payload.duration_days || 30,
      price: payload.price || 3000,
      features: payload.features || ['Full Gym Access', 'Locker Room'],
      is_popular: Boolean(payload.is_popular),
      is_active: payload.is_active !== false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    state.membershipPlans.push(newPlan);
    saveLocalState(state);
    return newPlan;
  },

  updatePlan: async (id: string, payload: Partial<MembershipPlan>): Promise<MembershipPlan> => {
    const idx = state.membershipPlans.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Plan not found');
    state.membershipPlans[idx] = {
      ...state.membershipPlans[idx],
      ...payload,
      updated_at: new Date().toISOString(),
    };
    saveLocalState(state);
    return state.membershipPlans[idx];
  },

  deletePlan: async (id: string) => {
    const idx = state.membershipPlans.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Plan not found');
    state.membershipPlans.splice(idx, 1);
    saveLocalState(state);
    return { success: true };
  },

  // --- MEMBERSHIPS ---
  getMemberships: async (filter?: { status?: string; member_id?: string; expiring_days?: number }): Promise<Membership[]> => {
    let list = [...state.memberships];
    const now = new Date();

    list = list.map(ms => {
      const endDate = new Date(ms.end_date);
      const diffDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      let status = ms.status;
      if (status === 'active' && diffDays < 0) {
        status = 'expired';
      }
      return {
        ...ms,
        status,
        days_left: diffDays,
      };
    });

    if (filter?.member_id) list = list.filter(ms => ms.member_id === filter.member_id);
    if (filter?.status && filter.status !== 'all') list = list.filter(ms => ms.status === filter.status);
    if (filter?.expiring_days) {
      list = list.filter(ms => ms.status === 'active' && ms.days_left !== undefined && ms.days_left >= 0 && ms.days_left <= filter.expiring_days!);
    }

    return list;
  },

  renewMembership: async (id: string, payload: { duration_days?: number; discount?: number; payment_method?: 'cash' | 'upi' | 'card' | 'bank_transfer' }) => {
    const msIdx = state.memberships.findIndex(m => m.id === id);
    if (msIdx === -1) throw new Error('Membership not found');

    const oldMs = state.memberships[msIdx];
    const plan = state.membershipPlans.find(p => p.id === oldMs.plan_id) || DEFAULT_PLANS[0];
    const days = payload.duration_days || plan.duration_days;
    const discount = payload.discount || 0;
    const finalAmount = Math.max(0, plan.price - discount);

    const now = new Date();
    const oldEndDate = new Date(oldMs.end_date);
    const baseDate = oldEndDate > now ? oldEndDate : now;
    const newEndDateObj = new Date(baseDate);
    newEndDateObj.setDate(newEndDateObj.getDate() + days);

    const updatedMs: Membership = {
      ...oldMs,
      start_date: oldEndDate > now ? oldMs.start_date : now.toISOString().split('T')[0],
      end_date: newEndDateObj.toISOString().split('T')[0],
      price: plan.price,
      discount,
      final_amount: finalAmount,
      status: 'active',
      updated_at: new Date().toISOString(),
    };

    state.memberships[msIdx] = updatedMs;

    const paymentId = `pay-${Date.now().toString(36)}`;
    const newPayment: Payment = {
      id: paymentId,
      member_id: updatedMs.member_id,
      member_name: updatedMs.member_name,
      member_code: updatedMs.member_code,
      membership_id: updatedMs.id,
      plan_name: updatedMs.plan_name,
      amount: finalAmount,
      payment_method: payload.payment_method || 'upi',
      transaction_reference: `APX/RNW/${Date.now().toString().slice(-6)}`,
      payment_date: new Date().toISOString().split('T')[0],
      status: 'paid',
      notes: `Membership renewal for ${updatedMs.plan_name} (${days} days)`,
      created_by: state.currentUser.full_name,
      created_at: new Date().toISOString(),
    };

    state.payments.unshift(newPayment);

    const memIdx = state.members.findIndex(m => m.id === updatedMs.member_id);
    if (memIdx !== -1) {
      state.members[memIdx].current_membership = updatedMs;
      state.members[memIdx].status = 'active';
    }

    saveLocalState(state);
    return { membership: updatedMs, payment: newPayment };
  },

  // --- PAYMENTS ---
  getPayments: async (filter?: { search?: string; member_id?: string; method?: string; status?: string }): Promise<Payment[]> => {
    let list = [...state.payments];
    if (filter?.member_id) list = list.filter(p => p.member_id === filter.member_id);
    if (filter?.method && filter.method !== 'all') list = list.filter(p => p.payment_method === filter.method);
    if (filter?.status && filter.status !== 'all') list = list.filter(p => p.status === filter.status);
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(p =>
        (p.member_name && p.member_name.toLowerCase().includes(q)) ||
        (p.member_code && p.member_code.toLowerCase().includes(q)) ||
        p.transaction_reference.toLowerCase().includes(q)
      );
    }
    return list;
  },

  recordPayment: async (payload: any): Promise<Payment> => {
    const member = state.members.find(m => m.id === payload.member_id);
    if (!member) throw new Error('Member not found');

    const paymentId = `pay-${Date.now().toString(36)}`;
    const txRef = payload.transaction_reference || `TXN-${Date.now().toString().slice(-8)}`;

    let planName = undefined;
    if (payload.membership_id) {
      const ms = state.memberships.find(m => m.id === payload.membership_id);
      if (ms) planName = ms.plan_name;
    }

    const newPayment: Payment = {
      id: paymentId,
      member_id: member.id,
      member_name: member.full_name,
      member_code: member.member_code,
      membership_id: payload.membership_id,
      plan_name: planName,
      amount: payload.amount,
      payment_method: payload.payment_method,
      transaction_reference: txRef,
      payment_date: payload.payment_date || new Date().toISOString().split('T')[0],
      status: payload.status || 'paid',
      notes: payload.notes,
      created_by: state.currentUser.full_name,
      created_at: new Date().toISOString(),
    };

    state.payments.unshift(newPayment);
    saveLocalState(state);
    return newPayment;
  },

  getPaymentReceipt: async (id: string) => {
    const payment = state.payments.find(p => p.id === id);
    if (!payment) throw new Error('Payment not found');

    const member = state.members.find(m => m.id === payment.member_id);
    const subtotal = Math.round(payment.amount / (1 + state.settings.tax_rate / 100));
    const taxAmount = payment.amount - subtotal;

    return {
      receipt_number: `REC-${payment.transaction_reference.replace(/[^a-zA-Z0-9]/g, '')}`,
      payment,
      member: {
        full_name: member?.full_name || payment.member_name,
        member_code: member?.member_code || payment.member_code,
        email: member?.email,
        phone: member?.phone,
        address: member?.address,
      },
      gym: state.settings,
      breakdown: {
        plan_name: payment.plan_name || 'Gym Membership Access',
        subtotal,
        tax_rate: state.settings.tax_rate,
        tax_amount: taxAmount,
        total: payment.amount,
        currency_symbol: state.settings.currency_symbol,
      },
      issued_at: payment.payment_date,
      created_by: payment.created_by,
    };
  },

  // --- ATTENDANCE ---
  getAttendance: async (filter?: { date?: string; member_id?: string }): Promise<AttendanceRecord[]> => {
    let list = [...state.attendance];
    if (filter?.date) list = list.filter(a => a.attendance_date === filter.date);
    if (filter?.member_id) list = list.filter(a => a.member_id === filter.member_id);
    return list;
  },

  getTodayAttendance: async () => {
    const today = new Date().toISOString().split('T')[0];
    const records = state.attendance.filter(a => a.attendance_date === today);
    const currentlyIn = records.filter(r => !r.check_out).length;
    return {
      success: true,
      data: records,
      today_total: records.length,
      currently_in_gym: currentlyIn,
    };
  },

  markCheckIn: async (payload: { member_id_or_code: string; notes?: string }) => {
    const q = payload.member_id_or_code.trim().toLowerCase();
    const member = state.members.find(
      m => m.id === payload.member_id_or_code ||
      m.member_code.toLowerCase() === q ||
      m.phone.includes(q)
    );

    if (!member) {
      throw new Error(`Member '${payload.member_id_or_code}' not found.`);
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const existing = state.attendance.find(a => a.member_id === member.id && a.attendance_date === todayStr);

    if (existing && !existing.check_out) {
      throw new Error(`${member.full_name} is already checked in today at ${existing.check_in}.`);
    }

    const nowTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now().toString(36)}`,
      member_id: member.id,
      member_name: member.full_name,
      member_code: member.member_code,
      attendance_date: todayStr,
      check_in: nowTime,
      check_out: null,
      marked_by: state.currentUser.full_name || 'Front Desk',
      notes: payload.notes || 'Access Granted',
      created_at: new Date().toISOString(),
    };

    state.attendance.unshift(newRecord);
    saveLocalState(state);
    return { success: true, data: newRecord, message: `Check-in confirmed for ${recordName(newRecord)}` };
  },

  markCheckOut: async (payload: { attendance_id?: string; member_id?: string }) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const record = state.attendance.find(
      a => (a.id === payload.attendance_id || a.member_id === payload.member_id) && a.attendance_date === todayStr && !a.check_out
    );

    if (!record) {
      throw new Error('No active checked-in session found for checkout.');
    }

    const nowTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    record.check_out = nowTime;
    saveLocalState(state);
    return { success: true, data: record, message: `Check-out recorded for ${record.member_name}` };
  },

  // --- TRAINERS ---
  getTrainers: async (): Promise<Trainer[]> => {
    return state.trainers.map(t => ({
      ...t,
      assigned_members_count: state.members.filter(m => m.assigned_trainer_id === t.id && m.status === 'active').length,
    }));
  },

  getTrainerById: async (id: string) => {
    const trainer = state.trainers.find(t => t.id === id);
    if (!trainer) return null;
    return {
      ...trainer,
      assigned_members: state.members.filter(m => m.assigned_trainer_id === id),
      workout_plans: state.workoutPlans.filter(wp => wp.trainer_id === id),
    };
  },

  createTrainer: async (payload: Partial<Trainer>): Promise<Trainer> => {
    const id = `trainer-${Date.now().toString(36)}`;
    const newTrainer: Trainer = {
      id,
      full_name: payload.full_name || 'New Coach',
      email: payload.email || '',
      phone: payload.phone || '',
      specialization: payload.specialization || 'General Strength',
      experience_years: payload.experience_years || 2,
      joining_date: payload.joining_date || new Date().toISOString().split('T')[0],
      salary: payload.salary || 45000,
      bio: payload.bio || '',
      is_active: payload.is_active !== false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    state.trainers.push(newTrainer);
    saveLocalState(state);
    return newTrainer;
  },

  updateTrainer: async (id: string, payload: Partial<Trainer>): Promise<Trainer> => {
    const idx = state.trainers.findIndex(t => t.id === id);
    if (idx === -1) throw new Error('Trainer not found');
    state.trainers[idx] = {
      ...state.trainers[idx],
      ...payload,
      updated_at: new Date().toISOString(),
    };
    saveLocalState(state);
    return state.trainers[idx];
  },

  // --- EXERCISES & WORKOUTS ---
  getExercises: async (filter?: { category?: string; muscle_group?: string; search?: string }): Promise<Exercise[]> => {
    let list = [...state.exercises];
    if (filter?.category && filter.category !== 'all') list = list.filter(e => e.category === filter.category);
    if (filter?.muscle_group && filter.muscle_group !== 'all') list = list.filter(e => e.muscle_group === filter.muscle_group);
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(e => e.name.toLowerCase().includes(q) || e.muscle_group.toLowerCase().includes(q));
    }
    return list;
  },

  createExercise: async (payload: Partial<Exercise>): Promise<Exercise> => {
    const id = `ex-${Date.now().toString(36)}`;
    const newEx: Exercise = {
      id,
      name: payload.name || 'Custom Exercise',
      category: payload.category || 'Strength',
      muscle_group: payload.muscle_group || 'Full Body',
      description: payload.description || '',
      equipment: payload.equipment || 'Gym Equipment',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    state.exercises.push(newEx);
    saveLocalState(state);
    return newEx;
  },

  getWorkoutPlans: async (filter?: { member_id?: string; trainer_id?: string }): Promise<WorkoutPlan[]> => {
    let list = [...state.workoutPlans];
    if (filter?.member_id) list = list.filter(p => p.member_id === filter.member_id);
    if (filter?.trainer_id) list = list.filter(p => p.trainer_id === filter.trainer_id);
    return list.map(wp => ({
      ...wp,
      exercises: state.workoutPlanExercises.filter(e => e.workout_plan_id === wp.id),
    }));
  },

  createWorkoutPlan: async (payload: any): Promise<WorkoutPlan> => {
    const planId = `plan-wk-${Date.now().toString(36)}`;
    let memberName = undefined;
    if (payload.member_id) {
      const m = state.members.find(mem => mem.id === payload.member_id);
      if (m) memberName = m.full_name;
    }

    let trainerName = undefined;
    if (payload.trainer_id) {
      const t = state.trainers.find(tr => tr.id === payload.trainer_id);
      if (t) trainerName = t.full_name;
    }

    const newPlan: WorkoutPlan = {
      id: planId,
      member_id: payload.member_id,
      member_name: memberName,
      trainer_id: payload.trainer_id,
      trainer_name: trainerName,
      name: payload.name,
      description: payload.description,
      difficulty: payload.difficulty || 'Intermediate',
      start_date: new Date().toISOString().split('T')[0],
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    state.workoutPlans.unshift(newPlan);

    if (payload.exercises && payload.exercises.length > 0) {
      payload.exercises.forEach((exItem: any, idx: number) => {
        const exMeta = state.exercises.find(e => e.id === exItem.exercise_id);
        const wpe: WorkoutPlanExercise = {
          id: `wpe-${Date.now().toString(36)}-${idx}`,
          workout_plan_id: planId,
          exercise_id: exItem.exercise_id,
          exercise_name: exMeta?.name || 'Exercise',
          muscle_group: exMeta?.muscle_group,
          day_name: exItem.day_name || 'Day 1',
          sets: exItem.sets || 3,
          reps: exItem.reps || '10-12',
          weight: exItem.weight || 'Bodyweight',
          rest_seconds: exItem.rest_seconds || 60,
          instructions: exItem.instructions,
          sort_order: idx + 1,
          created_at: new Date().toISOString(),
        };
        state.workoutPlanExercises.push(wpe);
      });
    }

    saveLocalState(state);
    return newPlan;
  },

  // --- MEASUREMENTS ---
  getMeasurements: async (memberId: string): Promise<MemberMeasurement[]> => {
    return state.measurements
      .filter(m => m.member_id === memberId)
      .sort((a, b) => new Date(a.measured_at).getTime() - new Date(b.measured_at).getTime());
  },

  addMeasurement: async (payload: any): Promise<MemberMeasurement> => {
    const id = `meas-${Date.now().toString(36)}`;
    const newMeas: MemberMeasurement = {
      id,
      member_id: payload.member_id,
      measured_at: payload.measured_at || new Date().toISOString().split('T')[0],
      weight: payload.weight,
      height: payload.height,
      body_fat_percentage: payload.body_fat_percentage,
      chest: payload.chest,
      waist: payload.waist,
      arms: payload.arms,
      thighs: payload.thighs,
      notes: payload.notes,
      created_at: new Date().toISOString(),
    };
    state.measurements.push(newMeas);
    saveLocalState(state);
    return newMeas;
  },

  // --- REPORTS ---
  getRevenueReport: async () => {
    const payments = state.payments.filter(p => p.status === 'paid');
    const totalRevenue = payments.reduce((s, p) => s + p.amount, 0);
    const byMethod: Record<string, number> = { upi: 0, card: 0, cash: 0, bank_transfer: 0 };
    payments.forEach(p => {
      byMethod[p.payment_method] = (byMethod[p.payment_method] || 0) + p.amount;
    });

    return {
      success: true,
      total_revenue: totalRevenue,
      method_breakdown: byMethod,
      transactions_count: payments.length,
      average_transaction_value: payments.length ? Math.round(totalRevenue / payments.length) : 0,
    };
  },

  getAttendanceReport: async () => {
    return {
      success: true,
      total_checkins: state.attendance.length,
      peak_hour: '07:00 PM',
      busiest_day: 'Monday',
      avg_duration_minutes: 72,
    };
  },

  // --- SETTINGS ---
  getSettings: async (): Promise<GymSettings> => {
    return state.settings;
  },

  updateSettings: async (payload: Partial<GymSettings>): Promise<GymSettings> => {
    state.settings = {
      ...state.settings,
      ...payload,
      updated_at: new Date().toISOString(),
    };
    saveLocalState(state);
    return state.settings;
  },

  reseed: async () => {
    state = {
      ...state,
      members: [],
      memberships: [],
      payments: [],
      attendance: [],
      measurements: [],
      workoutPlans: [],
      workoutPlanExercises: [],
      trainers: [],
    };
    saveLocalState(state);
    return { success: true, message: 'Clean slate activated.' };
  },
};

function recordName(r: AttendanceRecord) {
  return r.member_name;
}
