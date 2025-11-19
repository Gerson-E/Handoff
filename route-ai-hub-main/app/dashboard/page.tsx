'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Target, 
  AlertTriangle, 
  Activity,
  Send,
  Wifi,
  WifiOff
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import KpiGrid from '@/components/dashboard/KpiGrid';
import TrendCharts from '@/components/dashboard/TrendCharts';
import FacilityTable from '@/components/dashboard/FacilityTable';
import RecentEvents from '@/components/dashboard/RecentEvents';
import ExplainabilityPanel from '@/components/dashboard/ExplainabilityPanel';
import { routeRequest, listEvents, openEventsStream } from '@/lib/api';
import { RouteRequest, RouteResponse } from '@/lib/types';
import { formatConfidence } from '@/lib/format';

export default function DashboardPage() {
  const [events, setEvents] = useState<RouteResponse[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<RouteResponse | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<RouteRequest>({
    patient_id: '',
    request_type: '',
    department: '',
    urgency: '',
    location_hint: '',
    free_text: '',
  });

  // Load initial events
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const initialEvents = await listEvents(50);
        setEvents(initialEvents);
      } catch (error) {
        console.error('Failed to load events:', error);
        // Fallback to demo mode
        generateDemoEvents();
      }
    };

    loadEvents();
  }, []);

  // Set up event stream
  useEffect(() => {
    const cleanup = openEventsStream((newEvent) => {
      setEvents(prev => [newEvent, ...prev.slice(0, 99)]); // Keep max 100 events
      setIsConnected(true);
    });

    return cleanup;
  }, []);

  // Demo mode fallback
  const generateDemoEvents = () => {
    const demoEvents: RouteResponse[] = [
      {
        route_to_facility_id: 'FAC001',
        route_to_endpoint: 'https://api.facility.com/requests',
        confidence: 0.92,
        decision_status: 'routed',
        reason: 'High confidence MRI routing based on location and capacity',
        explanation: 'Facility FAC001 has MRI availability and specializes in spine imaging',
        resolved_request_type: 'imaging',
        features_used: { location_proximity: 0.8, facility_capacity: 0.9, specialization_match: 0.95 },
        decision_id: 'DEMO_001',
        ttl_seconds: 3600,
        facility_name: 'Main Campus Radiology',
        address: '123 Medical Drive, City, State 12345',
        phone: '(555) 123-4567',
        hours: '24/7',
      },
    ];

    setEvents(demoEvents);
    setIsConnected(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await routeRequest(formData);
      setEvents(prev => [response, ...prev.slice(0, 99)]);
      setSelectedEvent(response);
      
      // Reset form
      setFormData({
        patient_id: '',
        request_type: '',
        department: '',
        urgency: '',
        location_hint: '',
        free_text: '',
      });
    } catch (error) {
      console.error('Failed to submit request:', error);
      // In demo mode, generate a synthetic response
      const syntheticResponse: RouteResponse = {
        route_to_facility_id: 'FAC002',
        route_to_endpoint: 'https://api.facility.com/requests',
        confidence: 0.87,
        decision_status: 'routed',
        reason: 'Demo routing decision',
        explanation: 'This is a synthetic response for demonstration purposes',
        resolved_request_type: formData.request_type || 'general',
        features_used: { demo_mode: 1.0 },
        decision_id: `DEMO_${Date.now()}`,
        ttl_seconds: 3600,
        facility_name: 'Demo Facility',
        address: 'Demo Address',
        phone: '(555) DEMO-123',
        hours: '9-5',
      };
      
      setEvents(prev => [syntheticResponse, ...prev.slice(0, 99)]);
      setSelectedEvent(syntheticResponse);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">Monitor routing decisions and system performance</p>
            </div>
            
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <Badge variant="outline" className="text-green-500 border-green-500">
                  <Wifi className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="outline" className="text-orange-500 border-orange-500">
                  <WifiOff className="w-3 h-3 mr-1" />
                  Demo Mode
                </Badge>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Dashboard Content */}
          <div className="lg:col-span-2 space-y-8">
            <KpiGrid events={events} />
            <TrendCharts events={events} />
            <FacilityTable events={events} />
            <RecentEvents 
              events={events} 
              onEventSelect={setSelectedEvent}
              selectedEvent={selectedEvent}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Demo Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Send className="w-5 h-5 mr-2" />
                  Try Routing Demo
                </CardTitle>
                <CardDescription>
                  Submit a test request to see the routing system in action
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="patient_id">Patient ID *</Label>
                    <Input
                      id="patient_id"
                      value={formData.patient_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, patient_id: e.target.value }))}
                      placeholder="P123456789"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={formData.department || ''}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="radiology">Radiology</SelectItem>
                        <SelectItem value="cardiology">Cardiology</SelectItem>
                        <SelectItem value="neurology">Neurology</SelectItem>
                        <SelectItem value="orthopedics">Orthopedics</SelectItem>
                        <SelectItem value="oncology">Oncology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="urgency">Urgency</Label>
                    <Select
                      value={formData.urgency || ''}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stat">STAT</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="routine">Routine</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="location_hint">Location Hint</Label>
                    <Input
                      id="location_hint"
                      value={formData.location_hint || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, location_hint: e.target.value }))}
                      placeholder="Main campus, Emergency dept, etc."
                    />
                  </div>

                  <div>
                    <Label htmlFor="free_text">Request Details</Label>
                    <Textarea
                      id="free_text"
                      value={formData.free_text || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, free_text: e.target.value }))}
                      placeholder="Describe the request in detail..."
                      rows={3}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting || !formData.patient_id}
                  >
                    {isSubmitting ? 'Routing...' : 'Submit Request'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Explainability Panel */}
            {selectedEvent && (
              <ExplainabilityPanel event={selectedEvent} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}