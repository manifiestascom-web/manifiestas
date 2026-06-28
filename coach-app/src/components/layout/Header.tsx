"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IconSun, IconMoon, IconSparkles, IconLogout, IconBulb, IconX, IconLoader2 } from '@tabler/icons-react';
import { createClient } from '@/utils/supabase/client';

export default function Header() {
  const router = useRouter();
  const supabase = createClient();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [subscriptionTier, setSubscriptionTier] = useState<string>('free');

  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [suggestionText, setSuggestionText] = useState('');
  const [submittingSuggest, setSubmittingSuggest] = useState(false);
  const [suggestSuccess, setSuggestSuccess] = useState(false);
  const [suggestError, setSuggestError] = useState('');

  const handleSendSuggestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestionText.trim()) return;

    setSubmittingSuggest(true);
    setSuggestError('');
    setSuggestSuccess(false);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No autorizado');

      const { error } = await supabase
        .from('suggestions')
        .insert({
          user_id: user.id,
          text: suggestionText.trim(),
        });

      if (error) throw error;

      setSuggestSuccess(true);
      setSuggestionText('');
      setTimeout(() => {
        setIsSuggestModalOpen(false);
        setSuggestSuccess(false);
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setSuggestError(err.message || 'Error al guardar la sugerencia.');
    } finally {
      setSubmittingSuggest(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    const fetchTier = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('subscription_tier')
          .eq('id', user.id)
          .single();
        if (data) {
          setSubscriptionTier(data.subscription_tier);
        }
      }
    };
    fetchTier();
  }, []);

  const toggleTheme = () => {
    if (theme === 'dark') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    }
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm("¿Estás seguro de que deseas cerrar sesión?");
    if (!confirmLogout) return;
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="bg-gradient-to-br from-primary-dark to-primary p-5 sm:p-6 text-white shadow-md relative overflow-hidden shrink-0 flex justify-between items-center">
      <div className="relative z-10">
        <h1 className="text-xl font-semibold mb-1 flex items-center gap-2">
          ✨ Manifiestas
        </h1>
        <p className="text-xs sm:text-sm opacity-85">Tu coach de manifestación personal — disponible 24/7</p>
      </div>
      
      <div className="relative z-10 flex items-center gap-3">
        {/* Botón/Badge de Suscripción */}
        {subscriptionTier === 'pro' ? (
          <button 
            onClick={async () => {
              try {
                const response = await fetch('/api/portal', { method: 'POST' });
                const data = await response.json();
                if (data.url) {
                  window.open(data.url, '_blank');
                } else {
                  alert(data.error || 'No se pudo abrir el portal de facturación.');
                }
              } catch (err) {
                console.error(err);
                alert('Error al conectar con el portal de facturación.');
              }
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-400 hover:from-emerald-600 hover:to-green-500 text-slate-950 font-black text-xs shadow-[0_0_15px_rgba(52,211,153,0.6)] border border-emerald-200/60 active:scale-95 transition-all cursor-pointer animate-pulse-subtle"
            title="Gestionar tu plan / Facturación de Stripe"
          >
            <IconSparkles size={14} className="text-slate-950" stroke={3} /> Pro Activo
          </button>
        ) : (
          <Link 
            href="/paywall"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent-gold hover:bg-yellow-500 text-slate-950 text-xs font-extrabold shadow-md transition-all active:scale-95"
          >
            <IconSparkles size={12} stroke={3} /> Subir a Pro
          </Link>
        )}

        {/* Botón de sugerencia (Solo Premium Pro) */}
        {subscriptionTier === 'pro' && (
          <button 
            onClick={() => setIsSuggestModalOpen(true)}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white border border-white/10 shadow-inner flex items-center justify-center cursor-pointer"
            title="Enviar sugerencia o idea"
          >
            <IconBulb size={18} className="text-accent-gold" />
          </button>
        )}

        {/* Botón de alternancia de tema */}
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white border border-white/10 shadow-inner"
          aria-label="Cambiar tema"
        >
          {theme === 'dark' ? <IconSun size={18} className="text-accent-gold" /> : <IconMoon size={18} className="text-white" />}
        </button>

        {/* Botón de cerrar sesión */}
        <button 
          onClick={handleLogout}
          className="p-2.5 rounded-full bg-white/10 hover:bg-red-500/20 hover:text-red-300 transition-all text-white border border-white/10 shadow-inner cursor-pointer"
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
        >
          <IconLogout size={18} />
        </button>
      </div>

      {/* Decorative background circle */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse-slow"></div>

      {/* Modal de Sugerencias para usuarios PRO */}
      {isSuggestModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[420px] bg-bg-primary border border-border-primary rounded-3xl p-6 shadow-2xl relative text-left">
            <button
              onClick={() => {
                setIsSuggestModalOpen(false);
                setSuggestError('');
                setSuggestSuccess(false);
              }}
              type="button"
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-bg-secondary text-text-secondary hover:text-text-primary transition-colors cursor-pointer border-none"
            >
              <IconX size={18} />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-accent-gold/15 text-accent-gold rounded-2xl flex items-center justify-center">
                <IconBulb size={20} stroke={2.5} />
              </div>
              <div>
                <h3 className="text-base font-black text-text-primary">Compartir Idea o Sugerencia</h3>
                <p className="text-[11px] text-accent-gold font-bold uppercase tracking-wider">Espacio Premium Pro</p>
              </div>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed mb-4">
              Como miembro Premium, tu visión guía la evolución de **Manifiestas**. ¿Qué herramienta, meditación o mejora te gustaría ver aquí?
            </p>

            <form onSubmit={handleSendSuggestion} className="space-y-4">
              <textarea
                value={suggestionText}
                onChange={(e) => setSuggestionText(e.target.value)}
                required
                rows={4}
                placeholder="Escribe tu idea aquí..."
                disabled={submittingSuggest || suggestSuccess}
                className="w-full bg-bg-secondary/40 border border-border-secondary rounded-2xl p-4 text-sm text-text-primary placeholder:text-text-secondary/40 focus:border-primary focus:outline-none transition-colors shadow-inner resize-none"
              />

              {suggestError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl text-center">
                  {suggestError}
                </div>
              )}

              {suggestSuccess && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-xs rounded-xl text-center font-bold">
                  ¡Idea recibida con éxito! Gracias por co-crear con nosotros.
                </div>
              )}

              <button
                type="submit"
                disabled={submittingSuggest || suggestSuccess || !suggestionText.trim()}
                className="w-full py-3.5 rounded-xl border-none text-[13px] font-bold tracking-wide transition-all bg-primary hover:bg-primary-dark text-white flex justify-center items-center gap-2 shadow-lg shadow-primary/10 disabled:opacity-50 active:scale-[0.98] uppercase cursor-pointer"
              >
                {submittingSuggest ? (
                  <IconLoader2 size={18} className="animate-spin" />
                ) : (
                  "Enviar Idea"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
