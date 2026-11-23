'use client';

import * as React from 'react';
import { AdminDashboard, Button, AppShell, LayoutProvider } from '@repo/ui-web';
import Link from 'next/link';

export default function FreelanceOSAdminPage() {
  return (
    <LayoutProvider>
      <AppShell appId="freelanceos" activeNav="admin">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm">← Back to FreelanceOS Workspace</Button>
            </Link>
          </div>
          <AdminDashboard
            appId="freelanceos"
            activeUsers={98}
            quotaHitsToday={14}
            avgLatencyMs={280}
            initialEvents={[
              {
                type: 'QUOTA_HIT',
                appId: 'freelanceos',
                userId: 'freelancer_551',
                data: { featureKey: 'DOC_GEN', remaining: 0 },
                timestamp: new Date().toISOString(),
              },
              {
                type: 'COPILOT_SUBSCRIBED',
                appId: 'freelanceos',
                userId: 'freelancer_302',
                data: { plan: '$24/mo Scope Shield Pro' },
                timestamp: new Date(Date.now() - 5400000).toISOString(),
              },
            ]}
          />
        </div>
      </AppShell>
    </LayoutProvider>
  );
}
