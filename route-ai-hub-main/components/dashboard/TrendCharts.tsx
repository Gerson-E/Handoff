"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface TSItem { date: string; orders: number; avg_conf: number }

export default function TrendCharts({ data }: { data: TSItem[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <Card className="rounded-xl border border-white/10 bg-white/5">
        <CardContent className="p-5 md:p-6">
          <div className="mb-3 text-sm text-slate-300">Orders (30d)</div>
          <div role="img" aria-label="Orders over last 30 days">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F5FFF" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0F5FFF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" hide tickLine axisLine/>
                <YAxis hide tickLine axisLine/>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
                <Tooltip contentStyle={{ background: "#0B111A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} labelStyle={{ color: "#fff" }} />
                <Area type="monotone" dataKey="orders" stroke="#0F5FFF" fillOpacity={1} fill="url(#ordersGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl border border-white/10 bg-white/5">
        <CardContent className="p-5 md:p-6">
          <div className="mb-3 text-sm text-slate-300">Avg Confidence (30d)</div>
          <div role="img" aria-label="Average confidence over last 30 days">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                <XAxis dataKey="date" hide tickLine axisLine/>
                <YAxis hide tickLine axisLine domain={[0, 1]} />
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
                <Tooltip contentStyle={{ background: "#0B111A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} labelStyle={{ color: "#fff" }} />
                <Line type="monotone" dataKey="avg_conf" stroke="#0DB7A8" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


