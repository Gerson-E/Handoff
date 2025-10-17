import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Issues from "@/components/Issues";
import WhatWeDo from "@/components/WhatWeDo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Starfield from "@/components/Starfield";
import SectionSeparator from "@/components/SectionSeparator";
import Features from "@/components/Features";

export default function Page() {
  return (
    <div>
      <Navbar />
      <Starfield />
      <div className="pointer-events-none fixed inset-0 bg-black/65 -z-40" aria-hidden="true" />
      <main className="mx-auto max-w-7xl px-4">
        <Hero />
        <Issues />
        <WhatWeDo />
        <Features />

        {/* KPI strip */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {["-40% misroutes", "+25% referral closure", "<1s decision time", "Audit-ready logs"].map((k) => (
                <div key={k} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-lg font-medium">
                  {k}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA band */}
        <section className="py-20 md:py-28">
          <div className="rounded-2xl border border-white/10 bg-[linear-gradient(to_right,rgba(15,95,255,0.15),rgba(13,183,168,0.15))] p-8 text-center shadow-soft">
            <h3 className="text-2xl font-semibold">Stop sending. Start knowing where it goes.</h3>
            <div className="mt-4">
              <Button asChild className="btn-gradient">
                <a href="/demo">Book a Demo</a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-12 text-sm">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 md:grid-cols-4">
          <div>
            <div className="text-base font-semibold">Product</div>
            <ul className="mt-3 space-y-2 text-white/80">
              <li><Link href="/about" className="hover:underline">About</Link></li>
              <li><Link href="/dashboard" className="hover:underline">Dashboard</Link></li>
              <li><a href="#" className="pointer-events-none opacity-60">API Docs</a></li>
            </ul>
          </div>
          <div>
            <div className="text-base font-semibold">Company</div>
            <ul className="mt-3 space-y-2 text-white/80">
              <li><a href="#" className="pointer-events-none opacity-60">Careers</a></li>
            </ul>
          </div>
          <div>
            <div className="text-base font-semibold">Legal</div>
            <ul className="mt-3 space-y-2 text-white/80">
              <li><a href="#" className="hover:underline">Privacy</a></li>
              <li><a href="#" className="hover:underline">Terms</a></li>
            </ul>
          </div>
          <div className="md:text-right">
            <div>© Handoff</div>
            <div className="mt-2 text-white/60">All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}


