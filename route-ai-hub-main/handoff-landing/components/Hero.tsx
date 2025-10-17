import MotionDiv from "./MotionDiv";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-[92svh] flex items-center py-24 md:py-32 bg-gradient-to-b from-[#0A0F1C] via-[#0D1220] to-[#0A0F1C]">
      <MotionDiv className="mx-auto max-w-3xl text-center">
        <h1 className="font-heading text-pretty text-6xl sm:text-7xl lg:text-8xl leading-[0.95] font-semibold tracking-tight">
          <span className="block">Right Patient.</span>
          <span className="block">Right Place.</span>
          <span className="block">Right Now.</span>
        </h1>
        <p className="mt-5 text-base text-slate-300 md:text-lg font-body">
          Handoff is the AI router that sends every clinical order to the right place — instantly and intelligently.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild className="btn-gradient h-12 px-6 text-base">
            <Link href="/demo">Book a Demo</Link>
          </Button>
          <Button asChild variant="ghost" className="h-12 px-6 text-base">
            <Link href="/dashboard" className="flex items-center gap-2">
              View Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-6 flex justify-center">
          <Badge className="bg-white/10 text-white/80 text-sm md:text-base">FHIR-native • Works with Epic, Cerner, Athenahealth</Badge>
        </div>
      </MotionDiv>
    </section>
  );
}


