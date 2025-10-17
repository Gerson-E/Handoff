import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Issues from '@/components/Issues';
import WhatWeDo from '@/components/WhatWeDo';
import CodeSnippet from '@/components/CodeSnippet';
import SectionSeparator from '@/components/SectionSeparator';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <SectionSeparator />
      <Features />
      <SectionSeparator />
      <Issues />
      <SectionSeparator />
      <WhatWeDo />
      <SectionSeparator />
      <CodeSnippet />
    </main>
  );
}