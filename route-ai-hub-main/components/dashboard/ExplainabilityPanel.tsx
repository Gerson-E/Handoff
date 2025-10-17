"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

interface Weights { capability: number; proximity: number; history: number; capacity: number }
interface Errors { low_confidence: number; identity_missing: number; downstream_unavailable: number }

export default function ExplainabilityPanel({ reason_weights, error_rates }: { reason_weights: Weights; error_rates: Errors }) {
  const weightsData = Object.entries(reason_weights).map(([k, v]) => ({ name: k, value: v }));
  const errorsData = Object.entries(error_rates).map(([k, v]) => ({ name: k, value: v }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <Card className="rounded-xl border border-white/10 bg-white/5">
        <CardContent className="p-5 md:p-6">
          <div className="mb-3 text-sm text-slate-300">Reason Weights</div>
          <div role="img" aria-label="Explainability reason weights" className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weightsData} layout="vertical" margin={{ left: 16, right: 16 }}>
                <XAxis type="number" hide domain={[0, 1]} />
                <YAxis dataKey="name" type="category" width={100} tick={{ fill: "#CBD5E1" }} />
                <Tooltip contentStyle={{ background: "#0B111A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} labelStyle={{ color: "#fff" }} />
                <Bar dataKey="value" fill="#0F5FFF" radius={[4, 4, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-xl border border-white/10 bg-white/5">
        <CardContent className="p-5 md:p-6">
          <div className="mb-3 text-sm text-slate-300">Error Mix</div>
          <div role="img" aria-label="Error mix" className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={errorsData} layout="vertical" margin={{ left: 16, right: 16 }}>
                <XAxis type="number" hide domain={[0, 1]} />
                <YAxis dataKey="name" type="category" width={150} tick={{ fill: "#CBD5E1" }} />
                <Tooltip contentStyle={{ background: "#0B111A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} labelStyle={{ color: "#fff" }} />
                <Bar dataKey="value" fill="#0DB7A8" radius={[4, 4, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


