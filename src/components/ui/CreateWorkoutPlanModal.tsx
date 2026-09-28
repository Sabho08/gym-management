import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { api } from '../../lib/api';
import { Member, Trainer, Exercise } from '../../types';
import { Dumbbell, X, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface CreateWorkoutPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMemberId?: string;
  onSuccess?: () => void;
}

export const CreateWorkoutPlanModal: React.FC<CreateWorkoutPlanModalProps> = ({
  isOpen,
  onClose,
  defaultMemberId,
  onSuccess,
}) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const [form, setForm] = useState({
    member_id: defaultMemberId || '',
    trainer_id: '',
    name: 'Push / Pull / Legs Hypertrophy Split',
    description: 'Targeted weekly split for progressive overload and muscle building.',
    difficulty: 'Intermediate' as 'Beginner' | 'Intermediate' | 'Advanced' | 'Elite',
    exercises: [
      { exercise_id: '', day_name: 'Day 1 - Push & Chest', sets: 4, reps: '8-10', weight: '70 kg', rest_seconds: 90, instructions: '' },
      { exercise_id: '', day_name: 'Day 2 - Pull & Back', sets: 4, reps: '8-10', weight: '80 kg', rest_seconds: 90, instructions: '' },
    ],
  });

  useEffect(() => {
    if (isOpen) {
      Promise.all([api.getMembers(), api.getTrainers(), api.getExercises()]).then(
        ([mList, tList, exList]) => {
          setMembers(mList);
          setTrainers(tList);
          setExercises(exList);
          if (exList.length > 0) {
            setForm((prev) => ({
              ...prev,
              member_id: defaultMemberId || (mList.length > 0 ? mList[0].id : ''),
              trainer_id: tList.length > 0 ? tList[0].id : '',
              exercises: prev.exercises.map((e, idx) => ({
                ...e,
                exercise_id: exList[idx % exList.length]?.id || exList[0].id,
              })),
            }));
          }
        }
      );
    }
  }, [isOpen, defaultMemberId]);

  if (!isOpen) return null;

  const handleAddExerciseRow = () => {
    const defaultExId = exercises.length > 0 ? exercises[0].id : '';
    setForm({
      ...form,
      exercises: [
        ...form.exercises,
        { exercise_id: defaultExId, day_name: 'Day 3 - Legs & Core', sets: 3, reps: '10-12', weight: 'Bodyweight', rest_seconds: 60, instructions: '' },
      ],
    });
  };

  const handleRemoveExerciseRow = (index: number) => {
    setForm({
      ...form,
      exercises: form.exercises.filter((_, i) => i !== index),
    });
  };

  const handleExerciseChange = (index: number, field: string, value: any) => {
    const updated = [...form.exercises];
    (updated[index] as any)[field] = value;
    setForm({ ...form, exercises: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || form.exercises.length === 0) {
      toast.warning('Input Required', 'Please provide a plan name and at least one exercise.');
      return;
    }

    try {
      setLoading(true);
      await api.createWorkoutPlan(form);
      toast.success('Workout Plan Assigned', `${form.name} is now active.`);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error('Failed to create plan', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-modal-backdrop overflow-y-auto">
      <div className="animate-modal-card relative w-full max-w-3xl bg-[#0F172A] border border-amber-500/30 rounded-3xl shadow-2xl p-6 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-white font-display">Create Custom Workout Plan</h3>
              <p className="text-xs text-slate-400">Design splits, exercises, sets, target loads & rest periods</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Assign to Member</label>
              <select
                value={form.member_id}
                onChange={(e) => setForm({ ...form, member_id: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs outline-none"
              >
                <option value="">General / Club Template</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.full_name} ({m.member_code})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Author Coach</label>
              <select
                value={form.trainer_id}
                onChange={(e) => setForm({ ...form, trainer_id: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs outline-none"
              >
                <option value="">No Coach</option>
                {trainers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.full_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Difficulty Level</label>
              <select
                value={form.difficulty}
                onChange={(e: any) => setForm({ ...form, difficulty: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs outline-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Elite">Elite Performance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Plan Title *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Exercise Breakdown & Routines
              </label>
              <button
                type="button"
                onClick={handleAddExerciseRow}
                className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Exercise
              </button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {form.exercises.map((row, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 sm:grid-cols-6 gap-2.5 items-center"
                >
                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-slate-400 block mb-0.5">Split / Day</label>
                    <input
                      type="text"
                      value={row.day_name}
                      onChange={(e) => handleExerciseChange(idx, 'day_name', e.target.value)}
                      placeholder="e.g. Day 1 - Push"
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-slate-400 block mb-0.5">Exercise</label>
                    <select
                      value={row.exercise_id}
                      onChange={(e) => handleExerciseChange(idx, 'exercise_id', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs"
                    >
                      {exercises.map((ex) => (
                        <option key={ex.id} value={ex.id}>
                          {ex.name} ({ex.muscle_group})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Sets × Reps</label>
                    <input
                      type="text"
                      value={`${row.sets} × ${row.reps}`}
                      onChange={(e) => {
                        const parts = e.target.value.split('×').map((s) => s.trim());
                        if (parts[0]) handleExerciseChange(idx, 'sets', parseInt(parts[0], 10) || 3);
                        if (parts[1]) handleExerciseChange(idx, 'reps', parts[1]);
                      }}
                      className="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs text-center font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="text-[10px] text-slate-400 block mb-0.5">Target Wt</label>
                      <input
                        type="text"
                        value={row.weight}
                        onChange={(e) => handleExerciseChange(idx, 'weight', e.target.value)}
                        className="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs"
                      />
                    </div>
                    {form.exercises.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveExerciseRow(idx)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 cursor-pointer mt-4"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold tracking-wide transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              <Dumbbell className="w-4 h-4" />
              {loading ? 'Assigning...' : 'Save & Publish Workout Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
