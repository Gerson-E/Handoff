"use client";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mx-auto max-w-6xl mt-4 md:mt-6 sticky top-4 z-50">
      <header className="rounded-full border border-white/10 bg-neutral-900/80 shadow-[0_2px_30px_rgba(0,0,0,0.35)] px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" aria-label="Handoff home">
          <div className="h-7 w-7 rounded-lg bg-white/10" />
          <span className="text-lg font-semibold">Handoff</span>
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          <a href="#process" className="text-sm text-white/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-md px-1 py-1">Process</a>
          <a href="#features" className="text-sm text-white/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-md px-1 py-1">Features</a>
          <a href="#benefits" className="text-sm text-white/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-md px-1 py-1">Benefits</a>
          <a href="#plans" className="text-sm text-white/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-md px-1 py-1">Plans</a>
          <Link href="/dashboard" className="text-sm text-white/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-md px-1 py-1">Dashboard</Link>
          <Button asChild className="btn-gradient">
            <Link href="/demo">Book Demo</Link>
          </Button>
        </div>
        <button
          className="md:hidden rounded-lg p-2 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>
      {open && (
        <div className="mt-2 rounded-2xl border border-white/10 bg-neutral-900/90 md:hidden">
          <div className="px-4 py-3">
            <div className="flex flex-col gap-2">
              <a href="#process" className="rounded-lg px-2 py-2 hover:bg-white/10" onClick={() => setOpen(false)}>Process</a>
              <a href="#features" className="rounded-lg px-2 py-2 hover:bg-white/10" onClick={() => setOpen(false)}>Features</a>
              <a href="#benefits" className="rounded-lg px-2 py-2 hover:bg-white/10" onClick={() => setOpen(false)}>Benefits</a>
              <a href="#plans" className="rounded-lg px-2 py-2 hover:bg-white/10" onClick={() => setOpen(false)}>Plans</a>
              <Button asChild className="w-full">
                <Link href="/demo" onClick={() => setOpen(false)}>Book Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


