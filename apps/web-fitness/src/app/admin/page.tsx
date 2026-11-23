'use client';

import * as React from 'react';
import { AdminDashboard, Button, AppShell, LayoutProvider } from '@repo/ui-web';
import Link from 'next/link';

export default function KineticAdminPage() {
  return (
    <LayoutProvider>
      <AppShell appId="kinetic" activeNav="admin">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm">← Back to KineticAI Workspace</Button>
            </Link>
          </div>
          <AdminDashboard
            appId="kinetic"
            activeUsers={142}
            quotaHitsToday={38}
            avgLatencyMs={245}
            initialEvents={[
              {
                type: 'QUOTA_HIT',
                appId: 'kinetic',
                userId: 'ath_7749x',
                data: { featureKey: 'MEAL_SCAN', remaining: 0 },
                timestamp: new Date().toISOString(),
              },
              {
                type: 'COPILOT_SUBSCRIBED',
                appId: 'kinetic',
                userId: 'ath_2291z',
                data: { plan: '$14/mo Biomechanics Copilot' },
                timestamp: new Date(Date.now() - 7200000).toISOString(),
              },
            ]}
          />
        </div>
      </AppShell>
    </LayoutProvider>
  );
}
