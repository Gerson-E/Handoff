'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, AlertTriangle, Activity } from 'lucide-react';
import { RouteResponse } from '@/lib/types';
import { formatConfidence } from '@/lib/format';

interface KpiGridProps {
  events: RouteResponse[];
}

export default function KpiGrid({ events }: KpiGridProps) {
  const totalRouted = events.length;
  const avgConfidence = events.length > 0 
    ? events.reduce((sum, event) => sum + event.confidence, 0) / events.length 
    : 0;
  const fallbackRate = events.length > 0 
    ? events.filter(event => event.decision_status === 'fallback').length / events.length 
    : 0;
  const last24hVolume = events.length; // Simplified for demo

  const kpis = [
    {
      title: 'Total Routed',
      value: totalRouted.toLocaleString(),
      icon: Target,
      description: 'Requests processed',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Avg Confidence',
      value: formatConfidence(avgConfidence),
      icon: TrendingUp,
      description: 'Routing accuracy',
      trend: '+5%',
      trendUp: true,
    },
    {
      title: 'Fallback Rate',
      value: `${(fallbackRate * 100).toFixed(1)}%`,
      icon: AlertTriangle,
      description: 'Manual intervention',
      trend: '-2%',
      trendUp: true,
    },
    {
      title: 'Last 24h Volume',
      value: last24hVolume.toLocaleString(),
      icon: Activity,
      description: 'Recent activity',
      trend: '+8%',
      trendUp: true,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-bold text-foreground mb-6">Key Performance Indicators</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300 card-gradient">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <kpi.icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge 
                    variant={kpi.trendUp ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {kpi.trend}
                  </Badge>
                  <p className="text-xs text-muted-foreground">{kpi.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}