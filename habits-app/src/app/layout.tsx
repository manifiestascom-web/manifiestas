import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_URL = "https://habitosia.com";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Hábitos IA — Creador de Hábitos y Disciplina con IA",
    template: "%s | Hábitos IA",
  },
  description:
    "Construye hábitos atómicos, diseña tu rutina diaria y mantén tu disciplina con el mentor de comportamiento con IA disponible 24/7.",
  keywords: [
    "hábitos",
    "hábitos atómicos",
    "rutinas",
    "disciplina",
    "productividad",
    "inteligencia artificial",
    "coach de hábitos",
    "seguimiento de hábitos",
    "racha",
    "desarrollo personal",
    "James Clear",
    "psicología del comportamiento",
  ],
  authors: [{ name: "Hábitos IA" }],
  creator: "Hábitos IA",
  publisher: "Hábitos IA",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: APP_URL,
  },
  openGraph: {
    type: "website",
    url: APP_URL,
    siteName: "Hábitos IA",
    title: "Hábitos IA — Creador de Hábitos y Disciplina con IA",
    description:
      "Construye hábitos atómicos, diseña tu rutina diaria y mantén tu disciplina con el mentor de comportamiento con IA disponible 24/7.",
    locale: "es_ES",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Hábitos IA — Creador de Hábitos y Disciplina con Inteligencia Artificial",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hábitos IA — Creador de Hábitos y Disciplina con IA",
    description:
      "Construye hábitos atómicos, diseña tu rutina diaria y mantén tu disciplina con el mentor de comportamiento con IA disponible 24/7.",
    images: ["/og-image.png"],
    creator: "@habitos_ia",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full">
        {children}
      </body>
    </html>
  );
}

