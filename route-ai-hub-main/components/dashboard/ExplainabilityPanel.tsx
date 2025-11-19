'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Target, BarChart3, FileText } from 'lucide-react';
import { RouteResponse } from '@/lib/types';
import { formatConfidence } from '@/lib/format';

interface ExplainabilityPanelProps {
  event: RouteResponse;
}

export default function ExplainabilityPanel({ event }: ExplainabilityPanelProps) {
  const features = Object.entries(event.features_used).map(([key, value]) => ({
    name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: value,
    percentage: Math.round(value * 100),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            Decision Explanation
          </CardTitle>
          <CardDescription>
            Understanding the AI routing decision
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Decision Status */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Decision Status</span>
              <Badge variant="default">{event.decision_status}</Badge>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Confidence</span>
              <Badge variant="outline">{formatConfidence(event.confidence)}</Badge>
            </div>
          </div>

          {/* Reason */}
          <div>
            <div className="flex items-center mb-2">
              <Target className="w-4 h-4 mr-2 text-primary" />
              <span className="text-sm font-medium text-foreground">Reason</span>
            </div>
            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
              {event.reason}
            </p>
          </div>

          {/* Explanation */}
          {event.explanation && (
            <div>
              <div className="flex items-center mb-2">
                <FileText className="w-4 h-4 mr-2 text-primary" />
                <span className="text-sm font-medium text-foreground">Detailed Explanation</span>
              </div>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                {event.explanation}
              </p>
            </div>
          )}

          {/* Resolved Request Type */}
          {event.resolved_request_type && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Resolved Type</span>
                <Badge variant="secondary">{event.resolved_request_type}</Badge>
              </div>
            </div>
          )}

          {/* Features Used */}
          {features.length > 0 && (
            <div>
              <div className="flex items-center mb-3">
                <BarChart3 className="w-4 h-4 mr-2 text-primary" />
                <span className="text-sm font-medium text-foreground">Features Used</span>
              </div>
              <div className="space-y-2">
                {features.map((feature) => (
                  <div key={feature.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{feature.name}</span>
                      <span className="text-foreground">{feature.percentage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${feature.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Facility Information */}
          {event.facility_name && (
            <div>
              <div className="flex items-center mb-2">
                <span className="text-sm font-medium text-foreground">Routed To</span>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg space-y-1">
                <div className="text-sm font-medium text-foreground">{event.facility_name}</div>
                {event.address && (
                  <div className="text-xs text-muted-foreground">{event.address}</div>
                )}
                {event.phone && (
                  <div className="text-xs text-muted-foreground">{event.phone}</div>
                )}
                {event.hours && (
                  <div className="text-xs text-muted-foreground">{event.hours}</div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}