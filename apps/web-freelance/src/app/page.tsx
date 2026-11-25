'use client';

import * as React from 'react';
import {
  Kanban,
  FileSignature,
  ShieldAlert,
  Receipt,
  CreditCard,
  Play,
  Pause,
  Plus,
  ArrowRight,
  ArrowLeft,
  Copy,
  CheckCircle2,
  DollarSign,
  Eraser,
} from 'lucide-react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Input,
  Tabs,
  AppShell,
  LayoutProvider,
  AppHeroHeader,
  CopilotUpgradeDialog,
  CopilotGateBanner,
  useAppMonetization,
  useToast,
} from '@repo/ui-web';

interface KanbanTask {
  id: string;
  title: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  client: string;
}

function FreelanceWorkspace() {
  const { toast } = useToast();
  const monetization = useAppMonetization('freelanceos');

  // FR-3.1 Billable Time Tracker
  const [activeClient, setActiveClient] = React.useState('Acme Corp');
  const [seconds, setSeconds] = React.useState(1420);
  const [timerRunning, setTimerRunning] = React.useState(false);

  React.useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  // FR-3.1 Interactive Kanban Tasks
  const [tasks, setTasks] = React.useState<KanbanTask[]>([
    { id: 't1', title: 'Setup Turborepo Monorepo', status: 'DONE', client: 'Acme Corp' },
    { id: 't2', title: 'Implement Stripe Webhook', status: 'IN_PROGRESS', client: 'Fintech Inc' },
    { id: 't3', title: 'Draft Scope of Work SOW', status: 'TODO', client: 'Design Studio' },
  ]);
  const [newTaskTitle, setNewTaskTitle] = React.useState('');
  const [newTaskClient, setNewTaskClient] = React.useState('Acme Corp');

  // FR-3.2 AI Contract / Proposal / Invoice Generator + E-Sign
  const [docType, setDocType] = React.useState<'SOW Contract' | 'Project Proposal' | 'Milestone Invoice'>('SOW Contract');
  const [clientName, setClientName] = React.useState('Acme Enterprises');
  const [projectTitle, setProjectTitle] = React.useState('Full-Stack SaaS Dashboard & API');
  const [rate, setRate] = React.useState('125');
  const [paymentTerms, setPaymentTerms] = React.useState('Net 15');
  const [deliverablesInput, setDeliverablesInput] = React.useState(
    'Responsive Next.js 15 Frontend, NestJS REST & WS API, PostgreSQL Prisma Schema',
  );
  const [loadingContract, setLoadingContract] = React.useState(false);
  const [contractCreated, setContractCreated] = React.useState<{
    contractId: string;
    docType: string;
    title: string;
    hourlyRate: string;
    paymentTerms: string;
    deliverables: string[];
    clauses: string[];
    signed: boolean;
  } | null>(null);

  // Canvas Signature Pad
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [hasSignature, setHasSignature] = React.useState(false);

  // FR-3.3 Receipt OCR Expenses
  const [expenses, setExpenses] = React.useState([
    { id: 'ex1', vendor: 'Vercel Pro Hosting', category: 'Cloud Infrastructure', amount: 20.0, deductible: true },
    { id: 'ex2', vendor: 'JetBrains All Products', category: 'Software & Tools', amount: 289.0, deductible: true },
  ]);

  // FR-3.4 Scope-Creep Shield
  const [clientMessage, setClientMessage] = React.useState(
    'Hey, could you also quickly build an iOS & Android Flutter mobile app version in addition to the web dashboard by Friday?',
  );
  const [loadingScope, setLoadingScope] = React.useState(false);
  const [scopeAnalysis, setScopeAnalysis] = React.useState<{
    outOfScope: boolean;
    deviationPercent: number;
    explanation: string;
    changeOrderTitle: string;
    hours: number;
    quote: string;
    politeEmail: string;
  } | null>(null);

  // FR-3.5 Autonomous Collections Agent
  const [invoices, setInvoices] = React.useState([
    { id: 'inv_101', client: 'Venture Capital X', amount: 4200, due: 'Overdue by 5 days', status: 'CHASING', chases: 2 },
    { id: 'inv_102', client: 'Fintech Inc', amount: 2800, due: 'Due in 3 days', status: 'ISSUED', chases: 0 },
  ]);
  const [newInvClient, setNewInvClient] = React.useState('');
  const [newInvAmount, setNewInvAmount] = React.useState('1800');

  const formatTime = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const hourlyNum = Math.max(1, Number(rate) || 95);
  const accruedDollars = ((seconds / 3600) * hourlyNum).toFixed(2);
  const totalDeductible = expenses.reduce((s, e) => s + e.amount, 0);
  const outstandingTotal = invoices.filter((i) => i.status !== 'PAID').reduce((s, i) => s + i.amount, 0);

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    setTasks((prev) => [
      { id: `t_${Date.now()}`, title: newTaskTitle.trim(), status: 'TODO', client: newTaskClient },
      ...prev,
    ]);
    setNewTaskTitle('');
    toast({ title: 'Task Added to Kanban', variant: 'success' });
  };

  const moveTask = (id: string, dir: -1 | 1) => {
    const order: KanbanTask['status'][] = ['TODO', 'IN_PROGRESS', 'DONE'];
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const idx = order.indexOf(t.status);
        const nextIdx = Math.min(2, Math.max(0, idx + dir));
        return { ...t, status: order[nextIdx] };
      }),
    );
  };

  const handleGenerateContract = () => {
    if (!monetization.consumeQuota(`AI ${docType}`)) return;
    setLoadingContract(true);
    setTimeout(() => {
      const deliverables = deliverablesInput
        .split(',')
        .map((d) => d.trim())
        .filter(Boolean);
      setContractCreated({
        contractId: `cnt_${Math.floor(10000 + Math.random() * 89999)}`,
        docType,
        title: `${clientName} — ${projectTitle}`,
        hourlyRate: `$${hourlyNum}/hr`,
        paymentTerms,
        deliverables: deliverables.length ? deliverables : ['Full-Stack Web Platform'],
        clauses: [
          `${paymentTerms} Payment Terms`,
          'IP Transfer Strictly Upon Cleared Final Settlement',
          'Out-of-Scope Additions Billed via Signed Change Order',
        ],
        signed: false,
      });
      setLoadingContract(false);
      toast({ title: `${docType} Generated`, description: `Prepared binding terms for ${clientName}.`, variant: 'success' });
    }, 500);
  };

  const getCanvasPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleScopeAnalysis = () => {
    setLoadingScope(true);
    setTimeout(() => {
      const msg = clientMessage.toLowerCase();
      const activeDeliverables = (contractCreated?.deliverables || deliverablesInput.split(',')).join(' ').toLowerCase();
      const mentionsMobile = msg.includes('ios') || msg.includes('android') || msg.includes('mobile') || msg.includes('flutter');
      const mentionsRush = msg.includes('tomorrow') || msg.includes('friday') || msg.includes('asap');
      const inContract = mentionsMobile && activeDeliverables.includes('mobile');

      const outOfScope = !inContract && (mentionsMobile || mentionsRush || msg.includes('also'));
      const estHours = mentionsMobile ? 40 : 12;
      const quoteAmt = estHours * hourlyNum;

      setScopeAnalysis({
        outOfScope,
        deviationPercent: outOfScope ? (mentionsMobile ? 85 : 45) : 10,
        explanation: outOfScope
          ? `Requested work ("${clientMessage.slice(0, 64)}...") is outside the signed SOW deliverables (${deliverablesInput}).`
          : 'Request aligns with existing contractual deliverables.',
        changeOrderTitle: `Change Order #1: ${mentionsMobile ? 'Native Mobile Companion App' : 'Expanded Feature Scope'}`,
        hours: estHours,
        quote: `$${quoteAmt.toLocaleString()} USD (${estHours} hrs @ $${hourlyNum}/hr)`,
        politeEmail: `Hi ${clientName} team, adding this capability sounds like a high-impact milestone! Since it falls outside our signed web SOW deliverables, I can deliver this as a dedicated Change Order estimated at ${estHours} hours ($${quoteAmt.toLocaleString()} USD). Let me know if you'd like me to issue the addendum!`,
      });
      setLoadingScope(false);
    }, 550);
  };

  const triggerChase = (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === invoiceId ? { ...inv, status: 'CHASING', chases: inv.chases + 1 } : inv)),
    );
    toast({
      title: `Stripe Reminder Dispatched (${invoiceId})`,
      description: 'Autonomous Collections Agent sent an escalating polite payment link.',
      variant: 'success',
    });
  };

  const markInvoicePaid = (invoiceId: string) => {
    setInvoices((prev) => prev.map((inv) => (inv.id === invoiceId ? { ...inv, status: 'PAID', due: 'Settled via Stripe' } : inv)));
    toast({ title: `Invoice ${invoiceId} Paid`, description: 'Stripe webhook reconciled revenue.', variant: 'success' });
  };

  const handleScanSampleReceipt = () => {
    if (!monetization.consumeQuota('Receipt OCR Scan')) return;
    const samples = [
      { vendor: 'Figma Organization', category: 'Design Software', amount: 45.0 },
      { vendor: 'AWS Route53 & RDS', category: 'Cloud Infrastructure', amount: 118.4 },
      { vendor: 'United Airlines (Client Onsite)', category: 'Business Travel', amount: 342.0 },
    ];
    const pick = samples[expenses.length % samples.length];
    setExpenses((prev) => [{ id: `ex_${Date.now()}`, ...pick, deductible: true }, ...prev]);
    toast({
      title: `Receipt OCR: $${pick.amount.toFixed(2)}`,
      description: `${pick.vendor} categorized as Tax-Deductible (${pick.category}).`,
      variant: 'success',
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <AppHeroHeader
        appId="freelanceos"
        title="FreelanceOS"
        subtitle="Client CRM, Billable Kanban, AI Legal Contracts with E-Sign, Scope-Creep Shield & Collections Agent"
        usedQuota={monetization.usedQuota}
        freeLimit={monetization.spec.freeLimit}
        quotaUnit={monetization.spec.quotaUnit}
        isCopilotPro={monetization.isCopilotPro}
        onOpenUpgrade={() => monetization.setUpgradeOpen(true)}
      />

      {/* Business KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">Live Session</p>
              <p className="text-2xl font-extrabold text-primary mt-0.5">${accruedDollars}</p>
              <p className="text-[11px] text-text-muted">{formatTime(seconds)} @ ${hourlyNum}/hr</p>
            </div>
            <DollarSign className="size-7 text-primary/70" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">Active Tasks</p>
              <p className="text-2xl font-extrabold text-text mt-0.5">{tasks.filter((t) => t.status !== 'DONE').length}</p>
              <p className="text-[11px] text-text-muted">{tasks.filter((t) => t.status === 'DONE').length} completed</p>
            </div>
            <Kanban className="size-7 text-accent/70" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">Receivables</p>
              <p className="text-2xl font-extrabold text-warning mt-0.5">${outstandingTotal.toLocaleString()}</p>
              <p className="text-[11px] text-text-muted">{invoices.filter((i) => i.status !== 'PAID').length} open invoices</p>
            </div>
            <CreditCard className="size-7 text-warning/70" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">Tax Deductions</p>
              <p className="text-2xl font-extrabold text-success mt-0.5">${totalDeductible.toFixed(0)}</p>
              <p className="text-[11px] text-text-muted">{expenses.length} OCR receipts</p>
            </div>
            <Receipt className="size-7 text-success/70" />
          </CardContent>
        </Card>
      </div>

      <Tabs
        tabs={[
          {
            id: 'kanban',
            label: 'CRM Kanban & Timer',
            badge: 'FR-3.1',
            icon: <Kanban className="size-3.5" />,
            content: (
              <div className="flex flex-col gap-6">
                <Card>
                  <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5">
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="text-3xl font-black font-mono text-primary">{formatTime(seconds)}</span>
                      <div className="flex items-center gap-2">
                        <select
                          value={activeClient}
                          onChange={(e) => setActiveClient(e.target.value)}
                          className="h-8 rounded-lg border border-border bg-bg px-2.5 text-xs text-text"
                        >
                          <option value="Acme Corp">Acme Corp (${hourlyNum}/hr)</option>
                          <option value="Fintech Inc">Fintech Inc (${hourlyNum}/hr)</option>
                          <option value="Venture Capital X">Venture Capital X (${hourlyNum}/hr)</option>
                        </select>
                        <Badge variant="outline">Accrued: ${accruedDollars}</Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={timerRunning ? 'destructive' : 'default'}
                      onClick={() => setTimerRunning(!timerRunning)}
                      className="gap-1.5"
                    >
                      {timerRunning ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                      {timerRunning ? 'Pause Tracker' : 'Start Billable Timer'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Add Task Bar */}
                <div className="flex flex-wrap gap-2">
                  <Input
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Add deliverable task to board..."
                    className="flex-1 min-w-48"
                  />
                  <Input
                    value={newTaskClient}
                    onChange={(e) => setNewTaskClient(e.target.value)}
                    placeholder="Client"
                    className="w-40"
                  />
                  <Button onClick={handleAddTask} className="gap-1.5">
                    <Plus className="size-4" /> Add Task
                  </Button>
                </div>

                {/* Kanban Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(['TODO', 'IN_PROGRESS', 'DONE'] as const).map((column) => (
                    <div key={column} className="p-4 rounded-xl border border-border bg-surface flex flex-col gap-3">
                      <div className="flex justify-between items-center pb-2 border-b border-border">
                        <span className="font-bold text-xs tracking-wider">{column.replace('_', ' ')}</span>
                        <Badge variant="outline">{tasks.filter((t) => t.status === column).length}</Badge>
                      </div>
                      <div className="space-y-2.5">
                        {tasks
                          .filter((t) => t.status === column)
                          .map((task) => (
                            <div key={task.id} className="p-3 rounded-lg border border-border bg-bg text-xs flex items-center justify-between gap-2">
                              <div className="min-w-0">
                                <p className="font-semibold text-text truncate">{task.title}</p>
                                <span className="text-[10px] text-text-muted">{task.client}</span>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                {column !== 'TODO' && (
                                  <button
                                    type="button"
                                    onClick={() => moveTask(task.id, -1)}
                                    className="p-1 rounded border border-border hover:bg-surface cursor-pointer"
                                    title="Move Back"
                                  >
                                    <ArrowLeft className="size-3" />
                                  </button>
                                )}
                                {column !== 'DONE' && (
                                  <button
                                    type="button"
                                    onClick={() => moveTask(task.id, 1)}
                                    className="p-1 rounded border border-border hover:bg-surface cursor-pointer"
                                    title="Advance Task"
                                  >
                                    <ArrowRight className="size-3" />
                                  </button>
                                )}
                              </div>
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
            label: 'AI Contracts & E-Sign',
            badge: 'FR-3.2',
            icon: <FileSignature className="size-3.5" />,
            content: (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>AI Legal SOW &amp; Proposal Studio</CardTitle>
                        <CardDescription>Guarded by @UseQuota(&apos;DOC_GEN&apos;, 1)</CardDescription>
                      </div>
                      <Badge variant="success">5 Free Docs/Mo</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    <div className="flex gap-1.5">
                      {(['SOW Contract', 'Project Proposal', 'Milestone Invoice'] as const).map((dt) => (
                        <button
                          key={dt}
                          type="button"
                          onClick={() => setDocType(dt)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${
                            docType === dt ? 'bg-primary text-white border-primary' : 'bg-bg text-text-muted border-border'
                          }`}
                        >
                          {dt}
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      <Input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Client Name" />
                      <Input value={rate} onChange={(e) => setRate(e.target.value)} placeholder="Hourly Rate ($/hr)" />
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      <Input value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} placeholder="Project Title" />
                      <Input value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} placeholder="Payment Terms" />
                    </div>
                    <textarea
                      value={deliverablesInput}
                      onChange={(e) => setDeliverablesInput(e.target.value)}
                      rows={2}
                      className="w-full rounded-md border border-border bg-bg p-2.5 text-xs text-text"
                      placeholder="Comma-separated deliverables..."
                    />
                    <Button onClick={handleGenerateContract} disabled={loadingContract}>
                      {loadingContract ? 'Generating with Gemini...' : `Generate ${docType}`}
                    </Button>
                  </CardContent>
                </Card>

                <Card className={contractCreated ? 'border-primary/40' : ''}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{contractCreated?.title || 'Generated Document & E-Signature'}</CardTitle>
                        <CardDescription>
                          {contractCreated
                            ? `${contractCreated.docType} • ${contractCreated.hourlyRate} • ${contractCreated.paymentTerms}`
                            : 'Generate a contract or proposal to inspect deliverables and sign'}
                        </CardDescription>
                      </div>
                      {contractCreated?.signed && <Badge variant="success">E-Signed</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 text-xs">
                    {contractCreated && (
                      <>
                        <div>
                          <strong className="text-primary block mb-1">Scope Deliverables:</strong>
                          <ul className="list-disc pl-4 space-y-0.5 text-text-muted">
                            {contractCreated.deliverables.map((d) => (
                              <li key={d}>{d}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="pt-2 border-t border-border">
                          <strong className="text-accent block mb-1">Protective Clauses:</strong>
                          <p className="text-text-muted">{contractCreated.clauses.join(' • ')}</p>
                        </div>

                        {/* HTML5 Signature Canvas */}
                        <div className="pt-2 border-t border-border space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-text">Client / Freelancer E-Signature</span>
                            <button
                              type="button"
                              onClick={() => {
                                const ctx = canvasRef.current?.getContext('2d');
                                if (ctx && canvasRef.current) {
                                  ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                                  setHasSignature(false);
                                }
                              }}
                              className="text-text-muted hover:text-text flex items-center gap-1 cursor-pointer"
                            >
                              <Eraser className="size-3" /> Clear
                            </button>
                          </div>
                          <canvas
                            ref={canvasRef}
                            width={380}
                            height={90}
                            onMouseDown={(e) => {
                              const ctx = canvasRef.current?.getContext('2d');
                              if (!ctx) return;
                              const { x, y } = getCanvasPos(e);
                              ctx.strokeStyle = '#3b82f6';
                              ctx.lineWidth = 2;
                              ctx.lineCap = 'round';
                              ctx.beginPath();
                              ctx.moveTo(x, y);
                              setIsDrawing(true);
                              setHasSignature(true);
                            }}
                            onMouseMove={(e) => {
                              if (!isDrawing) return;
                              const ctx = canvasRef.current?.getContext('2d');
                              if (!ctx) return;
                              const { x, y } = getCanvasPos(e);
                              ctx.lineTo(x, y);
                              ctx.stroke();
                            }}
                            onMouseUp={() => setIsDrawing(false)}
                            onMouseLeave={() => setIsDrawing(false)}
                            className="w-full h-24 rounded-lg border border-dashed border-border bg-bg cursor-crosshair"
                          />
                          <Button
                            size="sm"
                            disabled={!hasSignature || contractCreated.signed}
                            onClick={() => {
                              setContractCreated({ ...contractCreated, signed: true });
                              toast({ title: 'Contract Executed', description: `Signed ${contractCreated.contractId}`, variant: 'success' });
                            }}
                          >
                            {contractCreated.signed ? 'Signed & Locked' : 'Sign & Lock Agreement'}
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            ),
          },
          {
            id: 'receipts',
            label: 'Receipt OCR & Tax',
            badge: 'FR-3.3',
            icon: <Receipt className="size-3.5" />,
            content: (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Tax Receipt OCR Scanner</CardTitle>
                        <CardDescription>Guarded by @UseQuota(&apos;RECEIPT_OCR&apos;, 1) • Auto-categorizes deductions</CardDescription>
                      </div>
                      <Badge variant="success">5 Free Scans/Mo</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-xs text-text-muted">
                      Extract vendor, total, and IRS/VAT deduction categories from software, hardware, and travel receipts.
                    </p>
                    <Button onClick={handleScanSampleReceipt} className="gap-2">
                      <Receipt className="size-4" /> Scan &amp; Categorize Receipt
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Deductible Expense Ledger (${totalDeductible.toFixed(2)})</CardTitle>
                    <CardDescription>Ready for quarterly tax export</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2.5">
                    {expenses.map((ex) => (
                      <div key={ex.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-bg/60 text-xs">
                        <div>
                          <p className="font-semibold text-text">{ex.vendor}</p>
                          <p className="text-text-muted">{ex.category}</p>
                        </div>
                        <Badge variant="success">${ex.amount.toFixed(2)}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            ),
          },
          {
            id: 'shield',
            label: 'Scope-Creep Shield',
            badge: 'FR-3.4',
            icon: <ShieldAlert className="size-3.5" />,
            content: (
              <div className="flex flex-col gap-4">
                <CopilotGateBanner
                  isCopilotPro={monetization.isCopilotPro}
                  price="$24/mo"
                  featureName="Autonomous Scope-Creep Shield"
                  onUpgrade={() => monetization.setUpgradeOpen(true)}
                />
                <Card className="border-warning/40">
                  <CardHeader>
                    <CardTitle>Autonomous Scope-Creep Shield</CardTitle>
                    <CardDescription>Audits client messages against your SOW deliverables &amp; drafts diplomatic change orders</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <div>
                      <label className="text-xs text-text-muted block mb-1">Incoming Client Email / Slack Message:</label>
                      <textarea
                        value={clientMessage}
                        onChange={(e) => setClientMessage(e.target.value)}
                        className="w-full h-24 rounded-lg border border-border bg-bg p-3 text-xs text-text"
                      />
                    </div>
                    <Button onClick={handleScopeAnalysis} disabled={loadingScope}>
                      {loadingScope ? 'Auditing SOW Embeddings...' : 'Analyze Scope Deviation'}
                    </Button>

                    {scopeAnalysis && (
                      <div className="p-4 rounded-xl border border-border bg-bg/70 flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                          <Badge variant={scopeAnalysis.outOfScope ? 'destructive' : 'success'}>
                            {scopeAnalysis.deviationPercent}% Scope Deviation
                          </Badge>
                          <span className="text-xs font-bold text-warning">
                            {scopeAnalysis.outOfScope ? 'Uncontracted Work Detected' : 'Within SOW'}
                          </span>
                        </div>
                        <p className="text-xs text-text-muted">{scopeAnalysis.explanation}</p>

                        <div className="p-4 rounded-lg bg-surface border border-border flex flex-col gap-2">
                          <div className="flex justify-between font-bold text-xs text-primary">
                            <span>{scopeAnalysis.changeOrderTitle}</span>
                            <span>{scopeAnalysis.quote}</span>
                          </div>
                          <p className="text-xs text-text-muted italic">&quot;{scopeAnalysis.politeEmail}&quot;</p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="self-start h-7 text-xs gap-1 mt-1"
                            onClick={() => {
                              navigator.clipboard?.writeText(scopeAnalysis.politeEmail);
                              toast({ title: 'Diplomatic Change-Order Email Copied', variant: 'success' });
                            }}
                          >
                            <Copy className="size-3" /> Copy Change-Order Email
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ),
          },
          {
            id: 'collections',
            label: 'Collections Agent',
            badge: 'FR-3.5',
            icon: <CreditCard className="size-3.5" />,
            content: (
              <div className="flex flex-col gap-4">
                <CopilotGateBanner
                  isCopilotPro={monetization.isCopilotPro}
                  price="$24/mo"
                  featureName="Autonomous Collections Agent"
                  onUpgrade={() => monetization.setUpgradeOpen(true)}
                />
                <Card className="border-primary/40">
                  <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <CardTitle>Autonomous Collections Agent</CardTitle>
                        <CardDescription>Dispatches escalating Stripe pay-link reminders &amp; reconciles webhook settlements</CardDescription>
                      </div>
                      <Badge variant="success">Active Worker</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Input
                        value={newInvClient}
                        onChange={(e) => setNewInvClient(e.target.value)}
                        placeholder="Client Name"
                        className="flex-1 min-w-40"
                      />
                      <Input
                        type="number"
                        value={newInvAmount}
                        onChange={(e) => setNewInvAmount(e.target.value)}
                        placeholder="Amount ($)"
                        className="w-32"
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          if (!newInvClient.trim()) return;
                          setInvoices((prev) => [
                            {
                              id: `inv_${Math.floor(200 + Math.random() * 799)}`,
                              client: newInvClient.trim(),
                              amount: Number(newInvAmount) || 1500,
                              due: 'Due in 14 days',
                              status: 'ISSUED',
                              chases: 0,
                            },
                            ...prev,
                          ]);
                          setNewInvClient('');
                          toast({ title: 'Invoice Issued', variant: 'success' });
                        }}
                      >
                        <Plus className="size-3.5 mr-1" /> Issue Invoice
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {invoices.map((inv) => (
                        <div
                          key={inv.id}
                          className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-border bg-bg/60"
                        >
                          <div>
                            <p className="font-bold text-sm text-text">
                              {inv.client} (${inv.amount.toLocaleString()})
                            </p>
                            <p className="text-xs text-text-muted">
                              {inv.due} • {inv.chases} Reminders Sent
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge
                              variant={
                                inv.status === 'PAID'
                                  ? 'success'
                                  : inv.status === 'CHASING'
                                    ? 'destructive'
                                    : 'default'
                              }
                            >
                              {inv.status}
                            </Badge>
                            {inv.status !== 'PAID' && (
                              <>
                                <Button size="sm" variant="outline" onClick={() => triggerChase(inv.id)}>
                                  Dispatch Stripe Reminder
                                </Button>
                                <Button size="sm" onClick={() => markInvoicePaid(inv.id)} className="gap-1">
                                  <CheckCircle2 className="size-3.5" /> Mark Paid
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ),
          },
        ]}
      />

      <CopilotUpgradeDialog
        appId="freelanceos"
        isOpen={monetization.upgradeOpen}
        onClose={() => monetization.setUpgradeOpen(false)}
        isCopilotPro={monetization.isCopilotPro}
        onToggleCopilot={monetization.toggleCopilotPro}
        onResetQuota={monetization.resetDemoQuota}
      />
    </div>
  );
}

export default function FreelanceOSPage() {
  return (
    <LayoutProvider>
      <AppShell appId="freelanceos">
        <FreelanceWorkspace />
      </AppShell>
    </LayoutProvider>
  );
}
