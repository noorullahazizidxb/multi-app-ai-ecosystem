'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { Input } from './input';
import { cn } from '../lib/utils';

export interface AdminTelemetryEvent {
  type: 'QUOTA_HIT' | 'COPILOT_SUBSCRIBED' | 'AI_LATENCY_MS' | 'ACTIVE_USERS' | 'MAINTENANCE_TOGGLE' | 'QUOTA_OVERRIDE';
  appId: string;
  userId?: string;
  data: Record<string, unknown>;
  timestamp: string;
}

export interface AdminDashboardProps {
  appId: string;
  initialEvents?: AdminTelemetryEvent[];
  activeUsers?: number;
  quotaHitsToday?: number;
  avgLatencyMs?: number;
  wsUrl?: string;
  className?: string;
}

/**
 * Formats the time in the viewer's locale and time zone. Rendered only after mount so the
 * prerendered HTML (server locale/time zone) never conflicts with the client during hydration.
 */
function EventTime({ timestamp }: { timestamp: string }) {
  const [label, setLabel] = React.useState('');

  React.useEffect(() => {
    setLabel(new Date(timestamp).toLocaleTimeString());
  }, [timestamp]);

  return <span className="text-xs text-text-muted">{label}</span>;
}

export function AdminDashboard({
  appId,
  initialEvents = [],
  activeUsers = 42,
  quotaHitsToday = 14,
  avgLatencyMs = 380,
  className,
}: AdminDashboardProps) {
  const [events, setEvents] = React.useState<AdminTelemetryEvent[]>(initialEvents);
  const [maintenance, setMaintenance] = React.useState(false);
  const [overrideUserId, setOverrideUserId] = React.useState('usr_892k1');
  const [overrideQuotaCap, setOverrideQuotaCap] = React.useState('10');

  const toggleMaintenance = () => {
    const nextState = !maintenance;
    setMaintenance(nextState);
    const newEvent: AdminTelemetryEvent = {
      type: 'MAINTENANCE_TOGGLE',
      appId,
      data: { enabled: nextState },
      timestamp: new Date().toISOString(),
    };
    setEvents((prev) => [newEvent, ...prev]);
  };

  const emitQuotaOverride = () => {
    if (!overrideUserId.trim()) return;
    const newEvent: AdminTelemetryEvent = {
      type: 'QUOTA_OVERRIDE',
      appId,
      userId: overrideUserId.trim(),
      data: { newMonthlyCap: Number(overrideQuotaCap) || 10 },
      timestamp: new Date().toISOString(),
    };
    setEvents((prev) => [newEvent, ...prev]);
  };

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text">Admin Telemetry</h2>
          <p className="text-sm text-text-muted">
            Real-time WebSocket &amp; Redis Quota Oversight for {appId}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant={maintenance ? 'destructive' : 'success'}>
            {maintenance ? 'Maintenance Mode Active' : 'System Operational'}
          </Badge>
          <Button
            variant={maintenance ? 'default' : 'destructive'}
            size="sm"
            onClick={toggleMaintenance}
          >
            {maintenance ? 'Disable Maintenance' : 'Emergency Kill-Switch'}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-text-muted">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-extrabold text-primary">{activeUsers}</p>
            <p className="text-xs text-text-muted mt-1">Live WebSocket Connections</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base text-text-muted">Quota Caps Hit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-extrabold text-warning">{quotaHitsToday}</p>
            <p className="text-xs text-text-muted mt-1">HTTP 402 Upgrade Prompts Triggered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base text-text-muted">Gemini Latency (p95)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-extrabold text-accent">{avgLatencyMs}ms</p>
            <p className="text-xs text-text-muted mt-1">Token Metering Active</p>
          </CardContent>
        </Card>
      </div>

      {/* Remote Quota Override (SYS-ADM-08) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Remote User Quota Override (/admin-ws)</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Input
            value={overrideUserId}
            onChange={(e) => setOverrideUserId(e.target.value)}
            placeholder="Target User ID"
            className="w-48"
          />
          <Input
            type="number"
            value={overrideQuotaCap}
            onChange={(e) => setOverrideQuotaCap(e.target.value)}
            placeholder="New Free Quota Cap"
            className="w-36"
          />
          <Button size="sm" onClick={emitQuotaOverride}>
            Emit Quota Override
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Live Event Stream (/admin-ws)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {events.length === 0 ? (
              <p className="text-sm text-text-muted py-4 text-center">
                Listening for live telemetric events from Redis Pub/Sub...
              </p>
            ) : (
              events.map((evt, idx) => (
                <div
                  key={idx}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3 text-sm bg-bg"
                >
                  <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                    <Badge
                      variant={
                        evt.type === 'QUOTA_HIT' || evt.type === 'MAINTENANCE_TOGGLE'
                          ? 'destructive'
                          : evt.type === 'COPILOT_SUBSCRIBED' || evt.type === 'QUOTA_OVERRIDE'
                            ? 'success'
                            : 'default'
                      }
                    >
                      {evt.type}
                    </Badge>
                    <span className="font-medium text-text">{evt.appId}</span>
                    {evt.userId && (
                      <span className="text-xs text-text-muted font-mono">{evt.userId}</span>
                    )}
                    <span className="text-xs text-text-muted font-mono">
                      {JSON.stringify(evt.data)}
                    </span>
                  </div>
                  <EventTime timestamp={evt.timestamp} />
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
