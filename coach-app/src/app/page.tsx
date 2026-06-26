"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import {
  IconSparkles,
  IconTarget,
  IconHeart,
  IconEye,
  IconChevronDown,
  IconCheck,
  IconPlayerPlayFilled,
  IconCoins,
  IconArrowUpRight,
  IconSun,
  IconMoon,
  IconLoader2,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";
import EnergyParticles from "@/components/layout/EnergyParticles";

const SUCCESS_GRATITUDE_IMAGE_URL =
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1000";

const affirmationsByCategory: Record<string, string[]> = {
  dinero: [
    "El dinero fluye hacia mí de múltiples fuentes de forma constante.",
    "Merezco la abundancia y la recibo con el corazón abierto.",
    "Soy un imán potente para la prosperidad y la riqueza financiera.",
    "Cada centavo que gasto regresa a mí multiplicado por diez.",
  ],
  amor: [
    "Atraigo un amor sano, recíproco y profundamente alineado conmigo.",
    "Mi corazón está abierto para dar y recibir amor verdadero.",
    "Me amo incondicionalmente y proyecto esa vibración al universo.",
    "La persona ideal para mí está de camino a mi vida en este instante.",
  ],
  exito: [
    "Soy capaz de lograr cualquier meta cuántica que me proponga.",
    "Mis ideas tienen un valor inmenso y el mundo está listo para recibirlas.",
    "El éxito es mi estado natural y lo abrazo con gratitud.",
    "Tengo la disciplina, la fuerza y la sabiduría para triunfar.",
  ],
  confianza: [
    "Confío en mi intuición y actúo con seguridad en mí mismo.",
    "Soy valioso, inteligente y suficiente tal y como soy hoy.",
    "Suelto el miedo al juicio y brillo con mi propia luz.",
    "Tengo el control de mi energía y elijo vibrar en abundancia.",
  ],
};

const faqs = [
  {
    question: "¿Qué es Manifiestas?",
    answer:
      "Manifiestas es un coach interactivo que combina psicología cognitiva, neurociencia y el arte de la manifestación para ayudarte a reprogramar tu subconsciente. Ofrece diálogos con inteligencia artificial, generación de afirmaciones personalizadas, tableros de visualización y herramientas interactivas.",
  },
  {
    question: "¿Cómo funciona el Coach de Manifestación?",
    answer:
      "Nuestro coach basado en inteligencia artificial te escucha de manera empática y sin juzgarte. Te ayuda a detectar creencias limitantes sobre el dinero, el amor o la salud, y te guía en la creación de planes de manifestación y reprogramación a 30 días.",
  },
  {
    question: "¿Qué es el 'Spiritual Jackpot' o Estallido de Abundancia?",
    answer:
      "Es un estímulo visual y mental interactivo diseñado para liberar dopamina en el cerebro cuando visualizas una meta financiera. El cerebro aprende mediante la emoción y la repetición; este estallido simula visualmente la consecución de tus metas monetarias para consolidar tu fe y alineación.",
  },
  {
    question: "¿Es gratis utilizar la aplicación?",
    answer:
      "Sí. El plan gratuito incluye 3 mensajes diarios con el coach IA, 1 entrada de gratitud al día, 1 triángulo de manifestación al día, visualizaciones guiadas y 1 meta activa. Los límites se resetean cada día. El plan Pro ($5.99/mes) elimina todos los límites y desbloquea los retos de 30 días con IA.",
  },
];

// Sticky Note component
function StickyNote({
  text,
  bg,
  rotate,
  className = "",
}: {
  text: string;
  bg: string;
  rotate: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={`p-2.5 shadow-lg border border-black/5 text-center flex items-center justify-center font-bold font-serif text-[11px] text-[#1a1625] rounded-md ${bg} ${rotate} ${className} w-[72px] h-[72px] sm:w-20 sm:h-20`}
      style={{ transformOrigin: "center", whiteSpace: "pre-line" }}
    >
      {text}
    </motion.div>
  );
}

export default function LandingPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isPro, setIsPro] = useState(false);
  const [pricingPeriod, setPricingPeriod] = useState<"monthly" | "yearly">("monthly");
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profile } = await supabase
          .from("profiles")
          .select("subscription_tier")
          .eq("id", user.id)
          .single();
        if (profile?.subscription_tier === "pro") {
          setIsPro(true);
        }
      }
    };
    checkUser();
  }, []);

  const handleSubscribeClick = (plan: "monthly" | "yearly") => {
    if (user) {
      window.location.href = `/paywall?plan=${plan}`;
    } else {
      const nextUrl = encodeURIComponent(`/paywall?plan=${plan}`);
      window.location.href = `/login?next=${nextUrl}`;
    }
  };

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

  // Afirmaciones widget
  const [selectedCategory, setSelectedCategory] = useState("dinero");
  const [currentAffirmation, setCurrentAffirmation] = useState(
    "El dinero fluye hacia mí de múltiples fuentes de forma constante."
  );
  const [copied, setCopied] = useState(false);

  // Chat
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: "ai" | "user"; text: string }>
  >([
    {
      sender: "ai",
      text: "👋 ¡Hola! Soy tu mentor de manifestación. ¿Qué aspecto de tu vida deseas transformar hoy? (💰 Dinero, 💗 Amor o 🚀 Éxito)",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Jackpot
  const [showJackpot, setShowJackpot] = useState(false);
  const [jackpotAmount, setJackpotAmount] = useState("10.000");
  const [displayJackpotAmount, setDisplayJackpotAmount] = useState(0);

  // FAQs
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Triángulo
  const [landingStep, setLandingStep] = useState(1);
  const [landingDesire, setLandingDesire] = useState("");
  const [landingEmotion, setLandingEmotion] = useState("");
  const [landingAction, setLandingAction] = useState("");
  const [landingGenerating, setLandingGenerating] = useState(false);
  const [landingAffirmation, setLandingAffirmation] = useState("");
  const [landingCopied, setLandingCopied] = useState(false);

  // Cookies
  const [showCookieBanner, setShowCookieBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) setShowCookieBanner(true);
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
        `Agradezco la llegada de "${landingDesire}" en mi vida física. Me inundo de la vibración de "${landingEmotion}" y hoy doy el paso alineado de "${landingAction}". Hecho está.`,
      ];
      setLandingAffirmation(templates[Math.floor(Math.random() * templates.length)]);
      setLandingGenerating(false);
      setLandingStep(4);
    }, 2000);
  };

  const handleGenerateAffirmation = (category: string) => {
    setSelectedCategory(category);
    const list = affirmationsByCategory[category];
    setCurrentAffirmation(list[Math.floor(Math.random() * list.length)]);
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentAffirmation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChatOption = (optionText: string, replyText: string) => {
    if (isTyping) return;
    setChatMessages((prev) => [...prev, { sender: "user", text: optionText }]);
    setIsTyping(true);
    setTimeout(() => {
      setChatMessages((prev) => [...prev, { sender: "ai", text: replyText }]);
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

  const navLinks = [
    { href: "#how-it-works", label: "Cómo funciona" },
    { href: "#features", label: "Beneficios" },
    { href: "#testimonios", label: "Testimonios" },
    { href: "#precios", label: "Precios" },
    { href: "#faqs", label: "Blog" },
  ];

  return (
    <div className="bg-gradient-to-br from-[#FFF3EC] via-[#FDE8F5] to-[#EBE4FC] dark:from-[#090518] dark:via-[#0c0721] dark:to-[#080312] text-text-primary min-h-screen font-sans overflow-x-hidden transition-colors duration-300 selection:bg-[#534AB7]/30">

      {/* Glow orbs */}
      <div className="absolute top-0 left-1/4 w-[40vw] h-[40vw] bg-[#ff477e]/8 dark:bg-accent-purple/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-1/3 right-1/4 w-[35vw] h-[35vw] bg-[#534AB7]/6 dark:bg-primary/10 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-1/3 w-[30vw] h-[30vw] bg-[#fbbf24]/5 dark:bg-accent-gold/5 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* ─── HEADER ─── */}
      <header className="hidden md:block sticky top-0 z-50 bg-white/70 dark:bg-black/50 border-b border-black/5 dark:border-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-5 py-3.5 flex justify-between items-center">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/logosuperior.webp"
              alt="Manifiestas Logo"
              className="h-8 sm:h-9 object-contain"
            />
            <span className="font-serif font-bold text-[#0b2253] dark:text-white text-xl sm:text-2xl tracking-tight leading-none">
              manifiestas
            </span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#1a1625]/75 dark:text-white/75">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="hover:text-[#534AB7] dark:hover:text-white transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white/30 dark:bg-white/5 border border-black/8 dark:border-white/10 hover:border-[#534AB7]/30 transition-all text-[#534AB7] dark:text-white"
              aria-label="Cambiar tema"
            >
              {theme === "dark" ? (
                <IconSun size={17} className="text-amber-400" />
              ) : (
                <IconMoon size={17} />
              )}
            </button>

            {user ? (
              <Link
                href="/app"
                className="hidden sm:inline-flex px-5 py-2.5 rounded-full bg-[#534AB7] hover:bg-[#3C3489] text-white font-bold text-sm transition-all shadow-md shadow-[#534AB7]/20 hover:scale-[1.02] items-center gap-1.5"
              >
                Ir a la App {isPro && <span className="text-[9px] bg-accent-gold/20 text-accent-gold px-1.5 py-0.5 rounded-full font-black uppercase">PRO</span>}
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="hidden sm:inline-flex text-sm font-semibold hover:text-[#534AB7] dark:hover:text-white transition-colors mr-2 text-[#1a1625]/75 dark:text-white/75"
                >
                  Iniciar sesión
                </Link>
                <button
                  onClick={() => handleSubscribeClick("monthly")}
                  className="hidden sm:inline-flex px-5 py-2.5 rounded-full bg-gradient-to-r from-[#ff477e] to-[#534AB7] hover:opacity-95 text-white font-bold text-sm transition-all shadow-md shadow-[#ff477e]/20 hover:scale-[1.02]"
                >
                  Probar Pro
                </button>
              </div>
            )}

            {/* Hamburger — mobile only */}
            <button
              className="md:hidden p-2 rounded-xl bg-white/30 dark:bg-white/5 border border-black/8 dark:border-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? (
                <IconX size={20} className="text-[#1a1625] dark:text-white" />
              ) : (
                <IconMenu2 size={20} className="text-[#1a1625] dark:text-white" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-0 z-[60] bg-white dark:bg-[#0c0721] border-b border-black/10 dark:border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="flex justify-between items-center px-5 py-4 border-b border-black/5 dark:border-white/5">
              <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <img
                  src="/logosuperior.webp"
                  alt="Manifiestas Logo"
                  className="h-8 object-contain"
                />
              </Link>
              <button
                className="p-2 rounded-xl bg-black/5 dark:bg-white/5"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Cerrar menú"
              >
                <IconX size={20} className="text-[#1a1625] dark:text-white" />
              </button>
            </div>
            
            <nav className="flex flex-col px-5 py-4 gap-1">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 px-4 rounded-xl font-semibold text-sm text-[#1a1625] dark:text-white hover:bg-[#534AB7]/8 transition-colors"
                >
                  {l.label}
                </a>
              ))}
              {user ? (
                <Link
                  href="/app"
                  className="mt-2 py-3 px-4 rounded-xl bg-[#534AB7] text-white font-bold text-sm text-center flex items-center justify-center gap-1.5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Ir a la App {isPro && <span className="text-[9px] bg-accent-gold/20 text-accent-gold px-1.5 py-0.5 rounded-full font-black uppercase">PRO</span>}
                </Link>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  <Link
                    href="/login"
                    className="py-3 px-4 rounded-xl border border-black/10 dark:border-white/10 text-center font-bold text-sm text-[#1a1625] dark:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Iniciar sesión
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleSubscribeClick("monthly");
                    }}
                    className="py-3 px-4 rounded-xl bg-gradient-to-r from-[#ff477e] to-[#534AB7] text-white font-bold text-sm text-center"
                  >
                    Probar Pro
                  </button>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── CINTA DE ABUNDANCIA ─── */}
      <div className="hidden md:block relative w-full overflow-hidden bg-gradient-to-r from-[#1a0f35] via-[#100926] to-[#1a0f35] border-b border-yellow-500/20 py-2.5 z-40 select-none">
        <style>{`
          @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
          .marquee-track { display: flex; width: max-content; animation: marquee 35s linear infinite; }
        `}</style>
        <div className="marquee-track flex gap-8 whitespace-nowrap text-[10px] sm:text-xs font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 uppercase">
          <span>💰 TOTAL MANIFESTADO HOY: $1,854,230 USD • 📈 342 DEUDAS SALDADAS • 🕊️ 897 MENTES EN SINTONÍA ALTA • 🔮 COEFICIENTE DE PROSPERIDAD: 99.4% • 💸 FLUJO DE ABUNDANCIA ACTIVADO • 🌟</span>
          <span>💰 TOTAL MANIFESTADO HOY: $1,854,230 USD • 📈 342 DEUDAS SALDADAS • 🕊️ 897 MENTES EN SINTONÍA ALTA • 🔮 COEFICIENTE DE PROSPERIDAD: 99.4% • 💸 FLUJO DE ABUNDANCIA ACTIVADO • 🌟</span>
        </div>
      </div>

      {/* ─── HERO — 3 COLUMNAS ─── */}
      <section className="hidden md:block relative w-full pt-0 pb-16 z-10 overflow-hidden">
        <EnergyParticles />
        <div className="relative z-10 grid grid-cols-12 gap-0 items-stretch min-h-[500px] lg:min-h-[600px] w-full">

          {/* ── Columna IZQUIERDA: mujer ── */}
          <div className="col-span-12 md:col-span-4 relative overflow-hidden h-full">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full h-full"
              style={{
                maskImage: "linear-gradient(to right, black 65%, transparent 95%)",
                WebkitMaskImage: "linear-gradient(to right, black 65%, transparent 95%)"
              }}
            >
              <img
                src="/imagenprincipal.webp"
                alt="Mujer escribiendo su diario de manifestación"
                className="w-full h-full object-cover object-left select-none"
              />
            </motion.div>
          </div>

          {/* ── Columna CENTRAL: contenido ── */}
          <div className="col-span-12 md:col-span-5 text-center flex flex-col items-center justify-center gap-5 py-12 px-6 lg:px-12">

            {/* Sparkles arriba del logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-center items-center gap-1.5 text-[#fbbf24] mb-1"
            >
              <IconSparkles size={18} className="animate-pulse" />
            </motion.div>

            {/* Logo central */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="flex flex-col items-center gap-2"
            >
              <img
                src="/logosuperior.webp"
                alt="Manifiestas Icon"
                className="h-14 sm:h-16 object-contain"
              />
              <span className="font-serif font-black text-[#0b2253] dark:text-white text-3xl sm:text-4xl tracking-tight leading-none">
                manifiestas
              </span>
            </motion.div>

            {/* Titular */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-[#0b2253] dark:text-white leading-tight tracking-tight font-serif"
            >
              La vida que deseas <br />
              <span className="bg-gradient-to-r from-[#ff007a] via-[#7e22ce] via-[#2563eb] to-[#00b4d8] bg-clip-text text-transparent font-caveat font-normal normal-case block mt-2 text-[38px] sm:text-[48px] lg:text-[60px] xl:text-[72px] py-1">
                ya existe. Ve por ella.
              </span>
            </motion.h1>

            {/* Subtítulo */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.22 }}
              className="text-[#6b667a] dark:text-slate-400 text-sm md:text-base leading-relaxed max-w-md"
            >
              Manifiestas es tu espacio para alinear tu mente, tus emociones y
              tus acciones para crear la vida que sueñas. Con herramientas
              guiadas y el poder de la IA, estarás más enfocada, motivada y
              cerca de tus metas cada día.
            </motion.p>

            {/* Botones CTA */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 w-full justify-center"
            >
              {user ? (
                isPro ? (
                  <Link
                    href="/app"
                    className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#ff477e] to-[#534AB7] hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-[#ff477e]/20 transition-all text-center hover:scale-[1.02]"
                  >
                    Ir a la App (Premium Activo)
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => handleSubscribeClick("monthly")}
                      className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#ff477e] to-[#534AB7] hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-[#ff477e]/20 transition-all text-center hover:scale-[1.02]"
                    >
                      Adquirir Premium Pro
                    </button>
                    <Link
                      href="/app"
                      className="px-8 py-3.5 rounded-full border-2 border-[#534AB7] hover:bg-[#534AB7]/8 text-[#534AB7] dark:text-white font-bold text-sm transition-all text-center flex items-center justify-center gap-1.5"
                    >
                      Ir a la App (Plan Básico)
                    </Link>
                  </>
                )
              ) : (
                <>
                  <button
                    onClick={() => handleSubscribeClick("monthly")}
                    className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#ff477e] to-[#534AB7] hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-[#ff477e]/20 transition-all text-center hover:scale-[1.02]"
                  >
                    Adquirir Premium Pro
                  </button>
                  <Link
                    href="/app"
                    className="px-8 py-3.5 rounded-full border-2 border-[#534AB7] hover:bg-[#534AB7]/8 text-[#534AB7] dark:text-white font-bold text-sm transition-all text-center flex items-center justify-center gap-1.5"
                  >
                    Comenzar gratis (Básico)
                  </Link>
                </>
              )}
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center gap-3"
            >
              <div className="flex -space-x-2">
                {["👩‍🦰", "👩‍💼", "👩‍🎨"].map((emoji, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full bg-white border-2 border-white shadow flex items-center justify-center text-xs"
                  >
                    {emoji}
                  </div>
                ))}
              </div>
              <div className="text-center sm:text-left">
                <div className="flex justify-center sm:justify-start gap-0.5 text-amber-400 text-xs">
                  {"★★★★★"}
                </div>
                <p className="text-xs text-[#6b667a] dark:text-slate-400">
                  <span className="font-bold text-[#1a1625] dark:text-white">
                    +10.000 personas
                  </span>{" "}
                  ya están manifestando la vida que siempre soñaron.
                </p>
              </div>
            </motion.div>
          </div>

          {/* ── Columna DERECHA: celular + polaroids ── */}
          <div className="col-span-12 md:col-span-3 relative overflow-hidden h-full">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full h-full"
              style={{
                maskImage: "linear-gradient(to left, black 65%, transparent 95%)",
                WebkitMaskImage: "linear-gradient(to left, black 65%, transparent 95%)"
              }}
            >
              <img
                src="/parte derecha.webp"
                alt="App de manifestación en celular con polaroids"
                className="w-full h-full object-cover object-right select-none"
              />
            </motion.div>
          </div>

        </div>
      </section>

      {/* ─── GRID 5 CARACTERÍSTICAS ─── */}
      <section id="features" className="hidden md:block relative z-20 max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { title: "Afirmaciones personalizadas", desc: "Creadas para ti con IA", color: "bg-[#ff477e]/10 border-[#ff477e]/25 text-[#ff477e]", icon: IconSparkles },
            { title: "Trabajo emocional", desc: "Libera bloqueos y eleva tu energía", color: "bg-[#8b5cf6]/10 border-[#8b5cf6]/25 text-[#8b5cf6]", icon: IconHeart },
            { title: "Acciones diarias", desc: "Pequeños pasos que te acercan a tu meta", color: "bg-[#3b82f6]/10 border-[#3b82f6]/25 text-[#3b82f6]", icon: IconCheck },
            { title: "Enfoque y hábitos", desc: "Mantén la constancia y la disciplina", color: "bg-[#06b6d4]/10 border-[#06b6d4]/25 text-[#06b6d4]", icon: IconTarget },
            { title: "Visualización y gratitud", desc: "Atrae más de lo bueno a tu vida", color: "bg-[#fbbf24]/10 border-[#fbbf24]/25 text-[#fbbf24]", icon: IconEye },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 * i }}
              className="bg-white/70 dark:bg-white/5 backdrop-blur-sm p-6 rounded-3xl flex flex-col items-center text-center gap-4 hover:scale-[1.03] transition-all duration-300 border border-white/80 dark:border-white/10 shadow-sm"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${item.color}`}>
                <item.icon size={22} stroke={2} />
              </div>
              <div className="flex flex-col gap-1.5">
                <h4 className="text-xs font-bold text-[#1a1625] dark:text-white leading-snug">{item.title}</h4>
                <p className="text-[11px] text-[#6b667a] dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── VISTA MÓVIL ─── */}
      <div className="block md:hidden relative w-full bg-gradient-to-b from-[#FFF3EC] via-[#FDE8F5] to-[#EBE4FC] dark:from-[#090518] dark:via-[#0c0721] dark:to-[#080312]">
        
        {/* Mobile Header (sits on top of the hero background) */}
        <header className="relative z-50 flex justify-between items-center px-4 py-3 bg-white/95 dark:bg-[#0c0721]/95 backdrop-blur-md border-b border-black/5 dark:border-white/5">
          {/* Left Side: Hamburger + Logo */}
          <div className="flex items-center gap-2">
            {/* Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1 text-[#1a1625] dark:text-white hover:bg-black/5 rounded-lg transition-colors"
              aria-label="Abrir menú"
            >
              <IconMenu2 size={22} />
            </button>
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-1.5 shrink-0">
              <img src="/logosuperior.webp" alt="Manifiestas Logo" className="h-[21px] object-contain" />
              <span className="font-serif font-bold text-[#0b2253] dark:text-white text-[18px] tracking-tight leading-none">
                manifiestas
              </span>
            </Link>
          </div>
          
          {/* Right Side: Comenzar gratis / Ir a la App Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              type="button"
              className="p-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-[#534AB7] dark:text-white"
              aria-label="Cambiar tema"
            >
              {theme === "dark" ? (
                <IconSun size={15} className="text-amber-400" />
              ) : (
                <IconMoon size={15} />
              )}
            </button>
            {user ? (
              <Link
                href="/app"
                className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#ff477e] to-[#8b5cf6] text-white font-bold text-xs shadow-md shadow-[#ff477e]/15 flex items-center gap-1"
              >
                Ir a la App {isPro && <span className="text-[8px] bg-white/20 text-white px-1 py-0.2 rounded-full font-black uppercase">PRO</span>}
              </Link>
            ) : (
              <button
                onClick={() => handleSubscribeClick("monthly")}
                className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#ff477e] to-[#8b5cf6] text-white font-bold text-xs shadow-md shadow-[#ff477e]/15"
              >
                Probar Pro
              </button>
            )}
          </div>
        </header>

        {/* Hero Section Container */}
        <div className="relative w-full aspect-[2/3.4] overflow-hidden select-none">
          {/* Mockup Background Image */}
          <img
            src="/manifiestahero.webp"
            alt="Manifiestas Background"
            className="absolute inset-0 w-full h-full object-cover object-bottom z-0 pointer-events-none"
          />

          {/* Sparkles, Title, Subtitle, and Buttons */}
          <div className="absolute inset-x-0 top-[2%] flex flex-col items-center justify-start text-center px-5 pt-4 z-10">
            {/* Sparkles */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-center items-center gap-1.5 mb-1.5 text-amber-500 animate-pulse"
            >
              <IconSparkles size={14} />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[22px] xs:text-[25px] font-black text-[#0b2253] leading-tight tracking-tight font-serif max-w-[280px]"
            >
              La vida que deseas <br />
              <span className="bg-gradient-to-r from-[#ff007a] via-[#7e22ce] via-[#2563eb] to-[#00b4d8] bg-clip-text text-transparent font-caveat font-normal normal-case text-[28px] xs:text-[34px] block mt-0.5 py-0.5">
                ya existe. Ve por ella.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[#1e293b] text-[10.5px] xs:text-[11.5px] leading-relaxed max-w-[260px] mt-1.5 font-medium"
            >
              Alinea tu mente, tus emociones y tus acciones para manifestar tus sueños con herramientas guiadas por IA diseñadas para ti.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-2 w-full max-w-[210px] mt-3"
            >
              {user ? (
                isPro ? (
                  <Link
                    href="/app"
                    className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#ff8a00] to-[#8b5cf6] text-white font-bold text-xs shadow-md shadow-[#ff8a00]/15 transition-all text-center flex items-center justify-center gap-1"
                  >
                    Ir a la App (Premium)
                    <span className="text-[10px]">❯</span>
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => handleSubscribeClick("monthly")}
                      className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#ff8a00] to-[#8b5cf6] text-white font-bold text-xs shadow-md shadow-[#ff8a00]/15 transition-all text-center flex items-center justify-center gap-1"
                    >
                      Adquirir Premium Pro
                      <span className="text-[10px]">❯</span>
                    </button>
                    <Link
                      href="/app"
                      className="w-full py-2 rounded-full border border-[#8b5cf6]/40 text-[#8b5cf6] font-bold text-xs bg-white/40 backdrop-blur-sm transition-all text-center flex items-center justify-center gap-1"
                    >
                      Ir a la App (Básico)
                    </Link>
                  </>
                )
              ) : (
                <>
                  <button
                    onClick={() => handleSubscribeClick("monthly")}
                    className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#ff8a00] to-[#8b5cf6] text-white font-bold text-xs shadow-md shadow-[#ff8a00]/15 transition-all text-center flex items-center justify-center gap-1"
                  >
                    Adquirir Premium Pro
                    <span className="text-[10px]">❯</span>
                  </button>
                  <Link
                    href="/app"
                    className="w-full py-2 rounded-full border border-[#8b5cf6]/40 text-[#8b5cf6] font-bold text-xs bg-white/40 backdrop-blur-sm transition-all text-center flex items-center justify-center gap-1"
                  >
                    Comenzar gratis
                  </Link>
                </>
              )}
            </motion.div>
          </div>
        </div>

        {/* Features & Social Proof Card (Below the Hero Illustration) */}
        <div className="px-4 pb-8 -mt-6 relative z-30">
          <div className="bg-white/85 dark:bg-[#120b29]/85 backdrop-blur-md rounded-3xl p-4 shadow-xl border border-white/60 dark:border-white/5 flex flex-col gap-4">
            
            {/* 5 columns of benefits */}
            <div className="grid grid-cols-5 gap-1 divide-x divide-slate-100 dark:divide-white/5 text-center">
              {[
                { title: "Afirmaciones personalizadas", desc: "Creadas para ti con IA", icon: "✨", iconColor: "text-pink-500 bg-pink-50 dark:bg-pink-950/30" },
                { title: "Trabajo emocional", desc: "Libera bloqueos y eleva tu energía", icon: "💜", iconColor: "text-purple-500 bg-purple-50 dark:bg-purple-950/30" },
                { title: "Acciones diarias", desc: "Pequeños pasos te acercan a tu meta", icon: "🎯", iconColor: "text-blue-500 bg-blue-50 dark:bg-blue-950/30" },
                { title: "Enfoque y hábitos", desc: "Mantén la constancia y la disciplina", icon: "🌿", iconColor: "text-cyan-500 bg-cyan-50 dark:bg-cyan-950/30" },
                { title: "Visualización y gratitud", desc: "Atrae más de lo bueno a tu vida", icon: "☀️", iconColor: "text-amber-500 bg-amber-50 dark:bg-amber-950/30" },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center px-1 gap-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${item.iconColor}`}>
                    {item.icon}
                  </div>
                  <h4 className="text-[8px] font-extrabold text-[#0f172a] dark:text-white leading-tight">{item.title}</h4>
                  <p className="text-[7px] text-[#64748b] dark:text-slate-400 leading-tight">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="h-px bg-slate-100 dark:bg-white/5" />

            {/* Social proof and Laurel Wreath */}
            <div className="flex items-center justify-between gap-2">
              {/* Left: Stars & People */}
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1.5 shrink-0">
                  {["👩‍🦰", "👩‍💼", "👩‍🎨"].map((emoji, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-full bg-white border border-white shadow-sm flex items-center justify-center text-[10px]"
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5 text-[8px] text-amber-400">
                    ★★★★★
                  </div>
                  <p className="text-[8px] text-[#64748b] leading-tight font-medium">
                    <span className="font-extrabold text-[#0f172a] dark:text-white">+10k personas</span> ya están manifestando.
                  </p>
                </div>
              </div>

              {/* Right: Laurel Wreath */}
              <div className="flex items-center gap-1 border-l border-slate-100 dark:border-white/5 pl-2">
                <span className="text-purple-400 text-sm">🌿</span>
                <div className="text-right">
                  <p className="text-[7.5px] text-[#64748b] dark:text-slate-400 font-semibold leading-tight">Tu mejor versión te espera.</p>
                  <p className="text-[8px] text-pink-500 font-extrabold font-serif leading-tight">¡Manifiéstate! ♥</p>
                </div>
                <span className="text-purple-400 text-sm scale-x-[-1]">🌿</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ─── CÓMO FUNCIONA ─── */}
      <section id="how-it-works" className="py-24 border-t border-black/5 dark:border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto space-y-4 mb-20">
            <h2 className="text-xs font-bold text-[#534AB7] dark:text-accent-gold uppercase tracking-widest">Método Cuántico</h2>
            <p className="text-3xl sm:text-4xl font-black text-[#1a1625] dark:text-white tracking-tight">Tu Ruta de Reprogramación en 3 Pasos</p>
            <p className="text-[#6b667a] dark:text-slate-400">Diseñamos una metodología digital única para ayudarte a alinearte y manifestar.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 text-left relative">
            <div className="hidden md:block absolute top-16 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-[#534AB7]/20 to-amber-500/20 z-0" />
            {[
              { num: "1", color: "border-[#534AB7] text-[#534AB7]", title: "Establece tu Intención", desc: "Describe a tu coach de IA lo que deseas manifestar. Te guiará para redactarlo con la vibración correcta y eliminar bloqueos." },
              { num: "2", color: "border-[#8b5cf6] text-[#8b5cf6]", title: "Declara y Visualiza", desc: "Repite tus afirmaciones creadas por IA diariamente y realiza las sesiones de respiración para elevar tu frecuencia cerebral." },
              { num: "3", color: "border-amber-500 text-amber-500", title: "Toma Acción Inspirada", desc: "Completa los retos diarios de 30 días que la IA diseña para ti. La manifestación requiere tu alineación mental y acción física." },
            ].map((step) => (
              <div key={step.num} className="space-y-4 relative z-10">
                <div className={`w-12 h-12 rounded-full bg-white dark:bg-[#120b29] border ${step.color} flex items-center justify-center font-bold text-lg shadow-md`}>
                  {step.num}
                </div>
                <h3 className="text-lg font-bold text-[#1a1625] dark:text-white">{step.title}</h3>
                <p className="text-[#6b667a] dark:text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DEMO INTERACTIVA ─── */}
      <section id="demo" className="py-24 bg-white/30 dark:bg-gradient-to-b dark:from-[#080414] dark:to-[#0c0620] relative z-10 border-t border-black/5 dark:border-white/5 overflow-hidden">
        <EnergyParticles />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <p className="text-3xl sm:text-4xl font-black text-[#1a1625] dark:text-white tracking-tight">Siente el poder de Manifiestas</p>
            <p className="text-[#6b667a] dark:text-slate-400">Prueba nuestras herramientas directamente aquí.</p>
          </div>
          <div className="grid lg:grid-cols-12 gap-12 items-start">

            {/* TRIÁNGULO */}
            <div id="demo-triangulo" className="lg:col-span-6 space-y-6">
              <div className="bg-white/70 dark:bg-[#120b29]/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 space-y-6 shadow-xl border border-white/80 dark:border-white/10 min-h-[430px] flex flex-col">
                <h3 className="text-lg font-bold text-[#1a1625] dark:text-white flex items-center gap-2">
                  <span className="text-[#534AB7]">🔺</span> El Triángulo de Manifestación
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center flex-1">
                  <div className="sm:col-span-5 flex justify-center">
                    <svg className="w-40 h-36" viewBox="0 0 200 170">
                      <defs>
                        <filter id="lg"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#534AB7"/><stop offset="50%" stopColor="#ff477e"/><stop offset="100%" stopColor="#fbbf24"/>
                        </linearGradient>
                      </defs>
                      {landingGenerating && (
                        <motion.polygon points="100,25 35,145 165,145" fill="rgba(250,204,21,0.03)" stroke="url(#grad)" strokeWidth="3.5"
                          animate={{ strokeDashoffset: [0, 400], opacity: [0.4, 0.9, 0.4] }}
                          style={{ strokeDasharray: "10,20", filter: "drop-shadow(0 0 6px rgba(255,71,126,0.6))" }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
                      )}
                      <line x1={100} y1={25} x2={35} y2={145} stroke={(!!landingDesire.trim() || landingStep >= 2) ? "#534AB7" : "rgba(83,74,183,0.15)"} strokeWidth="2.5" style={{ filter: (!!landingDesire.trim() || landingStep >= 2) ? "url(#lg)" : "none" }} />
                      <line x1={35} y1={145} x2={165} y2={145} stroke={(!!landingEmotion.trim() || landingStep >= 3) ? "#ff477e" : "rgba(83,74,183,0.15)"} strokeWidth="2.5" style={{ filter: (!!landingEmotion.trim() || landingStep >= 3) ? "url(#lg)" : "none" }} />
                      <line x1={165} y1={145} x2={100} y2={25} stroke={(!!landingAction.trim() || landingStep >= 4) ? "#fbbf24" : "rgba(83,74,183,0.15)"} strokeWidth="2.5" style={{ filter: (!!landingAction.trim() || landingStep >= 4) ? "url(#lg)" : "none" }} />
                      <circle cx={100} cy={25} r={9} className={landingStep === 1 ? "fill-[#534AB7] stroke-purple-200 stroke-[2px] animate-pulse" : landingDesire.trim() ? "fill-[#534AB7] stroke-purple-300 stroke-1" : "fill-white stroke-border-secondary"} style={landingStep >= 1 || landingDesire.trim() ? { filter: "url(#lg)" } : {}} />
                      <circle cx={35} cy={145} r={9} className={landingStep === 2 ? "fill-[#ff477e] stroke-pink-200 stroke-[2px] animate-pulse" : landingEmotion.trim() ? "fill-[#ff477e] stroke-pink-300 stroke-1" : "fill-white stroke-border-secondary"} style={landingStep >= 2 || landingEmotion.trim() ? { filter: "url(#lg)" } : {}} />
                      <circle cx={165} cy={145} r={9} className={landingStep === 3 ? "fill-[#fbbf24] stroke-yellow-200 stroke-[2px] animate-pulse" : landingAction.trim() ? "fill-[#fbbf24] stroke-yellow-300 stroke-1" : "fill-white stroke-border-secondary"} style={landingStep >= 3 || landingAction.trim() ? { filter: "url(#lg)" } : {}} />
                    </svg>
                  </div>
                  <div className="sm:col-span-7 flex flex-col justify-center min-h-[220px]">
                    <AnimatePresence mode="wait">
                      {landingStep === 1 && (
                        <motion.div key="s1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-3">
                          <div><span className="text-[9px] font-black text-[#534AB7] uppercase tracking-widest block mb-1">Paso 1: Tu Deseo (Mente)</span>
                          <h4 className="text-xs font-bold text-[#1a1625] dark:text-white">¿Qué meta o deseo quieres manifestar?</h4></div>
                          <textarea value={landingDesire} onChange={e => setLandingDesire(e.target.value)} placeholder="Ej. Tener libertad financiera, viajar a Japón…" className="w-full bg-[#f8f6fc] dark:bg-slate-900/60 border border-border-secondary rounded-xl p-3 text-xs text-text-primary outline-none focus:border-[#534AB7] transition-colors h-16 resize-none" />
                          <button disabled={!landingDesire.trim()} onClick={() => setLandingStep(2)} className="w-full py-2 bg-[#534AB7] hover:bg-[#3C3489] text-white font-bold text-xs uppercase tracking-wider rounded-xl disabled:opacity-50">Definir Emoción</button>
                        </motion.div>
                      )}
                      {landingStep === 2 && (
                        <motion.div key="s2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-3">
                          <div><span className="text-[9px] font-black text-[#ff477e] uppercase tracking-widest block mb-0.5">Paso 2: Emoción (Corazón)</span>
                          <h4 className="text-xs font-bold text-[#1a1625] dark:text-white">¿Qué emoción sentirás al lograrlo?</h4></div>
                          <textarea value={landingEmotion} onChange={e => setLandingEmotion(e.target.value)} placeholder="Ej. Paz interior, seguridad, alegría…" className="w-full bg-[#f8f6fc] dark:bg-slate-900/60 border border-border-secondary rounded-xl p-3 text-xs text-text-primary outline-none focus:border-[#ff477e] h-14 resize-none" />
                          <div className="flex gap-2">
                            <button onClick={() => setLandingStep(1)} className="flex-1 py-2 bg-[#f0ecfa] dark:bg-white/5 border border-border-secondary text-[#1a1625] dark:text-slate-200 text-xs font-bold uppercase rounded-xl">Atrás</button>
                            <button disabled={!landingEmotion.trim()} onClick={() => setLandingStep(3)} className="flex-1 py-2 bg-[#ff477e] hover:bg-[#d9386c] text-white font-bold text-xs uppercase rounded-xl disabled:opacity-50">Definir Acción</button>
                          </div>
                        </motion.div>
                      )}
                      {landingStep === 3 && (
                        <motion.div key="s3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-3">
                          <div><span className="text-[9px] font-black text-amber-500 uppercase tracking-widest block mb-0.5">Paso 3: Acción Física</span>
                          <h4 className="text-xs font-bold text-[#1a1625] dark:text-white">¿Qué micro-acción darás hoy?</h4></div>
                          <textarea value={landingAction} onChange={e => setLandingAction(e.target.value)} placeholder="Ej. Ahorrar $5, investigar sobre vuelos…" className="w-full bg-[#f8f6fc] dark:bg-slate-900/60 border border-border-secondary rounded-xl p-3 text-xs text-text-primary outline-none focus:border-amber-500 h-16 resize-none" />
                          <div className="flex gap-2">
                            <button disabled={landingGenerating} onClick={() => setLandingStep(2)} className="flex-1 py-2 bg-[#f0ecfa] dark:bg-white/5 border border-border-secondary text-xs font-bold uppercase rounded-xl">Atrás</button>
                            <button disabled={!landingAction.trim() || landingGenerating} onClick={handleActivateLandingTriangle} className="flex-1 py-2 bg-gradient-to-r from-amber-500 to-[#fbbf24] text-slate-950 font-bold text-xs uppercase rounded-xl disabled:opacity-50 flex items-center justify-center gap-1">
                              {landingGenerating ? <IconLoader2 size={12} className="animate-spin" /> : <>Manifestar 🔺</>}
                            </button>
                          </div>
                        </motion.div>
                      )}
                      {landingStep === 4 && (
                        <motion.div key="s4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-3.5">
                          <div className="text-center">
                            <span className="text-xs font-bold text-[#534AB7]">Decreto Cuántico Generado</span>
                            <div className="bg-[#f8f6fc] dark:bg-white/5 border border-border-secondary rounded-xl p-3 text-[10px] font-bold text-accent-purple italic leading-normal text-left mt-1.5">"{landingAffirmation}"</div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => { navigator.clipboard.writeText(landingAffirmation); setLandingCopied(true); setTimeout(() => setLandingCopied(false), 2000); }} className="flex-1 py-2 bg-[#f0ecfa] dark:bg-white/5 border border-border-secondary text-xs font-bold uppercase rounded-xl text-[#1a1625] dark:text-slate-200">
                              {landingCopied ? "✓ Copiado" : "Copiar"}
                            </button>
                            <Link href="/app" className="flex-1 py-2 bg-[#534AB7] text-xs font-bold uppercase rounded-xl text-white text-center flex items-center justify-center gap-1">Guardar 🚀</Link>
                          </div>
                          <button onClick={() => { setLandingStep(1); setLandingDesire(""); setLandingEmotion(""); setLandingAction(""); setLandingAffirmation(""); }} className="w-full text-center text-[9px] font-bold text-[#6b667a] hover:text-[#1a1625] underline">Hacer otro decreto</button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            {/* CHAT */}
            <div id="demo-coach" className="lg:col-span-6 space-y-6">
              <div className="bg-white/70 dark:bg-[#120b29]/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/80 dark:border-white/10 flex flex-col h-[430px]">
                <h3 className="text-lg font-bold text-[#1a1625] dark:text-white flex items-center gap-2 shrink-0">
                  <span className="text-[#8b5cf6]">💬</span> Coach de Reprogramación
                </h3>
                <div className="flex-1 bg-[#f8f6fc] dark:bg-slate-950/50 border border-border-secondary rounded-2xl p-4 overflow-y-auto space-y-3 flex flex-col no-scrollbar mt-4">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${msg.sender === "ai" ? "bg-white dark:bg-[#120b29] border border-border-primary text-[#1a1625] dark:text-slate-200 rounded-bl-none self-start" : "bg-[#534AB7] text-white rounded-br-none self-end"}`}>
                      {msg.text}
                    </div>
                  ))}
                  {isTyping && (
                    <div className="bg-white dark:bg-[#120b29] border border-border-primary px-3.5 py-2.5 rounded-2xl rounded-bl-none self-start flex gap-1 items-center">
                      {[0, 150, 300].map(d => <div key={d} className="w-1.5 h-1.5 bg-[#6b667a] rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
                    </div>
                  )}
                </div>
                <div className="space-y-2 shrink-0 mt-3">
                  <div className="text-[10px] text-[#6b667a] font-bold tracking-wider uppercase">Selecciona una duda:</div>
                  <div className="flex flex-col gap-2">
                    {[
                      { opt: "💰 Siento bloqueos al pensar en abundancia y dinero.", rep: "Ese bloqueo suele nacer de la creencia inconsciente de que el dinero es escaso o malo. Empecemos a sintonizar agradeciendo lo que sí tienes hoy y declarando: 'El dinero fluye a mí constantemente'. ¿Qué monto deseas recibir hoy?" },
                      { opt: "💗 No sé cómo manifestar una relación de pareja sana.", rep: "Para atraer amor, primero debes cultivar la vibración de merecimiento dentro de ti. Declara diariamente: 'Mi corazón está listo para dar y recibir amor'. ¿Cómo se siente tu relación ideal?" },
                      { opt: "🚀 Quiero avanzar pero algo me detiene.", rep: "Eso que te detiene casi siempre es una creencia limitante: 'no soy suficiente' o 'el éxito no es para mí'. Vamos a reprogramarlo juntas. Dime: ¿cuál es tu gran meta este año?" },
                    ].map(({ opt, rep }) => (
                      <button key={opt} onClick={() => handleChatOption(opt, rep)} disabled={isTyping} className="w-full text-left py-2 px-3 bg-white dark:bg-white/5 hover:bg-[#f8f6fc] dark:hover:bg-white/10 rounded-xl text-xs text-[#1a1625] dark:text-slate-300 border border-border-secondary transition-all disabled:opacity-50">
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIOS ─── */}
      <section id="testimonios" className="py-24 border-t border-black/5 dark:border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs font-bold text-[#534AB7] dark:text-accent-gold uppercase tracking-widest">Resultados Reales</h2>
            <p className="text-3xl sm:text-4xl font-black text-[#1a1625] dark:text-white tracking-tight">Lo que dicen nuestras Manifestadoras</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Valeria M.", location: "Ciudad de México", avatar: "💜", text: "En menos de 30 días recibí una oferta de trabajo con el salario exacto que había declarado en mis afirmaciones. Esto no es coincidencia.", tag: "Manifestó su trabajo ideal" },
              { name: "Daniela R.", location: "Bogotá, Colombia", avatar: "✨", text: "El coach de IA entiende exactamente en qué frecuencia estoy. Nunca había tenido un espacio tan personal y sin juicios para hablar de mis sueños.", tag: "Amor propio y claridad" },
              { name: "Sofía L.", location: "Buenos Aires", avatar: "🌟", text: "Empecé la visualización cuántica antes de dormir. En 3 semanas, manifesté el apartamento al precio que pedí. Sigo sin creerlo.", tag: "Manifestó su hogar ideal" },
              { name: "Camila T.", location: "Lima, Perú", avatar: "🔮", text: "Las afirmaciones personalizadas son otro nivel. No son frases genéricas — el sistema las adapta a mis bloqueos específicos.", tag: "Reprogramación de creencias" },
              { name: "Andrea P.", location: "Santiago, Chile", avatar: "💎", text: "Hoy tengo 3 fuentes de ingreso que no tenía hace 4 meses. La consistencia con las afirmaciones diarias lo cambió todo.", tag: "Abundancia financiera" },
              { name: "Isabella F.", location: "Medellín, Colombia", avatar: "🌙", text: "El coach me ayudó a identificar el bloqueo que me saboteaba en el amor. Dos meses después conocí a la persona que buscaba.", tag: "Manifestó su relación ideal" },
            ].map(({ name, location, avatar, text, tag }) => (
              <div key={name} className="bg-white/70 dark:bg-white/5 backdrop-blur-sm p-7 rounded-3xl flex flex-col gap-4 border border-white/80 dark:border-white/10 shadow-sm hover:-translate-y-1 transition-all duration-300">
                <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <span key={i} className="text-[#fbbf24] text-sm">★</span>)}</div>
                <p className="text-[#6b667a] dark:text-slate-300 text-sm leading-relaxed flex-1 italic">&ldquo;{text}&rdquo;</p>
                <span className="self-start px-3 py-1 rounded-full bg-[#534AB7]/10 border border-[#534AB7]/25 text-[#534AB7] dark:text-violet-300 text-[11px] font-semibold">✦ {tag}</span>
                <div className="flex items-center gap-3 pt-1 border-t border-black/5 dark:border-white/5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#534AB7]/20 to-[#fbbf24]/20 flex items-center justify-center text-lg">{avatar}</div>
                  <div>
                    <p className="text-sm font-bold text-[#1a1625] dark:text-white">{name}</p>
                    <p className="text-[11px] text-[#6b667a]">{location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 text-center">
            {[{ value: "10.000+", label: "Usuarias activas" }, { value: "98%", label: "Satisfacción reportada" }, { value: "4.9 / 5", label: "Calificación promedio" }].map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-[#534AB7] to-[#fbbf24] bg-clip-text text-transparent">{value}</p>
                <p className="text-sm text-[#6b667a] mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PLANES DE PRECIO ─── */}
      <section id="precios" className="py-24 border-t border-black/5 dark:border-white/5 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-xs font-bold text-[#534AB7] dark:text-accent-gold uppercase tracking-widest">Planes</h2>
            <p className="text-3xl sm:text-4xl font-black text-[#1a1625] dark:text-white tracking-tight">Empieza gratis. Eleva tu frecuencia.</p>
            <p className="text-[#6b667a] dark:text-slate-400 max-w-xl mx-auto">Comienza sin costo. Cuando estés lista para ir más profundo, el plan Pro te espera.</p>
          </div>

          {/* Selector de Plan (Mensual / Anual) */}
          <div className="flex max-w-[280px] mx-auto p-1 bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl mb-10 relative">
            <button
              type="button"
              onClick={() => setPricingPeriod("monthly")}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all relative z-10 ${
                pricingPeriod === "monthly" ? "text-[#534AB7] dark:text-white" : "text-[#6b667a] hover:text-[#1a1625] dark:hover:text-white"
              }`}
            >
              Mensual
              {pricingPeriod === "monthly" && (
                <motion.div
                  layoutId="pricing-active"
                  className="absolute inset-0 bg-white dark:bg-white/10 border border-black/5 dark:border-white/10 rounded-xl -z-10 shadow-sm"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
            <button
              type="button"
              onClick={() => setPricingPeriod("yearly")}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all relative z-10 flex items-center justify-center gap-1.5 ${
                pricingPeriod === "yearly" ? "text-[#534AB7] dark:text-white" : "text-[#6b667a] hover:text-[#1a1625] dark:hover:text-white"
              }`}
            >
              Anual
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 text-[8px] font-black uppercase">
                Ahorra 33%
              </span>
              {pricingPeriod === "yearly" && (
                <motion.div
                  layoutId="pricing-active"
                  className="absolute inset-0 bg-white dark:bg-white/10 border border-black/5 dark:border-white/10 rounded-xl -z-10 shadow-sm"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto font-sans">
            {/* Plan Gratis */}
            <div className="bg-white/70 dark:bg-white/5 backdrop-blur-sm p-8 rounded-3xl flex flex-col gap-6 border border-white/80 dark:border-white/10 shadow-sm">
              <div>
                <p className="text-xs font-bold text-[#6b667a] uppercase tracking-widest mb-2">Gratis para siempre</p>
                <p className="text-4xl font-black text-[#1a1625] dark:text-white">$0</p>
                <p className="text-[#6b667a] text-sm mt-1">Sin tarjeta de crédito</p>
              </div>
              <ul className="space-y-3 flex-1">
                {["Coach de IA — 3 mensajes/día", "Diario de gratitud — 1 entrada/día", "Triángulo de Manifestación — 1/día", "Visualizaciones y respiración guiada", "Seguimiento de 1 meta activa"].map(item => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#6b667a]"><span className="text-[#534AB7] mt-0.5 shrink-0">✓</span>{item}</li>
                ))}
              </ul>
              {user ? (
                <Link href="/app" className="w-full py-3.5 rounded-xl border-2 border-[#534AB7]/40 text-[#534AB7] font-bold text-center hover:bg-[#534AB7]/5 transition-all block">Ir a la App</Link>
              ) : (
                <Link href="/app" className="w-full py-3.5 rounded-xl border-2 border-[#534AB7]/40 text-[#534AB7] font-bold text-center hover:bg-[#534AB7]/5 transition-all block">Empezar Gratis</Link>
              )}
            </div>
            {/* Plan Pro */}
            <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-br from-[#ff477e] to-[#534AB7] shadow-2xl">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#ff477e] to-[#fbbf24] text-white text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">✦ Más Popular</div>
              <div className="bg-white dark:bg-[#0c0721] rounded-[calc(1.5rem-1.5px)] p-8 flex flex-col gap-6 h-full">
                <div>
                  <p className="text-xs font-bold text-[#534AB7] dark:text-accent-gold uppercase tracking-widest mb-2">Pro — Manifestación Plena</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-black text-[#1a1625] dark:text-white">
                      {pricingPeriod === "monthly" ? "$5.99" : "$47.99"}
                    </p>
                    <p className="text-[#6b667a] text-sm">
                      {pricingPeriod === "monthly" ? "/ mes" : "/ año"}
                    </p>
                  </div>
                  <p className="text-[#6b667a] text-xs mt-1">
                    {pricingPeriod === "monthly" ? "O $47.99/año — ahorra 33%" : "Ahorra 33% ($3.99/mes)"}
                  </p>
                </div>
                <ul className="space-y-3 flex-1 font-medium">
                  {["Coach de IA — mensajes ilimitados ∞", "Triángulos de Manifestación ilimitados ∞", "Retos de 30 Días personalizados con IA", "Diario de gratitud ilimitado ∞", "Metas ilimitadas con avance por días", "Decretos de abundancia guardados", "Visualizaciones cuánticas ilimitadas"].map(item => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-[#6b667a] dark:text-slate-350"><span className="text-[#fbbf24] mt-0.5 shrink-0">✦</span>{item}</li>
                  ))}
                </ul>
                {user ? (
                  isPro ? (
                    <Link href="/app" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#ff477e] to-[#534AB7] hover:opacity-90 text-white font-bold text-center transition-all shadow-lg block">Ir a la App (Premium Activo)</Link>
                  ) : (
                    <button onClick={() => handleSubscribeClick(pricingPeriod)} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#ff477e] to-[#534AB7] hover:opacity-90 text-white font-bold text-center transition-all shadow-lg">Empezar Pro — 7 días gratis</button>
                  )
                ) : (
                  <button onClick={() => handleSubscribeClick(pricingPeriod)} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#ff477e] to-[#534AB7] hover:opacity-90 text-white font-bold text-center transition-all shadow-lg">Empezar Pro — 7 días gratis</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQs ─── */}
      <section id="faqs" className="py-24 border-t border-black/5 dark:border-white/5 relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-xs font-bold text-[#534AB7] dark:text-accent-gold uppercase tracking-widest">Preguntas Frecuentes</h2>
            <p className="text-3xl font-black text-[#1a1625] dark:text-white tracking-tight">Resuelve tus dudas</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/80 dark:border-white/10">
                <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)} className="w-full px-6 py-5 flex justify-between items-center text-left text-[#1a1625] dark:text-white hover:bg-[#534AB7]/5 transition-colors font-bold text-sm sm:text-base">
                  <span>{faq.question}</span>
                  <motion.span animate={{ rotate: openFaq === idx ? 180 : 0 }} className="text-[#6b667a]"><IconChevronDown size={20} /></motion.span>
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                      <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-[#6b667a] dark:text-slate-400 border-t border-black/5 leading-relaxed">{faq.answer}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-12 border-t border-black/5 dark:border-white/5 text-center text-xs text-[#6b667a] bg-white/40 dark:bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 space-y-4">
          <img src="/logosuperior.webp" alt="Manifiestas Logo" className="h-6 object-contain mx-auto" />
          <p>© {new Date().getFullYear()} Manifiestas. Todos los derechos reservados.</p>
          <div className="flex justify-center gap-6">
            <Link href="/terms" className="hover:text-[#534AB7] transition-colors">Términos de servicio</Link>
            <Link href="/privacy" className="hover:text-[#534AB7] transition-colors">Política de privacidad</Link>
            <Link href="/refunds" className="hover:text-[#534AB7] transition-colors">Reembolsos</Link>
          </div>
        </div>
      </footer>

      {/* ─── COOKIES ─── */}
      <AnimatePresence>
        {showCookieBanner && (
          <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }} className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md p-5 rounded-3xl bg-white/95 dark:bg-[#0c0721]/95 border border-black/8 dark:border-white/10 shadow-2xl z-[90] flex flex-col sm:flex-row items-center gap-4 backdrop-blur-sm">
            <div className="flex-1 space-y-1">
              <h4 className="text-xs font-bold text-[#1a1625] dark:text-white">🍪 Preferencias de Cookies</h4>
              <p className="text-[10px] text-[#6b667a] leading-relaxed">Utilizamos cookies para optimizar tu experiencia y analizar el rendimiento.</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setShowCookieBanner(false)} className="px-3.5 py-1.5 rounded-lg bg-black/5 border border-black/8 text-[10px] font-bold text-[#6b667a]">Rechazar</button>
              <button onClick={handleAcceptCookies} className="px-4 py-1.5 rounded-lg bg-[#534AB7] text-white text-[10px] font-bold">Aceptar</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── JACKPOT OVERLAY ─── */}
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
              <p className="text-slate-300 text-xs max-w-sm mx-auto leading-relaxed">¡Alineación cuántica completa! Tu cerebro está integrando esta visualización de riqueza.</p>
              <button onClick={() => setShowJackpot(false)} className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs uppercase font-bold tracking-wider">Cerrar</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
