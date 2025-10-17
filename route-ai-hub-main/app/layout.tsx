import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Handoff - AI-Powered Smart Request Routing',
  description: 'Smarter Requests. Fewer Callbacks. AI-powered Smart Request Routing for referrals, imaging, and labs.',
  keywords: ['healthcare', 'AI', 'routing', 'referrals', 'FHIR'],
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
          {children}
        </div>
      </body>
    </html>
  );
}