"use client";

import React, { useState, useEffect } from 'react';
import { 
  IconCheck, 
  IconLoader2, 
  IconBrain, 
  IconHeart, 
  IconTarget, 
  IconRotate, 
  IconMoodSmile,
  IconFlame,
  IconNotebook
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
};

type HabitWithStatus = Habit & {
  completedToday: boolean;
  logId?: string;
};

const CATEGORIES = {
  mind: { label: 'Mente', color: 'text-violet-400 bg-violet-500/10 border-violet-500/20', icon: IconBrain },
  health: { label: 'Salud', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: IconHeart },
  focus: { label: 'Enfoque', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', icon: IconTarget },
  routine: { label: 'Rutina', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', icon: IconRotate },
};

const MOODS = [
  { value: 'excelente', emoji: '😊', label: 'Excelente' },
  { value: 'bien', emoji: '🙂', label: 'Bien' },
  { value: 'neutral', emoji: '😐', label: 'Neutral' },
  { value: 'cansado', emoji: '🥱', label: 'Cansado' },
  { value: 'mal', emoji: '😔', label: 'Mal' }
];

export default function TodayTab() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [habits, setHabits] = useState<HabitWithStatus[]>([]);
  
  // Modal de registro rápido (estado de ánimo y nota)
  const [showLogModal, setShowLogModal] = useState(false);
  const [activeHabitId, setActiveHabitId] = useState<string | null>(null);
  const [mood, setMood] = useState('bien');
  const [notes, setNotes] = useState('');
  const [savingLog, setSavingLog] = useState(false);

  const getTodayDayName = () => {
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const today = new Date();
    return days[today.getDay()];
  };

  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchTodayData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUser(user);

      const todayStr = getTodayDateString();
      const todayDay = getTodayDayName();

      // Cargar hábitos y logs de hoy en paralelo
      const [habitsResult, logsResult] = await Promise.all([
        supabase.from('habits').select('*').eq('user_id', user.id).eq('is_archived', false),
        supabase.from('habit_logs').select('*').eq('user_id', user.id).eq('completed_at', todayStr)
      ]);

      if (habitsResult.error) throw habitsResult.error;
      if (logsResult.error) throw logsResult.error;

      const allHabits: Habit[] = habitsResult.data || [];
      const todayLogs = logsResult.data || [];

      // Filtrar hábitos programados para hoy
      const todayHabits = allHabits.filter(h => {
        // Si no está definido o vacío, asumimos todos los días
        if (!h.frequency || h.frequency.length === 0) return true;
        return h.frequency.includes(todayDay);
      });

      // Mapear con estado de completado
      const mapped: HabitWithStatus[] = todayHabits.map(habit => {
        const matchingLog = todayLogs.find(log => log.habit_id === habit.id);
        return {
          ...habit,
          completedToday: !!matchingLog,
          logId: matchingLog?.id
        };
      });

      setHabits(mapped);
    } catch (err) {
      console.error("Error al cargar datos del día:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayData();
  }, []);

  const handleToggleHabit = async (habitId: string, isCompleted: boolean, logId?: string) => {
    if (!user) return;

    if (isCompleted) {
      // Si ya está completado y hace click, desmarcarlo (eliminar log)
      try {
        setHabits(prev => prev.map(h => h.id === habitId ? { ...h, completedToday: false, streak_current: Math.max(h.streak_current - 1, 0) } : h));
        
        if (logId) {
          await supabase.from('habit_logs').delete().eq('id', logId);
        } else {
          // Respaldo por si no tenemos logId en estado local
          const todayStr = getTodayDateString();
          await supabase.from('habit_logs').delete().eq('habit_id', habitId).eq('completed_at', todayStr);
        }

        // Decrementar racha en la tabla principal
        const habit = habits.find(h => h.id === habitId);
        if (habit) {
          const nextStreak = Math.max(habit.streak_current - 1, 0);
          await supabase
            .from('habits')
            .update({ streak_current: nextStreak })
            .eq('id', habitId);
        }
        
        // Recargar datos frescos para mantener sincronización
        fetchTodayData();
      } catch (err) {
        console.error("Error al desmarcar hábito:", err);
      }
    } else {
      // Abrir modal para registrar estado de ánimo y notas
      setActiveHabitId(habitId);
      setMood('bien');
      setNotes('');
      setShowLogModal(true);
    }
  };

  const handleSaveLog = async () => {
    if (!activeHabitId || !user) return;
    setSavingLog(true);

    try {
      const todayStr = getTodayDateString();
      const habit = habits.find(h => h.id === activeHabitId);
      if (!habit) return;

      const nextStreak = habit.streak_current + 1;
      const nextLongest = Math.max(nextStreak, habit.streak_longest);

      // 1. Insertar el log de hábito
      const { data: logData, error: logError } = await supabase
        .from('habit_logs')
        .insert([
          {
            habit_id: activeHabitId,
            user_id: user.id,
            completed_at: todayStr,
            notes: notes.trim() || null,
            mood: mood
          }
        ])
        .select();

      if (logError) throw logError;

      // 2. Actualizar racha en la tabla de hábitos
      await supabase
        .from('habits')
        .update({ 
          streak_current: nextStreak, 
          streak_longest: nextLongest 
        })
        .eq('id', activeHabitId);

      setShowLogModal(false);
      setActiveHabitId(null);
      
      // Recargar datos frescos
      fetchTodayData();
    } catch (err) {
      console.error("Error al registrar el cumplimiento:", err);
    } finally {
      setSavingLog(false);
    }
  };

  // Calcular métricas
  const totalToday = habits.length;
  const completedToday = habits.filter(h => h.completedToday).length;
  const completionPercentage = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  // Calcular el perímetro de la circunferencia para el SVG de progreso
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  return (
    <div className="absolute inset-0 p-4 sm:p-6 overflow-y-auto no-scrollbar pb-24 bg-bg-primary">
      {loading ? (
        <div className="h-full flex items-center justify-center">
          <IconLoader2 size={32} className="animate-spin text-primary" />
        </div>
      ) : (
        <div className="max-w-md mx-auto space-y-6">
          
          {/* Tarjeta de Progreso Diario */}
          <div className="bg-gradient-to-br from-bg-secondary to-bg-secondary/40 rounded-3xl p-6 border border-border-primary/80 shadow-md relative overflow-hidden flex items-center justify-between">
            <div className="space-y-1 z-10">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">Progreso de Hoy</span>
              <h2 className="text-xl font-extrabold text-text-primary">
                {completedToday} de {totalToday} hábitos
              </h2>
              <p className="text-xs text-text-secondary">
                {completionPercentage === 100 
                  ? '✨ ¡Excelente! Día perfecto completado.' 
                  : completionPercentage >= 50 
                    ? '👍 ¡Vas por buen camino, mantén el ritmo!' 
                    : '🎯 Sigue construyendo tu disciplina diaria.'}
              </p>
            </div>

            <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                {/* Círculo de fondo */}
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  className="stroke-border-primary/60"
                  strokeWidth="6"
                  fill="transparent"
                />
                {/* Círculo de progreso */}
                <motion.circle
                  cx="40"
                  cy="40"
                  r={radius}
                  className="stroke-primary"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-xs font-black text-text-primary">
                {completionPercentage}%
              </span>
            </div>
          </div>

          {/* Lista de Hábitos de Hoy */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider pl-1">
              Hábitos Programados Hoy ({totalToday})
            </h3>

            {totalToday === 0 ? (
              <div className="text-center py-12 text-text-secondary text-sm bg-bg-secondary/50 rounded-3xl border border-dashed border-border-primary p-6">
                🌴 No tienes hábitos asignados para hoy. ¡Añade hábitos o edita tu frecuencia en la pestaña de ajustes!
              </div>
            ) : (
              <div className="space-y-3">
                {habits.map((habit) => {
                  const CatConfig = CATEGORIES[habit.category] || CATEGORIES.routine;
                  const CatIcon = CatConfig.icon;

                  return (
                    <motion.div
                      key={habit.id}
                      layoutId={habit.id}
                      className={twMerge(
                        "bg-bg-secondary rounded-2xl p-4 border transition-all duration-300 flex items-center justify-between shadow-sm relative overflow-hidden",
                        habit.completedToday 
                          ? "border-green-500/20 bg-green-500/5 dark:bg-green-950/5" 
                          : "border-border-primary hover:border-primary/20"
                      )}
                    >
                      {/* Indicador lateral sutil del color de categoría */}
                      <div className={twMerge(
                        "absolute left-0 top-0 bottom-0 w-1",
                        habit.category === 'mind' && "bg-violet-500",
                        habit.category === 'health' && "bg-emerald-500",
                        habit.category === 'focus' && "bg-blue-500",
                        habit.category === 'routine' && "bg-amber-500"
                      )} />

                      <div className="flex items-center gap-3 pl-1.5">
                        {/* Icono de Categoría */}
                        <div className={twMerge(
                          "w-10 h-10 rounded-xl flex items-center justify-center border shrink-0",
                          CatConfig.color
                        )}>
                          <CatIcon size={20} />
                        </div>

                        <div className="space-y-0.5">
                          <h4 className={twMerge(
                            "text-sm font-bold text-text-primary transition-all duration-200",
                            habit.completedToday && "line-through text-text-secondary opacity-65"
                          )}>
                            {habit.name}
                          </h4>
                          <p className="text-[11px] text-text-secondary line-clamp-1">
                            {habit.description || 'Sin descripción'}
                          </p>
                          
                          {/* Insignia de Racha */}
                          {habit.streak_current > 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full mt-1">
                              <IconFlame size={10} stroke={2.5} /> {habit.streak_current} {habit.streak_current === 1 ? 'día' : 'días'}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Botón interactivo de completado (Checkbox con Framer Motion) */}
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleToggleHabit(habit.id, habit.completedToday, habit.logId)}
                        className={twMerge(
                          "w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer",
                          habit.completedToday 
                            ? "bg-green-500 border-green-500 text-white shadow-md shadow-green-500/20" 
                            : "border-border-secondary hover:border-primary bg-bg-primary"
                        )}
                      >
                        {habit.completedToday && (
                          <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          >
                            <IconCheck size={18} stroke={3.5} />
                          </motion.div>
                        )}
                      </motion.button>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL DE CHECK-IN RÁPIDO (ESTADO DE ÁNIMO Y NOTAS) */}
      <AnimatePresence>
        {showLogModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-bg-primary border border-border-secondary w-full max-w-[380px] rounded-3xl p-6 shadow-2xl relative"
            >
              <div className="flex gap-2.5 items-center mb-5">
                <span className="text-2xl">🌱</span>
                <div>
                  <h3 className="text-base font-bold text-text-primary">¡Hábito Completado!</h3>
                  <p className="text-text-secondary text-xs">Registra cómo te sientes al lograrlo</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Selector de estado de ánimo */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">¿Cómo está tu energía?</label>
                  <div className="grid grid-cols-5 gap-2">
                    {MOODS.map((m) => (
                      <button
                        key={m.value}
                        onClick={() => setMood(m.value)}
                        className={twMerge(
                          "py-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer bg-bg-secondary/40",
                          mood === m.value 
                            ? "border-primary bg-primary/5 text-primary scale-105 shadow-sm" 
                            : "border-border-secondary text-text-secondary hover:border-primary/20"
                        )}
                      >
                        <span className="text-lg">{m.emoji}</span>
                        <span className="text-[9px] font-bold leading-none">{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nota o reflexión */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Nota rápida o reflexión (Opcional)</label>
                  <div className="relative">
                    <IconNotebook size={14} className="absolute left-3 top-3.5 text-text-secondary/60" />
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="¿Algún logro o pensamiento hoy?..."
                      className="w-full bg-bg-secondary/50 border border-border-secondary rounded-xl py-3 pl-9 pr-4 text-xs text-text-primary placeholder:text-text-secondary/50 focus:border-primary focus:outline-none transition-colors min-h-[70px] resize-none"
                    />
                  </div>
                </div>

                {/* Botón de envío */}
                <button
                  onClick={handleSaveLog}
                  disabled={savingLog}
                  className="w-full py-3.5 rounded-xl border-none text-[13px] font-bold tracking-wide transition-all bg-primary hover:bg-primary-dark text-white flex justify-center items-center gap-2 shadow-lg shadow-primary/10 disabled:opacity-50 active:scale-[0.98]"
                >
                  {savingLog ? <IconLoader2 size={16} className="animate-spin" /> : "Guardar Registro ✨"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
