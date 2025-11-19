export type RouteRequest = {
  patient_id: string;
  request_type?: string | null;
  department?: string | null;
  urgency?: string | null;
  location_hint?: string | null;
  free_text?: string | null;
};

export type RouteResponse = {
  route_to_facility_id: string;
  route_to_endpoint: string;
  confidence: number;
  decision_status: "routed" | "fallback" | "failed";
  reason: string;
  explanation?: string | null;
  resolved_request_type?: string | null;
  features_used: Record<string, number>;
  decision_id: string;
  ttl_seconds: number;
  facility_name?: string | null;
  address?: string | null;
  phone?: string | null;
  hours?: string | null;
};

export type Event = RouteResponse & {
  timestamp: string;
  patient_id: string;
};

export type KpiData = {
  totalRouted: number;
  avgConfidence: number;
  fallbackRate: number;
  last24hVolume: number;
};

export type TrendData = {
  timestamp: string;
  volume: number;
  requestType: string;
};
