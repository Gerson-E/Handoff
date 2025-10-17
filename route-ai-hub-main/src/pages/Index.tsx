import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/StatCard";
import EventStream from "@/components/EventStream";
import { Activity, MapPin, TrendingUp, Clock, Plus } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-medical">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Handoff</h1>
                <p className="text-sm text-muted-foreground">Smart Request Routing</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button onClick={() => navigate("/submit")} className="shadow-glow">
                <Plus className="mr-2 h-4 w-4" />
                Submit Request
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Routes Today"
            value="147"
            description="Active routing decisions"
            icon={Activity}
            trend={{ value: "12% vs yesterday", positive: true }}
          />
          <StatCard
            title="Avg Confidence"
            value="89%"
            description="AI routing accuracy"
            icon={TrendingUp}
            trend={{ value: "3% improvement", positive: true }}
          />
          <StatCard
            title="Active Facilities"
            value="24"
            description="Connected endpoints"
            icon={MapPin}
          />
          <StatCard
            title="Avg Response Time"
            value="1.2s"
            description="Routing decision speed"
            icon={Clock}
            trend={{ value: "0.3s faster", positive: true }}
          />
        </div>

        {/* Event Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <EventStream />
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-gradient-medical text-white shadow-lg">
              <h3 className="text-xl font-bold mb-2">Ready to Route?</h3>
              <p className="text-white/90 text-sm mb-4">
                Submit a new patient request and watch the AI routing engine work in real-time.
              </p>
              <Button
                variant="secondary"
                onClick={() => navigate("/submit")}
                className="w-full"
              >
                Create Request
              </Button>
            </div>

            <div className="p-6 rounded-xl bg-card shadow-md">
              <h3 className="font-bold mb-2">System Status</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Backend API</span>
                  <span className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-secondary animate-pulse-glow" />
                    Connected
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">AI Classification</span>
                  <span className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-secondary animate-pulse-glow" />
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Live Stream</span>
                  <span className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-secondary animate-pulse-glow" />
                    Streaming
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-card shadow-md">
              <h3 className="font-bold mb-2">Recent Facilities</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between py-2 border-b">
                  <span>Keck Radiology</span>
                  <span className="text-muted-foreground">15 routes</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span>UCLA Medical</span>
                  <span className="text-muted-foreground">12 routes</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>Cedars-Sinai Lab</span>
                  <span className="text-muted-foreground">8 routes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
