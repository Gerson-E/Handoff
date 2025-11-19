import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/src/components/ui/toaster';
import DemoBanner from '@/components/DemoBanner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Handoff - AI-Powered Smart Request Routing (Demo)',
  description: 'Proof of concept: AI-powered Smart Request Routing for referrals, imaging, and labs.',
  keywords: ['healthcare', 'AI', 'routing', 'referrals', 'FHIR', 'demo'],
  authors: [{ name: 'Handoff Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <DemoBanner />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}