import type { Metadata } from "next";
import { Nunito, Work_Sans } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import { AuthProvider } from "@/contexts/AuthContext";

// Cargamos Nunito para títulos y botones
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["600", "700"],
});

// Cargamos Work Sans para texto general
const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Por una Causa Justa',
    default: 'Por una Causa Justa | Plataforma de recaudación de fondos para todo tipo de causas',
  },
  description: 'Plataforma de recaudación de fondos para todo tipo de causas: desde viajes y estudios hasta emergencias médicas y proyectos solidarios. Crea tu campaña o apoya las existentes.',
  keywords: ['causa justa', 'recaudación de fondos', 'campañas', 'donaciones', 'ayuda', 'estudios', 'viajes', 'emergencias', 'proyectos personales', 'argentina'],
  authors: [{ name: 'Equipo Por una Causa Justa' }],
  creator: 'Por una Causa Justa',
  publisher: 'Por una Causa Justa',
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://causajusta.org'),
  alternates: {
    canonical: '/',
    languages: {
      'es-AR': '/',
    },
  },
  openGraph: {
    title: 'Por una Causa Justa | Plataforma de recaudación de fondos para todo tipo de causas',
    description: 'Plataforma de recaudación de fondos para todo tipo de causas: desde viajes y estudios hasta emergencias médicas y proyectos solidarios. Crea tu campaña o apoya las existentes.',
    url: '/',
    siteName: 'Por una Causa Justa',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Por una Causa Justa - Plataforma de recaudación de fondos',
      },
    ],
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Por una Causa Justa | Plataforma de recaudación de fondos para todo tipo de causas',
    description: 'Plataforma de recaudación de fondos para todo tipo de causas: desde viajes y estudios hasta emergencias médicas y proyectos solidarios. Crea tu campaña o apoya las existentes.',
    images: ['/opengraph-image'],
    creator: '@PorUnaCausaJusta',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Estos valores deberían ser reemplazados con los reales cuando estén disponibles
    google: 'google-site-verification-code',
    // yandex: 'yandex-verification-code',
    // yahoo: 'yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${nunito.variable} ${workSans.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
