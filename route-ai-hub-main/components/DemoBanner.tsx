'use client';

import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/src/components/ui/alert';

export default function DemoBanner() {
  return (
    <Alert className="rounded-none border-l-0 border-r-0 border-t-0 border-b-2 border-yellow-500/50 bg-yellow-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-2">
        <AlertTriangle className="h-4 w-4 text-yellow-500" />
        <AlertDescription className="text-sm text-yellow-200">
          <strong>Demo System:</strong> This is a proof of concept using synthetic data. Not intended for production use or real patient data.
        </AlertDescription>
      </div>
    </Alert>
  );
}
