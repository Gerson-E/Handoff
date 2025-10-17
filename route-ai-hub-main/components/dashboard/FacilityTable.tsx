'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Phone, Clock, MapPin } from 'lucide-react';
import { RouteResponse } from '@/lib/types';

interface FacilityTableProps {
  events: RouteResponse[];
}

export default function FacilityTable({ events }: FacilityTableProps) {
  // Generate facility data from events
  const facilityData = events.reduce((acc, event) => {
    const facilityId = event.route_to_facility_id;
    if (!acc[facilityId]) {
      acc[facilityId] = {
        id: facilityId,
        name: event.facility_name || `Facility ${facilityId}`,
        type: event.resolved_request_type || 'General',
        capacity: Math.floor(Math.random() * 40) + 60, // 60-100%
        utilization: Math.floor(Math.random() * 30) + 20, // 20-50%
        lastRouted: new Date().toISOString(),
        totalRouted: 0,
        address: event.address || 'Address not available',
        phone: event.phone || 'Phone not available',
        hours: event.hours || 'Hours not available',
      };
    }
    acc[facilityId].totalRouted += 1;
    acc[facilityId].lastRouted = new Date().toISOString();
    return acc;
  }, {} as Record<string, any>);

  const facilities = Object.values(facilityData);

  const getCapacityColor = (capacity: number) => {
    if (capacity >= 90) return 'destructive';
    if (capacity >= 75) return 'secondary';
    return 'default';
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 80) return 'destructive';
    if (utilization >= 60) return 'secondary';
    return 'default';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <h2 className="text-2xl font-bold text-foreground mb-6">Facility Overview</h2>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="w-5 h-5 mr-2" />
            Active Facilities
          </CardTitle>
          <CardDescription>
            Current facility status and routing performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {facilities.length > 0 ? (
              facilities.map((facility, index) => (
                <motion.div
                  key={facility.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-foreground">{facility.name}</h3>
                      <Badge variant="outline">{facility.type}</Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {facility.address}
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {facility.phone}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {facility.hours}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Capacity</div>
                      <Badge variant={getCapacityColor(facility.capacity)}>
                        {facility.capacity}%
                      </Badge>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Utilization</div>
                      <Badge variant={getUtilizationColor(facility.utilization)}>
                        {facility.utilization}%
                      </Badge>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Routed</div>
                      <div className="font-semibold text-foreground">{facility.totalRouted}</div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No facility data available. Submit a routing request to see facility information.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}