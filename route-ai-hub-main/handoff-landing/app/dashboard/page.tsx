import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>Placeholder {i + 1}</CardTitle>
              </CardHeader>
              <CardContent className="text-white/80">Content coming soon.</CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}


