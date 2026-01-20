import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import './globals.css';

import Script from 'next/script';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: 'Olimpo - Quiniela Predictor',
  description: 'Dashboard de predicciones para la Quiniela Argentina con IA basada en los Dioses del Olimpo',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'Olimpo - Quiniela Predictor',
    description: 'Predicciones divinas para la Quiniela Argentina',
    images: ['/og-image.png'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <head />
      <body className="bg-background text-foreground antialiased">
        <Script src="https://apps.abacus.ai/chatllm/appllm-lib.js" strategy="afterInteractive" />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" theme="dark" />
        </ThemeProvider>
      </body>
    </html>
  );
}
