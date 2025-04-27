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
  category: 'fundraising',
  openGraph: {
    title: 'Por una Causa Justa - Plataforma de recaudación de fondos',
    description: 'Plataforma de recaudación de fondos para todo tipo de causas: viajes, estudios, emergencias o proyectos personales.',
    url: 'https://causa-justa-app.vercel.app',
    siteName: 'Por una Causa Justa',
    locale: 'es_AR',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Por una Causa Justa - Plataforma de recaudación de fondos',
        type: 'image/jpeg', // Especificar el tipo de imagen para mejor compatibilidad
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Por una Causa Justa - Plataforma de recaudación de fondos',
    description: 'Plataforma de recaudación de fondos para todo tipo de causas: viajes, estudios, emergencias o proyectos personales.',
    creator: '@PorUnaCausaJusta',
    images: ['/opengraph-image'], // Usar la misma imagen que OpenGraph para consistencia
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
    languages: {
      'es-AR': '/',
    },
  },
  manifest: '/manifest',
  verification: {
    // Agregar cuando estén disponibles
    // google: 'google-site-verification-code',
    // yandex: 'yandex-verification-code',
  },
  // Metadatos adicionales para mejorar la compatibilidad con otras plataformas
  other: {
    'fb:app_id': '', // Agregar ID de app de Facebook si está disponible
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Datos estructurados JSON-LD para mejorar SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Por una Causa Justa',
              url: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://causa-justa-app.vercel.app').href,
              logo: `${new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://causa-justa-app.vercel.app').href}/icon-512x512.png`,
              sameAs: [
                'https://facebook.com/porunacausajusta',
                'https://twitter.com/PorUnaCausaJusta',
                'https://instagram.com/porunacausajusta',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+54-11-1234-5678',
                contactType: 'customer service',
                availableLanguage: 'Spanish',
              },
              description: 'Plataforma de recaudación de fondos para todo tipo de causas: viajes, estudios, emergencias o proyectos personales.',
            })
          }}
        />
      </head>
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
