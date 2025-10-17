import { Card, CardContent } from "@/components/ui/card";
import { fmtInt, pct, ms } from "../../lib/format";

interface Summary {
  total_orders_today: number;
  total_orders_7d: number;
  avg_confidence: number;
  auto_route_rate: number;
  p95_decision_ms: number;
  misroute_reduction: number;
}

export default function KpiGrid({ summary }: { summary: Summary }) {
  const items = [
    { label: "Orders (Today)", value: fmtInt(summary.total_orders_today) },
    { label: "Orders (7d)", value: fmtInt(summary.total_orders_7d) },
    { label: "Avg Confidence", value: pct(summary.avg_confidence, 1) },
    { label: "Auto-route Rate", value: pct(summary.auto_route_rate) },
    { label: "p95 Decision Time", value: ms(summary.p95_decision_ms) },
    { label: "Misroute Reduction", value: pct(summary.misroute_reduction) },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {items.map((it) => (
        <Card key={it.label} className="rounded-xl border border-white/10 bg-white/5">
          <CardContent className="p-5 md:p-6">
            <div className="text-sm text-slate-300">{it.label}</div>
            <div className="mt-2 text-2xl font-semibold">{it.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}


