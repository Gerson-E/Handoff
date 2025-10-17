import MotionDiv from "./MotionDiv";
import { Card, CardContent } from "./ui/card";

const items = [
  { metric: "~50%", desc: "Cross-org patient matching often fails.", source: "Pew Charitable Trusts" },
  { metric: "~18%", desc: "Duplicate records inside organizations.", source: "PMC" },
  { metric: "70% / 9%", desc: "Testing and referrals drive errors.", source: "ECRI & ISMP" },
  { metric: "10–30%", desc: "Revenue leaks from lost referrals.", source: "Clarify Health" },
];

export default function Issues() {
  return (
    <section id="issues" className="relative text-neutral-50 py-24 md:py-32">
      <MotionDiv className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 mx-auto overflow-hidden bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(96,91,255,0.18),transparent_60%),radial-gradient(1000px_500px_at_80%_110%,rgba(128,0,255,0.16),transparent_60%),linear-gradient(180deg,rgba(18,24,42,0.85),rgba(12,18,31,0.85))] p-8 md:p-12 lg:p-16">
          <h2 className="text-center text-4xl sm:text-5xl font-semibold tracking-tight mb-10 md:mb-14">Current Issues</h2>
          <div className="grid auto-rows-fr grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((it) => (
              <div key={it.metric} className="rounded-2xl border border-white/10 bg-[#0B111A]/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] p-7 md:p-8 flex h-full flex-col items-center justify-between text-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-[#6BA7FF] via-[#8C7BFF] to-[#C07CFF] tabular-nums">
                  {it.metric}
                </div>
                <div className="mt-3 text-center text-sm md:text-base text-slate-300">
                  {it.desc}
                </div>
                <div className="mt-5 text-xs text-slate-400">Source: {it.source}</div>
              </div>
            ))}
          </div>
        </div>
      </MotionDiv>
    </section>
  );
}


