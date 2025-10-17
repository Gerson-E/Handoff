'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

const codeExample = {
  request: {
    patient_id: "P123456789",
    request_type: "imaging",
    department: "radiology",
    urgency: "routine",
    location_hint: "main campus",
    free_text: "Patient needs MRI of lumbar spine for back pain"
  },
  response: {
    route_to_facility_id: "FAC001",
    route_to_endpoint: "https://api.facility.com/requests",
    confidence: 0.92,
    decision_status: "routed",
    reason: "High confidence MRI routing based on location and capacity",
    explanation: "Facility FAC001 has MRI availability and specializes in spine imaging",
    resolved_request_type: "imaging",
    features_used: {
      "location_proximity": 0.8,
      "facility_capacity": 0.9,
      "specialization_match": 0.95
    },
    decision_id: "DEC_20241201_001",
    ttl_seconds: 3600,
    facility_name: "Main Campus Radiology",
    address: "123 Medical Drive, City, State 12345",
    phone: "(555) 123-4567",
    hours: "24/7"
  }
};

export default function CodeSnippet() {
  const [copied, setCopied] = useState<'request' | 'response' | null>(null);

  const copyToClipboard = (text: string, type: 'request' | 'response') => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section className="py-20" id="demo-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Simple API Integration
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Integrate with just a few lines of code. Send requests, get intelligent routing decisions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Request */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">POST /api/route</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(JSON.stringify(codeExample.request, null, 2), 'request')}
                  >
                    {copied === 'request' ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <CardDescription>Send a routing request</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted/50 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{JSON.stringify(codeExample.request, null, 2)}</code>
                </pre>
              </CardContent>
            </Card>
          </motion.div>

          {/* Response */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Response</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(JSON.stringify(codeExample.response, null, 2), 'response')}
                  >
                    {copied === 'response' ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <CardDescription>Get routing decision with explanation</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted/50 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{JSON.stringify(codeExample.response, null, 2)}</code>
                </pre>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            onClick={() => window.location.href = '/dashboard'}
            className="bg-primary hover:bg-primary/90 text-lg px-8 py-3"
          >
            Ready to reduce leakage?
          </Button>
        </motion.div>
      </div>
    </section>
  );
}