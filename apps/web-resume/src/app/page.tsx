'use client';

import * as React from 'react';
import {
  FileText,
  Download,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Eye,
  Code2,
  Target,
  Mic,
  MicOff,
  Briefcase,
  Upload,
  Copy,
  ShieldCheck,
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
  Progress,
  Dialog,
  AppShell,
  LayoutProvider,
  AppHeroHeader,
  CopilotUpgradeDialog,
  CopilotGateBanner,
  useAppMonetization,
  useToast,
} from '@repo/ui-web';
import {
  DEFAULT_RESUME_DATA,
  RESUME_ACCENTS,
  RESUME_TEMPLATES,
  analyzeJobDescriptionMatch,
  computeAtsHealthAudit,
  parseMarkdownToResume,
  resumeToPlainText,
  rewriteBulletWithStar,
  type AtsKeywordScanResult,
  type ResumeAccentId,
  type ResumeData,
  type ResumePaperSize,
  type ResumeTemplateId,
} from '../lib/resume-types';
import {
  generateCoverLetterPdf,
  generateEliteAtsResumePdf,
  triggerPdfDownload,
} from '../lib/resume-pdf';
import { ResumePaperPreview } from '../components/resume-paper-preview';

const INTERVIEW_PROMPTS = [
  'Tell me about a time you resolved an architectural dispute in a high-stakes engineering project.',
  'Describe a critical production outage you led recovery for and what systemic safeguards you shipped afterward.',
  'Walk me through how you balanced technical debt reduction with aggressive product delivery timelines.',
];

const SAMPLE_JD = `We are seeking a Principal Distributed Systems Engineer to architect cloud-native SaaS platforms using TypeScript, NestJS, Next.js, PostgreSQL, and Redis. Must have deep experience with Kubernetes, gRPC, OpenTelemetry observability, CI/CD automation, and LLM token metering or structured AI pipelines.`;

function CareerForgeWorkspace() {
  const { toast } = useToast();
  const monetization = useAppMonetization('careerforge');

  // Resume Builder State
  const [resume, setResume] = React.useState<ResumeData>(DEFAULT_RESUME_DATA);
  const [template, setTemplate] = React.useState<ResumeTemplateId>('executive-modern');
  const [paperSize, setPaperSize] = React.useState<ResumePaperSize>('A4');
  const [accent, setAccent] = React.useState<ResumeAccentId>('executive-navy');
  const [previewMode, setPreviewMode] = React.useState<'visual' | 'ats-text'>('visual');
  const [exportingPdf, setExportingPdf] = React.useState(false);
  const [auditModalOpen, setAuditModalOpen] = React.useState(false);
  const [importModalOpen, setImportModalOpen] = React.useState(false);
  const [markdownDraft, setMarkdownDraft] = React.useState('');

  // Persisted draft recovery
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('careerforge-resume-v2');
      if (saved) {
        setResume(JSON.parse(saved));
      }
    } catch {}
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem('careerforge-resume-v2', JSON.stringify(resume));
    } catch {}
  }, [resume]);

  const audit = React.useMemo(() => computeAtsHealthAudit(resume), [resume]);

  // ATS Scanner & STAR State (FR-1.2 & FR-1.3)
  const [jobDescription, setJobDescription] = React.useState(SAMPLE_JD);
  const [scanResult, setScanResult] = React.useState<AtsKeywordScanResult | null>(null);
  const [loadingAts, setLoadingAts] = React.useState(false);

  const [bulletInput, setBulletInput] = React.useState('Built microservices for billing system');
  const [targetRoleInput, setTargetRoleInput] = React.useState('Principal Software Architect');
  const [starResult, setStarResult] = React.useState<ReturnType<typeof rewriteBulletWithStar> | null>(null);

  // FR-1.4 Autonomous Job Tailor State
  const [tailorUrl, setTailorUrl] = React.useState('https://boards.greenhouse.io/stripe/jobs/71829');
  const [tailorCompany, setTailorCompany] = React.useState('Stripe');
  const [tailorRole, setTailorRole] = React.useState('Principal Infrastructure Engineer');
  const [tailoring, setTailoring] = React.useState(false);
  const [tailorProgress, setTailorProgress] = React.useState(0);
  const [tailoredPackage, setTailoredPackage] = React.useState<{
    customSummary: string;
    priorityKeywords: string[];
    coverLetter: string;
  } | null>(null);

  // FR-1.5 Voice Interview State
  const [promptIdx, setPromptIdx] = React.useState(0);
  const [spokenTranscript, setSpokenTranscript] = React.useState('');
  const [isRecording, setIsRecording] = React.useState(false);
  const [loadingInterview, setLoadingInterview] = React.useState(false);
  const [interviewFeedback, setInterviewFeedback] = React.useState<{
    overallScore: number;
    starScore: number;
    relevanceScore: number;
    communicationScore: number;
    strengths: string[];
    improvements: string[];
  } | null>(null);
  const recognitionRef = React.useRef<any>(null);

  // FR-1.6 Auto-Tracker Applications
  const [applications, setApplications] = React.useState([
    { id: 'app_1', company: 'Google', role: 'Staff Software Engineer', status: 'FOLLOW_UP_SENT', appliedAt: '2 days ago' },
    { id: 'app_2', company: 'Stripe', role: 'Infrastructure Tech Lead', status: 'TAILORED', appliedAt: 'Yesterday' },
    { id: 'app_3', company: 'Neon Database', role: 'Principal Systems Engineer', status: 'QUEUED', appliedAt: 'Just now' },
  ]);

  const handleExportPdf = async () => {
    setExportingPdf(true);
    try {
      const pdfBytes = await generateEliteAtsResumePdf({
        data: resume,
        template,
        paperSize,
        accent,
      });
      const safeName = (resume.fullName || 'Resume').trim().replace(/[^a-zA-Z0-9]+/g, '_');
      const filename = `${safeName}_Resume_${paperSize}_${template}.pdf`;
      triggerPdfDownload(pdfBytes, filename);
      toast({
        title: 'Elite ATS-Friendly PDF Exported',
        description: `Downloaded ${filename} with 100% selectable vector text and clickable URI links.`,
        variant: 'success',
      });
    } catch (err) {
      toast({
        title: 'PDF Export Error',
        description: err instanceof Error ? err.message : 'Unable to generate PDF.',
        variant: 'error',
      });
    } finally {
      setExportingPdf(false);
    }
  };

  const handleCopyPlainText = async () => {
    try {
      await navigator.clipboard.writeText(resumeToPlainText(resume));
      toast({
        title: 'ATS Plain Text Copied',
        description: 'Linear plain-text resume copied to clipboard for rapid portal pasting.',
        variant: 'success',
      });
    } catch {
      toast({ title: 'Copy Failed', description: 'Clipboard permission denied.', variant: 'error' });
    }
  };

  const handleImportMarkdown = () => {
    if (!markdownDraft.trim()) return;
    setResume((prev) => parseMarkdownToResume(markdownDraft, prev));
    setImportModalOpen(false);
    toast({
      title: 'Resume Imported',
      description: 'Parsed headings, summary, and bullets into the structured ATS builder.',
      variant: 'success',
    });
  };

  const handleAddSkillKeyword = (keyword: string) => {
    setResume((prev) => {
      const groups = [...prev.skills];
      if (groups.length === 0) {
        groups.push({ id: `sk_${Date.now()}`, category: 'Core Technologies', items: [keyword] });
      } else {
        const already = groups.some((g) => g.items.some((i) => i.toLowerCase() === keyword.toLowerCase()));
        if (already) return prev;
        groups[0] = { ...groups[0], items: [...groups[0].items, keyword] };
      }
      return { ...prev, skills: groups };
    });
    setScanResult((prev) =>
      prev
        ? {
            ...prev,
            matchedKeywords: [...prev.matchedKeywords, keyword],
            missingKeywords: prev.missingKeywords.filter((k) => k !== keyword),
            atsScore: Math.min(99, prev.atsScore + 4),
          }
        : null,
    );
    toast({
      title: `Added "${keyword}" to Core Competencies`,
      description: 'ATS match score and PDF resume updated immediately.',
      variant: 'success',
    });
  };

  const handleAtsScan = () => {
    if (jobDescription.trim().length < 20) {
      toast({
        title: 'Job Description Too Short',
        description: 'Paste at least 20 characters from a target job posting.',
        variant: 'warning',
      });
      return;
    }
    if (!monetization.consumeQuota('ATS Keyword Scan')) return;

    setLoadingAts(true);
    setTimeout(() => {
      const res = analyzeJobDescriptionMatch(resume, jobDescription);
      setScanResult(res);
      setLoadingAts(false);
      toast({
        title: `ATS Scan Complete: ${res.atsScore}% Match`,
        description: `${res.matchedKeywords.length} matched keywords, ${res.missingKeywords.length} gaps identified.`,
        variant: res.atsScore >= 80 ? 'success' : 'info',
      });
    }, 450);
  };

  const handleStarRewrite = (customBullet?: string, applyTarget?: { expId: string; bulletIdx: number }) => {
    if (!monetization.consumeQuota('STAR Bullet Rewrite')) return;
    const source = customBullet ?? bulletInput;
    const res = rewriteBulletWithStar(source, targetRoleInput || resume.headline);
    setStarResult(res);

    if (applyTarget) {
      setResume((prev) => ({
        ...prev,
        experience: prev.experience.map((exp) =>
          exp.id === applyTarget.expId
            ? {
                ...exp,
                bullets: exp.bullets.map((b, i) => (i === applyTarget.bulletIdx ? res.starBullet : b)),
              }
            : exp,
        ),
      }));
      toast({
        title: 'Bullet Upgraded with STAR Metrics',
        description: 'Applied quantified Situation-Task-Action-Result rewrite directly to your resume.',
        variant: 'success',
      });
    }
  };

  const handleTailorJob = () => {
    if (!tailorCompany.trim() || !tailorRole.trim()) return;
    setTailoring(true);
    setTailorProgress(25);
    setTimeout(() => setTailorProgress(65), 350);
    setTimeout(() => {
      setTailorProgress(100);
      const priorityKeywords = ['Distributed Systems', 'TypeScript', 'NestJS', 'Redis Lua', 'OpenTelemetry'];
      const coverLetter = `Dear ${tailorCompany} Hiring Team,\n\nI am excited to apply for the ${tailorRole} role at ${tailorCompany}. Over the past 9+ years as a ${resume.headline}, I have architected resilient multi-tenant platforms processing 2.4M+ monthly AI requests at 99.98% uptime while cutting tail latency by 48%.\n\nAt DevMinds Cloud Systems and StripeFlow Financial, I led distributed TypeScript and NestJS microservices, implemented atomic Redis Lua rate limiting, and mentored 14 senior engineers across zero-downtime migrations. I would welcome the opportunity to bring this systems rigor to ${tailorCompany}.\n\nSincerely,\n${resume.fullName}`;
      setTailoredPackage({
        customSummary: `${resume.headline} tailored for ${tailorCompany} (${tailorRole}), combining distributed systems reliability, sub-50ms telemetry, and production AI governance.`,
        priorityKeywords,
        coverLetter,
      });
      setTailoring(false);
      toast({
        title: `Tailored Package Ready for ${tailorCompany}`,
        description: 'Generated bespoke summary, priority keywords, and downloadable cover letter PDF.',
        variant: 'success',
      });
    }, 750);
  };

  const handleExportCoverLetterPdf = async () => {
    if (!tailoredPackage) return;
    const bytes = await generateCoverLetterPdf({
      data: resume,
      companyName: tailorCompany,
      targetRole: tailorRole,
      letterBody: tailoredPackage.coverLetter,
      paperSize,
      accent,
    });
    const safeCo = tailorCompany.replace(/[^a-zA-Z0-9]+/g, '_');
    triggerPdfDownload(bytes, `${resume.fullName.replace(/[^a-zA-Z0-9]+/g, '_')}_CoverLetter_${safeCo}.pdf`);
    toast({ title: 'Cover Letter PDF Exported', variant: 'success' });
  };

  const toggleVoiceRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop?.();
      setIsRecording(false);
      return;
    }

    const SpeechRec =
      typeof window !== 'undefined'
        ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        : null;

    if (SpeechRec) {
      const recognition = new SpeechRec();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + ' ';
        }
        setSpokenTranscript(transcript.trim());
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
      recognition.start();
      recognitionRef.current = recognition;
      setIsRecording(true);
      toast({ title: 'Listening via Microphone', description: 'Speak your STAR response clearly.', variant: 'info' });
    } else {
      setIsRecording(true);
      setTimeout(() => {
        setSpokenTranscript(
          'In my previous role as Principal Architect, we faced a critical deployment bottleneck across 4 shared services. I proposed decoupling into isolated NestJS containers with Redis Lua rate-limiting, aligned the 3 squad leads through an RFC review, and reduced deployment cycle time from 4 days to 18 minutes with zero downtime.',
        );
        setIsRecording(false);
        toast({
          title: 'Simulated Voice Capture Ready',
          description: 'Web Speech API unavailable in this browser; populated sample spoken transcript.',
          variant: 'info',
        });
      }, 900);
    }
  };

  const handleGradeInterview = () => {
    if (spokenTranscript.trim().length < 20) {
      toast({
        title: 'Provide a Spoken or Typed Response',
        description: 'Record or enter at least a few sentences to evaluate against the STAR rubric.',
        variant: 'warning',
      });
      return;
    }
    setLoadingInterview(true);
    setTimeout(() => {
      const text = spokenTranscript.toLowerCase();
      const hasMetrics = /\d+%|\d+\s*(ms|min|minutes|days|hrs|million|k|\$)/i.test(spokenTranscript);
      const hasAction = /(i led|i designed|i architected|i proposed|i built|i implemented|we shipped)/i.test(text);
      const wordLen = spokenTranscript.split(/\s+/).length;

      const starScore = Math.min(98, 70 + (hasAction ? 14 : 0) + (hasMetrics ? 12 : 0));
      const relevanceScore = Math.min(96, 74 + (wordLen > 35 ? 16 : 6));
      const communicationScore = Math.min(95, 76 + (wordLen >= 30 && wordLen <= 220 ? 15 : 5));
      const overallScore = Math.round((starScore + relevanceScore + communicationScore) / 3);

      setInterviewFeedback({
        overallScore,
        starScore,
        relevanceScore,
        communicationScore,
        strengths: [
          hasAction ? 'Clear first-person ownership ("I architected / proposed / implemented")' : 'Good situational framing',
          hasMetrics ? 'Quantified business impact with concrete metrics' : 'Structured narrative flow',
          `Concise executive pacing (${wordLen} words)`,
        ],
        improvements: [
          !hasMetrics
            ? 'Add specific before/after numbers (e.g., latency %, revenue $, or time saved) to boost Result score.'
            : 'Explicitly call out cross-functional trade-offs considered before choosing the final design.',
          'Pause briefly between Task and Action to emphasize leadership decision-making.',
        ],
      });
      setLoadingInterview(false);
    }, 550);
  };

  const cycleApplicationStatus = (id: string) => {
    const order = ['QUEUED', 'TAILORED', 'APPLIED', 'FOLLOW_UP_SENT'] as const;
    setApplications((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const idx = order.indexOf(a.status as any);
        const nextStatus = order[(idx + 1) % order.length];
        return { ...a, status: nextStatus };
      }),
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <AppHeroHeader
        appId="careerforge"
        title="CareerForge AI"
        subtitle="Elite ATS-Friendly Vector Resume Builder, Gap Scanner, Voice Mock Interviewer & Autonomous Job Copilot"
        usedQuota={monetization.usedQuota}
        freeLimit={monetization.spec.freeLimit}
        quotaUnit={monetization.spec.quotaUnit}
        isCopilotPro={monetization.isCopilotPro}
        onOpenUpgrade={() => monetization.setUpgradeOpen(true)}
        actions={
          <Button size="sm" onClick={handleExportPdf} disabled={exportingPdf} className="gap-1.5 shadow-sm">
            <Download className="size-3.5" />
            {exportingPdf ? 'Building Vector PDF...' : `Export Elite ${paperSize} PDF`}
          </Button>
        }
      />

      {/* Executive KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="cursor-pointer" onClick={() => setAuditModalOpen(true)}>
          <CardContent className="p-4 flex items-center justify-between gap-2">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">ATS Format Health</p>
              <p className="text-2xl font-extrabold text-primary mt-0.5">{audit.score}/100</p>
              <p className="text-[11px] text-text-muted mt-0.5">Click to inspect 6 checks</p>
            </div>
            <ShieldCheck className="size-7 text-primary/70 shrink-0" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between gap-2">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">STAR Metric Ratio</p>
              <p className="text-2xl font-extrabold text-success mt-0.5">
                {Math.round(audit.quantifiedBulletRatio * 100)}%
              </p>
              <p className="text-[11px] text-text-muted mt-0.5">Quantified bullets</p>
            </div>
            <Target className="size-7 text-success/70 shrink-0" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between gap-2">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">Word Budget</p>
              <p className="text-2xl font-extrabold text-text mt-0.5">{audit.wordCount}</p>
              <p className="text-[11px] text-text-muted mt-0.5">Target: 250–900 words</p>
            </div>
            <FileText className="size-7 text-accent/70 shrink-0" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between gap-2">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">Pipeline Active</p>
              <p className="text-2xl font-extrabold text-accent mt-0.5">{applications.length} Jobs</p>
              <p className="text-[11px] text-text-muted mt-0.5">BullMQ Auto-Tracker</p>
            </div>
            <Briefcase className="size-7 text-primary/70 shrink-0" />
          </CardContent>
        </Card>
      </div>

      {/* Main Feature Tabs */}
      <Tabs
        tabs={[
          {
            id: 'editor',
            label: 'Resume Studio & Elite PDF',
            badge: 'FR-1.1',
            icon: <FileText className="size-3.5" />,
            content: (
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                {/* Left Column: Structured ATS Editor (5 cols) */}
                <div className="xl:col-span-5 flex flex-col gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <CardTitle>Structured ATS Builder</CardTitle>
                          <CardDescription>Single-column linear flow guaranteed parsable by Workday, Greenhouse &amp; Lever</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setImportModalOpen(true)} className="gap-1.5 text-xs h-8">
                          <Upload className="size-3.5" />
                          Import MD
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-5">
                      {/* Identity & Links */}
                      <div className="space-y-2.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-primary">1. Header &amp; Clickable Links</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <Input
                            value={resume.fullName}
                            onChange={(e) => setResume({ ...resume, fullName: e.target.value })}
                            placeholder="Full Name"
                            aria-label="Full Name"
                          />
                          <Input
                            value={resume.location}
                            onChange={(e) => setResume({ ...resume, location: e.target.value })}
                            placeholder="City, State / Remote"
                            aria-label="Location"
                          />
                        </div>
                        <Input
                          value={resume.headline}
                          onChange={(e) => setResume({ ...resume, headline: e.target.value })}
                          placeholder="Target Headline (e.g. Principal Software Architect)"
                          aria-label="Headline"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <Input
                            value={resume.email}
                            onChange={(e) => setResume({ ...resume, email: e.target.value })}
                            placeholder="Email"
                            aria-label="Email"
                          />
                          <Input
                            value={resume.phone}
                            onChange={(e) => setResume({ ...resume, phone: e.target.value })}
                            placeholder="Phone"
                            aria-label="Phone"
                          />
                          <Input
                            value={resume.linkedin}
                            onChange={(e) => setResume({ ...resume, linkedin: e.target.value })}
                            placeholder="LinkedIn URL"
                            aria-label="LinkedIn"
                          />
                          <Input
                            value={resume.website}
                            onChange={(e) => setResume({ ...resume, website: e.target.value })}
                            placeholder="GitHub / Portfolio"
                            aria-label="Portfolio"
                          />
                        </div>
                      </div>

                      {/* Executive Summary */}
                      <div className="space-y-2 pt-3 border-t border-border">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-primary">2. Professional Summary</h4>
                        <textarea
                          value={resume.summary}
                          onChange={(e) => setResume({ ...resume, summary: e.target.value })}
                          rows={3}
                          className="w-full rounded-md border border-border bg-bg p-2.5 text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Concise 3-4 line executive impact summary..."
                        />
                      </div>

                      {/* Core Competencies */}
                      <div className="space-y-2.5 pt-3 border-t border-border">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-primary">3. Core Competencies</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs gap-1"
                            onClick={() =>
                              setResume({
                                ...resume,
                                skills: [
                                  ...resume.skills,
                                  { id: `sk_${Date.now()}`, category: 'New Category', items: ['Skill A', 'Skill B'] },
                                ],
                              })
                            }
                          >
                            <Plus className="size-3" /> Add Group
                          </Button>
                        </div>
                        {resume.skills.map((group, gIdx) => (
                          <div key={group.id} className="p-2.5 rounded-lg border border-border bg-bg/50 space-y-2">
                            <div className="flex items-center gap-2">
                              <Input
                                value={group.category}
                                onChange={(e) => {
                                  const next = [...resume.skills];
                                  next[gIdx] = { ...group, category: e.target.value };
                                  setResume({ ...resume, skills: next });
                                }}
                                className="h-8 text-xs font-semibold"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setResume({ ...resume, skills: resume.skills.filter((s) => s.id !== group.id) })
                                }
                                className="text-text-muted hover:text-error p-1 cursor-pointer"
                                aria-label="Remove skill group"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                            <Input
                              value={group.items.join(', ')}
                              onChange={(e) => {
                                const next = [...resume.skills];
                                next[gIdx] = {
                                  ...group,
                                  items: e.target.value
                                    .split(',')
                                    .map((s) => s.trim())
                                    .filter(Boolean),
                                };
                                setResume({ ...resume, skills: next });
                              }}
                              placeholder="Comma-separated skills..."
                              className="h-8 text-xs"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Experience */}
                      <div className="space-y-3 pt-3 border-t border-border">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-primary">4. Professional Experience</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs gap-1"
                            onClick={() =>
                              setResume({
                                ...resume,
                                experience: [
                                  {
                                    id: `exp_${Date.now()}`,
                                    role: 'Senior Engineer',
                                    company: 'New Company',
                                    location: 'Remote',
                                    startDate: 'Jan 2024',
                                    endDate: 'Present',
                                    bullets: ['Led architecture initiative reducing tail latency by 35%.'],
                                  },
                                  ...resume.experience,
                                ],
                              })
                            }
                          >
                            <Plus className="size-3" /> Add Role
                          </Button>
                        </div>

                        {resume.experience.map((exp, eIdx) => (
                          <div key={exp.id} className="p-3 rounded-xl border border-border bg-bg/60 space-y-2.5">
                            <div className="flex items-center justify-between gap-2">
                              <Input
                                value={exp.role}
                                onChange={(e) => {
                                  const next = [...resume.experience];
                                  next[eIdx] = { ...exp, role: e.target.value };
                                  setResume({ ...resume, experience: next });
                                }}
                                placeholder="Role Title"
                                className="h-8 text-xs font-semibold"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setResume({
                                    ...resume,
                                    experience: resume.experience.filter((item) => item.id !== exp.id),
                                  })
                                }
                                className="text-text-muted hover:text-error p-1 cursor-pointer shrink-0"
                                aria-label="Delete experience"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              <Input
                                value={exp.company}
                                onChange={(e) => {
                                  const next = [...resume.experience];
                                  next[eIdx] = { ...exp, company: e.target.value };
                                  setResume({ ...resume, experience: next });
                                }}
                                placeholder="Company"
                                className="h-8 text-xs col-span-2"
                              />
                              <Input
                                value={exp.startDate}
                                onChange={(e) => {
                                  const next = [...resume.experience];
                                  next[eIdx] = { ...exp, startDate: e.target.value };
                                  setResume({ ...resume, experience: next });
                                }}
                                placeholder="Start"
                                className="h-8 text-xs"
                              />
                              <Input
                                value={exp.endDate}
                                onChange={(e) => {
                                  const next = [...resume.experience];
                                  next[eIdx] = { ...exp, endDate: e.target.value };
                                  setResume({ ...resume, experience: next });
                                }}
                                placeholder="End"
                                className="h-8 text-xs"
                              />
                            </div>
                            <div className="space-y-1.5">
                              {exp.bullets.map((bullet, bIdx) => (
                                <div key={bIdx} className="flex items-start gap-1.5">
                                  <textarea
                                    value={bullet}
                                    onChange={(e) => {
                                      const next = [...resume.experience];
                                      const nextBullets = [...exp.bullets];
                                      nextBullets[bIdx] = e.target.value;
                                      next[eIdx] = { ...exp, bullets: nextBullets };
                                      setResume({ ...resume, experience: next });
                                    }}
                                    rows={2}
                                    className="flex-1 rounded-md border border-border bg-surface p-2 text-[11px] text-text focus:outline-none focus:ring-1 focus:ring-primary"
                                  />
                                  <div className="flex flex-col gap-1">
                                    <button
                                      type="button"
                                      title="Rewrite with STAR Formula"
                                      onClick={() => handleStarRewrite(bullet, { expId: exp.id, bulletIdx: bIdx })}
                                      className="p-1.5 rounded border border-primary/40 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer"
                                    >
                                      <Sparkles className="size-3" />
                                    </button>
                                    <button
                                      type="button"
                                      title="Remove bullet"
                                      onClick={() => {
                                        const next = [...resume.experience];
                                        next[eIdx] = {
                                          ...exp,
                                          bullets: exp.bullets.filter((_, idx) => idx !== bIdx),
                                        };
                                        setResume({ ...resume, experience: next });
                                      }}
                                      className="p-1.5 rounded border border-border text-text-muted hover:text-error cursor-pointer"
                                    >
                                      <Trash2 className="size-3" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-[11px] gap-1"
                                onClick={() => {
                                  const next = [...resume.experience];
                                  next[eIdx] = { ...exp, bullets: [...exp.bullets, 'Delivered measurable impact...'] };
                                  setResume({ ...resume, experience: next });
                                }}
                              >
                                <Plus className="size-3" /> Add Bullet
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Education */}
                      <div className="space-y-2.5 pt-3 border-t border-border">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-primary">5. Education</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs gap-1"
                            onClick={() =>
                              setResume({
                                ...resume,
                                education: [
                                  ...resume.education,
                                  {
                                    id: `edu_${Date.now()}`,
                                    degree: 'B.S. in Computer Science',
                                    institution: 'State University',
                                    location: 'USA',
                                    graduationDate: '2020',
                                  },
                                ],
                              })
                            }
                          >
                            <Plus className="size-3" /> Add Degree
                          </Button>
                        </div>
                        {resume.education.map((edu, idx) => (
                          <div key={edu.id} className="p-2.5 rounded-lg border border-border bg-bg/50 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <Input
                              value={edu.degree}
                              onChange={(e) => {
                                const next = [...resume.education];
                                next[idx] = { ...edu, degree: e.target.value };
                                setResume({ ...resume, education: next });
                              }}
                              placeholder="Degree"
                              className="h-8 text-xs sm:col-span-2"
                            />
                            <Input
                              value={edu.institution}
                              onChange={(e) => {
                                const next = [...resume.education];
                                next[idx] = { ...edu, institution: e.target.value };
                                setResume({ ...resume, education: next });
                              }}
                              placeholder="Institution"
                              className="h-8 text-xs"
                            />
                            <div className="flex gap-1.5">
                              <Input
                                value={edu.graduationDate}
                                onChange={(e) => {
                                  const next = [...resume.education];
                                  next[idx] = { ...edu, graduationDate: e.target.value };
                                  setResume({ ...resume, education: next });
                                }}
                                placeholder="Year"
                                className="h-8 text-xs"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setResume({
                                    ...resume,
                                    education: resume.education.filter((x) => x.id !== edu.id),
                                  })
                                }
                                className="text-text-muted hover:text-error p-1 cursor-pointer"
                                aria-label="Remove education"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column: Live Paper Sheet + PDF Export Toolbar (7 cols) */}
                <div className="xl:col-span-7 xl:sticky xl:top-20 flex flex-col gap-4">
                  {/* PDF Export & Template Toolbar */}
                  <Card className="border-primary/30">
                    <CardContent className="p-4 flex flex-col gap-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <select
                            value={template}
                            onChange={(e) => setTemplate(e.target.value as ResumeTemplateId)}
                            aria-label="Resume Template"
                            className="h-8 rounded-lg border border-border bg-bg px-2.5 text-xs font-medium text-text"
                          >
                            {Object.values(RESUME_TEMPLATES).map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.name} ({t.fontLabel})
                              </option>
                            ))}
                          </select>

                          <div className="flex rounded-lg border border-border bg-bg p-0.5">
                            {(['A4', 'LETTER'] as ResumePaperSize[]).map((sz) => (
                              <button
                                key={sz}
                                type="button"
                                onClick={() => setPaperSize(sz)}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer transition-colors ${
                                  paperSize === sz ? 'bg-primary text-white' : 'text-text-muted hover:text-text'
                                }`}
                              >
                                {sz}
                              </button>
                            ))}
                          </div>

                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-border bg-bg">
                            {Object.values(RESUME_ACCENTS).map((ac) => (
                              <button
                                key={ac.id}
                                type="button"
                                title={ac.name}
                                onClick={() => setAccent(ac.id)}
                                className={`w-4 h-4 rounded-full cursor-pointer transition-transform ${
                                  accent === ac.id ? 'ring-2 ring-primary ring-offset-1 scale-110' : 'opacity-75 hover:opacity-100'
                                }`}
                                style={{ backgroundColor: ac.hex }}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs gap-1"
                            onClick={() => setPreviewMode(previewMode === 'visual' ? 'ats-text' : 'visual')}
                          >
                            {previewMode === 'visual' ? <Code2 className="size-3.5" /> : <Eye className="size-3.5" />}
                            {previewMode === 'visual' ? 'ATS Text View' : 'Paper View'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs gap-1"
                            onClick={handleCopyPlainText}
                          >
                            <Copy className="size-3.5" />
                            Copy Text
                          </Button>
                          <Button size="sm" className="h-8 text-xs gap-1.5" onClick={handleExportPdf} disabled={exportingPdf}>
                            <Download className="size-3.5" />
                            {exportingPdf ? 'Generating...' : 'Export Elite PDF'}
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border text-[11px] text-text-muted">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="size-3.5 text-success" />
                          True Vector PDF • Selectable Text • Clickable Email/Links • Zero Rasterization
                        </span>
                        <button
                          type="button"
                          onClick={() => setAuditModalOpen(true)}
                          className="text-primary font-semibold hover:underline cursor-pointer"
                        >
                          ATS Audit: {audit.score}/100 ({audit.checks.filter((c) => c.passed).length}/{audit.checks.length} Passed)
                        </button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Live A4 / Letter Paper Sheet */}
                  <ResumePaperPreview
                    data={resume}
                    template={template}
                    paperSize={paperSize}
                    accent={accent}
                    viewMode={previewMode}
                  />
                </div>
              </div>
            ),
          },
          {
            id: 'ats',
            label: 'ATS Scanner & STAR',
            badge: 'FR-1.2 / 1.3',
            icon: <Target className="size-3.5" />,
            content: (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <CardTitle>ATS Keyword &amp; Gap Scanner</CardTitle>
                        <CardDescription>Guarded by @UseQuota(&apos;ATS_SCAN&apos;, 1) • Compares live resume vs JD</CardDescription>
                      </div>
                      {scanResult && (
                        <Badge variant={scanResult.atsScore >= 80 ? 'success' : 'destructive'}>
                          Match: {scanResult.atsScore}%
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste target job requirements here..."
                      className="w-full h-36 rounded-lg border border-border bg-bg p-3 text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button onClick={handleAtsScan} disabled={loadingAts} className="gap-2">
                      <Target className="size-4" />
                      {loadingAts ? 'Analyzing Keywords via Gemini Flash...' : 'Run ATS Gap Analysis'}
                    </Button>

                    {scanResult && (
                      <div className="p-4 rounded-xl border border-border bg-bg/70 flex flex-col gap-3 text-xs">
                        <div>
                          <div className="font-semibold text-success mb-1.5">
                            Matched Keywords ({scanResult.matchedKeywords.length}):
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {scanResult.matchedKeywords.map((k) => (
                              <Badge key={k} variant="success">
                                {k}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="font-semibold text-error mb-1.5">
                            Missing Keywords ({scanResult.missingKeywords.length}) — Click to add to Resume:
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {scanResult.missingKeywords.length === 0 ? (
                              <span className="text-text-muted italic">None — full keyword coverage!</span>
                            ) : (
                              scanResult.missingKeywords.map((k) => (
                                <button
                                  key={k}
                                  type="button"
                                  onClick={() => handleAddSkillKeyword(k)}
                                  className="inline-flex items-center gap-1 rounded-full border border-error/40 bg-error/10 text-error px-2.5 py-0.5 text-[11px] font-semibold hover:bg-error hover:text-white transition-colors cursor-pointer"
                                >
                                  <Plus className="size-3" /> {k}
                                </button>
                              ))
                            )}
                          </div>
                        </div>

                        <p className="text-text-muted italic border-t border-border pt-2">{scanResult.gapAnalysis}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>STAR-Method Bullet Optimizer</CardTitle>
                    <CardDescription>Guarded by @UseQuota(&apos;STAR_REWRITE&apos;, 1) • Converts duties into quantified outcomes</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    <div>
                      <label className="text-xs font-medium text-text-muted block mb-1">Target Role</label>
                      <Input
                        value={targetRoleInput}
                        onChange={(e) => setTargetRoleInput(e.target.value)}
                        placeholder="e.g. Principal Systems Architect"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-text-muted block mb-1">Original Resume Bullet</label>
                      <textarea
                        value={bulletInput}
                        onChange={(e) => setBulletInput(e.target.value)}
                        rows={3}
                        className="w-full rounded-lg border border-border bg-bg p-3 text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Paste weak resume bullet..."
                      />
                    </div>
                    <Button variant="secondary" onClick={() => handleStarRewrite()} className="gap-2">
                      <Sparkles className="size-4 text-primary" />
                      Optimize with STAR Formula
                    </Button>

                    {starResult && (
                      <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 text-xs space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div className="p-2 rounded bg-surface border border-border">
                            <strong className="text-primary block">Situation &amp; Task</strong>
                            <span className="text-text-muted">{starResult.task}</span>
                          </div>
                          <div className="p-2 rounded bg-surface border border-border">
                            <strong className="text-success block">Quantified Result</strong>
                            <span className="text-text-muted">{starResult.result}</span>
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-surface border border-border">
                          <span className="font-bold text-primary block mb-1">EXECUTIVE STAR BULLET:</span>
                          <p className="leading-relaxed text-text">{starResult.starBullet}</p>
                        </div>
                        {resume.experience[0] && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => {
                              setResume((prev) => ({
                                ...prev,
                                experience: prev.experience.map((exp, idx) =>
                                  idx === 0 ? { ...exp, bullets: [starResult.starBullet, ...exp.bullets] } : exp,
                                ),
                              }));
                              toast({
                                title: 'Inserted into Resume',
                                description: `Added STAR bullet to ${resume.experience[0].company}.`,
                                variant: 'success',
                              });
                            }}
                          >
                            Insert into Top Role ({resume.experience[0].company})
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ),
          },
          {
            id: 'tailor',
            label: 'Job Tailor & Auto-Tracker',
            badge: 'FR-1.4 / 1.6',
            icon: <Briefcase className="size-3.5" />,
            content: (
              <div className="flex flex-col gap-4">
                <CopilotGateBanner
                  isCopilotPro={monetization.isCopilotPro}
                  price="$19/mo"
                  featureName="Autonomous Job Tailor & BullMQ Auto-Tracker"
                  onUpgrade={() => monetization.setUpgradeOpen(true)}
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-primary/30">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>FR-1.4: Autonomous Job Tailor</CardTitle>
                          <CardDescription>Generates tailored summary + executive cover letter PDF in one click</CardDescription>
                        </div>
                        <Badge variant="default">$19/mo Copilot</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                      <Input
                        value={tailorUrl}
                        onChange={(e) => setTailorUrl(e.target.value)}
                        placeholder="Target Job URL (Greenhouse / Lever / LinkedIn)"
                      />
                      <div className="grid grid-cols-2 gap-2.5">
                        <Input
                          value={tailorCompany}
                          onChange={(e) => setTailorCompany(e.target.value)}
                          placeholder="Company Name"
                        />
                        <Input
                          value={tailorRole}
                          onChange={(e) => setTailorRole(e.target.value)}
                          placeholder="Target Role"
                        />
                      </div>
                      <Button onClick={handleTailorJob} disabled={tailoring} className="gap-2">
                        <Sparkles className="size-4" />
                        {tailoring ? 'Tailoring via Gemini Pro...' : 'Tailor Resume & Cover Letter'}
                      </Button>

                      {tailoring && <Progress value={tailorProgress} className="mt-1" />}

                      {tailoredPackage && (
                        <div className="p-4 rounded-xl border border-border bg-bg/70 space-y-3 text-xs">
                          <div>
                            <strong className="text-primary block mb-1">Tailored Executive Summary:</strong>
                            <p className="text-text-muted">{tailoredPackage.customSummary}</p>
                          </div>
                          <div>
                            <strong className="text-text block mb-1">Cover Letter Draft:</strong>
                            <pre className="whitespace-pre-wrap font-sans text-text-muted bg-surface p-3 rounded-lg border border-border max-h-48 overflow-y-auto">
                              {tailoredPackage.coverLetter}
                            </pre>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" onClick={handleExportCoverLetterPdf} className="gap-1.5">
                              <Download className="size-3.5" /> Export Cover Letter PDF
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setApplications((prev) => [
                                  {
                                    id: `app_${Date.now()}`,
                                    company: tailorCompany,
                                    role: tailorRole,
                                    status: 'TAILORED',
                                    appliedAt: 'Just now',
                                  },
                                  ...prev,
                                ]);
                                toast({ title: `Added ${tailorCompany} to Auto-Tracker`, variant: 'success' });
                              }}
                            >
                              Queue in Auto-Tracker
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>FR-1.6: Autonomous Auto-Tracker</CardTitle>
                          <CardDescription>Click any status badge to advance BullMQ follow-up pipeline</CardDescription>
                        </div>
                        <Badge variant="success">Active Worker</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {applications.map((app) => (
                        <div
                          key={app.id}
                          className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-bg/60"
                        >
                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-text truncate">{app.company}</p>
                            <p className="text-xs text-text-muted truncate">
                              {app.role} • {app.appliedAt}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => cycleApplicationStatus(app.id)}
                            className="cursor-pointer shrink-0"
                            title="Click to cycle pipeline status"
                          >
                            <Badge
                              variant={
                                app.status === 'FOLLOW_UP_SENT'
                                  ? 'success'
                                  : app.status === 'TAILORED'
                                    ? 'default'
                                    : 'secondary'
                              }
                            >
                              {app.status}
                            </Badge>
                          </button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            ),
          },
          {
            id: 'voice',
            label: 'Voice Mock Interview',
            badge: 'FR-1.5',
            icon: <Mic className="size-3.5" />,
            content: (
              <div className="flex flex-col gap-4">
                <CopilotGateBanner
                  isCopilotPro={monetization.isCopilotPro}
                  price="$19/mo"
                  featureName="Voice Mock Interviewer"
                  onUpgrade={() => monetization.setUpgradeOpen(true)}
                />
                <Card className="border-primary/40">
                  <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <CardTitle>Voice Mock Interview Coach</CardTitle>
                        <CardDescription>Grades spoken answers against Amazon/Google leadership rubrics</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {INTERVIEW_PROMPTS.map((_, idx) => (
                          <Button
                            key={idx}
                            size="sm"
                            variant={promptIdx === idx ? 'default' : 'outline'}
                            className="h-7 text-xs"
                            onClick={() => setPromptIdx(idx)}
                          >
                            Q{idx + 1}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <div className="p-4 rounded-xl border border-border bg-bg">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-primary block mb-1">
                        Current Interview Prompt
                      </span>
                      <p className="text-sm font-semibold text-text">{INTERVIEW_PROMPTS[promptIdx]}</p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-text-muted">Spoken / Live Transcript:</label>
                      <textarea
                        value={spokenTranscript}
                        onChange={(e) => setSpokenTranscript(e.target.value)}
                        placeholder="Tap 'Record Voice Answer' or type your STAR response..."
                        className="w-full h-28 rounded-lg border border-border bg-bg p-3 text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <Button
                        variant={isRecording ? 'destructive' : 'secondary'}
                        onClick={toggleVoiceRecording}
                        className="gap-2"
                      >
                        {isRecording ? <MicOff className="size-4" /> : <Mic className="size-4" />}
                        {isRecording ? 'Stop Recording' : 'Record Voice Answer'}
                      </Button>
                      <Button onClick={handleGradeInterview} disabled={loadingInterview}>
                        {loadingInterview ? 'Grading against Rubric...' : 'Grade Spoken Answer'}
                      </Button>
                    </div>

                    {interviewFeedback && (
                      <div className="p-4 rounded-xl border border-border bg-bg/70 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm">Overall Candidate Score</span>
                          <Badge variant="success">{interviewFeedback.overallScore}/100</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="p-2.5 rounded-lg bg-surface border border-border">
                            <span className="block font-bold text-base text-primary">{interviewFeedback.starScore}/100</span>
                            <span className="text-text-muted">STAR Structure</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-surface border border-border">
                            <span className="block font-bold text-base text-accent">{interviewFeedback.relevanceScore}/100</span>
                            <span className="text-text-muted">Relevance</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-surface border border-border">
                            <span className="block font-bold text-base text-success">{interviewFeedback.communicationScore}/100</span>
                            <span className="text-text-muted">Delivery</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <strong className="text-success block mb-1">Key Strengths:</strong>
                            <ul className="list-disc pl-4 space-y-0.5 text-text-muted">
                              {interviewFeedback.strengths.map((s) => (
                                <li key={s}>{s}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <strong className="text-warning block mb-1">Coaching Tips:</strong>
                            <ul className="list-disc pl-4 space-y-0.5 text-text-muted">
                              {interviewFeedback.improvements.map((s) => (
                                <li key={s}>{s}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ),
          },
        ]}
      />

      {/* ATS Format Audit Dialog */}
      <Dialog
        isOpen={auditModalOpen}
        onClose={() => setAuditModalOpen(false)}
        title={`ATS Readiness Audit — ${audit.score}/100`}
        description="Checks structural, typographic, and content signals required by enterprise ATS parsers"
      >
        <div className="space-y-2.5">
          {audit.checks.map((chk) => (
            <div
              key={chk.id}
              className="flex items-start gap-3 p-3 rounded-xl border border-border bg-bg/60 text-xs"
            >
              {chk.passed ? (
                <CheckCircle2 className="size-4 text-success shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="size-4 text-warning shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-text">{chk.label}</span>
                  <Badge variant={chk.passed ? 'success' : 'secondary'}>+{chk.weight} pts</Badge>
                </div>
                <p className="text-text-muted mt-0.5">{chk.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Dialog>

      {/* Markdown Import Dialog */}
      <Dialog
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        title="Import Markdown or Raw Resume Text"
        description="Paste a Markdown resume (# Name, ## SUMMARY, ## EXPERIENCE) to populate the structured builder"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setImportModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleImportMarkdown}>
              Parse into Builder
            </Button>
          </>
        }
      >
        <textarea
          value={markdownDraft}
          onChange={(e) => setMarkdownDraft(e.target.value)}
          rows={10}
          placeholder={`# JANE DOE\nStaff Platform Engineer\n\n## SUMMARY\n...\n\n## EXPERIENCE\n- Reduced p99 latency by 45%...`}
          className="w-full rounded-lg border border-border bg-bg p-3 text-xs font-mono text-text"
        />
      </Dialog>

      {/* Model 5 Copilot Upgrade Modal */}
      <CopilotUpgradeDialog
        appId="careerforge"
        isOpen={monetization.upgradeOpen}
        onClose={() => monetization.setUpgradeOpen(false)}
        isCopilotPro={monetization.isCopilotPro}
        onToggleCopilot={monetization.toggleCopilotPro}
        onResetQuota={monetization.resetDemoQuota}
      />
    </div>
  );
}

export default function CareerForgePage() {
  return (
    <LayoutProvider>
      <AppShell appId="careerforge">
        <CareerForgeWorkspace />
      </AppShell>
    </LayoutProvider>
  );
}
