"use client";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { fmtInt, pct } from "../../lib/format";

interface Facility { name: string; type: string; routed_today: number; routed_7d: number; capacity: number; avg_conf: number }

type Key = keyof Facility;

export default function FacilityTable({ facilities }: { facilities: Facility[] }) {
  const [sortKey, setSortKey] = useState<Key>("routed_today");
  const [sortAsc, setSortAsc] = useState(false);

  const sorted = useMemo(() => {
    const arr = [...facilities];
    arr.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") return sortAsc ? av - bv : bv - av;
      return sortAsc ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return arr;
  }, [facilities, sortKey, sortAsc]);

  function toggle(key: Key) {
    if (key === sortKey) setSortAsc((v) => !v);
    else { setSortKey(key); setSortAsc(false); }
  }

  const th = (label: string, key: Key) => (
    <th className="px-3 py-2 text-left text-xs font-medium text-slate-300 cursor-pointer select-none" onClick={() => toggle(key)}>
      {label}
    </th>
  );

  return (
    <Card className="rounded-xl border border-white/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              {th("Facility", "name")}
              {th("Type", "type")}
              {th("Today", "routed_today")}
              {th("7d", "routed_7d")}
              {th("Capacity", "capacity")}
              {th("Avg Conf", "avg_conf")}
            </tr>
          </thead>
          <tbody>
            {sorted.map((f, i) => (
              <tr key={f.name} className={i % 2 === 0 ? "bg-transparent" : "bg-white/5"}>
                <td className="px-3 py-3 whitespace-nowrap">{f.name}</td>
                <td className="px-3 py-3 whitespace-nowrap text-slate-300">{f.type}</td>
                <td className="px-3 py-3">{fmtInt(f.routed_today)}</td>
                <td className="px-3 py-3">{fmtInt(f.routed_7d)}</td>
                <td className="px-3 py-3">{pct(f.capacity)}</td>
                <td className="px-3 py-3">{pct(f.avg_conf, 1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}


