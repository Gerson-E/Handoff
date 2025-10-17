import MotionDiv from "./MotionDiv";
import { CheckCircle, Activity, Network, CircuitBoard } from "lucide-react";

export default function WhatWeDo() {
  return (
    <section id="what-we-do" className="py-28 md:py-36">
      <MotionDiv className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-4xl sm:text-5xl font-semibold tracking-tight mb-10 md:mb-14">What We Do</h2>
        <p className="mx-auto max-w-3xl text-center text-lg md:text-xl text-slate-300">
          Handoff is the identity-aware smart routing layer for healthcare. We read any clinical request (FHIR/HL7), resolve identity, score destination facilities by capability, proximity, history, and capacity, and return the correct endpoint with a confidence score and an audit-ready explanation. We integrate as a drop-in API across Epic/Cerner/Athena and partners—cutting misroutes, speeding turnaround, and improving referral closure.
        </p>
        <ul className="mt-8 grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-3">
          <li className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 text-center flex flex-col items-center gap-3">
            <Activity className="mt-0.5 h-5 w-5 text-teal" />
            <span className="text-slate-200"><strong>Ingest</strong> — FHIR/HL7 in; identity resolved</span>
          </li>
          <li className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 text-center flex flex-col items-center gap-3">
            <CircuitBoard className="mt-0.5 h-5 w-5 text-[var(--medical-blue)]" />
            <span className="text-slate-200"><strong>Decide</strong> — capability, proximity, history, capacity</span>
          </li>
          <li className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 text-center flex flex-col items-center gap-3">
            <Network className="mt-0.5 h-5 w-5 text-white" />
            <span className="text-slate-200"><strong>Route</strong> — endpoint + confidence + rationale returned</span>
          </li>
        </ul>
      </MotionDiv>
    </section>
  );
}


