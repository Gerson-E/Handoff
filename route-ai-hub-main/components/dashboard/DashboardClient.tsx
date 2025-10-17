"use client";
import KpiGrid from "./KpiGrid";
import TrendCharts from "./TrendCharts";
import FacilityTable from "./FacilityTable";
import ExplainabilityPanel from "./ExplainabilityPanel";
import RecentEvents from "./RecentEvents";

export default function DashboardClient({ data }: { data: any }) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-12">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold">Dashboard</h1>
        <p className="text-sm text-slate-300">Routing performance & system health</p>
      </header>

      <section className="mb-8 md:mb-10">
        <KpiGrid summary={data.summary} />
      </section>

      <section className="mb-8 md:mb-10">
        <TrendCharts data={data.timeseries_30d} />
      </section>

      <section className="mb-8 md:mb-10">
        <FacilityTable facilities={data.facilities} />
      </section>

      <section className="mb-8 md:mb-10">
        <ExplainabilityPanel reason_weights={data.reason_weights} error_rates={data.error_rates} />
      </section>

      <section>
        <RecentEvents events={data.recent_events} />
      </section>
    </div>
  );
}


