'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Brain, 
  Eye, 
  Building2, 
  Key, 
  Activity, 
  FileText, 
  Shield, 
  Lock,
  Code2,
  ChevronRight
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useState } from 'react';

const features = [
  {
    icon: Brain,
    title: 'Smart Request Classification',
    description: 'Advanced LLM-powered classification with built-in guardrails and safety measures.',
    details: 'Our AI models understand medical terminology and context to accurately classify requests. Built-in guardrails prevent misclassification and ensure clinical safety.',
    codeExample: `{
  "request_type": "imaging",
  "confidence": 0.94,
  "guardrails_passed": true,
  "classification_reason": "MRI request detected with high confidence"
}`,
  },
  {
    icon: Eye,
    title: 'Explainable Routing',
    description: 'Every routing decision includes clear, clinician-friendly explanations.',
    details: 'Transparency is key in healthcare. Our system provides detailed explanations for every routing decision, helping clinical staff understand and trust the AI recommendations.',
    codeExample: `{
  "explanation": "Facility FAC001 selected based on MRI availability, 
   spine imaging specialization, and proximity to patient location",
  "reasoning_factors": ["capacity", "specialization", "proximity"]
}`,
  },
  {
    icon: Building2,
    title: 'Multi-Factor Facility Scoring',
    description: 'Comprehensive scoring based on capability, proximity, history, and capacity.',
    details: 'Our scoring algorithm considers multiple factors including facility capabilities, geographic proximity, historical performance, and current capacity to make optimal routing decisions.',
    codeExample: `{
  "facility_scores": {
    "capability_match": 0.95,
    "proximity_score": 0.87,
    "capacity_available": 0.92,
    "historical_performance": 0.89
  },
  "total_score": 0.91
}`,
  },
  {
    icon: Key,
    title: 'Idempotent Requests',
    description: 'Safe request handling with Idempotency-Key support for reliable operations.',
    details: 'Prevent duplicate processing and ensure reliable request handling with our idempotency system. Perfect for retry scenarios and high-volume environments.',
    codeExample: `POST /api/route
Headers: {
  "Idempotency-Key": "req_12345",
  "Content-Type": "application/json"
}
Body: { "patient_id": "P123", "request_type": "imaging" }`,
  },
  {
    icon: Activity,
    title: 'Real-time Event Streaming',
    description: 'Live updates via Server-Sent Events for instant visibility into routing decisions.',
    details: 'Get real-time updates on all routing decisions through our Server-Sent Events stream. Perfect for dashboards and monitoring systems.',
    codeExample: `const eventSource = new EventSource('/api/events/stream');
eventSource.onmessage = (event) => {
  const routingDecision = JSON.parse(event.data);
  updateDashboard(routingDecision);
};`,
  },
  {
    icon: FileText,
    title: 'FHIR R4 ServiceRequest Adapter',
    description: 'Seamless integration with FHIR R4 ServiceRequest standards.',
    details: 'Built-in support for FHIR R4 ServiceRequest resources ensures compatibility with existing healthcare systems and workflows.',
    codeExample: `{
  "resourceType": "ServiceRequest",
  "id": "req-123",
  "status": "active",
  "intent": "order",
  "subject": { "reference": "Patient/P123" },
  "code": { "coding": [{"system": "LOINC", "code": "12345"}] }
}`,
  },
  {
    icon: Shield,
    title: 'Audit Logs & Metrics',
    description: 'Comprehensive logging and metrics for compliance and performance monitoring.',
    details: 'Every action is logged with detailed audit trails. Built-in metrics help you monitor performance, identify bottlenecks, and ensure compliance.',
    codeExample: `{
  "audit_log": {
    "timestamp": "2024-01-15T10:30:00Z",
    "action": "route_request",
    "user_id": "user123",
    "patient_id": "P456",
    "decision_id": "DEC_001"
  }
}`,
  },
  {
    icon: Lock,
    title: 'Simple API Key Auth + CORS',
    description: 'Easy integration with API key authentication and CORS support.',
    details: 'Simple API key authentication makes integration straightforward. CORS support ensures seamless operation in web applications.',
    codeExample: `Headers: {
  "x-api-key": "your-api-key",
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*"
}`,
  },
];

export default function FeaturesPage() {
  const [selectedFeature, setSelectedFeature] = useState<typeof features[0] | null>(null);

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Feature Details
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore our comprehensive feature set designed for healthcare request routing.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 card-gradient">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => setSelectedFeature(feature)}
                        >
                          Learn More
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center">
                            <feature.icon className="w-6 h-6 text-primary mr-2" />
                            {feature.title}
                          </DialogTitle>
                          <DialogDescription className="text-base">
                            {feature.details}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                          <h4 className="font-semibold">Code Example:</h4>
                          <pre className="bg-muted/50 p-4 rounded-lg overflow-x-auto text-sm">
                            <code>{feature.codeExample}</code>
                          </pre>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-16"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground mb-6">
              Try our API with the free tier and see how easy it is to integrate.
            </p>
            <Button size="lg" onClick={() => window.location.href = '/dashboard'}>
              <Code2 className="mr-2 h-5 w-5" />
              Try the Dashboard
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
