"use client";

import React, { useState, useEffect } from 'react';
import { 
  IconLoader2, 
  IconFlame, 
  IconCalendarEvent, 
  IconTrendingUp, 
  IconBrain, 
  IconHeart, 
  IconTarget, 
  IconRotate,
  IconCircleCheck
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import { twMerge } from 'tailwind-merge';

type Habit = {
  id: string;
  name: string;
  category: 'mind' | 'health' | 'focus' | 'routine';
  streak_current: number;
  streak_longest: number;
};

type HabitLog = {
  id: string;
  habit_id: string;
  completed_at: string; // YYYY-MM-DD
  mood?: string;
  notes?: string;
};

const CATEGORIES = {
  mind: { label: 'Mente', color: 'text-violet-400 bg-violet-500/10 border-violet-500/20', dotColor: 'bg-violet-500', icon: IconBrain },
  health: { label: 'Salud', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', dotColor: 'bg-emerald-500', icon: IconHeart },
  focus: { label: 'Enfoque', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', dotColor: 'bg-blue-500', icon: IconTarget },
  routine: { label: 'Rutina', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', dotColor: 'bg-amber-500', icon: IconRotate },
};

export default function AnalyticsTab() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [monthDates, setMonthDates] = useState<Date[]>([]);
  const [currentMonthName, setCurrentMonthName] = useState('');

  // Generar las fechas de los últimos 30 días para el heatmap
  const generateLast30Days = () => {
    const dates = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      dates.push(d);
    }
    return dates;
  };

  const getLocalDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Definir rango para buscar registros (últimos 30 días)
        const last30 = generateLast30Days();
        setMonthDates(last30);
        
        // Formatear nombre del mes actual en español
        const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
        setCurrentMonthName(new Date().toLocaleDateString('es-ES', options));

        const startDateStr = getLocalDateString(last30[0]);

        // Cargar hábitos activos y logs correspondientes en paralelo
        const [habitsResult, logsResult] = await Promise.all([
          supabase.from('habits').select('*').eq('user_id', user.id).eq('is_archived', false),
          supabase.from('habit_logs').select('*').eq('user_id', user.id).gte('completed_at', startDateStr)
        ]);

        if (habitsResult.error) throw habitsResult.error;
        if (logsResult.error) throw logsResult.error;

        setHabits(habitsResult.data || []);
        setLogs(logsResult.data || []);
      } catch (err) {
        console.error("Error al cargar analíticas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  // Estadísticas globales
  const totalLogsCount = logs.length;
  const bestStreak = habits.reduce((max, h) => h.streak_longest > max ? h.streak_longest : max, 0);
  const currentStreakSum = habits.reduce((sum, h) => sum + h.streak_current, 0);

  // Calcular porcentaje general de efectividad (últimos 30 días)
  // Total posibles completions = hábitos * 30 días
  const totalPossible = habits.length * 30;
  const globalCompletionRate = totalPossible > 0 ? Math.round((totalLogsCount / totalPossible) * 100) : 0;

  return (
    <div className="absolute inset-0 p-4 sm:p-6 overflow-y-auto no-scrollbar pb-24 bg-bg-primary">
      {loading ? (
        <div className="h-full flex items-center justify-center">
          <IconLoader2 size={32} className="animate-spin text-primary" />
        </div>
      ) : (
        <div className="max-w-md mx-auto space-y-6">
          <div>
            <h2 className="text-lg font-extrabold text-text-primary">Tu Progreso</h2>
            <p className="text-xs text-text-secondary">Analiza tu consistencia en los últimos 30 días</p>
          </div>

          {/* Grid de Tarjetas de Estadísticas Globales */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-bg-secondary rounded-2xl p-4 border border-border-primary flex flex-col gap-1 shadow-sm">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <IconFlame size={12} className="text-amber-500" /> Mejor Racha
              </span>
              <p className="text-2xl font-black text-text-primary mt-1">
                {bestStreak} <span className="text-xs font-normal text-text-secondary">días</span>
              </p>
              <span className="text-[9px] text-text-secondary">Máxima alcanzada</span>
            </div>

            <div className="bg-bg-secondary rounded-2xl p-4 border border-border-primary flex flex-col gap-1 shadow-sm">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <IconTrendingUp size={12} className="text-primary" /> Efectividad
              </span>
              <p className="text-2xl font-black text-text-primary mt-1">
                {globalCompletionRate}%
              </p>
              <span className="text-[9px] text-text-secondary">De metas en 30 días</span>
            </div>

            <div className="bg-bg-secondary rounded-2xl p-4 border border-border-primary flex flex-col gap-1 shadow-sm">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <IconCircleCheck size={12} className="text-green-500" /> Checks Totales
              </span>
              <p className="text-2xl font-black text-text-primary mt-1">
                {totalLogsCount} <span className="text-xs font-normal text-text-secondary">veces</span>
              </p>
              <span className="text-[9px] text-text-secondary">Hábitos completados</span>
            </div>

            <div className="bg-bg-secondary rounded-2xl p-4 border border-border-primary flex flex-col gap-1 shadow-sm">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <IconCalendarEvent size={12} className="text-blue-500" /> Período
              </span>
              <p className="text-[14px] font-extrabold text-text-primary mt-2 uppercase tracking-wide leading-tight line-clamp-1">
                Últimos 30 días
              </p>
              <span className="text-[9px] text-text-secondary lowercase">Cierre: {currentMonthName}</span>
            </div>
          </div>

          {/* Cuadrículas individuales de Hábitos (Heatmaps) */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider pl-1">
              Desglose de Hábitos Activos
            </h3>

            {habits.length === 0 ? (
              <div className="text-center py-10 text-text-secondary text-sm bg-bg-secondary/50 rounded-3xl border border-dashed border-border-primary p-6">
                📈 No hay datos disponibles. Crea un hábito y márcalo hoy para ver tus gráficos.
              </div>
            ) : (
              habits.map((habit) => {
                const CatConfig = CATEGORIES[habit.category] || CATEGORIES.routine;
                
                // Filtrar los logs correspondientes a este hábito
                const habitLogs = logs.filter(l => l.habit_id === habit.id);
                const habitCompletionRate = Math.round((habitLogs.length / 30) * 100);

                return (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-bg-secondary rounded-2xl p-5 border border-border-primary/80 shadow-sm space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <div className={twMerge(
                          "w-7 h-7 rounded-lg flex items-center justify-center border",
                          CatConfig.color
                        )}>
                          <CatConfig.icon size={15} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-text-primary">{habit.name}</h4>
                          <p className="text-[10px] text-text-secondary">{CatConfig.label}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-black text-text-primary">{habitCompletionRate}%</span>
                        <p className="text-[8px] text-text-secondary uppercase tracking-widest">Efectividad</p>
                      </div>
                    </div>

                    {/* Heatmap (cuadrícula de 30 días) */}
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider block">Mapa de calor (Últimos 30 días)</span>
                      
                      <div className="flex flex-wrap gap-1.5 bg-bg-primary/40 p-3 rounded-xl border border-border-primary/50 justify-between">
                        {monthDates.map((date, index) => {
                          const dateStr = getLocalDateString(date);
                          const isCompleted = habitLogs.some(l => l.completed_at === dateStr);
                          
                          // Formatear tooltip simple
                          const label = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });

                          return (
                            <div
                              key={dateStr}
                              className={twMerge(
                                "w-4 h-4 sm:w-5 sm:h-5 rounded-md transition-all relative group cursor-pointer border border-transparent",
                                isCompleted 
                                  ? twMerge(CatConfig.dotColor, "shadow-sm shadow-black/10 scale-102") 
                                  : "bg-border-primary/50 dark:bg-white/5 border-border-primary/20"
                              )}
                              title={`${label}: ${isCompleted ? 'Completado ✓' : 'Pendiente'}`}
                            >
                              {/* Tooltip flotante al pasar el mouse */}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 bg-slate-900 text-white text-[8px] rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 font-bold border border-white/5">
                                {label}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Rachas individuales */}
                    <div className="flex justify-between items-center text-[10px] text-text-secondary px-1 font-medium">
                      <span className="flex items-center gap-1 text-amber-500 font-bold">
                        <IconFlame size={12} stroke={2.5} /> Racha actual: {habit.streak_current} días
                      </span>
                      <span>
                        Racha récord: {habit.streak_longest} días
                      </span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
