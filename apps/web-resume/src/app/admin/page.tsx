'use client';

import * as React from 'react';
import { AdminDashboard, Button, AppShell, LayoutProvider } from '@repo/ui-web';
import Link from 'next/link';

export default function CareerForgeAdminPage() {
  return (
    <LayoutProvider>
      <AppShell appId="careerforge" activeNav="admin">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm">← Back to CareerForge Workspace</Button>
            </Link>
          </div>
          <AdminDashboard
            appId="careerforge"
            activeUsers={73}
            quotaHitsToday={21}
            avgLatencyMs={310}
            initialEvents={[
              {
                type: 'QUOTA_HIT',
                appId: 'careerforge',
                userId: 'usr_892k1',
                data: { featureKey: 'ATS_SCAN', remaining: 0 },
                timestamp: new Date().toISOString(),
              },
              {
                type: 'COPILOT_SUBSCRIBED',
                appId: 'careerforge',
                userId: 'usr_394j2',
                data: { plan: '$19/mo Copilot Pro' },
                timestamp: new Date(Date.now() - 3600000).toISOString(),
              },
            ]}
          />
        </div>
      </AppShell>
    </LayoutProvider>
  );
}
