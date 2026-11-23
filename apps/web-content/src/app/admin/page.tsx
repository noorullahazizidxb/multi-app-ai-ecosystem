'use client';

import * as React from 'react';
import { AdminDashboard, Button, AppShell, LayoutProvider } from '@repo/ui-web';
import Link from 'next/link';

export default function ViralMatrixAdminPage() {
  return (
    <LayoutProvider>
      <AppShell appId="viralmatrix" activeNav="admin">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm">← Back to ViralMatrix Workspace</Button>
            </Link>
          </div>
          <AdminDashboard
            appId="viralmatrix"
            activeUsers={215}
            quotaHitsToday={64}
            avgLatencyMs={420}
            initialEvents={[
              {
                type: 'QUOTA_HIT',
                appId: 'viralmatrix',
                userId: 'creator_9918',
                data: { featureKey: 'VIDEO_REPURPOSE', remaining: 0 },
                timestamp: new Date().toISOString(),
              },
              {
                type: 'COPILOT_SUBSCRIBED',
                appId: 'viralmatrix',
                userId: 'creator_1104',
                data: { plan: '$29/mo Viral Studio Copilot' },
                timestamp: new Date(Date.now() - 1800000).toISOString(),
              },
            ]}
          />
        </div>
      </AppShell>
    </LayoutProvider>
  );
}
