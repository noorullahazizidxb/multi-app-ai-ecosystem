'use client';

import * as React from 'react';
import { AdminDashboard, Button } from '@repo/ui-web';
import Link from 'next/link';

export default function ViralMatrixAdminPage() {
  return (
    <div className="min-h-screen bg-[--bg] text-[--text] p-6 lg:p-12 max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" size="sm">← Back to ViralMatrix</Button>
        </Link>
      </div>
      <AdminDashboard
        appId="viralmatrix"
        activeUsers={164}
        quotaHitsToday={49}
        avgLatencyMs={410}
        initialEvents={[
          {
            type: 'QUOTA_HIT',
            appId: 'viralmatrix',
            userId: 'usr_viral_330',
            data: { featureKey: 'VIDEO_REPURPOSE', remaining: 0 },
            timestamp: new Date().toISOString(),
          },
          {
            type: 'COPILOT_SUBSCRIBED',
            appId: 'viralmatrix',
            userId: 'usr_viral_711',
            data: { plan: '$29/mo 9:16 Reframe Copilot' },
            timestamp: new Date(Date.now() - 4800000).toISOString(),
          },
        ]}
      />
    </div>
  );
}

