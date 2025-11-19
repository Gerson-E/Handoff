import { Card } from './ui/card';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: string;
}

export default function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <Card className="p-6 bg-gradient-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
          {trend && <p className="text-xs text-green-600 mt-1">{trend}</p>}
        </div>
        {icon && <div className="text-primary opacity-50">{icon}</div>}
      </div>
    </Card>
  );
}
