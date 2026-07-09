import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'Senga Systems | Enterprise Cybersecurity Solutions',
  description: 'Enterprise cybersecurity and software engineering solutions. Penetration testing, compliance audits, incident response, and DevSecOps.',
  keywords: 'cybersecurity, penetration testing, compliance, incident response, DevSecOps, security',
  authors: [{ name: 'Senga Systems' }],
  openGraph: {
    title: 'Senga Systems | Enterprise Cybersecurity Solutions',
    description: 'Enterprise cybersecurity and software engineering solutions.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#00d9ff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-background">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
