"use client";
import { useState } from "react";
import KpiGrid from "./KpiGrid";
import TrendCharts from "./TrendCharts";
import FacilityTable from "./FacilityTable";
import ExplainabilityPanel from "./ExplainabilityPanel";
import RecentEvents from "./RecentEvents";
import { RouteResponse } from "@/lib/types";

export default function DashboardClient({ data }: { data: any }) {
  const [selectedEvent, setSelectedEvent] = useState<RouteResponse | null>(null);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-12">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold">Dashboard</h1>
        <p className="text-sm text-slate-300">Routing performance & system health</p>
      </header>

      <section className="mb-8 md:mb-10">
        <KpiGrid events={data.events || []} />
      </section>

      <section className="mb-8 md:mb-10">
        <TrendCharts events={data.events || []} />
      </section>

      <section className="mb-8 md:mb-10">
        <FacilityTable events={data.events || []} />
      </section>

      {data.events && data.events.length > 0 && (
        <section className="mb-8 md:mb-10">
          <ExplainabilityPanel event={data.events[0]} />
        </section>
      )}

      <section>
        <RecentEvents
          events={data.events || []}
          onEventSelect={setSelectedEvent}
          selectedEvent={selectedEvent}
        />
      </section>
    </div>
  );
}


