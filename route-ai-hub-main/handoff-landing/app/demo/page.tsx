"use client";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  const [form, setForm] = useState({ name: "", email: "", org: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight">Book a Demo</h1>
        <p className="mt-2 text-white/80">We will reach out to schedule a session.</p>
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Tell us about you</CardTitle>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="text-white/80">Thanks! We'll be in touch shortly.</div>
            ) : (
              <form onSubmit={onSubmit} className="grid gap-4">
                <label className="grid gap-2">
                  <span className="text-sm">Name</span>
                  <input
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none placeholder:text-white/40 focus:ring-2 focus:ring-white/30"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm">Email</span>
                  <input
                    type="email"
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none placeholder:text-white/40 focus:ring-2 focus:ring-white/30"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm">Organization</span>
                  <input
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none placeholder:text-white/40 focus:ring-2 focus:ring-white/30"
                    value={form.org}
                    onChange={(e) => setForm({ ...form, org: e.target.value })}
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm">Message</span>
                  <textarea
                    rows={4}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none placeholder:text-white/40 focus:ring-2 focus:ring-white/30"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </label>
                <div>
                  <Button type="submit" className="btn-gradient">Submit</Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}


