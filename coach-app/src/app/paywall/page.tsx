"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  IconSparkles, 
  IconCheck, 
  IconCreditCard, 
  IconLoader2, 
  IconArrowLeft,
  IconLock
} from "@tabler/icons-react";
import { createClient } from "@/utils/supabase/client";
import * as fpixel from "@/utils/fpixel";

export default function PaywallPage() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  const startStripeCheckout = async (plan: "monthly" | "yearly") => {
    setPaying(true);
    setErrorMsg("");

    try {
      const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
      const testEventCode = params.get("test_event_code") || (typeof window !== "undefined" ? (window as any)._metaTestCode : "") || "";

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planType: plan, testEventCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al iniciar Stripe Checkout");
      }

      if (data.url) {
        // Track InitiateCheckout event for Meta Pixel
        const planValue = plan === "yearly" ? 47.99 : 5.99;
        const planName = plan === "yearly" ? "Plan Premium Anual" : "Plan Premium Mensual";

        fpixel.event("InitiateCheckout", {
          value: planValue,
          currency: "USD",
          content_name: planName,
          content_category: "Suscripción",
        });

        // Redirigir a la pasarela segura de Stripe
        window.location.href = data.url;
      } else {
        throw new Error("No se recibió la URL de pago de Stripe");
      }
    } catch (err: any) {
      console.error("Error al procesar la suscripción:", err);
      setErrorMsg(err.message || "Ocurrió un error inesperado al procesar la suscripción.");
      setPaying(false);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      let isProUser = false;

      if (user) {
        setUser(user);
        
        // Redirigir a la app si el usuario ya es PRO (evitamos consulta pesada en middleware)
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_tier')
          .eq('id', user.id)
          .single();
          
        if (profile?.subscription_tier === 'pro') {
          isProUser = true;
          router.push('/app');
          return;
        }
      }

      if (user && !isProUser) {
        const params = new URLSearchParams(window.location.search);
        const plan = params.get("plan");
        const auto = params.get("auto");
        
        let selectedPlan: "monthly" | "yearly" = "monthly";
        if (plan === "yearly" || plan === "monthly") {
          selectedPlan = plan;
          setBillingPeriod(plan);
        }
        
        if (auto === "true") {
          setLoading(false);
          await startStripeCheckout(selectedPlan);
          return;
        }
      }

      setLoading(false);
    };
    checkUser();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    await startStripeCheckout(billingPeriod);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <IconLoader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col justify-center items-center p-4 relative overflow-hidden select-none">
      
      {/* Brillos decorativos de fondo */}
      <div className="absolute top-[-10%] left-[-20%] w-[600px] h-[600px] bg-primary/8 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-20%] w-[600px] h-[600px] bg-accent-gold/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Botón de volver */}
      <button 
        onClick={() => router.push("/app")}
        className="absolute top-6 left-6 flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-text-primary transition-colors cursor-pointer bg-bg-secondary border border-border-primary px-3 py-2 rounded-xl z-20"
      >
        <IconArrowLeft size={16} /> Volver a la App
      </button>

      {/* Botón de cerrar sesión */}
      <button 
        onClick={handleLogout}
        className="absolute top-6 right-6 flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-text-primary transition-colors cursor-pointer bg-bg-secondary border border-border-primary px-3 py-2 rounded-xl z-20"
      >
        Cerrar Sesión
      </button>

      <div className="w-full max-w-[860px] grid md:grid-cols-12 gap-8 items-stretch mt-12 md:mt-0 z-10">
        
        {/* Columna Izquierda: Beneficios del Plan Pro */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-6 flex flex-col justify-center space-y-6"
        >
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-xs font-bold text-accent-purple uppercase tracking-wider">
              <IconSparkles size={14} className="animate-pulse" /> Frecuencia Plena
            </div>
            <h1 className="text-3xl sm:text-4xl font-black leading-tight text-text-primary">
              Activa tu <br />
              <span className="bg-gradient-to-r from-primary via-accent-purple to-accent-gold bg-clip-text text-transparent">
                Acceso Premium Pro
              </span>
            </h1>
            <p className="text-text-secondary text-sm leading-relaxed max-w-sm">
              Elimina todos los límites diarios y desbloquea el poder completo de tu mente y el universo.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { title: "Coach de IA Ilimitado", desc: "Sin límite de 3 mensajes diarios. Habla cuando quieras." },
              { title: "Retos de 30 Días con IA", desc: "Crea planes de reprogramación mental personalizados." },
              { title: "Triángulos de Manifestación Ilimitados", desc: "Sin límite de 1 por día. Genera todos los que necesites." },
              { title: "Diario de Gratitud Sin Límites", desc: "Escribe tantas entradas como quieras cada día." },
              { title: "Metas Ilimitadas", desc: "Sigue múltiples metas de manifestación a la vez." }
            ].map((benefit, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-accent-gold/20 text-accent-gold flex items-center justify-center shrink-0 mt-0.5">
                  <IconCheck size={14} stroke={3} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-text-primary">{benefit.title}</h4>
                  <p className="text-xs text-text-secondary">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Columna Derecha: Resumen y Botón de Pago */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-6"
        >
          <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-border-primary/80 h-full flex flex-col justify-between">
            <div>
              {/* Selector de Plan (Mensual / Anual) */}
              <div className="flex p-1 bg-bg-secondary/60 border border-border-primary/50 rounded-2xl mb-6 relative">
                <button
                  type="button"
                  onClick={() => setBillingPeriod("monthly")}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all relative z-10 ${
                    billingPeriod === "monthly" ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  Mensual
                  {billingPeriod === "monthly" && (
                    <motion.div
                      layoutId="billing-active"
                      className="absolute inset-0 bg-primary/15 border border-primary/30 rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setBillingPeriod("yearly")}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all relative z-10 flex items-center justify-center gap-1.5 ${
                    billingPeriod === "yearly" ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  Anual
                  <span className="px-1.5 py-0.5 rounded-full bg-accent-gold/20 text-accent-gold text-[9px] font-black uppercase">
                    Ahorra 33%
                  </span>
                  {billingPeriod === "yearly" && (
                    <motion.div
                      layoutId="billing-active"
                      className="absolute inset-0 bg-primary/15 border border-primary/30 rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              </div>

              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-black text-lg text-text-primary">
                    {billingPeriod === "monthly" ? "Plan Premium Mensual" : "Plan Premium Anual"}
                  </h3>
                  <p className="text-xs text-text-secondary">
                    {billingPeriod === "monthly" ? "Cancela cuando quieras" : "Pago recurrente. Cancela cuando quieras"}
                  </p>
                </div>
                {billingPeriod === "monthly" ? (
                  <div className="text-right">
                    <span className="text-3xl font-black text-text-primary">$5.99</span>
                    <span className="text-xs text-text-secondary block">/ mes</span>
                  </div>
                ) : (
                  <div className="text-right">
                    <span className="text-3xl font-black text-text-primary">$47.99</span>
                    <span className="text-xs text-text-secondary block">/ año</span>
                    <span className="text-[10px] text-accent-gold font-bold block">($3.99/mes)</span>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubscribe} className="space-y-6">
                <div className="bg-bg-secondary/40 border border-border-primary/50 p-4 rounded-2xl space-y-3">
                  <div className="flex justify-between text-xs text-text-secondary">
                    <span>
                      {billingPeriod === "monthly" ? "Suscripción Mensual" : "Suscripción Anual"}
                    </span>
                    <span>{billingPeriod === "monthly" ? "$5.99" : "$47.99"}</span>
                  </div>
                  <div className="flex justify-between text-xs text-text-secondary">
                    <span>Impuestos</span>
                    <span>$0.00</span>
                  </div>
                  <div className="border-t border-border-primary/50 pt-3 flex justify-between text-sm font-bold text-text-primary">
                    <span>Total hoy</span>
                    <span>{billingPeriod === "monthly" ? "$5.99" : "$47.99"}</span>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl text-center">
                    {errorMsg}
                  </div>
                )}

                <div className="flex items-start gap-2.5 text-[11px] text-text-secondary leading-relaxed bg-bg-secondary/50 p-3.5 rounded-xl border border-border-primary/50">
                  <IconLock size={16} className="shrink-0 text-green-500 mt-0.5" />
                  <span>
                    El pago se procesará de forma segura a través de **Stripe**. Al hacer clic abajo, serás redirigido a su pasarela de pago oficial.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={paying}
                  className="w-full py-4 rounded-xl border-none text-[13px] font-bold tracking-wide transition-all bg-primary hover:bg-primary-dark text-white flex justify-center items-center gap-2 shadow-lg shadow-primary/10 disabled:opacity-50 active:scale-[0.98] uppercase"
                >
                  {paying ? (
                    <IconLoader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      Proceder al Pago <IconCreditCard size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="text-center text-[10px] text-text-secondary mt-6">
              🔒 Garantía de satisfacción de 7 días. Si no estás feliz, solicita la devolución sin preguntas.
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
