'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Clock, Target, Eye } from 'lucide-react';
import { RouteResponse } from '@/lib/types';
import { formatConfidence, formatDateTime } from '@/lib/format';

interface RecentEventsProps {
  events: RouteResponse[];
  onEventSelect: (event: RouteResponse) => void;
  selectedEvent: RouteResponse | null;
}

export default function RecentEvents({ events, onEventSelect, selectedEvent }: RecentEventsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'routed':
        return 'default';
      case 'fallback':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'routed':
        return Target;
      case 'fallback':
        return Clock;
      case 'failed':
        return Activity;
      default:
        return Activity;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <h2 className="text-2xl font-bold text-foreground mb-6">Recent Events</h2>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Live Event Stream
          </CardTitle>
          <CardDescription>
            Real-time routing decisions and updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events.length > 0 ? (
              events.slice(0, 10).map((event, index) => {
                const StatusIcon = getStatusIcon(event.decision_status);
                const isSelected = selectedEvent?.decision_id === event.decision_id;
                
                return (
                  <motion.div
                    key={event.decision_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    className={`p-4 border rounded-lg transition-all duration-200 ${
                      isSelected 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <StatusIcon className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-sm text-foreground">
                          {event.decision_id}
                        </span>
                        <Badge variant={getStatusColor(event.decision_status)}>
                          {event.decision_status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {formatConfidence(event.confidence)}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEventSelect(event)}
                          className="h-8 px-2"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-2">
                      {event.reason}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{event.facility_name || event.route_to_facility_id}</span>
                      <span>{formatDateTime(new Date())}</span>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No events yet. Submit a routing request to see live events.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}