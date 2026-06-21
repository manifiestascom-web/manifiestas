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
  IconLoader2
} from "@tabler/icons-react";
import EnergyParticles from "@/components/layout/EnergyParticles";

const SUCCESS_GRATITUDE_IMAGE_URL = "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1000";

// Lista de afirmaciones por categoría para el widget interactivo
const affirmationsByCategory: Record<string, string[]> = {
  dinero: [
    "El dinero fluye hacia mí de múltiples fuentes de forma constante.",
    "Merezco la abundancia y la recibo con el corazón abierto.",
    "Soy un imán potente para la prosperidad y la riqueza financiera.",
    "Cada centavo que gasto regresa a mí multiplicado por diez."
  ],
  amor: [
    "Atraigo un amor sano, recíproco y profundamente alineado conmigo.",
    "Mi corazón está abierto para dar y recibir amor verdadero.",
    "Me amo incondicionalmente y proyecto esa vibración al universo.",
    "La persona ideal para mí está de camino a mi vida en este instante."
  ],
  exito: [
    "Soy capaz de lograr cualquier meta cuántica que me proponga.",
    "Mis ideas tienen un valor inmenso y el mundo está listo para recibirlas.",
    "El éxito es mi estado natural y lo abrazo con gratitud.",
    "Tengo la disciplina, la fuerza y la sabiduría para triunfar."
  ],
  confianza: [
    "Confío en mi intuición y actúo con seguridad en mí mismo.",
    "Soy valioso, inteligente y suficiente tal y como soy hoy.",
    "Suelto el miedo al juicio y brillo con mi propia luz.",
    "Tengo el control de mi energía y elijo vibrar en abundancia."
  ]
};

// FAQ data
const faqs = [
  {
    question: "¿Qué es Manifiestas?",
    answer: "Manifiestas es un coach interactivo que combina psicología cognitiva, neurociencia y el arte de la manifestación para ayudarte a reprogramar tu subconsciente. Ofrece diálogos con inteligencia artificial, generación de afirmaciones personalizadas, tableros de visualización y herramientas interactivas."
  },
  {
    question: "¿Cómo funciona el Coach de Manifestación?",
    answer: "Nuestro coach basado en inteligencia artificial te escucha de manera empática y sin juzgarte. Te ayuda a detectar creencias limitantes sobre el dinero, el amor o la salud, y te guía en la creación de planes de manifestación y reprogramación a 30 días."
  },
  {
    question: "¿Qué es el 'Spiritual Jackpot' o Estallido de Abundancia?",
    answer: "Es un estímulo visual y mental interactivo diseñado para liberar dopamina en el cerebro cuando visualizas una meta financiera. El cerebro aprende mediante la emoción y la repetición; este estallido simula visualmente la consecución de tus metas monetarias para consolidar tu fe y alineación."
  },
  {
    question: "¿Es gratis utilizar la aplicación?",
    answer: "Sí. El plan gratuito incluye 3 mensajes diarios con el coach IA, 1 entrada de gratitud al día, 1 triángulo de manifestación al día, visualizaciones guiadas y 1 meta activa. Los límites se resetean cada día. El plan Pro ($5.99/mes) elimina todos los límites y desbloquea los retos de 30 días con IA."
  }
];

// Componente para Notas Adhesivas / Post-its
function StickyNote({ text, bg, rotate, className = "" }: { text: string; bg: string; rotate: string; className?: string }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`p-3 shadow-md border border-black/5 text-center flex items-center justify-center font-bold font-serif text-[11px] sm:text-xs text-[#1a1625] rounded-md ${bg} ${rotate} ${className} w-20 h-20 sm:w-24 sm:h-24`}
      style={{ transformOrigin: "center", whiteSpace: "pre-line" }}
    >
      {text}
    </motion.div>
  );
}

export default function LandingPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Leer tema inicial
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

  // Estados para el widget de Afirmaciones
  const [selectedCategory, setSelectedCategory] = useState("dinero");
  const [currentAffirmation, setCurrentAffirmation] = useState(
    "El dinero fluye hacia mí de múltiples fuentes de forma constante."
  );
  const [copied, setCopied] = useState(false);

  // Estados para el simulador de Chat
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "ai" | "user"; text: string }>>([
    { sender: "ai", text: "👋 ¡Hola! Soy tu mentor de manifestación. ¿Qué aspecto de tu vida deseas transformar hoy? (💰 Dinero, 💗 Amor o 🚀 Éxito)" }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Estados para el simulador del Jackpot
  const [showJackpot, setShowJackpot] = useState(false);
  const [jackpotAmount, setJackpotAmount] = useState("10.000");
  const [displayJackpotAmount, setDisplayJackpotAmount] = useState(0);

  // Estados de FAQs
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Estados del Triángulo de Manifestación Interactivo de la Landing
  const [landingStep, setLandingStep] = useState(1);
  const [landingDesire, setLandingDesire] = useState("");
  const [landingEmotion, setLandingEmotion] = useState("");
  const [landingAction, setLandingAction] = useState("");
  const [landingGenerating, setLandingGenerating] = useState(false);
  const [landingAffirmation, setLandingAffirmation] = useState("");
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
      const templates = [
        `Decreto con convicción absoluta que estoy manifestando "${landingDesire}" sintiendo una profunda vibración de "${landingEmotion}". Hoy tomo la acción inspirada de "${landingAction}", sabiendo que el universo me respalda.`,
        `Yo elijo conscientemente experimentar "${landingDesire}" a través del sentimiento puro de "${landingEmotion}". Hoy realizo mi paso físico de "${landingAction}" y abro mi realidad al éxito.`,
        `Agradezco la llegada de "${landingDesire}" en mi vida física. Me inundo de la vibración de "${landingEmotion}" y hoy doy el paso alineado de "${landingAction}". Hecho está.`
      ];
      const randomIndex = Math.floor(Math.random() * templates.length);
      setLandingAffirmation(templates[randomIndex]);
      setLandingGenerating(false);
      setLandingStep(4);
    }, 2000); // 2 segundos de animación láser
  };

  const handleGenerateAffirmation = (category: string) => {
    setSelectedCategory(category);
    const list = affirmationsByCategory[category];
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
    const target = parseInt(jackpotAmount.replace(/[,.]/g, ""), 10) || 10000;
    let current = 0;
    const step = Math.ceil(target / 40);

    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        setDisplayJackpotAmount(target);
        clearInterval(interval);
      } else {
        setDisplayJackpotAmount(current);
      }
    }, 40);
  };

  return (
    <div className="bg-gradient-to-tr from-[#FFFDF9] via-[#F8F6FC] to-[#EBF3FC] dark:from-[#090518] dark:via-[#0c0721] dark:to-[#080312] text-text-primary min-h-screen font-sans overflow-x-hidden transition-colors duration-300 selection:bg-accent-purple/30 selection:text-accent-gold">

      {/* GLOW DECORATIVOS DE FONDO */}
      <div className="absolute top-0 left-1/4 w-[40vw] h-[40vw] bg-accent-purple/5 dark:bg-accent-purple/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-1/3 right-1/4 w-[35vw] h-[35vw] bg-primary/5 dark:bg-primary/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 left-1/3 w-[30vw] h-[30vw] bg-accent-gold/3 dark:bg-accent-gold/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* HEADER DE NAVEGACIÓN */}
      <header className="sticky top-0 z-50 bg-white/60 dark:bg-black/45 border-b border-border-primary/50 dark:border-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logosuperior.webp" alt="Manifiestas Logo" className="h-8 sm:h-9 object-contain" />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#1a1625]/85 dark:text-white/80">
            <a href="#how-it-works" className="hover:text-primary dark:hover:text-accent-gold transition-colors">Cómo funciona</a>
            <a href="#features" className="hover:text-primary dark:hover:text-accent-gold transition-colors">Beneficios</a>
            <a href="#testimonios" className="hover:text-primary dark:hover:text-accent-gold transition-colors">Testimonios</a>
            <a href="#precios" className="hover:text-primary dark:hover:text-accent-gold transition-colors">Precios</a>
            <a href="#faqs" className="hover:text-primary dark:hover:text-accent-gold transition-colors">Blog</a>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-white/20 dark:bg-white/5 border border-border-primary hover:border-primary/30 dark:border-white/10 dark:hover:border-white/20 transition-all text-text-secondary hover:text-text-primary"
              aria-label="Cambiar tema"
            >
              {theme === "dark" ? <IconSun size={18} className="text-accent-gold" /> : <IconMoon size={18} className="text-primary" />}
            </button>

            <Link
              href="/app"
              className="px-5 py-2.5 rounded-full bg-[#534AB7] hover:bg-[#3C3489] text-white font-bold text-sm transition-all duration-300 shadow-md shadow-[#534AB7]/15 hover:scale-[1.02]"
            >
              Comenzar gratis
            </Link>
          </div>
        </div>
      </header>

      {/* CINTA DE ABUNDANCIA COLECTIVA */}
      <div className="relative w-full overflow-hidden bg-gradient-to-r from-slate-950 via-[#100926] to-slate-950 border-b border-yellow-500/20 py-2.5 z-40 select-none">
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
        <div className="animate-marquee-custom flex gap-8 whitespace-nowrap text-[10px] sm:text-xs font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-250 to-yellow-400 uppercase">
          <span>💰 TOTAL MANIFESTADO HOY: $1,854,230 USD • 📈 342 DEUDAS SALDADAS • 🕊️ 897 MENTES EN SINTONÍA ALTA • 🔮 COEFICIENTE DE PROSPERIDAD: 99.4% • 💸 FLUJO DE ABUNDANCIA ACTIVADO • 🌟</span>
          <span>💰 TOTAL MANIFESTADO HOY: $1,854,230 USD • 📈 342 DEUDAS SALDADAS • 🕊️ 897 MENTES EN SINTONÍA ALTA • 🔮 COEFICIENTE DE PROSPERIDAD: 99.4% • 💸 FLUJO DE ABUNDANCIA ACTIVADO • 🌟</span>
        </div>
      </div>

      {/* HERO SECTION DE TRES COLUMNAS (ALTA FIDELIDAD) */}
      <section className="relative max-w-7xl mx-auto px-6 pt-12 pb-20 md:pt-20 md:pb-28 z-10">
        <EnergyParticles />
        <div className="relative z-10 grid grid-cols-12 gap-8 items-center">

          {/* Columna Izquierda: Imagen y Sticky Notes */}
          <div className="col-span-12 md:col-span-3 flex justify-center items-center relative min-h-[300px]">
            <div className="relative w-full max-w-[240px] md:max-w-none">
              {/* Sticky Notes flotantes */}
              <StickyNote text="Confío" bg="bg-[#FDE2E4]" rotate="-rotate-6" className="absolute -top-6 -left-6 z-10" />
              <StickyNote text="Merezco" bg="bg-[#FFF1C5]" rotate="rotate-3" className="absolute top-24 -right-6 z-10" />
              <StickyNote text="Agradezco" bg="bg-[#E8F0FE]" rotate="-rotate-3" className="absolute bottom-20 -left-6 z-10" />
              <StickyNote text="Yo puedo" bg="bg-[#FFE5EC]" rotate="rotate-6" className="absolute -bottom-6 -right-4 z-10" />

              {/* Imagen Principal */}
              <div className="rounded-[2.2rem] overflow-hidden border border-border-secondary shadow-2xl p-1 bg-white dark:bg-[#120b29]">
                <img
                  src="/imagenprincipal.webp"
                  alt="Mujer escribiendo su diario de manifestación"
                  className="w-full h-auto rounded-[2rem] object-cover"
                />
              </div>
            </div>
          </div>

          {/* Columna Central: Contenido e Intenciones */}
          <div className="col-span-12 md:col-span-6 text-center space-y-6 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#534AB7]/8 dark:bg-violet-950/30 border border-[#534AB7]/15 dark:border-violet-800/30 text-[10px] sm:text-xs font-bold text-[#534AB7] dark:text-violet-400 tracking-wide uppercase shadow-sm select-none"
            >
              <IconSparkles size={12} className="animate-pulse" />
              COACH DE MANIFESTACIÓN CON INTELIGENCIA ARTIFICIAL
            </motion.div>

            {/* Logo de Manifiestas Central */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="w-full flex justify-center"
            >
              <img src="/manifiestahero.webp" alt="Manifiestas Logo" className="h-16 sm:h-20 object-contain" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1a1625] dark:text-white leading-[1.15] md:leading-tight tracking-tight"
            >
              La vida que deseas <br />
              <span className="bg-gradient-to-r from-[#534AB7] via-[#ff477e] to-[#00b2d6] bg-clip-text text-transparent italic font-serif">
                ya existe. Ve por ella.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-[#6b667a] dark:text-slate-350 text-base md:text-lg leading-relaxed max-w-lg"
            >
              Manifiestas es tu espacio para alinear tu mente, tus emociones y tus acciones para crear la vida que sueñas. Con herramientas guiadas y el poder de la IA, estarás más enfocada, motivada y cerca de tus metas cada día.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 pt-2 w-full justify-center"
            >
              <Link
                href="/app"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-[#ff477e] to-[#534AB7] hover:opacity-95 text-white font-bold shadow-lg shadow-[#ff477e]/20 transition-all text-center flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                Comenzar gratis
              </Link>
              <a
                href="#demo"
                className="px-8 py-4 rounded-full border-2 border-[#534AB7] hover:bg-[#534AB7]/5 text-[#534AB7] dark:text-white font-bold transition-all text-center flex items-center justify-center gap-2"
              >
                Ver cómo funciona <IconPlayerPlayFilled size={14} />
              </a>
            </motion.div>

            {/* Fila de estrellas de confianza */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center gap-3 pt-4 select-none"
            >
              <div className="flex -space-x-2">
                {['👩‍🦰', '👩‍💼', '👩‍🎨'].map((emoji, i) => (
                  <div key={i} className="w-7 h-7 rounded-full bg-[#f0ecfa] border-2 border-white flex items-center justify-center text-xs">{emoji}</div>
                ))}
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-0.5 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-xs">★</span>
                  ))}
                </div>
                <p className="text-xs text-[#6b667a] dark:text-slate-400 font-medium">
                  <span className="font-bold text-[#1a1625] dark:text-white">+10.000 personas</span> ya están manifestando la vida que siempre soñaron.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Columna Derecha: Celular Mockup y Polaroids */}
          <div className="col-span-12 md:col-span-3 flex justify-center items-center relative min-h-[300px]">
            <div className="relative w-full max-w-[240px] md:max-w-none">
              {/* Sticky Notes flotantes */}
              <StickyNote text="Libertad&#10;Tiempo&#10;Viajes&#10;Abundancia" bg="bg-[#FFF1C5]" rotate="-rotate-6" className="absolute -top-4 -left-8 z-10" />
              <StickyNote text="Enfoque&#10;Disciplina&#10;Fe&#10;Acción" bg="bg-[#FFE5EC]" rotate="rotate-6" className="absolute bottom-6 -right-6 z-10" />

              {/* Imagen / Collage de Celular y Polaroids */}
              <div className="rounded-[2.2rem] overflow-hidden border border-border-secondary shadow-2xl p-1 bg-white dark:bg-[#120b29]">
                <img
                  src="/parte derecha.webp"
                  alt="Celular y fotos polaroids flotando"
                  className="w-full h-auto rounded-[2rem] object-cover"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* GRID DE 5 CARACTERÍSTICAS INFERIORES */}
      <section className="relative z-20 max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {[
            { title: "Afirmaciones personalizadas", desc: "Creadas para ti con IA", color: "bg-[#ff477e]/10 border-[#ff477e]/25 text-[#ff477e]", icon: IconSparkles },
            { title: "Trabajo emocional", desc: "Libera bloqueos y eleva tu energía", color: "bg-[#8b5cf6]/10 border-[#8b5cf6]/25 text-[#8b5cf6]", icon: IconHeart },
            { title: "Acciones diarias", desc: "Pequeños pasos que te acercan a tu meta", color: "bg-[#3b82f6]/10 border-[#3b82f6]/25 text-[#3b82f6]", icon: IconCheck },
            { title: "Enfoque y hábitos", desc: "Mantén la constancia y la disciplina", color: "bg-[#06b6d4]/10 border-[#06b6d4]/25 text-[#06b6d4]", icon: IconTarget },
            { title: "Visualización y gratitud", desc: "Atrae más de lo bueno a tu vida", color: "bg-[#fbbf24]/10 border-[#fbbf24]/25 text-[#fbbf24]", icon: IconEye },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="glass-card p-6 rounded-3xl flex flex-col justify-between hover:scale-[1.03] transition-all duration-300 group border border-border-secondary"
            >
              <div>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 border ${item.color} group-hover:scale-110 transition-transform`}>
                  <item.icon size={20} stroke={2} />
                </div>
                <h4 className="text-sm font-bold text-[#1a1625] dark:text-white leading-snug">{item.title}</h4>
                <p className="text-[11px] text-[#6b667a] dark:text-slate-400 mt-1.5 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="how-it-works" className="py-24 border-t border-border-primary/50 dark:border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto space-y-4 mb-20">
            <h2 className="text-xs font-bold text-[#534AB7] dark:text-accent-gold uppercase tracking-widest">Método Cuántico</h2>
            <p className="text-3xl sm:text-4xl font-black text-[#1a1625] dark:text-white tracking-tight">Tu Ruta de Reprogramación en 3 Pasos</p>
            <p className="text-[#6b667a] dark:text-slate-400">Diseñamos una metodología digital única para ayudarte a alinearte y manifestar.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 text-left relative">
            <div className="hidden md:block absolute top-16 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-[#534AB7]/25 to-amber-500/25 z-0"></div>

            {/* Paso 1 */}
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-full bg-white dark:bg-[#120b29] border border-[#534AB7] text-[#534AB7] dark:text-white flex items-center justify-center font-bold text-lg shadow-md">
                1
              </div>
              <h3 className="text-lg font-bold text-[#1a1625] dark:text-white">Establece tu Intención</h3>
              <p className="text-[#6b667a] dark:text-slate-400 text-sm leading-relaxed">
                Describe a tu coach de IA lo que deseas manifestar. Te guiará para redactarlo con la vibración correcta y eliminar bloqueos.
              </p>
            </div>

            {/* Paso 2 */}
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-full bg-white dark:bg-[#120b29] border border-[#8b5cf6] text-[#8b5cf6] dark:text-white flex items-center justify-center font-bold text-lg shadow-md">
                2
              </div>
              <h3 className="text-lg font-bold text-[#1a1625] dark:text-white">Declara y Visualiza</h3>
              <p className="text-[#6b667a] dark:text-slate-400 text-sm leading-relaxed">
                Repite tus afirmaciones creadas por IA diariamente y realiza las sesiones de respiración para elevar tu frecuencia cerebral.
              </p>
            </div>

            {/* Paso 3 */}
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-full bg-white dark:bg-[#120b29] border border-amber-500 text-amber-500 dark:text-white flex items-center justify-center font-bold text-lg shadow-md">
                3
              </div>
              <h3 className="text-lg font-bold text-[#1a1625] dark:text-white">Toma Acción Inspirada</h3>
              <p className="text-[#6b667a] dark:text-slate-400 text-sm leading-relaxed">
                Completa los retos diarios de 30 días que la IA diseña para ti. La manifestación requiere tu alineación mental y acción física.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DEMO INTERACTIVA */}
      <section id="demo" className="py-24 bg-white/20 dark:bg-gradient-to-b dark:from-[#080414] dark:to-[#0c0620] relative z-10 border-t border-border-primary/50 dark:border-white/5 overflow-hidden">
        <EnergyParticles />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-purple/3 dark:bg-accent-purple/5 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <p className="text-3xl sm:text-4xl font-black text-[#1a1625] dark:text-white tracking-tight">Siente el poder de Manifiestas</p>
            <p className="text-[#6b667a] dark:text-slate-400">Prueba nuestras dos herramientas principales directamente en la landing page.</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-start">

            {/* WIDGET 1: TRIÁNGULO INTERACTIVO */}
            <div id="demo-triangulo" className="lg:col-span-6 space-y-6">
              <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[430px] border border-border-secondary">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent-purple/5 dark:bg-accent-purple/10 rounded-full blur-2xl pointer-events-none"></div>
                <h3 className="text-lg font-bold text-[#1a1625] dark:text-white flex items-center gap-2">
                  <span className="text-[#534AB7]">🔺</span> El Triángulo de Manifestación
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center flex-1">
                  {/* SVG */}
                  <div className="sm:col-span-5 flex justify-center">
                    <svg className="w-40 h-36 drop-shadow-[0_0_12px_rgba(83,74,183,0.25)] select-none" viewBox="0 0 200 170">
                      <defs>
                        <filter id="landing-glow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="4" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                        <linearGradient id="landing-loading-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#534AB7" />
                          <stop offset="50%" stopColor="#ff477e" />
                          <stop offset="100%" stopColor="#fbbf24" />
                        </linearGradient>
                      </defs>

                      {landingGenerating && (
                        <motion.polygon
                          points="100,25 35,145 165,145"
                          fill="rgba(250,204,21,0.03)"
                          stroke="url(#landing-loading-grad)"
                          strokeWidth="3.5"
                          animate={{
                            strokeDashoffset: [0, 400],
                            opacity: [0.4, 0.9, 0.4]
                          }}
                          style={{
                            strokeDasharray: "10, 20",
                            filter: "drop-shadow(0 0 6px rgba(255,71,126,0.6))"
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        />
                      )}

                      <line
                        x1={100} y1={25} x2={35} y2={145}
                        stroke={(!!landingDesire.trim() || landingStep >= 2) ? "#534AB7" : "rgba(83, 74, 183, 0.15)"}
                        strokeWidth="2.5"
                        style={{ filter: (!!landingDesire.trim() || landingStep >= 2) ? 'url(#landing-glow)' : 'none' }}
                      />
                      <line
                        x1={35} y1={145} x2={165} y2={145.1}
                        stroke={(!!landingEmotion.trim() || landingStep >= 3) ? "#ff477e" : "rgba(83, 74, 183, 0.15)"}
                        strokeWidth="2.5"
                        style={{ filter: (!!landingEmotion.trim() || landingStep >= 3) ? 'url(#landing-glow)' : 'none' }}
                      />
                      <line
                        x1={165} y1={145} x2={100} y2={25}
                        stroke={(!!landingAction.trim() || landingStep >= 4) ? "#fbbf24" : "rgba(83, 74, 183, 0.15)"}
                        strokeWidth="2.5"
                        style={{ filter: (!!landingAction.trim() || landingStep >= 4) ? 'url(#landing-glow)' : 'none' }}
                      />

                      <circle
                        cx={100} cy={25} r={9}
                        className={
                          landingStep === 1 ? "fill-[#534AB7] stroke-purple-200 stroke-[2px] animate-pulse" :
                          landingDesire.trim() ? "fill-[#534AB7] stroke-purple-300 stroke-1" : "fill-[#f0ecfa] dark:fill-white/10 stroke-border-secondary"
                        }
                        style={landingStep >= 1 || landingDesire.trim() ? { filter: 'url(#landing-glow)' } : {}}
                      />
                      <circle
                        cx={35} cy={145} r={9}
                        className={
                          landingStep === 2 ? "fill-[#ff477e] stroke-pink-200 stroke-[2px] animate-pulse" :
                          landingEmotion.trim() ? "fill-[#ff477e] stroke-pink-300 stroke-1" : "fill-[#f0ecfa] dark:fill-white/10 stroke-border-secondary"
                        }
                        style={landingStep >= 2 || landingEmotion.trim() ? { filter: 'url(#landing-glow)' } : {}}
                      />
                      <circle
                        cx={165} cy={145} r={9}
                        className={
                          landingStep === 3 ? "fill-[#fbbf24] stroke-yellow-200 stroke-[2px] animate-pulse" :
                          landingAction.trim() ? "fill-[#fbbf24] stroke-yellow-300 stroke-1" : "fill-[#f0ecfa] dark:fill-white/10 stroke-border-secondary"
                        }
                        style={landingStep >= 3 || landingAction.trim() ? { filter: 'url(#landing-glow)' } : {}}
                      />
                    </svg>
                  </div>

                  {/* Formulario */}
                  <div className="sm:col-span-7 flex flex-col justify-center min-h-[220px]">
                    <AnimatePresence mode="wait">
                      {landingStep === 1 && (
                        <motion.div key="l-step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-3">
                          <div>
                            <span className="text-[9px] font-black text-[#534AB7] uppercase tracking-widest block mb-1">Paso 1: Tu Deseo (Mente)</span>
                            <h4 className="text-xs font-bold text-[#1a1625] dark:text-white">¿Qué meta o deseo quieres manifestar?</h4>
                          </div>
                          <textarea
                            value={landingDesire}
                            onChange={(e) => setLandingDesire(e.target.value)}
                            placeholder="Ej. Tener libertad financiera, viajar a Japón este año..."
                            className="w-full bg-[#f8f6fc] dark:bg-slate-900/60 border border-border-secondary rounded-xl p-3 text-xs text-text-primary dark:text-white outline-none focus:border-[#534AB7] transition-colors h-16 resize-none leading-relaxed"
                          />
                          <button
                            disabled={!landingDesire.trim()}
                            onClick={() => setLandingStep(2)}
                            className="w-full py-2 bg-[#534AB7] hover:bg-[#3C3489] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all disabled:opacity-50"
                          >
                            Definir Emoción
                          </button>
                        </motion.div>
                      )}

                      {landingStep === 2 && (
                        <motion.div key="l-step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-3">
                          <div>
                            <span className="text-[9px] font-black text-[#ff477e] uppercase tracking-widest block mb-0.5">Paso 2: Emoción (Corazón)</span>
                            <h4 className="text-xs font-bold text-[#1a1625] dark:text-white">¿Qué emoción sentirás al lograrlo?</h4>
                          </div>
                          <textarea
                            value={landingEmotion}
                            onChange={(e) => setLandingEmotion(e.target.value)}
                            placeholder="Ej. Paz interior, seguridad, alegría desbordante..."
                            className="w-full bg-[#f8f6fc] dark:bg-slate-900/60 border border-border-secondary rounded-xl p-3 text-xs text-text-primary dark:text-white outline-none focus:border-[#ff477e] transition-colors h-14 resize-none leading-relaxed"
                          />
                          <div className="flex gap-2">
                            <button onClick={() => setLandingStep(1)} className="flex-1 py-2 bg-[#f0ecfa] dark:bg-white/5 border border-border-secondary text-[#1a1625] dark:text-slate-200 text-xs font-bold uppercase rounded-xl">Atrás</button>
                            <button
                              disabled={!landingEmotion.trim()}
                              onClick={() => setLandingStep(3)}
                              className="flex-1 py-2 bg-[#ff477e] hover:bg-[#d9386c] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all disabled:opacity-50"
                            >
                              Definir Acción
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {landingStep === 3 && (
                        <motion.div key="l-step3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-3">
                          <div>
                            <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest block mb-0.5">Paso 3: Acción Física (Mundo Real)</span>
                            <h4 className="text-xs font-bold text-[#1a1625] dark:text-white">¿Qué micro-acción darás hoy?</h4>
                          </div>
                          <textarea
                            value={landingAction}
                            onChange={(e) => setLandingAction(e.target.value)}
                            placeholder="Ej. Ahorrar $5 dólares, investigar sobre vuelos, agradecer..."
                            className="w-full bg-[#f8f6fc] dark:bg-slate-900/60 border border-border-secondary rounded-xl p-3 text-xs text-text-primary dark:text-white outline-none focus:border-amber-500 transition-colors h-16 resize-none leading-relaxed"
                          />
                          <div className="flex gap-2">
                            <button disabled={landingGenerating} onClick={() => setLandingStep(2)} className="flex-1 py-2 bg-[#f0ecfa] dark:bg-white/5 border border-border-secondary text-[#1a1625] dark:text-slate-200 text-xs font-bold uppercase rounded-xl">Atrás</button>
                            <button
                              disabled={!landingAction.trim() || landingGenerating}
                              onClick={handleActivateLandingTriangle}
                              className="flex-1 py-2 bg-gradient-to-r from-amber-500 to-[#fbbf24] hover:opacity-90 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-1 shadow-md"
                            >
                              {landingGenerating ? <IconLoader2 size={12} className="animate-spin" /> : <>Manifestar 🔺</>}
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {landingStep === 4 && (
                        <motion.div key="l-step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-3.5">
                          <div className="text-center">
                            <span className="text-xs font-bold text-[#534AB7]">Decreto Cuántico Generado</span>
                            <div className="bg-[#f8f6fc] dark:bg-white/5 border border-border-secondary rounded-xl p-3 text-[10px] sm:text-[11px] font-bold text-accent-purple italic leading-normal text-left mt-1.5 relative shadow-inner">
                              "{landingAffirmation}"
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(landingAffirmation);
                                setLandingCopied(true);
                                setTimeout(() => setLandingCopied(false), 2000);
                              }}
                              className="flex-1 py-2 bg-[#f0ecfa] dark:bg-white/5 border border-border-secondary text-xs font-bold uppercase rounded-xl text-[#1a1625] dark:text-slate-200"
                            >
                              {landingCopied ? "✓ Copiado" : "Copiar"}
                            </button>
                            <Link
                              href="/app"
                              className="flex-1 py-2 bg-[#534AB7] hover:bg-[#3C3489] text-xs font-bold uppercase rounded-xl text-white text-center flex items-center justify-center gap-1"
                            >
                              Guardar Decreto 🚀
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
                            className="w-full text-center text-[9px] font-bold text-[#6b667a] hover:text-[#1a1625] underline cursor-pointer"
                          >
                            Hacer otro decreto
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            {/* WIDGET 2: CHAT CON EL MENTOR */}
            <div id="demo-coach" className="lg:col-span-6 space-y-6">
              <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6 shadow-xl border border-border-secondary relative flex flex-col h-[430px]">
                <h3 className="text-lg font-bold text-[#1a1625] dark:text-white flex items-center gap-2 shrink-0">
                  <span className="text-[#8b5cf6]">💬</span> Coach de Reprogramación
                </h3>

                {/* Area del Chat */}
                <div className="flex-1 bg-[#f8f6fc] dark:bg-slate-950/50 border border-border-secondary rounded-2xl p-4 overflow-y-auto space-y-3 flex flex-col no-scrollbar shadow-inner">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === "ai"
                          ? "bg-white dark:bg-[#120b29] border border-border-primary text-[#1a1625] dark:text-slate-200 rounded-bl-none self-start shadow-sm"
                          : "bg-[#534AB7] text-white rounded-br-none self-end"
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))}
                  {isTyping && (
                    <div className="bg-white dark:bg-[#120b29] border border-border-primary px-3.5 py-2.5 rounded-2xl rounded-bl-none self-start flex gap-1 items-center">
                      <div className="w-1.5 h-1.5 bg-[#6b667a] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 bg-[#6b667a] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-1.5 h-1.5 bg-[#6b667a] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  )}
                </div>

                {/* Opciones Preestablecidas */}
                <div className="space-y-2 shrink-0">
                  <div className="text-[10px] text-[#6b667a] font-bold tracking-wider uppercase mb-1">
                    Selecciona una duda para chatear:
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleChatOption(
                        "💰 Siento bloqueos al pensar en abundancia y dinero.",
                        "Ese bloqueo suele nacer de la creencia inconsciente de que el dinero es escaso o malo. Empecemos a sintonizar agradeciendo lo que sí tienes hoy y declarando: 'El dinero fluye a mí constantemente'. ¿Qué monto deseas recibir hoy?"
                      )}
                      disabled={isTyping}
                      className="w-full text-left py-2 px-3 bg-white dark:bg-white/5 hover:bg-[#f8f6fc] dark:hover:bg-white/10 rounded-xl text-xs text-[#1a1625] dark:text-slate-300 border border-border-secondary transition-all disabled:opacity-50"
                    >
                      💰 Siento bloqueos al pensar en abundancia y dinero.
                    </button>
                    <button
                      onClick={() => handleChatOption(
                        "💗 No sé cómo manifestar una relación de pareja sana.",
                        "Para atraer amor, primero debes cultivar la vibración de merecimiento dentro de ti. Declara diariamente: 'Mi corazón está listo para dar y recibir amor'. ¿Cómo se siente tu relación ideal?"
                      )}
                      disabled={isTyping}
                      className="w-full text-left py-2 px-3 bg-white dark:bg-white/5 hover:bg-[#f8f6fc] dark:hover:bg-white/10 rounded-xl text-xs text-[#1a1625] dark:text-slate-300 border border-border-secondary transition-all disabled:opacity-50"
                    >
                      💗 No sé cómo manifestar una relación de pareja sana.
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section id="testimonios" className="py-24 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-xs font-bold text-[#534AB7] dark:text-accent-gold uppercase tracking-widest">Ellas Ya Lo Viven</h2>
            <p className="text-3xl sm:text-4xl font-black text-[#1a1625] dark:text-white tracking-tight">
              Vidas que se están{" "}
              <span className="bg-gradient-to-r from-[#534AB7] to-[#ff477e] bg-clip-text text-transparent">transformando</span>
            </p>
            <p className="text-[#6b667a] dark:text-slate-400 max-w-xl mx-auto">
              Más de 2,000 mujeres ya están alineando su frecuencia y manifestando sus deseos con Manifiestas.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Valeria M.", location: "Ciudad de México", avatar: "💜", text: "En menos de 30 días recibí una oferta de trabajo con el salario exacto que había declarado en mis afirmaciones. Esto no es coincidencia.", tag: "Manifestó su trabajo ideal" },
              { name: "Daniela R.", location: "Bogotá, Colombia", avatar: "✨", text: "El coach de IA entiende exactamente en qué frecuencia estoy. Nunca había tenido un espacio tan personal y sin juicios para hablar de mis sueños.", tag: "Amor propio y claridad" },
              { name: "Sofía L.", location: "Buenos Aires, Argentina", avatar: "🌟", text: "Empecé la visualización cuántica antes de dormir. En 3 semanas, manifesté el apartamento al precio que pedí. Sigo sin creerlo.", tag: "Manifestó su hogar ideal" },
              { name: "Camila T.", location: "Lima, Perú", avatar: "🔮", text: "Las afirmaciones personalizadas son otro nivel. No son frases genéricas — el sistema las adapta a mis bloqueos específicos. Realmente me conoce.", tag: "Reprogramación de creencias" },
              { name: "Andrea P.", location: "Santiago, Chile", avatar: "💎", text: "Hoy tengo 3 fuentes de ingreso que no tenía hace 4 meses. La consistencia con las afirmaciones diarias lo cambió todo.", tag: "Abundancia financiera" },
              { name: "Isabella F.", location: "Medellín, Colombia", avatar: "🌙", text: "El coach me ayudó a identificar el bloqueo que me saboteaba en el amor. Dos meses después conocí a la persona que buscaba.", tag: "Manifestó su relación ideal" },
            ].map(({ name, location, avatar, text, tag }) => (
              <div key={name} className="glass-card p-7 rounded-3xl flex flex-col gap-4 border border-border-secondary hover:-translate-y-1 transition-all duration-300">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-[#fbbf24] text-sm">★</span>
                  ))}
                </div>
                <p className="text-[#6b667a] dark:text-slate-300 text-sm leading-relaxed flex-1 italic">&ldquo;{text}&rdquo;</p>
                <span className="self-start px-3 py-1 rounded-full bg-[#534AB7]/10 border border-[#534AB7]/25 text-[#534AB7] dark:text-violet-300 text-[11px] font-semibold">✦ {tag}</span>
                <div className="flex items-center gap-3 pt-1 border-t border-border-primary dark:border-white/5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#534AB7]/20 to-[#fbbf24]/20 flex items-center justify-center text-lg shrink-0">{avatar}</div>
                  <div>
                    <p className="text-sm font-bold text-[#1a1625] dark:text-white">{name}</p>
                    <p className="text-[11px] text-[#6b667a]">{location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 text-center">
            {[
              { value: "2,300+", label: "Usuarias activas" },
              { value: "98%", label: "Satisfacción reportada" },
              { value: "4.9 / 5", label: "Calificación promedio" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-[#534AB7] to-[#fbbf24] bg-clip-text text-transparent">{value}</p>
                <p className="text-sm text-[#6b667a] mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WIDGET 3: SIMULADOR CEREBRAL (JACKPOT) */}
      <section id="demo-jackpot" className="py-12 text-center relative z-10 max-w-7xl mx-auto px-6">
        <div className="glass-card rounded-3xl p-8 max-w-4xl mx-auto border border-border-secondary relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 text-left space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-xs font-bold text-[#fbbf24]">
                <IconCoins size={14} /> Alineación de Riqueza
              </div>
              <h3 className="text-2xl font-bold text-[#1a1625] dark:text-white">Estallido de Abundancia Cuántica</h3>
              <p className="text-[#6b667a] dark:text-slate-400 text-sm leading-relaxed">
                Ingresa una meta financiera de dinero y alinea tu frecuencia mediante un estallido de dopamina en nuestra simulación cerebral.
              </p>
              <div className="flex gap-2 max-w-xs pt-2">
                <input
                  type="text"
                  value={jackpotAmount}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/\D/g, "");
                    setJackpotAmount(clean ? clean.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "");
                  }}
                  placeholder="10.000"
                  className="px-4 py-2.5 bg-[#f8f6fc] dark:bg-[#181818] border border-border-secondary rounded-xl text-sm font-bold text-[#1a1625] dark:text-white text-center focus:border-[#534AB7] focus:outline-none w-32"
                />
                <button
                  onClick={startJackpotSimulation}
                  className="px-4 py-2.5 bg-[#534AB7] hover:bg-[#3C3489] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1 shadow-md shadow-[#534AB7]/10"
                >
                  Alinear ⚡
                </button>
              </div>
            </div>

            <div className="md:col-span-5 relative flex justify-center">
              <div className="relative w-60 h-72 rounded-3xl overflow-hidden border border-border-secondary shadow-xl group">
                <img
                  src={SUCCESS_GRATITUDE_IMAGE_URL}
                  alt="Persona exitosa y próspera"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 inset-x-0 p-5 text-center flex flex-col items-center justify-end h-full">
                  <div className="w-9 h-9 bg-[#fbbf24]/20 border border-[#fbbf24]/40 rounded-full flex items-center justify-center mb-1 animate-bounce">
                    <IconCoins size={18} className="text-[#fbbf24]" />
                  </div>
                  <div className="text-[9px] text-[#fbbf24] font-bold uppercase tracking-widest">Meta de Sintonía</div>
                  <div className="text-xl font-black text-white mt-0.5">${jackpotAmount} USD</div>
                  <p className="text-[9px] text-slate-350 mt-1">El cerebro procesa la visualización como realidad.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLANES DE PRECIO */}
      <section id="precios" className="py-24 border-t border-border-primary/50 dark:border-white/5 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-xs font-bold text-[#534AB7] dark:text-accent-gold uppercase tracking-widest">Planes</h2>
            <p className="text-3xl sm:text-4xl font-black text-[#1a1625] dark:text-white tracking-tight">Empieza gratis. Eleva tu frecuencia.</p>
            <p className="text-[#6b667a] dark:text-slate-400 max-w-xl mx-auto">Comienza sin costo. Cuando estés lista para ir más profundo, el plan Pro te espera.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Plan Gratis */}
            <div className="glass-card p-8 rounded-3xl flex flex-col gap-6 border border-border-secondary bg-white/70">
              <div>
                <p className="text-xs font-bold text-[#6b667a] uppercase tracking-widest mb-2">Gratis para siempre</p>
                <p className="text-4xl font-black text-[#1a1625] dark:text-white">$0</p>
                <p className="text-[#6b667a] text-sm mt-1">Sin tarjeta de crédito</p>
              </div>
              <ul className="space-y-3 flex-1">
                {["Coach de IA — 3 mensajes/día", "Diario de gratitud — 1 entrada/día", "Triángulo de Manifestación — 1/día", "Visualizaciones y respiración guiada", "Seguimiento de 1 meta activa"].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#6b667a]">
                    <span className="text-[#534AB7] mt-0.5 shrink-0">✓</span>{item}
                  </li>
                ))}
              </ul>
              <Link href="/app" className="w-full py-3.5 rounded-xl border-2 border-[#534AB7]/40 text-[#534AB7] font-bold text-center hover:bg-[#534AB7]/5 transition-all">
                Empezar Gratis
              </Link>
            </div>

            {/* Plan Pro */}
            <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-br from-[#ff477e] to-[#534AB7] shadow-2xl">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#ff477e] to-[#fbbf24] text-white text-[11px] font-bold uppercase tracking-wider shadow-lg whitespace-nowrap">
                ✦ Más Popular
              </div>
              <div className="bg-white dark:bg-[#0c0721] rounded-[calc(1.5rem-1.5px)] p-8 flex flex-col gap-6 h-full">
                <div>
                  <p className="text-xs font-bold text-[#534AB7] dark:text-accent-gold uppercase tracking-widest mb-2">Pro — Manifestación Plena</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-black text-[#1a1625] dark:text-white">$5.99</p>
                    <p className="text-[#6b667a] text-sm">/ mes</p>
                  </div>
                  <p className="text-[#6b667a] text-sm mt-1">O $47.99/año — ahorra 33%</p>
                </div>
                <ul className="space-y-3 flex-1">
                  {["Coach de IA — mensajes ilimitados ∞", "Triángulos de Manifestación ilimitados ∞", "Retos de 30 Días personalizados con IA", "Diario de gratitud ilimitado ∞", "Metas ilimitadas con avance por días", "Decretos de abundancia guardados", "Visualizaciones cuánticas ilimitadas", "Gestión de facturación con Stripe"].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-[#6b667a] dark:text-slate-350">
                      <span className="text-[#fbbf24] mt-0.5 shrink-0">✦</span>{item}
                    </li>
                  ))}
                </ul>
                <Link href="/app" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#ff477e] to-[#534AB7] hover:opacity-90 text-white font-bold text-center transition-all shadow-lg">
                  Empezar Pro — 7 días gratis
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQS */}
      <section id="faqs" className="py-24 border-t border-border-primary/50 dark:border-white/5 relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-xs font-bold text-[#534AB7] dark:text-accent-gold uppercase tracking-widest">Preguntas Frecuentes</h2>
            <p className="text-3xl font-black text-[#1a1625] dark:text-white tracking-tight">Resuelve tus dudas</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="glass-card rounded-2xl overflow-hidden border border-border-secondary bg-white/70">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 flex justify-between items-center text-left text-[#1a1625] dark:text-white hover:bg-[#534AB7]/5 transition-colors font-bold text-sm sm:text-base"
                >
                  <span>{faq.question}</span>
                  <motion.span animate={{ rotate: openFaq === idx ? 180 : 0 }} className="text-[#6b667a]"><IconChevronDown size={20} /></motion.span>
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                      <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-[#6b667a] dark:text-slate-400 border-t border-border-primary leading-relaxed bg-white/40">
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
      <footer className="py-12 border-t border-border-primary/50 dark:border-white/5 text-center text-xs text-[#6b667a] bg-white/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 space-y-4">
          <img src="/logosuperior.webp" alt="Manifiestas Logo" className="h-6 object-contain mx-auto" />
          <p>© {new Date().getFullYear()} Manifiestas. Todos los derechos reservados.</p>
          <div className="flex justify-center gap-6">
            <Link href="/terms" className="hover:text-primary transition-colors">Términos de servicio</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Política de privacidad</Link>
            <Link href="/refunds" className="hover:text-primary transition-colors">Reembolsos</Link>
          </div>
        </div>
      </footer>

      {/* COOKIES */}
      <AnimatePresence>
        {showCookieBanner && (
          <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }} className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md p-5 rounded-3xl glass-card border border-border-secondary shadow-2xl z-[90] flex flex-col sm:flex-row items-center gap-4 text-left bg-white/95">
            <div className="flex-1 space-y-1">
              <h4 className="text-xs font-bold text-[#1a1625]">🍪 Preferencias de Cookies</h4>
              <p className="text-[10px] text-[#6b667a] leading-relaxed">Utilizamos cookies para optimizar tu experiencia y analizar el rendimiento de nuestro coach y simulador cuántico.</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setShowCookieBanner(false)} className="px-3.5 py-1.5 rounded-lg bg-white/5 border border-border-secondary text-[10px] font-bold text-[#6b667a]">Rechazar</button>
              <button onClick={handleAcceptCookies} className="px-4 py-1.5 rounded-lg bg-[#534AB7] text-white text-[10px] font-bold shadow-md">Aceptar</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* JACKPOT OVERLAY */}
      <AnimatePresence>
        {showJackpot && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-[#0c0721]/98 backdrop-blur-md z-[100] flex flex-col items-center justify-center">
            <motion.div initial={{ scale: 0.2, opacity: 1 }} animate={{ scale: 3, opacity: 0 }} transition={{ duration: 1.2 }} className="absolute w-40 h-40 rounded-full bg-yellow-400 blur-xl" />
            {[...Array(20)].map((_, idx) => (
              <motion.div key={idx} initial={{ y: -80, x: Math.random() * 400 - 200, opacity: 0 }} animate={{ y: 350, x: (Math.random() * 400 - 200), opacity: [0, 1, 1, 0] }} transition={{ duration: 2 + Math.random() * 2, repeat: Infinity }} className="absolute text-[#fbbf24] text-lg">✨</motion.div>
            ))}
            <div className="relative text-center space-y-4 px-4">
              <div className="w-14 h-14 bg-[#fbbf24]/20 border border-[#fbbf24]/50 rounded-full flex items-center justify-center mx-auto animate-bounce"><IconCheck size={28} className="text-[#fbbf24]" /></div>
              <h4 className="text-[#fbbf24] text-sm font-bold tracking-widest uppercase">Frecuencia Financiera Sintonizada</h4>
              <div className="text-5xl font-black text-white"><span className="text-[#fbbf24]">$</span>{displayJackpotAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</div>
              <p className="text-slate-300 text-xs max-w-sm mx-auto leading-relaxed">¡Alineación cuántica completa! Tu cerebro está integrando esta visualización de riqueza para consolidar tu frecuencia de logro en el mundo físico.</p>
              <button onClick={() => setShowJackpot(false)} className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs uppercase font-bold tracking-wider">Cerrar</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
