'use client';

import * as React from 'react';
import { AdminDashboard, Button } from '@repo/ui-web';
import Link from 'next/link';

export default function KineticAdminPage() {
  return (
    <div className="min-h-screen bg-[--bg] text-[--text] p-6 lg:p-12 max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" size="sm">← Back to KineticAI</Button>
        </Link>
      </div>
      <AdminDashboard
        appId="kinetic"
        activeUsers={128}
        quotaHitsToday={34}
        avgLatencyMs={245}
        initialEvents={[
          {
            type: 'QUOTA_HIT',
            appId: 'kinetic',
            userId: 'usr_fit_910',
            data: { featureKey: 'MEAL_SCAN', remaining: 0 },
            timestamp: new Date().toISOString(),
          },
          {
            type: 'COPILOT_SUBSCRIBED',
            appId: 'kinetic',
            userId: 'usr_fit_122',
            data: { plan: '$14/mo Biometrics Copilot' },
            timestamp: new Date(Date.now() - 7200000).toISOString(),
          },
        ]}
      />
    </div>
  );
}

