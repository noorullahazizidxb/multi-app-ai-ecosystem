'use client';

import * as React from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Input,
  Tabs,
  AppShell,
  AppearanceManager,
  LayoutProvider,
} from '@repo/ui-web';
import Link from 'next/link';

export default function FreelanceOSPage() {
  // Time Tracker State (FR-3.1)
  const [seconds, setSeconds] = React.useState(1420);
  const [timerRunning, setTimerRunning] = React.useState(false);

  React.useEffect(() => {
    let interval: any;
    if (timerRunning) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  // Kanban Tasks (FR-3.1)
  const [tasks, setTasks] = React.useState([
    { id: 't1', title: 'Setup Turborepo Monorepo', status: 'DONE', client: 'Acme Corp' },
    { id: 't2', title: 'Implement Stripe Webhook', status: 'IN_PROGRESS', client: 'Fintech Inc' },
    { id: 't3', title: 'Draft Scope of Work SOW', status: 'TODO', client: 'Design Studio' },
  ]);

  // Contract State (FR-3.2)
  const [clientName, setClientName] = React.useState('Acme Enterprises');
  const [rate, setRate] = React.useState('95');
  const [contractCreated, setContractCreated] = React.useState<any>(null);
  const [loadingContract, setLoadingContract] = React.useState(false);

  // Scope Creep Shield (FR-3.4)
  const [clientMessage, setClientMessage] = React.useState(
    'Hey, could you also quickly build an iOS mobile app version in addition to the web dashboard by tomorrow?',
  );
  const [scopeAnalysis, setScopeAnalysis] = React.useState<any>(null);
  const [loadingScope, setLoadingScope] = React.useState(false);

  // Collections Agent (FR-3.5)
  const [invoices, setInvoices] = React.useState([
    { id: 'inv_101', client: 'Venture Capital X', amount: '$4,200', due: 'Overdue by 5 days', status: 'CHASING', chases: 2 },
    { id: 'inv_102', client: 'Fintech Inc', amount: '$2,800', due: 'Due in 3 days', status: 'ISSUED', chases: 0 },
  ]);

  const handleGenerateContract = () => {
    setLoadingContract(true);
    setTimeout(() => {
      setContractCreated({
        contractId: 'cnt_88291',
        title: 'Full-Stack Web Application Scope of Work',
        hourlyRate: `$${rate}/hr`,
        deliverables: ['Responsive Next.js Frontend', 'NestJS API Backend', 'PostgreSQL DB Integration'],
        clauses: ['Net 15 Payment Terms', 'Strict IP Transfer upon Final Payment', '2 Revision Cycles Included'],
      });
      setLoadingContract(false);
    }, 600);
  };

  const handleScopeAnalysis = () => {
    setLoadingScope(true);
    setTimeout(() => {
      setScopeAnalysis({
        outOfScope: true,
        deviationPercent: 85,
        explanation: 'Native mobile app build was never included in the primary web SOW deliverable schedule.',
        changeOrder: {
          title: 'Change Order #1: Flutter Native Cross-Platform App',
          hours: 40,
          quote: '$3,800 USD',
          politeEmail:
            'Hi team, building the native mobile app sounds like an exciting milestone! Since this falls outside our agreed web dashboard SOW, I would be happy to take this on as a change order for 40 hours ($3,800). Let me know if you would like me to prepare the invoice!',
        },
      });
      setLoadingScope(false);
    }, 700);
  };

  const triggerChase = (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId
          ? { ...inv, status: 'CHASING', chases: inv.chases + 1 }
          : inv,
      ),
    );
    alert(`Autonomous Collections Agent sent escalating Stripe payment reminder for ${invoiceId}!`);
  };

  const formatTime = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <LayoutProvider>
      <AppShell appId="freelanceos">
        <div className="flex flex-col gap-6">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border border-border bg-surface/60 backdrop-blur-sm">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text">FreelanceOS</h1>
                <Badge variant="default">Model 1: 5 Free AI Docs/Mo</Badge>
              </div>
              <p className="text-xs sm:text-sm text-text-muted mt-1">
                Autonomous Client CRM, Scope-Creep Shield & Collections Agent ($24/mo)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="default" size="sm" className="shadow-sm">Upgrade to Copilot Pro</Button>
            </div>
          </div>

          {/* Appearance & Workspace Manager */}
          <AppearanceManager currentTheme="obsidian-gold" />

              {/* Tabs */}
              <Tabs
                tabs={[
                  {
                    id: 'kanban',
                    label: 'FR-3.1: Kanban Board & Time Tracker',
                    content: (
                      <div className="flex flex-col gap-6 mt-2">
                        {/* Time Tracker Stopwatch */}
                        <Card>
                          <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                              <span className="text-3xl font-black font-mono text-primary">{formatTime(seconds)}</span>
                              <span className="text-xs text-text-muted">Active Client: Acme Corp ($95/hr)</span>
                            </div>
                            <Button
                              size="sm"
                              variant={timerRunning ? 'destructive' : 'default'}
                              onClick={() => setTimerRunning(!timerRunning)}
                            >
                              {timerRunning ? 'Stop Tracker' : 'Start Billable Timer'}
                            </Button>
                          </CardContent>
                        </Card>

                            {/* Kanban Columns */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {['TODO', 'IN_PROGRESS', 'DONE'].map((column) => (
                                <div key={column} className="p-4 rounded-xl border border-border bg-surface flex flex-col gap-3">
                                  <div className="flex justify-between items-center pb-2 border-b border-border">
                                    <span className="font-bold text-xs">{column.replace('_', ' ')}</span>
                                    <Badge variant="outline">{tasks.filter((t) => t.status === column).length}</Badge>
                                  </div>
                                  <div className="space-y-2">
                                    {tasks
                                      .filter((t) => t.status === column)
                                      .map((task) => (
                                        <div key={task.id} className="p-3 rounded-lg border border-border bg-bg text-xs">
                                          <p className="font-semibold text-text">{task.title}</p>
                                          <span className="text-[10px] text-text-muted">{task.client}</span>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              ))}
                            </div>
              </div>
        ),
          },
        {
          id: 'contracts',
        label: 'FR-3.2: AI Contract & SOW Generator',
        content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Binding SOW Generator</CardTitle>
                <Badge variant="success">5 Free Docs/Mo</Badge>
              </div>
              <CardDescription>Guarded by @UseQuota('DOC_GEN', 1)</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Client Name"
              />
              <Input
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="Hourly Rate ($/hr)"
              />
              <Button onClick={handleGenerateContract} disabled={loadingContract}>
                {loadingContract ? 'Generating with Gemini...' : 'Generate Legal SOW Agreement'}
              </Button>
            </CardContent>
          </Card>

                  {contractCreated && (
                    <Card className="border-primary/40">
                      <CardHeader>
                        <CardTitle>{contractCreated.title}</CardTitle>
                        <CardDescription>Rate: {contractCreated.hourlyRate}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3 text-xs">
                        <div>
                          <strong className="text-primary block mb-1">Scope Deliverables:</strong>
                          <ul className="list-disc pl-4 space-y-0.5 text-text-muted">
                            {contractCreated.deliverables.map((d: string) => (
                              <li key={d}>{d}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="pt-2 border-t border-border">
                          <strong className="text-accent block mb-1">Standard Legal Protections:</strong>
                          <p className="text-text-muted">{contractCreated.clauses.join(' • ')}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                    ),
          },
                    {
                      id: 'shield',
                    label: 'FR-3.4: Scope-Creep Shield (Copilot)',
                    content: (
                    <Card className="mt-2 border-warning/40 shadow-xl">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle>Autonomous Scope-Creep Shield</CardTitle>
                            <CardDescription>Detects SOW drift and generates diplomatic change-order estimates</CardDescription>
                          </div>
                          <Badge variant="default">$24/mo Copilot</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-4">
                        <div>
                          <label className="text-xs text-text-muted">Incoming Client Communication:</label>
                          <textarea
                            value={clientMessage}
                            onChange={(e) => setClientMessage(e.target.value)}
                            className="w-full h-24 rounded-md border border-border bg-bg p-3 text-xs text-text"
                          />
                        </div>
                        <Button onClick={handleScopeAnalysis} disabled={loadingScope}>
                          {loadingScope ? 'Auditing SOW Embeddings...' : 'Analyze Scope Deviation'}
                        </Button>

                            {scopeAnalysis && (
                    <div className="p-4 rounded-xl border border-border bg-surface flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <Badge variant="destructive">⚠️ {scopeAnalysis.deviationPercent}% Scope Creep Detected</Badge>
                        <span className="text-xs text-warning font-bold">Uncontracted Work</span>
                      </div>
                      <p className="text-xs text-text-muted">{scopeAnalysis.explanation}</p>

                      <div className="p-4 rounded-lg bg-bg border border-border flex flex-col gap-2">
                        <div className="flex justify-between font-bold text-xs text-primary">
                          <span>{scopeAnalysis.changeOrder.title}</span>
                          <span>{scopeAnalysis.changeOrder.quote}</span>
                        </div>
                        <p className="text-xs text-text-muted italic">"{scopeAnalysis.changeOrder.politeEmail}"</p>
                      </div>
                    </div>
                            )}
                          </CardContent>
                        </Card>
                        ),
          },
                        {
                          id: 'collections',
                        label: 'FR-3.5: Autonomous Collections Agent',
                        content: (
                        <Card className="mt-2 border-primary/40">
                          <CardHeader>
                            <div className="flex justify-between items-center">
                              <div>
                                <CardTitle>Autonomous Collections Agent</CardTitle>
                                <CardDescription>BullMQ worker dispatches escalating polite payment links for overdue invoices</CardDescription>
                              </div>
                              <Badge variant="default">Active Worker</Badge>
                            </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-lg border border-border bg-surface"
                  >
                    <div>
                      <p className="font-bold text-sm">{inv.client} ({inv.amount})</p>
                      <p className="text-xs text-text-muted">{inv.due} • {inv.chases} Reminders Sent</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant={inv.status === 'CHASING' ? 'destructive' : 'default'}>{inv.status}</Badge>
                      <Button size="sm" onClick={() => triggerChase(inv.id)}>
                        Dispatch Stripe Reminder
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          ),
          },
        ]}
      />
        </div>
      </AppShell>
    </LayoutProvider>
  );
}
