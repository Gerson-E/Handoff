import { useEffect, useState, useCallback } from 'react';

export interface StreamEvent {
  event_type: string;
  timestamp: string;
  patient_id: string;
  facility_id: string;
  confidence: number;
  [key: string]: any;
}

export function useEventStream(onEvent?: (event: StreamEvent) => void) {
  const [events, setEvents] = useState<StreamEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const handleNewEvent = useCallback((event: StreamEvent) => {
    setEvents((prev) => [event, ...prev]);
    if (onEvent) {
      onEvent(event);
    }
  }, [onEvent]);

  useEffect(() => {
    const es = new EventSource("/api/events/stream");

    es.onopen = () => {
      setIsConnected(true);
      setError(null);
    };

    es.onmessage = (e) => {
      try {
        const evt = JSON.parse(e.data);
        handleNewEvent(evt);
      } catch (err) {
        console.error("Failed to parse event:", err);
      }
    };

    es.onerror = () => {
      setIsConnected(false);
      setError("Connection lost");
      es.close();
    };

    return () => {
      es.close();
    };
  }, [handleNewEvent]);

  return {
    events,
    error,
    isConnected,
  };
}
