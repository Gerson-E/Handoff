import Navbar from "@/components/Navbar";

export default function Page() {
  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight">About</h1>
        <p className="mt-4 max-w-3xl text-white/80">
          Handoff is the identity-aware routing layer for healthcare. We read any clinical request and send it to the correct facility—instantly, with explainable AI.
        </p>
      </main>
    </div>
  );
}


