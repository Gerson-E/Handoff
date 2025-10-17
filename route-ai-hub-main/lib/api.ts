import { RouteRequest, RouteResponse } from './types';

const BASE = process.env.NEXT_PUBLIC_API_BASE || "/api";

export async function routeRequest(body: RouteRequest, idem?: string): Promise<RouteResponse> {
  const res = await fetch(`${BASE}/route`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(idem ? { "Idempotency-Key": idem } : {}),
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Route failed: ${res.status} ${errorText}`);
  }
  
  return (await res.json()) as RouteResponse;
}

export async function listEvents(limit = 50): Promise<RouteResponse[]> {
  const res = await fetch(`${BASE}/events?limit=${limit}`, { 
    cache: "no-store" 
  });
  
  if (!res.ok) {
    throw new Error(`Events failed: ${res.status}`);
  }
  
  return (await res.json()) as RouteResponse[];
}

export function openEventsStream(onEvent: (evt: RouteResponse) => void): () => void {
  const es = new EventSource(`${BASE}/events/stream`);
  
  es.onmessage = (e) => {
    try { 
      onEvent(JSON.parse(e.data)); 
    } catch (error) {
      console.warn('Failed to parse event stream data:', error);
    }
  };
  
  es.onerror = () => {
    console.warn('Event stream connection error');
  };
  
  return () => es.close();
}
