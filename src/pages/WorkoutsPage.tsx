import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Exercise, WorkoutPlan } from '../types';
import { useToast } from '../context/ToastContext';
import {
  Dumbbell,
  Plus,
  Search,
  Flame,
  Award,
  Filter,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Layers,
  BookOpen
} from 'lucide-react';
import { CreateWorkoutPlanModal } from '../components/ui/CreateWorkoutPlanModal';

export const WorkoutsPage: React.FC = () => {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'plans' | 'exercises'>('plans');

  const [searchExercise, setSearchExercise] = useState('');
  const [muscleFilter, setMuscleFilter] = useState('all');
  const [isCreatePlanOpen, setCreatePlanOpen] = useState(false);
  const toast = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [p, ex] = await Promise.all([
        api.getWorkoutPlans(),
        api.getExercises({ search: searchExercise, muscle_group: muscleFilter }),
      ]);
      setPlans(p);
      setExercises(ex);
    } catch (err: any) {
      toast.error('Failed to load workouts data', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      loadData();
    }, 200);
    return () => clearTimeout(t);
  }, [searchExercise, muscleFilter, activeTab]);

  const muscleGroups = ['all', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body'];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-3xl font-black text-white font-display tracking-tight">
              Workouts & Exercise Library
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              {plans.length} Active Plans • {exercises.length} Exercises
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Build custom training splits, assign muscle-group routines and browse the biomechanics library.
          </p>
        </div>

        <button
          onClick={() => setCreatePlanOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Workout Plan</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-1">
        <button
          onClick={() => setActiveTab('plans')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'plans'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Custom Workout Splits ({plans.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('exercises')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'exercises'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Master Exercise Database ({exercises.length})</span>
        </button>
      </div>

      {/* 1. Workout Plans Tab */}
      {activeTab === 'plans' && (
        <div className="space-y-4">
          {plans.map((plan, idx) => (
            <div
              key={plan.id}
              className={`animate-card-in stagger-${(idx % 6) + 1} luxury-card p-6 rounded-3xl bg-[#0B0F17]/90 border border-white/[0.08] shadow-2xl space-y-4 hover:border-amber-500/40`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-lg font-black text-white font-display group-hover:text-amber-300 transition-colors">{plan.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      {plan.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{plan.description}</p>
                </div>
                <div className="text-left sm:text-right text-xs">
                  <span className="text-slate-400">Assigned Member:</span>
                  <span className="font-bold text-white block">{plan.member_name || 'General Template'}</span>
                </div>
              </div>

              {/* Routine Exercises */}
              <div className="divide-y divide-white/[0.05] border-t border-white/10 pt-2">
                {plan.exercises?.map((ex) => (
                  <div key={ex.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white">{ex.exercise_name}</span>
                      <span className="text-[11px] text-slate-400 block">{ex.day_name} • {ex.muscle_group}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-amber-300">{ex.sets} sets × {ex.reps}</span>
                      <span className="text-[11px] text-slate-400 block">Target: {ex.weight} (Rest: {ex.rest_seconds}s)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Exercise Database Tab */}
      {activeTab === 'exercises' && (
        <div className="space-y-5">
          {/* Search & Muscle Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3.5 bg-[#0B0F17]/90 p-4 rounded-2xl border border-white/[0.08] shadow-xl">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search exercises by name or muscle..."
                value={searchExercise}
                onChange={(e) => setSearchExercise(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto">
              {muscleGroups.map((mg) => (
                <button
                  key={mg}
                  onClick={() => setMuscleFilter(mg)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                    muscleFilter === mg
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {mg}
                </button>
              ))}
            </div>
          </div>

          {/* Exercise Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {exercises.map((ex) => (
              <div
                key={ex.id}
                className="p-5 rounded-3xl bg-[#0B0F17]/90 border border-white/[0.08] shadow-xl flex flex-col justify-between hover:border-amber-500/40 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      {ex.muscle_group}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">{ex.category}</span>
                  </div>

                  <h3 className="text-base font-bold text-white font-display mt-3 group-hover:text-amber-300 transition-colors">
                    {ex.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{ex.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Dumbbell className="w-3.5 h-3.5 text-amber-400" /> {ex.equipment}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Plan Modal */}
      <CreateWorkoutPlanModal
        isOpen={isCreatePlanOpen}
        onClose={() => setCreatePlanOpen(false)}
        onSuccess={() => loadData()}
      />
    </div>
  );
};
