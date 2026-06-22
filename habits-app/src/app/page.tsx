"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IconSparkles, 
  IconRobot, 
  IconTarget, 
  IconHeart, 
  IconEye, 
  IconArrowRight, 
  IconDeviceMobile, 
  IconChevronDown, 
  IconCopy, 
  IconCheck, 
  IconPlayerPlayFilled, 
  IconCoins,
  IconBrain,
  IconArrowUpRight,
  IconSun,
  IconMoon,
  IconSend,
  IconTriangle,
  IconLoader2,
  IconCircleCheck,
  IconRotate,
  IconTrendingUp,
  IconHourglassLow,
  IconFlame
} from "@tabler/icons-react";
import EnergyParticles from "@/components/layout/EnergyParticles";

// URLs de Imágenes externas (Cloudflare R2 / CDN)
const HERO_IMAGE_URL = "/hero.webp"; 
const APP_INTERACTION_IMAGE_URL = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1000"; // Enfoque de fitness y hábitos
const SUCCESS_GRATITUDE_IMAGE_URL = "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1000"; 

// Ejemplos de hábitos por categoría para el widget interactivo
const habitsByCategory: Record<string, string[]> = {
  ejercicio: [
    "Hacer 10 flexiones de pecho justo al despertar.",
    "Dar una caminata de 15 minutos después de comer.",
    "Hacer 5 minutos de estiramientos corporales antes de acostarme.",
    "Realizar una rutina corta de yoga al comenzar el día."
  ],
  productividad: [
    "Escribir las 3 tareas prioritarias del día antes de abrir correos.",
    "Trabajar en bloques Pomodoro de 25 minutos sin interrupciones.",
    "Limpiar mi escritorio físico al terminar la jornada laboral.",
    "Revisar mi agenda para el día siguiente antes de dormir."
  ],
  salud: [
    "Beber un vaso grande de agua en ayunas.",
    "Comer una fruta fresca como snack a media tarde.",
    "Apagar pantallas 30 minutos antes de acostarme.",
    "Hacer 3 respiraciones profundas al sentir estrés."
  ],
  aprendizaje: [
    "Leer 5 páginas de mi libro actual por la mañana.",
    "Practicar 3 palabras en otro idioma al desayunar.",
    "Escuchar 10 minutos de un podcast educativo de camino a clases/trabajo.",
    "Escribir un aprendizaje clave del día en mi diario."
  ]
};

// FAQ data
const faqs = [
  {
    question: "¿Qué es Hábitos IA?",
    answer: "Hábitos IA es un mentor interactivo que combina la psicología del comportamiento (basada en el marco de Hábitos Atómicos) y la neurociencia para ayudarte a construir rutinas consistentes. Ofrece diálogos interactivos con inteligencia artificial, registro diario de hábitos con un toque, mapas de calor estilo GitHub para visualizar tus rachas y recompensas de disciplina."
  },
  {
    question: "¿Cómo funciona el Mentor de Hábitos?",
    answer: "Nuestro mentor impulsado por inteligencia artificial te guía para estructurar tus hábitos de forma atómica. Te ayuda a diagnosticar por qué procrastinas, a diseñar disparadores claros (anclaje de hábitos) y a ajustar el tamaño de tus rutinas con la regla de los dos minutos para asegurar tu consistencia diaria."
  },
  {
    question: "¿Qué es la Calculadora de Consistencia?",
    answer: "Es una herramienta interactiva que simula la probabilidad de que un hábito se vuelva automático según la cantidad de días seguidos que mantienes tu racha. Te ayuda a entender cómo la constancia acumula beneficios en tu mente mediante el interés compuesto de la disciplina."
  },
  {
    question: "¿Es gratis utilizar la aplicación?",
    answer: "Sí. El plan gratuito te permite crear hasta 2 hábitos activos, registrar tu cumplimiento diario con estados de ánimo y notas de racha, visualizar tu mapa de calor de 30 días, y enviar hasta 3 mensajes al día a tu Mentor IA. El plan Pro ($5.99/mes) elimina todas las limitaciones para una disciplina plena."
  }
];

export default function LandingPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "dark") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    }
  };

  // Estados para el widget de ejemplos rápidos de hábitos
  const [selectedCategory, setSelectedCategory] = useState("ejercicio");
  const [currentAffirmation, setCurrentAffirmation] = useState(
    "Hacer 10 flexiones de pecho justo al despertar."
  );
  const [copied, setCopied] = useState(false);

  // Estados para el simulador de Chat
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "ai" | "user"; text: string }>>([
    { sender: "ai", text: "👋 ¡Hola! Soy tu mentor de hábitos con IA. ¿Qué rutina te gustaría construir o mejorar hoy? (🏋️ Ejercicio diario, 🧘 Meditación o 📚 Lectura constante)" }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Estados para el simulador de Consistencia (anterior Jackpot)
  const [showJackpot, setShowJackpot] = useState(false);
  const [jackpotAmount, setJackpotAmount] = useState("30");
  const [displayJackpotAmount, setDisplayJackpotAmount] = useState(0);

  // Estados de FAQs
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Estados del Bucle de Hábito Interactivo de la Landing (anterior Triángulo de Manifestación)
  const [landingStep, setLandingStep] = useState(1);
  const [landingDesire, setLandingDesire] = useState(""); // Señal / Detonante
  const [landingEmotion, setLandingEmotion] = useState(""); // Hábito / Acción
  const [landingAction, setLandingAction] = useState(""); // Recompensa
  const [landingGenerating, setLandingGenerating] = useState(false);
  const [landingAffirmation, setLandingAffirmation] = useState(""); // Contrato Resultante
  const [landingCopied, setLandingCopied] = useState(false);

  // Estado para el aviso de cookies
  const [showCookieBanner, setShowCookieBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowCookieBanner(true);
    }
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowCookieBanner(false);
  };

  const handleActivateLandingTriangle = () => {
    if (!landingDesire.trim() || !landingEmotion.trim() || !landingAction.trim()) return;
    setLandingGenerating(true);
    setTimeout(() => {
      const contract = `Compromiso de Hábito Atómico: "Cuando ocurra '${landingDesire.trim()}', haré la acción de '${landingEmotion.trim()}' y de inmediato me daré la recompensa de '${landingAction.trim()}'."`;
      setLandingAffirmation(contract);
      setLandingGenerating(false);
      setLandingStep(4);
    }, 2000); 
  };

  const handleGenerateAffirmation = (category: string) => {
    setSelectedCategory(category);
    const list = habitsByCategory[category];
    const randomIndex = Math.floor(Math.random() * list.length);
    setCurrentAffirmation(list[randomIndex]);
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentAffirmation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChatOption = (optionText: string, replyText: string) => {
    if (isTyping) return;
    
    setChatMessages(prev => [...prev, { sender: "user", text: optionText }]);
    setIsTyping(true);

    setTimeout(() => {
      setChatMessages(prev => [...prev, { sender: "ai", text: replyText }]);
      setIsTyping(false);
    }, 1000);
  };

  const startJackpotSimulation = () => {
    setShowJackpot(true);
    setDisplayJackpotAmount(0);
    const days = parseInt(jackpotAmount, 10) || 30;
    
    // Calcular probabilidad de éxito usando una curva exponencial simple
    // A más días, mayor probabilidad de fijar el hábito de manera automática (máximo 99%)
    const targetProbability = Math.min(99, Math.round((1 - Math.exp(-days / 18)) * 100));
    let current = 0;
    const step = Math.ceil(targetProbability / 30);

    const interval = setInterval(() => {
      current += step;
      if (current >= targetProbability) {
        setDisplayJackpotAmount(targetProbability);
        clearInterval(interval);
      } else {
        setDisplayJackpotAmount(current);
      }
    }, 35);
  };

  return (
    <div className="bg-background text-text-primary min-h-screen font-sans overflow-x-hidden transition-colors duration-300 selection:bg-primary/20 selection:text-primary">
      
      {/* GLOW DECORATIVOS DE FONDO (Spotify-style Green & Slate) */}
      <div className="absolute top-0 left-1/4 w-[40vw] h-[40vw] bg-primary/5 dark:bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-1/3 right-1/4 w-[35vw] h-[35vw] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 left-1/3 w-[30vw] h-[30vw] bg-primary/5 dark:bg-primary/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* HEADER DE NAVEGACIÓN */}
      <header className="sticky top-0 z-50 glass-card border-b border-border-primary/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-wider text-text-primary">
            <span className="text-primary text-2xl">⚡</span>
            <span className="font-extrabold tracking-tight">HÁBITOS IA</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
            <a href="#features" className="hover:text-primary dark:hover:text-primary transition-colors">Características</a>
            <a href="#demo" className="hover:text-primary dark:hover:text-primary transition-colors">Demo Interactiva</a>
            <a href="#how-it-works" className="hover:text-primary dark:hover:text-primary transition-colors">Cómo Funciona</a>
            <a href="#faqs" className="hover:text-primary dark:hover:text-primary transition-colors">Preguntas</a>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-bg-primary dark:bg-white/5 border border-border-primary hover:border-primary/30 dark:border-white/10 dark:hover:border-white/20 transition-all text-text-secondary hover:text-text-primary"
              aria-label="Cambiar tema"
            >
              {theme === "dark" ? <IconSun size={18} className="text-primary" /> : <IconMoon size={18} className="text-primary" />}
            </button>

            <Link 
              href="/app" 
              className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-dark text-white font-medium text-sm transition-all duration-300 flex items-center gap-1.5 shadow-md shadow-primary/15 hover:shadow-primary/30 hover:scale-[1.02]"
            >
              Iniciar App <IconArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </header>

      {/* CINTA DE PRODUCTIVIDAD COLECTIVA */}
      <div className="relative w-full overflow-hidden bg-gradient-to-r from-slate-950 via-[#101913] to-slate-950 border-b border-primary/20 py-2.5 z-40 select-none">
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee-custom {
            display: flex;
            width: max-content;
            animation: marquee 35s linear infinite;
          }
        `}</style>
        <div className="animate-marquee-custom flex gap-8 whitespace-nowrap text-[10px] sm:text-xs font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-primary uppercase">
          <span>🔥 HÁBITOS COMPLETADOS HOY EN LA COMUNIDAD: 24,854 • 📈 TASA DE CONSISTENCIA GLOBAL: 98.4% • 🌿 1,230 DÍAS DE RACHA ACUMULADA • ⚡ MENTALIDAD MÁS ENFOCADA • 🚀</span>
          <span>🔥 HÁBITOS COMPLETADOS HOY EN LA COMUNIDAD: 24,854 • 📈 TASA DE CONSISTENCIA GLOBAL: 98.4% • 🌿 1,230 DÍAS DE RACHA ACUMULADA • ⚡ MENTALIDAD MÁS ENFOCADA • 🚀</span>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-24 md:pt-28 md:pb-36 z-10 overflow-hidden">
        <EnergyParticles />
        <div className="relative z-10 grid grid-cols-12 gap-6 md:gap-12 items-center">
          
          {/* Columna Izquierda: Mensaje principal */}
          <div className="col-span-12 md:col-span-7 text-left space-y-6 md:space-y-8 flex flex-col items-start">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 dark:bg-primary/5 border border-primary/20 text-[10px] sm:text-xs font-bold text-primary tracking-wide uppercase shadow-sm select-none"
            >
              <IconSparkles size={12} className="animate-pulse text-primary" />
              MENTOR DE COMPORTAMIENTO CON INTELIGENCIA ARTIFICIAL
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-text-primary leading-[1.15] md:leading-tight tracking-tight"
            >
              Construye hábitos atómicos y{" "}
              <span className="bg-gradient-to-r from-primary via-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                diseña tu rutina diaria con IA.
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-text-secondary text-lg md:text-xl leading-relaxed max-w-xl"
            >
              Habla con un mentor de IA especializado en psicología del comportamiento, trackea tus rachas con mapas de calor y automatiza tu disciplina diaria.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 pt-2 w-full sm:w-auto"
            >
              <Link 
                href="/app" 
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.03]"
              >
                Probar gratis — sin tarjeta <IconArrowRight size={20} />
              </Link>
              <a 
                href="#demo" 
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-bg-primary dark:bg-white/5 border border-border-secondary dark:border-white/15 text-text-primary dark:text-slate-200 font-bold hover:bg-bg-secondary dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                Ver demo en vivo
              </a>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-text-secondary/70 select-none text-left w-full mt-1.5"
            >
              <span>🛡️</span> Gratis para siempre  •  Pro desde $5.99/mes  •  Cancela cuando quieras
            </motion.div>

            {/* Calculadora de racha rápida en el Hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.38 }}
              className="w-full max-w-md p-4 sm:p-5 rounded-3xl bg-white/5 dark:bg-[#181818]/60 border border-primary/20 dark:border-primary/10 shadow-[0_0_25px_rgba(29,185,84,0.04)] text-left space-y-3 relative overflow-hidden mt-2"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>
              <div className="flex items-center gap-2">
                <span className="text-lg text-primary">📈</span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Calculadora de Consistencia de Racha</h4>
              </div>
              <p className="text-[11px] text-text-secondary dark:text-slate-300 leading-relaxed">
                Ingresa los días que planeas mantener tu nuevo hábito para simular la probabilidad de automatizarlo en tu rutina:
              </p>
              <div className="flex gap-2 w-full">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-xs font-bold"><IconFlame size={12} className="text-primary" /></span>
                  <input 
                    type="text"
                    value={jackpotAmount}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/\D/g, "");
                      setJackpotAmount(clean ? clean : "");
                    }}
                    placeholder="30"
                    className="w-full bg-bg-secondary dark:bg-[#282828] border border-border-secondary dark:border-white/10 rounded-xl py-2 pl-8 pr-2 text-xs font-bold text-text-primary dark:text-white outline-none focus:border-primary transition-colors"
                  />
                </div>
                <button
                  onClick={startJackpotSimulation}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-primary/15 flex items-center gap-1 active:scale-[0.98] cursor-pointer"
                >
                  Calcular Probabilidad 📈
                </button>
              </div>
            </motion.div>
            
            {/* Fila de stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col gap-6 pt-6 md:pt-8 border-t border-border-primary dark:border-white/5 max-w-md text-left w-full mt-2"
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {['🏋️', '📚', '🧘', '💧', '🥗'].map((emoji, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-emerald-500/20 border-2 border-bg-primary dark:border-background flex items-center justify-center text-sm">{emoji}</div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">2,300+ rutinas activadas</p>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-primary text-xs">★</span>
                    ))}
                    <span className="text-xs text-text-secondary ml-1">4.9/5 en consistencia</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-2xl font-black text-text-primary">24/7</p>
                  <p className="text-xs text-text-secondary mt-1">Mentor IA disponible</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-text-primary">95%</p>
                  <p className="text-xs text-text-secondary mt-1">Tasa de retención</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-text-primary">0%</p>
                  <p className="text-xs text-text-secondary mt-1">Fricción de inicio</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Columna Derecha: Dashboard + Celular Mockup */}
          <div className="hidden md:flex md:col-span-5 relative w-full h-[550px] lg:h-[600px] justify-center items-center select-none">
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 to-emerald-500/5 rounded-[40px] blur-3xl opacity-80 pointer-events-none" />

            {/* Dashboard Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex absolute left-0 top-6 w-[85%] h-[80%] rounded-3xl bg-white/40 dark:bg-[#181818]/65 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl flex-col overflow-hidden"
            >
              {/* Browser Window Header */}
              <div className="h-9 px-4 border-b border-border-primary/50 dark:border-white/5 bg-white/20 dark:bg-slate-900/30 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/90 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/90 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400/90 inline-block" />
                </div>
                <div className="w-[60%] h-5 bg-white/30 dark:bg-white/5 border border-white/10 dark:border-white/5 rounded-md flex items-center justify-center text-[9px] text-text-secondary/70 dark:text-slate-400">
                  app.habitosia.com/hoy
                </div>
                <div className="w-6" />
              </div>

              {/* Dashboard Body */}
              <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-12 border-r border-border-primary/50 dark:border-white/5 bg-white/15 dark:bg-slate-900/10 flex flex-col items-center py-4 gap-4 shrink-0">
                  <span className="text-[12px] opacity-80 text-primary">✓</span>
                  <span className="text-[12px] opacity-40">📊</span>
                  <span className="text-[12px] opacity-40">🤖</span>
                  <span className="text-[12px] opacity-40">⚙️</span>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 flex flex-col gap-3 overflow-hidden text-[10px]">
                  <div className="flex justify-between items-center pb-2 border-b border-border-primary/50 dark:border-white/5">
                    <div>
                      <div className="font-bold text-text-primary dark:text-white">⚡ Mis Hábitos de Hoy</div>
                      <div className="text-[8px] text-primary flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> En racha de consistencia
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[8px] font-bold">100% de Cumplimiento</span>
                  </div>

                  <div className="flex-1 flex flex-col gap-2.5 overflow-hidden">
                    <div className="flex justify-between items-center bg-[#282828] border border-white/5 px-3 py-2 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-primary text-xs">✓</span>
                        <span className="text-white font-medium">Leer 5 páginas del libro</span>
                      </div>
                      <span className="text-[8px] text-text-secondary">08:00 AM</span>
                    </div>

                    <div className="flex justify-between items-center bg-[#282828] border border-white/5 px-3 py-2 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-primary text-xs">✓</span>
                        <span className="text-white font-medium">Hacer 10 flexiones de pecho</span>
                      </div>
                      <span className="text-[8px] text-text-secondary">Al despertar</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Celular Flotante Desktop */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="absolute right-0 bottom-0 md:-right-4 md:-bottom-2 w-[170px] lg:w-[185px] aspect-[9/18.5] rounded-[36px] bg-[#121212] border-[5px] border-border-secondary shadow-[0_20px_50px_rgba(0,0,0,0.5),_0_0_30px_rgba(29,185,84,0.15)] overflow-hidden flex flex-col z-20"
            >
              {/* Notch */}
              <div className="absolute top-1 left-1/2 -translate-x-1/2 w-16 h-2.5 bg-border-secondary rounded-full z-30" />

              {/* Status Bar */}
              <div className="pt-5 px-3 pb-1 flex justify-between items-center text-[8px] text-white/40 font-semibold shrink-0">
                <span>9:41</span>
                <div className="flex items-center gap-1"><span>📶</span><span>🔋</span></div>
              </div>

              {/* Header App Celular */}
              <div className="px-2 py-1.5 bg-gradient-to-br from-[#121212] to-[#181818] border-b border-[#282828] text-white flex justify-between items-center shrink-0">
                <div>
                  <div className="text-[7.5px] font-bold flex items-center gap-0.5">
                    ⚡ Hábitos IA
                  </div>
                  <div className="text-[5.5px] opacity-80 leading-none">
                    Mentor de comportamiento
                  </div>
                </div>
                <div className="text-[5.5px] bg-[#282828] px-1 py-0.5 rounded-full border border-white/5 flex items-center gap-0.5 font-semibold leading-none shrink-0 text-primary">
                  <span className="w-0.5 h-0.5 rounded-full bg-primary animate-pulse"></span> 24/7
                </div>
              </div>

              {/* Chat Celular */}
              <div className="flex-1 px-2 py-2 flex flex-col gap-2 overflow-hidden text-[7.5px] leading-snug">
                <div className="flex gap-1 items-end max-w-[88%] self-start">
                  <div className="w-3.5 h-3.5 rounded-full bg-primary/10 flex items-center justify-center text-[5px] shrink-0 border border-primary/20">🤖</div>
                  <div className="bg-[#181818] border border-white/5 text-slate-200 px-1.5 py-1 rounded-lg rounded-bl-none shadow-sm">
                    ¿Qué hábito atómico quieres anclar hoy?
                  </div>
                </div>
                
                <div className="bg-primary text-white px-1.5 py-1 rounded-lg rounded-br-none max-w-[80%] self-end shadow-sm">
                  📚 Leer antes de ir a dormir.
                </div>

                <div className="flex gap-1 items-end max-w-[88%] self-start">
                  <div className="w-3.5 h-3.5 rounded-full bg-primary/10 flex items-center justify-center text-[5px] shrink-0 border border-primary/20">🤖</div>
                  <div className="bg-[#181818] border border-white/5 text-slate-200 px-1.5 py-1 rounded-lg rounded-bl-none space-y-0.5">
                    <div className="font-bold text-primary text-[5px]">✦ Consejo de Anclaje:</div>
                    <div className="italic">"Después de acostarme en la cama, abriré mi libro y leeré 2 páginas."</div>
                  </div>
                </div>
              </div>

              {/* Input Celular */}
              <div className="p-1 border-t border-[#282828] bg-[#121212] flex gap-1 items-center shrink-0">
                <div className="flex-1 bg-[#181818] border border-white/5 rounded-full py-0.5 px-2 text-[5px] text-slate-400 flex items-center justify-between">
                  <span>Escribe tu hábito...</span>
                  <span>🎙️</span>
                </div>
                <div className="w-3.5 h-3.5 rounded-full bg-primary flex items-center justify-center text-white text-[5px] cursor-pointer shadow-sm shrink-0">
                  <IconSend size={6} />
                </div>
              </div>

              {/* Bottom Navigation Mockup */}
              <div className="border-t border-[#282828] bg-[#121212] flex shrink-0 justify-around py-1 text-[5px] font-semibold text-text-secondary select-none">
                <div className="flex-1 flex flex-col items-center gap-0.5 text-primary font-extrabold border-b border-primary pb-0.5">
                  <IconCircleCheck size={8} stroke={2} />
                  <span>Hoy</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-0.5 opacity-60">
                  <IconRotate size={8} stroke={1.5} />
                  <span>Hábitos</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-0.5 opacity-60">
                  <IconTrendingUp size={8} stroke={1.5} />
                  <span>Progreso</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-0.5 opacity-60">
                  <IconRobot size={8} stroke={1.5} />
                  <span>Mentor</span>
                </div>
              </div>
            </motion.div>

            {/* Widgets Flotantes */}
            <div className="absolute top-10 right-4 p-3 rounded-2xl bg-[#181818]/90 backdrop-blur-xl border border-white/10 shadow-lg flex items-center gap-2.5 z-30">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <IconFlame size={16} />
              </div>
              <div>
                <p className="text-[8px] text-text-secondary font-semibold uppercase tracking-wider">Consistencia Actual</p>
                <p className="text-xs font-black text-white flex items-center gap-1">
                  12 Días 🔥 <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
                </p>
              </div>
            </div>
          </div>

          {/* Columna Móvil */}
          <div className="col-span-12 md:hidden relative w-full flex flex-col items-center justify-center pt-8 pb-4 overflow-visible select-none">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] aspect-[1/0.5] rounded-[100%] bg-gradient-to-t from-primary/10 via-transparent to-transparent -z-10" />

            {/* Estrella decorativa izquierda */}
            <motion.div 
              animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-2 sm:left-4 top-1/3 text-primary opacity-60"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
              </svg>
            </motion.div>
            
            {/* Estrella decorativa derecha */}
            <motion.div 
              animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.2, 1] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute right-2 sm:right-4 top-1/4 text-primary opacity-70"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
              </svg>
            </motion.div>

            {/* Celular Flotante de Alta Fidelidad (Móvil) */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative w-[280px] sm:w-[320px] aspect-[9/18.5] rounded-[36px] bg-[#121212] border-[6px] border-[#282828] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5),_0_0_40px_rgba(29,185,84,0.1)] overflow-hidden flex flex-col transition-colors z-10"
            >
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-3 bg-border-secondary rounded-full z-30" />

              <div className="pt-5 px-5 pb-1 flex justify-between items-center text-[9px] text-white/40 font-semibold shrink-0">
                <span>9:41</span>
                <div className="flex items-center gap-1.5"><span>📶</span><span>🔋</span></div>
              </div>

              {/* Header Real de la App */}
              <div className="px-4 py-3 bg-[#181818] text-white flex justify-between items-center shrink-0 border-b border-[#282828] relative overflow-hidden">
                <div className="absolute -top-4 -right-4 w-14 h-14 bg-primary/10 rounded-full blur-xl" />
                <div className="relative z-10">
                  <div className="text-[11px] font-semibold flex items-center gap-1">
                    ⚡ Hábitos IA
                  </div>
                  <div className="text-[8px] opacity-85 leading-tight">
                    Tu mentor de comportamiento — 24/7
                  </div>
                </div>
                <div className="relative z-10 w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <IconCircleCheck size={9} className="text-primary" />
                </div>
              </div>

              {/* Chat Celular Móvil */}
              <div className="flex-1 px-3 py-3 flex flex-col gap-2.5 overflow-hidden text-[10px] leading-relaxed bg-[#121212]">
                <div className="flex gap-2 items-end max-w-[88%] self-start">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[9px] shrink-0 border border-primary/20">🤖</div>
                  <div className="bg-[#181818] border border-white/5 text-slate-200 px-3 py-2 rounded-2xl rounded-bl-none shadow-sm">
                    👋 ¡Hola! Soy tu mentor de hábitos. ¿Cuál rutina quieres construir hoy: fitness, lectura o salud?
                  </div>
                </div>
                
                <div className="bg-primary text-white px-3 py-2 rounded-2xl rounded-br-none max-w-[75%] self-end shadow-sm">
                  🏋️ Desarrollar hábito de hacer ejercicio.
                </div>

                <div className="flex gap-2 items-end max-w-[90%] self-start">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[9px] shrink-0 border border-primary/20">🤖</div>
                  <div className="bg-[#181818] border border-white/5 text-slate-200 px-3 py-2 rounded-2xl rounded-bl-none shadow-sm space-y-0.5">
                    <div className="font-bold text-primary text-[8px] uppercase tracking-wider">✦ Consejo Atómico:</div>
                    <div className="italic text-[9px]">"Cuando me levante de la cama, haré 5 flexiones de pecho. Hazlo tan fácil que no puedas decir no."</div>
                  </div>
                </div>
              </div>

              {/* Input bar real */}
              <div className="px-3 py-2 border-t border-[#282828] bg-[#121212] flex gap-2 items-center shrink-0">
                <div className="flex-1 px-3 py-1.5 rounded-xl border border-white/10 bg-[#181818] text-[9px] text-slate-400">
                  Escribe tu mensaje...
                </div>
                <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center text-white cursor-pointer shadow-md shrink-0">
                  <IconSend size={11} />
                </div>
              </div>

              {/* Bottom Navigation */}
              <div className="border-t border-[#282828] bg-[#121212] flex shrink-0 overflow-x-auto">
                {[
                  { icon: IconCircleCheck, label: "Hoy", active: true },
                  { icon: IconRotate, label: "Hábitos", active: false },
                  { icon: IconTrendingUp, label: "Progreso", active: false },
                  { icon: IconRobot, label: "Mentor", active: false },
                ].map(({ icon: Icon, label, active }) => (
                  <div
                    key={label}
                    className={`flex-1 min-w-[44px] py-1.5 text-[7px] flex flex-col items-center gap-0.5 border-b-[1.5px] ${
                      active
                        ? "border-primary text-primary font-bold"
                        : "border-transparent text-slate-400"
                    }`}
                  >
                    <Icon size={11} stroke={active ? 2 : 1.5} />
                    <span className="font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CARACTERÍSTICAS CLAVE */}
      <section id="features" className="py-24 border-t border-[#282828] relative z-10 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-xs font-bold text-primary uppercase tracking-widest">Características Clave</h2>
            <p className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">
              Diseño de Comportamiento{" "}
              <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">Automatizado</span>
            </p>
            <p className="text-text-secondary max-w-xl mx-auto">
              No dependas de la motivación diaria. Diseña un sistema que haga que el éxito sea inevitable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Coach de IA */}
            <a href="#demo-coach" className="glass-card p-6 rounded-3xl text-left hover:border-primary/40 transition-all duration-300 group flex flex-col justify-between cursor-pointer no-underline">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <IconRobot size={24} />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-3">Mentor de IA 24/7</h3>
                <p className="text-text-secondary text-xs leading-relaxed">
                  Consulta de inmediato con un mentor virtual entrenado en psicología conductual, hábitos atómicos y optimización del rendimiento.
                </p>
              </div>
              <div className="pt-6 flex items-center gap-1.5 text-primary text-xs font-bold">
                Estructurar hábito <IconArrowRight size={12} />
              </div>
            </a>

            {/* Bucle de Hábito Atómico */}
            <a href="#demo-triangulo" className="glass-card p-6 rounded-3xl text-left hover:border-primary/40 transition-all duration-300 group flex flex-col justify-between cursor-pointer no-underline">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <IconRotate size={24} />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-3">Bucle Atómico Interactivo</h3>
                <p className="text-text-secondary text-xs leading-relaxed">
                  Alinea tu Señal (Cue), tu Hábito (Response) y tu Recompensa (Reward) en un generador asistido por IA para diseñar rutinas sin fricción.
                </p>
              </div>
              <div className="pt-6 flex items-center gap-1.5 text-primary text-xs font-bold">
                Crear bucle <IconArrowRight size={12} />
              </div>
            </a>

            {/* Heatmaps de Progreso */}
            <a href="#precios" className="glass-card p-6 rounded-3xl text-left hover:border-primary/40 transition-all duration-300 group flex flex-col justify-between cursor-pointer no-underline">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <IconTrendingUp size={24} />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-3">Mapas de Calor de Racha</h3>
                <p className="text-text-secondary text-xs leading-relaxed">
                  Visualiza tu consistencia diaria con un heatmap interactivo estilo GitHub. Mantén tu cadena visual de progreso para no romper la racha.
                </p>
              </div>
              <div className="pt-6 flex items-center gap-1.5 text-primary text-xs font-bold">
                Ver analíticas <IconArrowRight size={12} />
              </div>
            </a>

            {/* Regla de los 2 Minutos */}
            <a href="#demo-jackpot" className="glass-card p-6 rounded-3xl text-left hover:border-primary/40 transition-all duration-300 group flex flex-col justify-between cursor-pointer no-underline">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <IconHourglassLow size={24} />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-3">Reducción de Procrastinación</h3>
                <p className="text-text-secondary text-xs leading-relaxed">
                  Aplica herramientas de micro-pasos guiados y calculadoras de consistencia mental para derribar la resistencia cerebral de inicio.
                </p>
              </div>
              <div className="pt-6 flex items-center gap-1.5 text-primary text-xs font-bold">
                Calcular consistencia <IconArrowRight size={12} />
              </div>
            </a>

          </div>
        </div>
      </section>

      {/* SECCIÓN INTERMEZZO: LOS SISTEMAS VS LA VOLUNTAD */}
      <section className="py-24 border-t border-[#282828] relative z-10 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            
            {/* Columna Izquierda: Imagen */}
            <div className="md:col-span-6 flex justify-center">
              <div className="relative rounded-3xl overflow-hidden border border-border-primary dark:border-white/10 shadow-2xl group max-w-md w-full">
                <img 
                  src={APP_INTERACTION_IMAGE_URL} 
                  alt="Hacer flexiones, fitness y constancia" 
                  className="w-full h-[380px] object-cover transition-transform duration-700 group-hover:scale-103"
                />
                <div className="absolute inset-0 border border-white/10 rounded-3xl pointer-events-none"></div>
              </div>
            </div>

            {/* Columna Derecha: Copia de Valor */}
            <div className="md:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
                <IconBrain size={14} /> Psicología del Comportamiento
              </div>
              <h3 className="text-3xl font-black text-text-primary tracking-tight">
                No te elevas al nivel de tus metas. Caes al nivel de tus sistemas.
              </h3>
              <p className="text-text-secondary text-base leading-relaxed">
                Construir nuevos hábitos no es una cuestión de fuerza de voluntad, sino de diseño de entornos y detonantes. Al anclar tus nuevas acciones a disparadores existentes y registrar el cumplimiento, entrenas a tu cerebro para responder en piloto automático, limpiando el ruido mental y la procrastinación.
              </p>
              
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</div>
                  <div>
                    <h4 className="font-bold text-text-primary text-sm">Disparadores automáticos (Habit Stacking)</h4>
                    <p className="text-xs text-text-secondary">Estructura rutinas tipo: "Después de [Detonante actual], haré [Hábito nuevo]".</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</div>
                  <div>
                    <h4 className="font-bold text-text-primary text-sm">Regla de los 2 Minutos</h4>
                    <p className="text-xs text-text-secondary">El mentor te ayuda a encoger el hábito para asegurar que lo realices aun cuando no tengas motivación.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* DEMO INTERACTIVA */}
      <section id="demo" className="py-24 bg-bg-primary dark:bg-gradient-to-b dark:from-[#121212] dark:to-[#181818] relative z-10 transition-colors border-t border-[#282828] overflow-hidden">
        <EnergyParticles />
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[150px] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <p className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">Diseña tu consistencia en vivo</p>
            <p className="text-text-secondary">Prueba nuestras dos herramientas interactivas directamente desde esta página.</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* WIDGET 1: SIMULADOR INTERACTIVO DEL BUCLE DE HÁBITO */}
            <div id="demo-triangulo" className="lg:col-span-6 space-y-6">
              <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[430px]">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>
                
                <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <span className="text-primary">🔺</span> Crea tu Bucle de Hábito Atómico
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center flex-1">
                  
                  {/* Triángulo SVG */}
                  <div className="sm:col-span-5 flex justify-center">
                    <svg className="w-40 h-36 drop-shadow-[0_0_12px_rgba(29,185,84,0.25)] select-none" viewBox="0 0 200 170">
                      <defs>
                        <filter id="landing-glow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="4" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                        <linearGradient id="landing-loading-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#1DB954" />
                          <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                      </defs>

                      {landingGenerating && (
                        <motion.polygon 
                          points="100,25 35,145 165,145" 
                          fill="rgba(29,185,84,0.03)"
                          stroke="url(#landing-loading-grad)"
                          strokeWidth="3.5"
                          animate={{ 
                            strokeDashoffset: [0, 400],
                            opacity: [0.4, 0.9, 0.4]
                          }}
                          style={{ 
                            strokeDasharray: "10, 20", 
                            filter: "drop-shadow(0 0 6px rgba(29,185,84,0.6))" 
                          }}
                          transition={{ 
                            duration: 3, 
                            repeat: Infinity, 
                            ease: "linear" 
                          }}
                        />
                      )}

                      {/* Líneas del bucle */}
                      <line 
                        x1={100} y1={25} x2={35} y2={145} 
                        stroke={(!!landingDesire.trim() || landingStep >= 2) ? "#1DB954" : "rgba(255, 255, 255, 0.1)"}
                        strokeWidth="2.5"
                        style={{
                          filter: (!!landingDesire.trim() || landingStep >= 2) ? 'url(#landing-glow)' : 'none'
                        }}
                      />
                      <line 
                        x1={35} y1={145} x2={165} y2={145.1} 
                        stroke={(!!landingEmotion.trim() || landingStep >= 3) ? "#10b981" : "rgba(255, 255, 255, 0.1)"}
                        strokeWidth="2.5"
                        style={{
                          filter: (!!landingEmotion.trim() || landingStep >= 3) ? 'url(#landing-glow)' : 'none'
                        }}
                      />
                      <line 
                        x1={165} y1={145} x2={100} y2={25} 
                        stroke={(!!landingAction.trim() || landingStep >= 4) ? "#059669" : "rgba(255, 255, 255, 0.1)"}
                        strokeWidth="2.5"
                        style={{
                          filter: (!!landingAction.trim() || landingStep >= 4) ? 'url(#landing-glow)' : 'none'
                        }}
                      />

                      {/* Vértice 1: Señal */}
                      <circle 
                        cx={100} cy={25} r={9} 
                        className={
                          landingStep === 1 ? "fill-emerald-500 stroke-emerald-300 stroke-[2px] animate-pulse" : 
                          landingDesire.trim() ? "fill-emerald-500 stroke-emerald-400 stroke-1" : "fill-white/10 stroke-white/20"
                        }
                        style={landingStep >= 1 || landingDesire.trim() ? { filter: 'url(#landing-glow)' } : {}}
                      />

                      {/* Vértice 2: Hábito */}
                      <circle 
                        cx={35} cy={145} r={9} 
                        className={
                          landingStep === 2 ? "fill-primary stroke-[#1ed760] stroke-[2px] animate-pulse" : 
                          landingEmotion.trim() ? "fill-primary stroke-emerald-400 stroke-1" : "fill-white/10 stroke-white/20"
                        }
                        style={landingStep >= 2 || landingEmotion.trim() ? { filter: 'url(#landing-glow)' } : {}}
                      />

                      {/* Vértice 3: Recompensa */}
                      <circle 
                        cx={165} cy={145} r={9} 
                        className={
                          landingStep === 3 ? "fill-teal-500 stroke-teal-300 stroke-[2px] animate-pulse" : 
                          landingAction.trim() ? "fill-teal-500 stroke-teal-450 stroke-1" : "fill-white/10 stroke-white/20"
                        }
                        style={landingStep >= 3 || landingAction.trim() ? { filter: 'url(#landing-glow)' } : {}}
                      />
                    </svg>
                  </div>

                  {/* Formulario del bucle */}
                  <div className="sm:col-span-7 flex flex-col justify-center min-h-[220px]">
                    <AnimatePresence mode="wait">
                      {/* PASO 1: SEÑAL */}
                      {landingStep === 1 && (
                        <motion.div
                          key="l-step1"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="space-y-3"
                        >
                          <div>
                            <span className="text-[9px] font-black text-primary uppercase tracking-widest block mb-1">Paso 1: Detonante (Señal)</span>
                            <h4 className="text-xs font-bold text-text-primary dark:text-white">¿Cuál será tu disparador o señal física?</h4>
                          </div>
                          <textarea
                            value={landingDesire}
                            onChange={(e) => setLandingDesire(e.target.value)}
                            placeholder="Ej. Servirme mi café de la mañana, ponerme las zapatillas, cerrar la laptop..."
                            className="w-full bg-bg-secondary dark:bg-[#282828] border border-border-primary dark:border-white/10 rounded-xl p-3 text-xs text-text-primary dark:text-white outline-none focus:border-primary transition-colors h-16 resize-none leading-relaxed"
                          />
                          <button
                            disabled={!landingDesire.trim()}
                            onClick={() => setLandingStep(2)}
                            className="w-full py-2 bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all disabled:opacity-50"
                          >
                            Definir Hábito
                          </button>
                        </motion.div>
                      )}

                      {/* PASO 2: HÁBITO */}
                      {landingStep === 2 && (
                        <motion.div
                          key="l-step2"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="space-y-3"
                        >
                          <div>
                            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block mb-0.5">Paso 2: Hábito (Respuesta)</span>
                            <h4 className="text-xs font-bold text-text-primary dark:text-white">¿Qué acción atómica realizarás?</h4>
                          </div>
                          <textarea
                            value={landingEmotion}
                            onChange={(e) => setLandingEmotion(e.target.value)}
                            placeholder="Ej. Hacer 10 flexiones, leer 2 páginas de mi libro, beber un vaso de agua..."
                            className="w-full bg-bg-secondary dark:bg-[#282828] border border-border-primary dark:border-white/10 rounded-xl p-3 text-xs text-text-primary dark:text-white outline-none focus:border-primary transition-colors h-14 resize-none leading-relaxed"
                          />
                          <div className="flex flex-wrap gap-1.5 justify-center">
                            {['Flexiones 🏋️', 'Leer 📚', 'Meditar 🧘', 'Agua 💧'].map((chip) => (
                              <button
                                key={chip}
                                type="button"
                                onClick={() => {
                                  const clean = chip.split(' ')[0];
                                  if (!landingEmotion.trim()) {
                                    setLandingEmotion(clean);
                                  } else {
                                    setLandingEmotion(prev => prev.includes(clean) ? prev : `${prev}, ${clean}`);
                                  }
                                }}
                                className="px-2 py-1 rounded-full bg-white/5 hover:bg-primary/10 border border-white/10 text-[10px] text-text-secondary hover:text-primary transition-all"
                              >
                                {chip}
                              </button>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setLandingStep(1)}
                              className="flex-1 py-2 bg-white/5 border border-white/10 text-text-primary dark:text-slate-200 text-xs font-bold uppercase rounded-xl hover:bg-white/10"
                            >
                              Atrás
                            </button>
                            <button
                              disabled={!landingEmotion.trim()}
                              onClick={() => setLandingStep(3)}
                              className="flex-1 py-2 bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all disabled:opacity-50"
                            >
                              Definir Recompensa
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* PASO 3: RECOMPENSA */}
                      {landingStep === 3 && (
                        <motion.div
                          key="l-step3"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="space-y-3"
                        >
                          <div>
                            <span className="text-[9px] font-black text-teal-400 uppercase tracking-widest block mb-0.5">Paso 3: Recompensa</span>
                            <h4 className="text-xs font-bold text-text-primary dark:text-white">¿Cómo te recompensarás al instante?</h4>
                          </div>
                          <textarea
                            value={landingAction}
                            onChange={(e) => setLandingAction(e.target.value)}
                            placeholder="Ej. Tomar mi primer sorbo de café, marcarlo en la app, escuchar mi canción favorita..."
                            className="w-full bg-bg-secondary dark:bg-[#282828] border border-border-primary dark:border-white/10 rounded-xl p-3 text-xs text-text-primary dark:text-white outline-none focus:border-primary transition-colors h-16 resize-none leading-relaxed"
                          />
                          <div className="flex gap-2">
                            <button
                              disabled={landingGenerating}
                              onClick={() => setLandingStep(2)}
                              className="flex-1 py-2 bg-white/5 border border-white/10 text-text-primary dark:text-slate-200 text-xs font-bold uppercase rounded-xl hover:bg-white/10"
                            >
                              Atrás
                            </button>
                            <button
                              disabled={!landingAction.trim() || landingGenerating}
                              onClick={handleActivateLandingTriangle}
                              className="flex-1 py-2 bg-gradient-to-r from-primary to-emerald-600 hover:opacity-90 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-1 shadow-md"
                            >
                              {landingGenerating ? (
                                <IconLoader2 size={12} className="animate-spin" />
                              ) : (
                                <>Generar Bucle ⚡</>
                              )}
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* PASO 4: RESULTADO CONTRATO HÁBITO */}
                      {landingStep === 4 && (
                        <motion.div
                          key="l-step4"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="space-y-3.5"
                        >
                          <div className="text-center">
                            <span className="text-xs text-primary font-bold">✓ Contrato Generado con Éxito</span>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-[11px] font-bold text-primary italic leading-normal text-left mt-1.5 relative shadow-inner">
                              {landingAffirmation}
                            </div>
                          </div>

                          <div className="bg-primary/5 border border-primary/10 p-2.5 rounded-xl text-left flex items-start gap-2 shadow-inner">
                            <span className="text-lg text-primary">🎯</span>
                            <div>
                              <span className="text-[8px] font-black text-primary uppercase tracking-widest block leading-tight">Implementación de Intenciones</span>
                              <h5 className="text-[10px] font-bold text-text-primary dark:text-white leading-snug">
                                Fórmula: "Cuando ocurra [Señal], haré [Respuesta]."
                              </h5>
                              <p className="text-[8.5px] text-text-secondary/80 leading-normal">
                                En la App real, este bucle se vincula con notificaciones automáticas y analíticas de racha para mantener tu disciplina al 100%.
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(landingAffirmation);
                                setLandingCopied(true);
                                  setTimeout(() => setLandingCopied(false), 2000);
                              }}
                              className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-bold uppercase rounded-xl text-text-primary dark:text-slate-200"
                            >
                              {landingCopied ? "✓ Copiado" : "Copiar Fórmula"}
                            </button>
                            <Link
                              href="/app"
                              className="flex-1 py-2 bg-primary hover:bg-primary-dark text-[10px] font-bold uppercase rounded-xl text-white text-center flex items-center justify-center gap-1 shadow-md"
                            >
                              Registrar Gratis 🚀
                            </Link>
                          </div>
                          
                          <button
                            onClick={() => {
                              setLandingStep(1);
                              setLandingDesire("");
                              setLandingEmotion("");
                              setLandingAction("");
                              setLandingAffirmation("");
                            }}
                            className="w-full text-center text-[9px] font-bold text-text-secondary hover:text-text-primary underline cursor-pointer"
                          >
                            Crear otra rutina
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>

              </div>
            </div>
            
            {/* WIDGET 2: CHAT CON EL MENTOR SIMULADO */}
            <div id="demo-coach" className="lg:col-span-6 space-y-6">
              <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6 shadow-xl relative flex flex-col h-[415px]">
                <h3 className="text-lg font-bold text-text-primary flex items-center gap-2 shrink-0">
                  <span className="text-primary">🤖</span> Mentor de Hábitos
                </h3>

                {/* Area del Chat */}
                <div className="flex-1 bg-bg-secondary dark:bg-[#181818] border border-border-primary dark:border-white/5 rounded-2xl p-4 overflow-y-auto space-y-3 flex flex-col no-scrollbar shadow-inner">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === "ai"
                          ? "bg-bg-primary dark:bg-[#282828] border border-border-primary dark:border-white/5 text-text-primary dark:text-slate-200 rounded-bl-none self-start shadow-sm"
                          : "bg-primary text-white rounded-br-none self-end"
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))}
                  {isTyping && (
                    <div className="bg-bg-primary dark:bg-[#282828] border border-border-primary dark:border-white/5 px-3.5 py-2.5 rounded-2xl rounded-bl-none self-start flex gap-1 items-center shadow-sm">
                      <div className="w-1.5 h-1.5 bg-text-secondary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 bg-text-secondary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-1.5 h-1.5 bg-text-secondary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  )}
                </div>

                {/* Opciones Preestablecidas */}
                <div className="space-y-2 shrink-0">
                  <div className="text-[10px] text-text-secondary dark:text-slate-500 font-bold tracking-wider uppercase mb-1">
                    Pregúntale al Mentor:
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleChatOption(
                        "🏋️ ¿Cómo empiezo a hacer ejercicio si no tengo tiempo?",
                        "Comencemos aplicando la Regla de los 2 Minutos. No intentes ir 1 hora al gimnasio hoy. Comprométete a hacer solo 5 flexiones justo después de levantarte. La clave es construir la identidad antes de optimizar la rutina."
                      )}
                      disabled={isTyping}
                      className="w-full text-left py-2 px-3 bg-bg-primary dark:bg-[#282828] hover:bg-bg-secondary dark:hover:bg-[#3e3e3e] rounded-xl text-xs text-text-primary dark:text-slate-300 border border-border-primary dark:border-white/5 transition-all disabled:opacity-50 shadow-sm"
                    >
                      🏋️ ¿Cómo empiezo a hacer ejercicio si no tengo tiempo?
                    </button>
                    <button
                      onClick={() => handleChatOption(
                        "📚 Procrastino mucho al momento de leer, ¿qué hago?",
                        "Prueba el Anclaje de Hábitos. Identifica una señal que ya ocurra todos los días (como tomar tu café de la mañana). Ancla la lectura a ella: 'Tan pronto como tenga mi café, leeré 1 página'. La señal guiará la acción."
                      )}
                      disabled={isTyping}
                      className="w-full text-left py-2 px-3 bg-bg-primary dark:bg-[#282828] hover:bg-bg-secondary dark:hover:bg-[#3e3e3e] rounded-xl text-xs text-text-primary dark:text-slate-300 border border-border-primary dark:border-white/5 transition-all disabled:opacity-50 shadow-sm"
                    >
                      📚 Procrastino mucho al momento de leer, ¿qué hago?
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* WIDGET 3: PREVIO DEL CALCULADOR DE CONSISTENCIA */}
          <div id="demo-jackpot" className="mt-12 text-center">
            <div className="glass-card rounded-3xl p-8 max-w-4xl mx-auto relative overflow-hidden">
              <div className="grid md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-7 text-left space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
                    <IconTrendingUp size={14} /> Tasa de Retención Neural
                  </div>
                  <h3 className="text-2xl font-bold text-text-primary">El Calculador de Automatización</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    Según los estudios de comportamiento, un hábito tarda en promedio entre 21 y 66 días en volverse automático. Introduce tus días proyectados y calcula la probabilidad estadística de que tu rutina pase al piloto automático.
                  </p>
                  
                  <div className="flex gap-2 max-w-xs pt-2">
                    <input 
                      type="text" 
                      value={jackpotAmount}
                      onChange={(e) => {
                        const clean = e.target.value.replace(/\D/g, "");
                        setJackpotAmount(clean ? clean : "");
                      }}
                      placeholder="30"
                      className="px-4 py-2.5 bg-bg-secondary dark:bg-[#282828] border border-border-secondary dark:border-white/10 rounded-xl text-sm font-bold text-text-primary dark:text-white text-center focus:border-primary focus:outline-none w-32"
                    />
                    <button
                      onClick={startJackpotSimulation}
                      className="px-4 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1 shadow-md"
                    >
                      Calcular Racha <IconPlayerPlayFilled size={10} />
                    </button>
                  </div>
                </div>

                <div className="md:col-span-5 relative flex justify-center">
                  <div className="relative w-64 h-80 rounded-3xl overflow-hidden border border-border-primary dark:border-white/10 shadow-xl group">
                    <img 
                      src={SUCCESS_GRATITUDE_IMAGE_URL} 
                      alt="Persona enfocada y saludable" 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
                    
                    <div className="absolute bottom-0 inset-x-0 p-5 text-center flex flex-col items-center justify-end h-full">
                      <div className="w-10 h-10 bg-primary/20 border border-primary/45 rounded-full flex items-center justify-center mb-2 animate-bounce">
                        <IconFlame size={20} className="text-primary" />
                      </div>
                      <div className="text-[10px] text-primary font-bold uppercase tracking-widest">Días Propuestos</div>
                      <div className="text-2xl font-black text-white mt-1">
                        {parseInt(jackpotAmount || "30")} días
                      </div>
                      <p className="text-[10px] text-slate-300 mt-1 max-w-[200px]">La constancia diaria reconfigura las conexiones neuronales.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="how-it-works" className="py-24 border-t border-[#282828] relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          
          <div className="max-w-2xl mx-auto space-y-4 mb-20">
            <h2 className="text-xs font-bold text-primary uppercase tracking-widest">Método Atómico</h2>
            <p className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">Tu Ruta en 3 Pasos</p>
            <p className="text-text-secondary">Diseñado para simplificar tu disciplina y maximizar tu constancia a largo plazo.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 text-left relative">
            <div className="hidden md:block absolute top-16 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-primary/20 to-[#10b981]/20 z-0"></div>
            
            {/* Paso 1 */}
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-full bg-bg-primary dark:bg-[#181818] border border-primary text-primary dark:text-white flex items-center justify-center font-bold text-lg shadow-md">
                1
              </div>
              <h3 className="text-lg font-bold text-text-primary">Estructura tu Rutina</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Plantea tus hábitos y anclajes con disparadores específicos. Reducir la toma de decisiones inicial erradica la procrastinación.
              </p>
            </div>

            {/* Paso 2 */}
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-full bg-bg-primary dark:bg-[#181818] border border-primary text-primary dark:text-white flex items-center justify-center font-bold text-lg shadow-md">
                2
              </div>
              <h3 className="text-lg font-bold text-text-primary">Optimiza con el Mentor de IA</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Habla con el coach cognitivo para diagnosticar bloqueos, simplificar hábitos usando reglas de tiempo y reanudar rachas interrumpidas.
              </p>
            </div>

            {/* Paso 3 */}
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-full bg-bg-primary dark:bg-[#181818] border border-primary text-primary dark:text-white flex items-center justify-center font-bold text-lg shadow-md">
                3
              </div>
              <h3 className="text-lg font-bold text-text-primary">Tacha y Acumula Racha</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Registra tu cumplimiento diario con un solo toque y observa tu progreso en mapas de calor mensuales. El interés compuesto hará el resto.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ===== TESTIMONIOS ===== */}
      <section id="testimonios" className="py-24 border-t border-[#282828] relative z-10 overflow-hidden transition-colors">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-emerald-500/5 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-xs font-bold text-primary uppercase tracking-widest">Historias de Consistencia</h2>
            <p className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">
              Sistemas que están{" "}
              <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">transformando vidas</span>
            </p>
            <p className="text-text-secondary max-w-xl mx-auto">
              Más de 2,000 personas ya están usando Hábitos IA para diseñar rutinas consistentes y mantener su enfoque.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Valeria M.", location: "Ciudad de México", avatar: "🏋️", text: "Hacer ejercicio diario se sentía imposible por mi horario. Con la regla de los 2 minutos del Mentor de IA, empecé haciendo 5 flexiones. Hoy entreno 4 veces por semana.", tag: "Fitness y Fuerza" },
              { name: "Daniela R.", location: "Bogotá, Colombia", avatar: "📚", text: "El tracker visual y el heatmap me ayudaron a ver mi constancia en la lectura. Llevo una racha de 45 días consecutivos y ya leí 3 libros completos.", tag: "Hábito de Lectura" },
              { name: "Sofía L.", location: "Buenos Aires, Argentina", avatar: "🧘", text: "Procrastinaba meditar porque no tenía una señal clara. Anclarlo al momento justo después de servir mi café de la mañana lo resolvió todo de forma natural.", tag: "Rutina Matutina" },
              { name: "Carlos T.", location: "Lima, Perú", avatar: "💧", text: "Tener el mentor de hábitos disponible a cualquier hora me ayudó a reestructurar mi alimentación. Cuando quiero tirar la toalla, me da soluciones atómicas.", tag: "Nutrición y Salud" },
              { name: "Andrea P.", location: "Santiago, Chile", avatar: "💻", text: "Llevo 4 semanas organizando mis 3 prioridades diarias antes de abrir Slack o correos. Mi productividad y enfoque en el trabajo se duplicaron.", tag: "Foco Profesional" },
              { name: "Alejandro F.", location: "Medellín, Colombia", avatar: "⚡", text: "La interfaz minimalista negra tipo Spotify es espectacular. Te hace dar ganas de entrar a registrar tus hábitos en vez de distraerte en redes sociales.", tag: "Consistencia Diaria" },
            ].map(({ name, location, avatar, text, tag }) => (
              <div key={name} className="glass-card p-7 rounded-3xl flex flex-col gap-4 hover:border-primary/35 hover:-translate-y-1 transition-all duration-300">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-primary text-sm">★</span>
                  ))}
                </div>
                <p className="text-text-secondary dark:text-slate-300 text-sm leading-relaxed flex-1 italic">&ldquo;{text}&rdquo;</p>
                <span className="self-start px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-[11px] font-semibold">✦ {tag}</span>
                <div className="flex items-center gap-3 pt-1 border-t border-border-primary dark:border-white/5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-emerald-500/20 flex items-center justify-center text-lg shrink-0">{avatar}</div>
                  <div>
                    <p className="text-sm font-bold text-text-primary dark:text-white">{name}</p>
                    <p className="text-[11px] text-text-secondary">{location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRECIOS ===== */}
      <section id="precios" className="py-24 border-t border-[#282828] bg-bg-primary/50 dark:bg-slate-950/30 relative z-10 transition-colors">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-xs font-bold text-primary uppercase tracking-widest">Planes</h2>
            <p className="text-3xl sm:text-4xl font-black text-text-primary dark:text-white tracking-tight">Diseña tu rutina hoy.</p>
            <p className="text-text-secondary max-w-xl mx-auto">Comienza sin costo. Cuando estés listo para acelerar tu consistencia, el plan Pro te espera.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Plan Gratuito */}
            <div className="glass-card p-8 rounded-3xl flex flex-col gap-6">
              <div>
                <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Gratis para siempre</p>
                <p className="text-4xl font-black text-text-primary dark:text-white">$0</p>
                <p className="text-text-secondary text-sm mt-1">Sin tarjeta de crédito</p>
              </div>
              <ul className="space-y-3 flex-1">
                {["Mentor IA — 3 mensajes/día", "Seguimiento de hasta 2 hábitos activos", "Registro de estados de ánimo y notas de racha", "Heatmap mensual interactivo (30 días)", "Métricas de racha récord y racha actual"].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-text-secondary">
                    <span className="text-primary mt-0.5 shrink-0">✓</span>{item}
                  </li>
                ))}
              </ul>
              <Link href="/app" className="w-full py-3.5 rounded-xl border-2 border-primary/40 text-primary font-bold text-center hover:bg-primary/5 transition-all">
                Empezar Gratis
              </Link>
            </div>

            {/* Plan Pro */}
            <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-br from-primary to-emerald-500 shadow-2xl shadow-primary/20">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-primary to-emerald-500 text-white text-[11px] font-bold uppercase tracking-wider shadow-lg whitespace-nowrap">
                ✦ Recomendado
              </div>
              <div className="bg-bg-primary dark:bg-[#121212] rounded-[calc(1.5rem-1.5px)] p-8 flex flex-col gap-6 h-full">
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Pro — Consistencia Total</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-black text-text-primary dark:text-white">$5.99</p>
                    <p className="text-text-secondary text-sm">/ mes</p>
                  </div>
                  <p className="text-text-secondary text-sm mt-1">O $47.99/año — ahorra 33%</p>
                </div>
                <ul className="space-y-3 flex-1">
                  {["Mentor IA — mensajes ilimitados ∞", "Hábitos activos ilimitados ∞", "Retos de disciplina personalizados con IA", "Historial completo de cumplimiento", "Exportación de registros y notas de hábito", "Recordatorios inteligentes integrados", "Calculadora avanzada de consistencia", "Gestión de facturación con Stripe"].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-text-secondary dark:text-slate-300">
                      <span className="text-primary mt-0.5 shrink-0">✓</span>{item}
                    </li>
                  ))}
                </ul>
                <Link href="/app" className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-center transition-all shadow-lg shadow-primary/20">
                  Empezar Pro — 7 días gratis
                </Link>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-text-secondary mt-10">
            🔒 Garantía de satisfacción de 7 días. Cancela cuando quieras en un clic.
          </p>
        </div>
      </section>

      {/* PREGUNTAS FRECUENTES (FAQs) */}
      <section id="faqs" className="py-24 bg-[#181818]/40 border-t border-[#282828] relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-xs font-bold text-primary uppercase tracking-widest">Preguntas Frecuentes</h2>
            <p className="text-3xl font-black text-text-primary tracking-tight">Resuelve tus dudas</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="glass-card rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 flex justify-between items-center text-left text-text-primary hover:bg-primary/5 transition-colors"
                >
                  <span className="font-bold text-sm sm:text-base">{faq.question}</span>
                  <motion.span
                    animate={{ rotate: openFaq === idx ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-text-secondary shrink-0"
                  >
                    <IconChevronDown size={20} />
                  </motion.span>
                </button>
                
                <AnimatePresence initial={false}>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-text-secondary leading-relaxed border-t border-[#282828] bg-bg-primary/20 dark:bg-white/5">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-[#282828] text-center text-xs text-text-secondary">
        <div className="max-w-7xl mx-auto px-6 space-y-6">
          <div className="flex justify-center items-center gap-2 font-bold text-text-primary text-sm">
            <span className="text-primary text-lg">⚡</span> HÁBITOS IA
          </div>
          <p>© {new Date().getFullYear()} Hábitos IA. Todos los derechos reservados.</p>
          <div className="flex justify-center gap-6">
            <a href="#" className="hover:text-primary transition-colors">Términos de Servicio</a>
            <a href="#" className="hover:text-primary transition-colors">Política de Privacidad</a>
            <a href="#" className="hover:text-primary transition-colors">Soporte</a>
          </div>
        </div>
      </footer>

      {/* AVISO DE COOKIES */}
      <AnimatePresence>
        {showCookieBanner && (
          <motion.div 
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md p-5 rounded-3xl glass-card border border-white/10 dark:border-white/5 shadow-2xl z-[90] flex flex-col sm:flex-row items-center gap-4 text-left"
          >
            <div className="flex-1 space-y-1">
              <h4 className="text-xs font-bold text-text-primary dark:text-white">🍪 Preferencias de Cookies</h4>
              <p className="text-[10px] text-text-secondary leading-relaxed">
                Utilizamos cookies propias y de terceros para optimizar tu experiencia y analizar el rendimiento de nuestro simulador y mentor conductual.
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => setShowCookieBanner(false)}
                className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-bold text-text-secondary transition-colors uppercase tracking-wider cursor-pointer"
              >
                Rechazar
              </button>
              <button
                onClick={handleAcceptCookies}
                className="px-4 py-1.5 rounded-lg bg-primary hover:opacity-90 text-[10px] font-bold text-white transition-all uppercase tracking-wider shadow-md cursor-pointer"
              >
                Aceptar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SIMULADOR DE AUTOMATIZACIÓN DE RACHA GLOBAL (ANTERIOR JACKPOT) */}
      <AnimatePresence>
        {showJackpot && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#121212]/98 backdrop-blur-md z-[100] flex flex-col items-center justify-center"
          >
            {/* Estallido central */}
            <motion.div
              initial={{ scale: 0.2, opacity: 1 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute w-40 h-40 rounded-full bg-primary blur-xl"
            />

            {/* Partículas Cayendo */}
            {[...Array(15)].map((_, idx) => (
              <motion.div
                key={idx}
                initial={{ y: -80, x: Math.random() * 400 - 200, opacity: 0 }}
                animate={{ y: 250, x: (Math.random() * 400 - 200), opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.5 + Math.random() * 1.5, ease: "linear", repeat: Infinity }}
                className="absolute text-primary text-lg"
              >
                ✓
              </motion.div>
            ))}

            <div className="relative text-center space-y-4 px-4">
              <div className="w-14 h-14 bg-primary/20 border border-primary/50 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(29,185,84,0.3)] animate-bounce">
                <IconCheck size={28} className="text-primary" />
              </div>
              <h4 className="text-primary text-sm font-bold tracking-widest uppercase">Consistencia de Racha Analizada</h4>
              <div className="text-5xl font-black text-white">
                {displayJackpotAmount}<span className="text-primary">%</span>
              </div>
              <p className="text-slate-300 text-xs max-w-sm mx-auto leading-relaxed">
                ¡Análisis de racha de {jackpotAmount} días completo! Hay un {displayJackpotAmount}% de probabilidad de que esta rutina esté completamente automatizada en tu cerebro y requiera un {100 - displayJackpotAmount}% menos de esfuerzo diario.
              </p>
              <button
                onClick={() => setShowJackpot(false)}
                className="px-5 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-full text-xs uppercase font-bold tracking-wider transition-colors"
              >
                Cerrar Simulación
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
