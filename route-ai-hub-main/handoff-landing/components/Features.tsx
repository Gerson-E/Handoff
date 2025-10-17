import MotionDiv from "./MotionDiv";
import { Brain, Network, ShieldCheck, PlugZap, Users, Gauge } from "lucide-react";

const features = [
  { icon: Brain, title: "Explainable AI", desc: "Confidence, feature scores, and a clinician-readable rationale for every decision." },
  { icon: Network, title: "Facility Knowledge Graph", desc: "Live capabilities, endpoints, proximity, and capacity signals." },
  { icon: ShieldCheck, title: "Identity Adapter", desc: "Pluggable (mock now; Verato-ready) for high-confidence patient resolution." },
  { icon: PlugZap, title: "Drop-in API", desc: "FHIR/HL7 adapter, secure webhooks, audit trail." },
  { icon: Users, title: "Human-in-the-Loop", desc: "Overrides teach the model and improve accuracy over time." },
  { icon: Gauge, title: "Low-latency Runtime", desc: "Sub-second route decisions at scale." },
];

export default function Features() {
  return (
    <section id="features" className="py-24 md:py-32">
      <MotionDiv className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-4xl sm:text-5xl font-semibold tracking-tight mb-10 md:mb-14">Features</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border border-white/10 bg-white/5 p-6 flex items-start gap-4">
              <Icon className="h-6 w-6 text-[var(--medical-blue)]" />
              <div>
                <div className="font-medium">{title}</div>
                <p className="mt-1 text-sm text-slate-300">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </MotionDiv>
    </section>
  );
}


