'use client';

import * as React from 'react';
import { AdminDashboard, Button } from '@repo/ui-web';
import Link from 'next/link';

export default function FreelanceOSAdminPage() {
  return (
    <div className="min-h-screen bg-[--bg] text-[--text] p-6 lg:p-12 max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" size="sm">← Back to FreelanceOS</Button>
        </Link>
      </div>
      <AdminDashboard
        appId="freelanceos"
        activeUsers={95}
        quotaHitsToday={28}
        avgLatencyMs={290}
        initialEvents={[
          {
            type: 'QUOTA_HIT',
            appId: 'freelanceos',
            userId: 'usr_freelance_441',
            data: { featureKey: 'DOC_GEN', remaining: 0 },
            timestamp: new Date().toISOString(),
          },
          {
            type: 'COPILOT_SUBSCRIBED',
            appId: 'freelanceos',
            userId: 'usr_freelance_882',
            data: { plan: '$24/mo Scope Shield Copilot' },
            timestamp: new Date(Date.now() - 5400000).toISOString(),
          },
        ]}
      />
    </div>
  );
}

