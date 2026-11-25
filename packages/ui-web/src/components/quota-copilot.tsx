'use client';

import * as React from 'react';
import { Sparkles, Check, Lock, Zap, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { Badge } from './badge';
import { Button } from './button';
import { Dialog } from './dialog';
import { Progress } from './progress';
import { ECOSYSTEM_APPS, type AppConfig } from './app-shell';
import { useToast } from './toast';

export interface AppMonetizationSpec {
  freeItems: string[];
  copilotItems: string[];
  freeLimit: number;
  quotaUnit: string;
}

const APP_SPECS: Record<AppConfig['id'], AppMonetizationSpec> = {
  careerforge: {
    freeLimit: 3,
    quotaUnit: 'ATS Scans / mo',
    freeItems: [
      'Unlimited manual A4 & US Letter Elite PDF exports',
      '3 Free AI ATS Keyword & Gap Scans / month',
      '5 Free STAR-method bullet rewrites / month',
    ],
    copilotItems: [
      'Unlimited ATS Scans, STAR Rewrites & Executive Templates',
      'Autonomous Job Tailor + Custom Cover Letter (1-click)',
      'Voice Mock Interview Coach with rubric grading',
      'BullMQ Auto-Tracker with scheduled follow-up emails',
    ],
  },
  kinetic: {
    freeLimit: 3,
    quotaUnit: 'AI Scans / wk',
    freeItems: [
      'Unlimited manual workout logging, rest timer & 1RM tracker',
      '3 Free AI Workout Split Generations / week',
      '3 Free Multimodal Meal Photo Scans / week',
    ],
    copilotItems: [
      'Unlimited Gemini Vision Meal Scans & Split Periodization',
      '30FPS Camera Skeletal Pose Coach with audio cues',
      '06:00 Biometric Auto-Regulation (HRV & Sleep sync)',
      'Live /fitness-live WebSocket telemetry under 50ms',
    ],
  },
  freelanceos: {
    freeLimit: 5,
    quotaUnit: 'AI Docs / mo',
    freeItems: [
      'Unlimited CRM clients, Kanban boards & billable timer',
      '5 Free AI Proposals, SOW Contracts & Invoices / month',
      '5 Free Mobile Receipt OCR tax scans / month',
    ],
    copilotItems: [
      'Unlimited AI SOW Contracts, Proposals & E-Sign PDFs',
      'Scope-Creep Shield with SOW embedding deviation audit',
      'Autonomous Collections Agent with Stripe pay links',
      'Real-time Stripe revenue webhook alerts',
    ],
  },
  viralmatrix: {
    freeLimit: 3,
    quotaUnit: 'Videos / mo',
    freeItems: [
      '3 Long-form YouTube / video conversions / month',
      '5 Viral Hooks, X Threads & LinkedIn Authority Posts',
      'Watermarked 60s vertical clips with word-level captions',
    ],
    copilotItems: [
      'Unlimited long-form video repurposing & hook generation',
      'Watermark-free 9:16 Active-Speaker Kinetic Reframing',
      'Animated word-by-word captions & FFmpeg background worker',
      'Omnichannel Auto-Publisher (TikTok, Shorts, Reels, X)',
    ],
  },
};

export function useAppMonetization(appId: AppConfig['id']) {
  const spec = APP_SPECS[appId];
  const [usedQuota, setUsedQuota] = React.useState(0);
  const [isCopilotPro, setIsCopilotPro] = React.useState(false);
  const [upgradeOpen, setUpgradeOpen] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    try {
      const savedPro = localStorage.getItem(`copilot-pro-${appId}`);
      const savedUsed = localStorage.getItem(`quota-used-${appId}`);
      if (savedPro === 'true') setIsCopilotPro(true);
      if (savedUsed) setUsedQuota(Math.max(0, Number(savedUsed) || 0));
    } catch {}
  }, [appId]);

  const remaining = Math.max(0, spec.freeLimit - usedQuota);

  const consumeQuota = (actionName: string): boolean => {
    if (isCopilotPro) return true;
    if (usedQuota >= spec.freeLimit) {
      toast({
        title: 'HTTP 402 — Free Monthly/Weekly Quota Reached',
        description: `You used all ${spec.freeLimit} free ${spec.quotaUnit} for ${actionName}. Upgrade to Copilot Pro for unlimited access.`,
        variant: 'warning',
      });
      setUpgradeOpen(true);
      return false;
    }
    const next = usedQuota + 1;
    setUsedQuota(next);
    try {
      localStorage.setItem(`quota-used-${appId}`, String(next));
    } catch {}
    return true;
  };

  const resetDemoQuota = () => {
    setUsedQuota(0);
    try {
      localStorage.setItem(`quota-used-${appId}`, '0');
    } catch {}
    toast({
      title: 'Free Tier Quota Reset',
      description: `Restored ${spec.freeLimit} free ${spec.quotaUnit} for testing.`,
      variant: 'info',
    });
  };

  const toggleCopilotPro = (enabled?: boolean) => {
    const next = enabled ?? !isCopilotPro;
    setIsCopilotPro(next);
    try {
      localStorage.setItem(`copilot-pro-${appId}`, String(next));
    } catch {}
    toast({
      title: next ? 'Copilot Pro Activated' : 'Switched to Model 1 Free Tier',
      description: next
        ? `Unlocked all Model 5 Copilot autonomous workflows for ${ECOSYSTEM_APPS[appId].name}.`
        : 'Testing Model 1 usage-capped free tier mode.',
      variant: next ? 'success' : 'info',
    });
    setUpgradeOpen(false);
  };

  return {
    spec,
    usedQuota,
    remaining,
    isCopilotPro,
    upgradeOpen,
    setUpgradeOpen,
    consumeQuota,
    resetDemoQuota,
    toggleCopilotPro,
  };
}

export interface CopilotUpgradeDialogProps {
  appId: AppConfig['id'];
  isOpen: boolean;
  onClose: () => void;
  isCopilotPro: boolean;
  onToggleCopilot: (enabled?: boolean) => void;
  onResetQuota?: () => void;
}

export function CopilotUpgradeDialog({
  appId,
  isOpen,
  onClose,
  isCopilotPro,
  onToggleCopilot,
  onResetQuota,
}: CopilotUpgradeDialogProps) {
  const app = ECOSYSTEM_APPS[appId];
  const spec = APP_SPECS[appId];

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={`${app.name} — Plans & Copilot Pro`}
      description="Model 1 Usage-Capped Free Tier vs Model 5 Autonomous Copilot Add-On"
      footer={
        <div className="flex w-full flex-wrap items-center justify-between gap-2">
          {onResetQuota ? (
            <Button variant="ghost" size="sm" onClick={onResetQuota}>
              Reset Free Quota Counter
            </Button>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button
              variant={isCopilotPro ? 'secondary' : 'default'}
              size="sm"
              onClick={() => onToggleCopilot(!isCopilotPro)}
            >
              {isCopilotPro ? 'Switch to Free Tier' : `Activate Copilot Pro (${app.copilotPrice})`}
            </Button>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-bg/60 p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-text">Model 1: Free Tier</span>
            <Badge variant="outline">$0 / mo</Badge>
          </div>
          <p className="text-xs text-text-muted">
            Redis Lua atomic rate-limiting protects AI quotas while manual tools stay 100% unlimited.
          </p>
          <ul className="space-y-2 text-xs text-text">
            {spec.freeItems.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Check className="size-3.5 text-success shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border-2 border-primary bg-primary/5 p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-text flex items-center gap-1.5">
              <Sparkles className="size-4 text-primary" />
              Model 5: Copilot Pro
            </span>
            <Badge variant="default">{app.copilotPrice}</Badge>
          </div>
          <p className="text-xs text-text-muted">
            Stripe & RevenueCat entitlement unlocks autonomous BullMQ agents and Gemini Pro pipelines.
          </p>
          <ul className="space-y-2 text-xs text-text">
            {spec.copilotItems.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Zap className="size-3.5 text-primary shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Dialog>
  );
}

export interface AppHeroHeaderProps {
  appId: AppConfig['id'];
  title: string;
  subtitle: string;
  usedQuota: number;
  freeLimit: number;
  quotaUnit: string;
  isCopilotPro: boolean;
  onOpenUpgrade: () => void;
  actions?: React.ReactNode;
}

export function AppHeroHeader({
  appId,
  title,
  subtitle,
  usedQuota,
  freeLimit,
  quotaUnit,
  isCopilotPro,
  onOpenUpgrade,
  actions,
}: AppHeroHeaderProps) {
  const app = ECOSYSTEM_APPS[appId];
  const remaining = Math.max(0, freeLimit - usedQuota);
  const pct = isCopilotPro ? 100 : (remaining / freeLimit) * 100;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-surface/75 backdrop-blur-md p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text">{title}</h1>
            {isCopilotPro ? (
              <Badge variant="success" className="gap-1">
                <ShieldCheck className="size-3" />
                Copilot Pro Active
              </Badge>
            ) : (
              <Badge variant="default" className="gap-1">
                Model 1: {remaining}/{freeLimit} {quotaUnit} left
              </Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-text-muted max-w-2xl">{subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {!isCopilotPro && (
            <div className="hidden sm:flex flex-col gap-1 min-w-36 px-3 py-2 rounded-xl border border-border bg-bg/70">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-text-muted">Free AI Quota</span>
                <span className="font-semibold text-text">
                  {remaining}/{freeLimit}
                </span>
              </div>
              <Progress value={pct} className="h-1.5" />
            </div>
          )}
          {actions}
          <Button
            variant={isCopilotPro ? 'outline' : 'default'}
            size="sm"
            onClick={onOpenUpgrade}
            className="gap-1.5 shadow-sm"
          >
            <Sparkles className="size-3.5" />
            {isCopilotPro ? 'Manage Copilot Plan' : `Upgrade Copilot (${app.copilotPrice})`}
          </Button>
        </div>
      </div>
    </div>
  );
}

export interface CopilotGateBannerProps {
  isCopilotPro: boolean;
  price: string;
  featureName: string;
  onUpgrade: () => void;
  className?: string;
}

export function CopilotGateBanner({
  isCopilotPro,
  price,
  featureName,
  onUpgrade,
  className,
}: CopilotGateBannerProps) {
  if (isCopilotPro) return null;
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-primary/30 bg-primary/5 text-xs',
        className,
      )}
    >
      <div className="flex items-center gap-2.5">
        <Lock className="size-4 text-primary shrink-0" />
        <div>
          <span className="font-semibold text-text">Model 5 Copilot Preview ({price}) — </span>
          <span className="text-text-muted">
            Interactive sandbox enabled for {featureName}. Unlock production BullMQ automation with Copilot Pro.
          </span>
        </div>
      </div>
      <Button size="sm" variant="default" onClick={onUpgrade} className="shrink-0 h-8 text-xs">
        Unlock Copilot Pro
      </Button>
    </div>
  );
}
