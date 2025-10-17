import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, FlaskRound, Scan, MapPin } from "lucide-react";

interface EventItem { id: string; time: string; type: string; facility: string; confidence: number; reason: string }

export default function RecentEvents({ events }: { events: EventItem[] }) {
  const iconFor = (t: string) => {
    if (t.toLowerCase().includes("lab")) return <FlaskRound className="h-4 w-4" />;
    if (t.toLowerCase().includes("mri") || t.toLowerCase().includes("scan")) return <Scan className="h-4 w-4" />;
    return <Activity className="h-4 w-4" />;
  };
  return (
    <Card className="rounded-xl border border-white/10 bg-white/5">
      <CardContent className="p-5 md:p-6">
        <div className="mb-3 text-sm text-slate-300">Recent Events</div>
        <div className="space-y-3">
          {events.slice(0, 10).map((e) => (
            <div key={e.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
              <div className="text-slate-300">{iconFor(e.type)}</div>
              <div className="min-w-0">
                <div className="truncate text-sm"><span className="text-white/90">{e.type}</span> • <span className="text-slate-300">{e.facility}</span></div>
                <div className="text-xs text-slate-400 truncate">{e.reason}</div>
              </div>
              <div className="text-right">
                <Badge className="bg-white/10">{Math.round(e.confidence * 100)}%</Badge>
                <div className="text-[11px] text-slate-400 mt-1">{e.time}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


