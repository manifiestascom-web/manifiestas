"use client";

import React, { useState, useEffect } from 'react';
import { 
  IconPlus, 
  IconX, 
  IconLoader2, 
  IconBrain, 
  IconHeart, 
  IconTarget, 
  IconRotate, 
  IconFlame, 
  IconTrash, 
  IconEdit, 
  IconArchive,
  IconSparkles
} from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import { twMerge } from 'tailwind-merge';

type Habit = {
  id: string;
  name: string;
  description: string;
  category: 'mind' | 'health' | 'focus' | 'routine';
  frequency: string[];
  streak_current: number;
  streak_longest: number;
  is_archived: boolean;
};

const CATEGORIES = [
  { value: 'mind', label: 'Mente/Meditación', color: 'text-violet-400 bg-violet-500/10 border-violet-500/20', icon: IconBrain },
  { value: 'health', label: 'Salud/Cuerpo', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: IconHeart },
  { value: 'focus', label: 'Enfoque/Trabajo', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', icon: IconTarget },
  { value: 'routine', label: 'Rutinas Generales', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', icon: IconRotate },
];

const WEEKDAYS = [
  { value: 'lunes', label: 'L' },
  { value: 'martes', label: 'M' },
  { value: 'miércoles', label: 'M' },
  { value: 'jueves', label: 'J' },
  { value: 'viernes', label: 'V' },
  { value: 'sábado', label: 'S' },
  { value: 'domingo', label: 'D' }
];

export default function HabitsListTab() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);

  // Modales
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Formulario
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'mind' | 'health' | 'focus' | 'routine'>('routine');
  const [frequency, setFrequency] = useState<string[]>(WEEKDAYS.map(w => w.value));

  useEffect(() => {
    const fetchUserAndHabits = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          
          // Cargar perfil y hábitos
          const [profileResult, habitsResult] = await Promise.all([
            supabase.from('profiles').select('subscription_tier').eq('id', user.id).maybeSingle(),
            supabase.from('habits').select('*').eq('user_id', user.id).eq('is_archived', false).order('created_at', { ascending: false })
          ]);

          if (profileResult.data) {
            setIsPro(profileResult.data.subscription_tier === 'pro');
          }

          if (habitsResult.data) {
            setHabits(habitsResult.data);
          }
        }
      } catch (err) {
        console.error("Error al cargar hábitos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndHabits();
  }, []);

  const handleOpenAdd = () => {
    // Si tiene 2 hábitos o más y no es PRO, restringir en plan gratuito
    if (habits.length >= 2 && !isPro) {
      setShowUpgradeModal(true);
    } else {
      setEditingHabitId(null);
      setName('');
      setDescription('');
      setCategory('routine');
      setFrequency(WEEKDAYS.map(w => w.value));
      setShowAddModal(true);
    }
  };

  const handleOpenEdit = (habit: Habit) => {
    setEditingHabitId(habit.id);
    setName(habit.name);
    setDescription(habit.description || '');
    setCategory(habit.category);
    setFrequency(habit.frequency || WEEKDAYS.map(w => w.value));
    setShowAddModal(true);
  };

  const handleToggleDay = (day: string) => {
    setFrequency(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSaveHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !user || frequency.length === 0) return;
    setSaving(true);

    try {
      if (editingHabitId) {
        // Actualizar existente
        const { error } = await supabase
          .from('habits')
          .update({
            name: name.trim(),
            description: description.trim(),
            category,
            frequency
          })
          .eq('id', editingHabitId);

        if (error) throw error;

        setHabits(prev => prev.map(h => h.id === editingHabitId ? {
          ...h,
          name: name.trim(),
          description: description.trim(),
          category,
          frequency
        } : h));
      } else {
        // Insertar nuevo hábito
        const { data, error } = await supabase
          .from('habits')
          .insert([
            {
              user_id: user.id,
              name: name.trim(),
              description: description.trim(),
              category,
              frequency,
              streak_current: 0,
              streak_longest: 0
            }
          ])
          .select();

        if (error) throw error;

        if (data && data.length > 0) {
          setHabits([data[0], ...habits]);
        }
      }

      setShowAddModal(false);
      setEditingHabitId(null);
    } catch (err) {
      console.error("Error al guardar hábito:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleArchiveHabit = async (habitId: string) => {
    if (!confirm("¿Estás seguro de que deseas archivar este hábito? Ya no se mostrará en tu lista de hoy, pero mantendrás su historial.")) return;
    try {
      const { error } = await supabase
        .from('habits')
        .update({ is_archived: true })
        .eq('id', habitId);

      if (error) throw error;

      setHabits(prev => prev.filter(h => h.id !== habitId));
    } catch (err) {
      console.error("Error al archivar hábito:", err);
    }
  };

  return (
    <div className="absolute inset-0 p-4 sm:p-6 overflow-y-auto no-scrollbar pb-24 bg-bg-primary">
      {loading ? (
        <div className="h-full flex items-center justify-center">
          <IconLoader2 size={32} className="animate-spin text-primary" />
        </div>
      ) : (
        <div className="max-w-md mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-extrabold text-text-primary">Tus Hábitos ({habits.length})</h2>
              <p className="text-xs text-text-secondary">Diseña tu rutina de alta vibración</p>
            </div>
            
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white font-medium text-xs flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-md shadow-primary/10"
            >
              <IconPlus size={14} /> Crear Hábito
            </button>
          </div>

          <div className="space-y-4">
            {habits.length === 0 ? (
              <div className="text-center py-12 text-text-secondary text-sm bg-bg-secondary/40 rounded-3xl border border-dashed border-border-primary p-6">
                💡 No tienes hábitos creados. Comienza definiendo uno arriba para estructurar tu éxito diario.
              </div>
            ) : (
              habits.map((habit, idx) => {
                const CatConfig = CATEGORIES.find(c => c.value === habit.category) || CATEGORIES[3];
                const CatIcon = CatConfig.icon;

                return (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-bg-secondary rounded-2xl p-5 border border-border-primary/80 shadow-sm flex flex-col gap-4 relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={twMerge(
                          "w-9 h-9 rounded-xl flex items-center justify-center border",
                          CatConfig.color
                        )}>
                          <CatIcon size={18} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-text-primary">{habit.name}</h3>
                          <span className="text-[10px] text-text-secondary">
                            {CatConfig.label}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(habit)}
                          className="p-1.5 rounded-lg border border-border-primary text-text-secondary hover:text-text-primary hover:bg-bg-primary transition-all cursor-pointer"
                          title="Editar"
                        >
                          <IconEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleArchiveHabit(habit.id)}
                          className="p-1.5 rounded-lg border border-border-primary text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all cursor-pointer"
                          title="Archivar"
                        >
                          <IconArchive size={14} />
                        </button>
                      </div>
                    </div>

                    {habit.description && (
                      <p className="text-[12px] text-text-secondary leading-relaxed bg-bg-primary/30 p-2.5 rounded-xl border border-border-primary/40">
                        {habit.description}
                      </p>
                    )}

                    <div className="flex justify-between items-center pt-2 border-t border-border-primary/50 text-[11px] text-text-secondary">
                      {/* Frecuencia compacta */}
                      <div className="flex items-center gap-1">
                        <span className="font-bold">Frecuencia:</span>
                        <div className="flex gap-0.5">
                          {WEEKDAYS.map((day) => {
                            const isScheduled = habit.frequency?.includes(day.value);
                            return (
                              <span 
                                key={day.value}
                                className={twMerge(
                                  "w-4 h-4 rounded-full flex items-center justify-center font-bold text-[8px]",
                                  isScheduled 
                                    ? "bg-primary/20 text-primary border border-primary/20" 
                                    : "bg-bg-primary text-text-secondary/30"
                                )}
                              >
                                {day.label}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* Rachas */}
                      <div className="flex items-center gap-3 font-semibold">
                        <span className="flex items-center gap-0.5 text-amber-500">
                          <IconFlame size={12} stroke={2.5} /> Racha: {habit.streak_current}
                        </span>
                        <span className="text-text-secondary/70">
                          Máx: {habit.streak_longest}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* MODAL EDITAR / CREAR HÁBITO */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-bg-primary border border-border-secondary w-full max-w-[400px] rounded-3xl p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 p-1 text-text-secondary hover:text-text-primary rounded-full hover:bg-bg-secondary transition-all cursor-pointer"
              >
                <IconX size={20} />
              </button>

              <div className="flex gap-2.5 items-center mb-5">
                <span className="text-2xl">{editingHabitId ? '⚙️' : '✨'}</span>
                <div>
                  <h3 className="text-base font-bold text-text-primary">
                    {editingHabitId ? 'Editar Hábito' : 'Nuevo Hábito'}
                  </h3>
                  <p className="text-text-secondary text-xs">
                    Define la frecuencia y la intención del hábito
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveHabit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">¿Cuál es tu nuevo hábito?</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Meditar 10 min, Tomar 2L de agua..."
                    className="w-full bg-bg-secondary/50 border border-border-secondary rounded-xl py-3 px-4 text-xs text-text-primary placeholder:text-text-secondary/50 focus:border-primary focus:outline-none transition-colors shadow-inner"
                    autoFocus
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Descripción / Intención</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ej. Lograr calma y claridad mental antes de trabajar..."
                    className="w-full bg-bg-secondary/50 border border-border-secondary rounded-xl py-3 px-4 text-xs text-text-primary placeholder:text-text-secondary/50 focus:border-primary focus:outline-none transition-colors shadow-inner min-h-[70px] resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Categoría del Hábito</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-bg-secondary/50 border border-border-secondary rounded-xl py-3 px-4 text-xs text-text-primary focus:border-primary focus:outline-none transition-colors"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                {/* Selección de frecuencia por días de la semana */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Frecuencia Semanal</label>
                  <div className="flex justify-between gap-1 bg-bg-secondary/30 p-2.5 rounded-xl border border-border-secondary">
                    {WEEKDAYS.map(day => {
                      const isActive = frequency.includes(day.value);
                      return (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() => handleToggleDay(day.value)}
                          className={twMerge(
                            "w-8 h-8 rounded-full border text-xs font-black transition-all flex items-center justify-center cursor-pointer",
                            isActive 
                              ? "bg-primary border-primary text-white shadow-sm" 
                              : "bg-bg-primary border-border-secondary text-text-secondary/60 hover:border-primary/20"
                          )}
                          title={day.value}
                        >
                          {day.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving || frequency.length === 0}
                  className="w-full py-3.5 rounded-xl border-none text-[13px] font-bold tracking-wide transition-all bg-primary hover:bg-primary-dark text-white flex justify-center items-center gap-2 shadow-lg shadow-primary/10 disabled:opacity-50 active:scale-[0.98] mt-2"
                >
                  {saving ? <IconLoader2 size={16} className="animate-spin" /> : "Guardar Hábito"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL DE ADVERTENCIA DE PLAN (LIMITACIÓN FREE) */}
      <AnimatePresence>
        {showUpgradeModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-bg-primary border border-border-secondary w-full max-w-[360px] rounded-3xl p-6 shadow-2xl relative text-center flex flex-col items-center"
            >
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="absolute top-4 right-4 p-1 text-text-secondary hover:text-text-primary rounded-full hover:bg-bg-secondary transition-all cursor-pointer"
              >
                <IconX size={20} />
              </button>

              <div className="w-12 h-12 bg-accent-gold/20 text-accent-gold rounded-full flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(250,204,21,0.2)] animate-bounce mt-2">
                <IconSparkles size={24} stroke={2.5} />
              </div>

              <h3 className="text-base font-bold text-text-primary mb-1.5">Límite de Hábitos</h3>
              <p className="text-text-secondary text-xs mb-6 max-w-[250px] leading-relaxed">
                En el plan gratuito puedes crear un máximo de 2 hábitos activos. Actualiza a Pro para registrar hábitos y metas diarias de forma ilimitada.
              </p>

              <button
                onClick={() => {
                  setShowUpgradeModal(false);
                  // Redirección simple o link a paywall
                  window.location.href = '/paywall';
                }}
                className="w-full py-3.5 rounded-xl border-none text-[13px] font-bold tracking-wide transition-all bg-primary hover:bg-primary-dark text-white flex justify-center items-center gap-1.5 shadow-lg shadow-primary/10 active:scale-[0.98] mb-2 uppercase"
              >
                Obtener Plan Pro
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
