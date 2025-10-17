import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, MapPin, Clock, TrendingUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RoutingEvent {
  id: string;
  ts: string;
  patient_id: string;
  request_type: string;
  routed_facility_id: string;
  confidence: number;
  reason: string;
  explanation: string;
}

const EventStream = () => {
  const [events, setEvents] = useState<RoutingEvent[]>([]);

  useEffect(() => {
    // Connect to SSE endpoint
    // Replace with your actual backend endpoint
    const eventSource = new EventSource("http://localhost:8000/events/stream");

    eventSource.onmessage = (event) => {
      const newEvent = JSON.parse(event.data);
      setEvents((prev) => [newEvent, ...prev].slice(0, 50)); // Keep last 50 events
    };

    eventSource.onerror = () => {
      console.log("SSE connection failed. Using mock data for demo.");
      // Fallback to polling or mock data
      loadMockEvents();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const loadMockEvents = async () => {
    // Fallback: fetch from REST endpoint
    try {
      const response = await fetch("http://localhost:8000/events");
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.log("Using demo data");
      // Demo data for when backend is not available
      setEvents([
        {
          id: "evt_demo1",
          ts: new Date().toISOString(),
          patient_id: "V10001",
          request_type: "MRI",
          routed_facility_id: "002",
          confidence: 0.92,
          reason: "Closest MRI center with prior history",
          explanation: "Patient has 3 prior visits. Located 2.4 miles away with current capacity.",
        },
        {
          id: "evt_demo2",
          ts: new Date(Date.now() - 300000).toISOString(),
          patient_id: "V10045",
          request_type: "Lab",
          routed_facility_id: "001",
          confidence: 0.88,
          reason: "Specialized lab capabilities",
          explanation: "Facility offers specialized testing with fast turnaround.",
        },
      ]);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-secondary text-secondary-foreground";
    if (confidence >= 0.6) return "bg-accent text-accent-foreground";
    return "bg-muted text-muted-foreground";
  };

  const getUrgencyColor = (type: string) => {
    const urgent = ["STAT", "Emergency", "Urgent"];
    return urgent.some(u => type.includes(u)) ? "border-l-4 border-l-destructive" : "border-l-4 border-l-primary";
  };

  return (
    <Card className="p-6 bg-gradient-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary animate-pulse-glow" />
          <h2 className="text-xl font-bold">Live Event Stream</h2>
        </div>
        <Badge variant="outline" className="animate-pulse-glow">
          {events.length} Events
        </Badge>
      </div>

      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-3">
          {events.map((event, index) => (
            <div
              key={event.id}
              className={`p-4 rounded-lg bg-card hover:bg-muted/50 transition-all duration-300 animate-slide-in-right ${getUrgencyColor(event.request_type)}`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-medium">{event.patient_id}</span>
                  <Badge variant="secondary">{event.request_type}</Badge>
                </div>
                <Badge className={getConfidenceColor(event.confidence)}>
                  {(event.confidence * 100).toFixed(0)}%
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Facility: {event.routed_facility_id}</span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span>{event.reason}</span>
                </div>

                <p className="text-xs text-muted-foreground mt-2 pl-6">
                  {event.explanation}
                </p>

                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(event.ts).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}

          {events.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Waiting for routing events...</p>
              <p className="text-sm mt-2">Events will appear here in real-time</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default EventStream;
