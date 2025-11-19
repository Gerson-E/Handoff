export default function Issues() {
  const items = [
    { value: "50%", label: "Identity matches across systems" },
    { value: "18%", label: "Duplicate records inside orgs" },
    { value: "70%", label: "Diagnostic errors tied to testing" },
    { value: "30%", label: "Revenue lost from referral leakage" },
  ];

  return (
    <section className="w-full bg-[#0B1221] py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-2xl font-semibold text-white">The Issues</h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <div
              key={i}
              className="rounded-2xl border border-blue-800/40 bg-blue-950/40 px-6 py-8 text-center text-blue-100 shadow-sm transition-all hover:ring-1 hover:ring-blue-600/40"
            >
              <div className="text-4xl font-extrabold tracking-tight text-white">{it.value}</div>
              <div className="mt-2 text-sm opacity-90">{it.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
