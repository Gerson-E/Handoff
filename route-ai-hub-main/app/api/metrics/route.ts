import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data for the dashboard
  const mockData = {
    summary: {
      total_orders_today: 1247,
      total_orders_7d: 8234,
      avg_confidence: 0.89,
      auto_route_rate: 0.76,
      p95_decision_time: 45,
      misroute_reduction: 0.23
    },
    trends: {
      orders_30d: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        orders: Math.floor(Math.random() * 200) + 800
      })),
      confidence_30d: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        confidence: Math.random() * 0.2 + 0.8
      }))
    },
    facilities: [
      { name: "City General Hospital", type: "Hospital", routed_today: 234, routed_7d: 1456, capacity: 0.78, avg_conf: 0.92 },
      { name: "Metro Medical Center", type: "Medical Center", routed_today: 189, routed_7d: 1234, capacity: 0.65, avg_conf: 0.88 },
      { name: "Regional Health Clinic", type: "Clinic", routed_today: 156, routed_7d: 987, capacity: 0.82, avg_conf: 0.85 },
      { name: "University Hospital", type: "Hospital", routed_today: 298, routed_7d: 1876, capacity: 0.71, avg_conf: 0.94 },
      { name: "Community Health Center", type: "Clinic", routed_today: 134, routed_7d: 876, capacity: 0.89, avg_conf: 0.87 },
      { name: "Emergency Care Facility", type: "Emergency", routed_today: 89, routed_7d: 567, capacity: 0.45, avg_conf: 0.91 },
      { name: "Specialty Medical Group", type: "Specialty", routed_today: 67, routed_7d: 423, capacity: 0.92, avg_conf: 0.89 },
      { name: "Pediatric Care Center", type: "Pediatric", routed_today: 78, routed_7d: 512, capacity: 0.76, avg_conf: 0.93 }
    ],
    explainability: {
      reason_weights: [
        { reason: "Patient History", weight: 0.35 },
        { reason: "Geographic Proximity", weight: 0.28 },
        { reason: "Facility Capacity", weight: 0.22 },
        { reason: "Specialty Match", weight: 0.15 }
      ],
      error_mix: [
        { type: "Capacity Overflow", count: 12 },
        { type: "Specialty Mismatch", count: 8 },
        { type: "Geographic Distance", count: 5 },
        { type: "Insurance Coverage", count: 3 }
      ]
    },
    recent_events: [
      {
        id: "evt_001",
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        patient_id: "P12345",
        request_type: "MRI",
        facility: "City General Hospital",
        confidence: 0.94,
        status: "routed"
      },
      {
        id: "evt_002", 
        timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
        patient_id: "P12346",
        request_type: "Lab Work",
        facility: "Metro Medical Center",
        confidence: 0.87,
        status: "routed"
      },
      {
        id: "evt_003",
        timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
        patient_id: "P12347",
        request_type: "Emergency",
        facility: "Emergency Care Facility",
        confidence: 0.96,
        status: "routed"
      }
    ]
  };

  return NextResponse.json(mockData);
}
