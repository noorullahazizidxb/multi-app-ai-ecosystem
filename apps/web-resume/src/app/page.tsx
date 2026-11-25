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
  Progress,
  AppShell,
  AppearanceManager,
  LayoutProvider,
} from '@repo/ui-web';
import Link from 'next/link';

export default function CareerForgePage() {
  // Resume Editor State
  const [template, setTemplate] = React.useState('executive-modern');
  const [resumeText, setResumeText] = React.useState(
    `# ALEX CHEN
Principal Software Architect | Distributed Systems & AI

## SUMMARY
Passionate engineer with 8+ years architecting high-scale cloud-native SaaS ecosystems with TypeScript, NestJS, and Next.js 15.

## EXPERIENCE
- Architected decoupled monorepo supporting 4 SaaS products with 80% shared DRY libraries.
- Implemented Redis Lua atomic rate limiting, preventing quota exhaustion across millions of requests.
- Integrated Gemini 2.5 Flash & Pro models for real-time structured telemetry.`,
  );

  // ATS Scanner State
  const [jobDescription, setJobDescription] = React.useState('');
  const [atsScore, setAtsScore] = React.useState<number | null>(null);
  const [scanResult, setScanResult] = React.useState<any>(null);
  const [loadingAts, setLoadingAts] = React.useState(false);

  // STAR Bullet State
  const [bullet, setBullet] = React.useState('Built microservices for billing system');
  const [starResult, setStarResult] = React.useState<string | null>(null);

      // Voice Interview Prep State (FR-1.5)
      const [interviewQuestion, setInterviewQuestion] = React.useState(
        'Tell me about a time you resolved an architectural dispute in a high-stakes engineering project.',
      );
      const [spokenTranscript, setSpokenTranscript] = React.useState('');
      const [isRecording, setIsRecording] = React.useState(false);
      const [interviewFeedback, setInterviewFeedback] = React.useState<any>(null);
      const [loadingInterview, setLoadingInterview] = React.useState(false);

      // Auto-Tracker Applications (FR-1.6)
      const [applications, setApplications] = React.useState([
        { id: 'app_1', company: 'Google', role: 'Staff Software Engineer', status: 'FOLLOW_UP_SENT', appliedAt: '2 days ago' },
        { id: 'app_2', company: 'Stripe', role: 'Infrastructure Tech Lead', status: 'TAILORED', appliedAt: 'Yesterday' },
        { id: 'app_3', company: 'Neon Database', role: 'Principal Systems Engineer', status: 'QUEUED', appliedAt: 'Just now' },
      ]);

      const handleAtsScan = () => {
        setLoadingAts(true);
        setTimeout(() => {
          setAtsScore(93);
          setScanResult({
            matchedKeywords: ['TypeScript', 'NestJS', 'Distributed Systems', 'Cloud-Native', 'Redis'],
            missingKeywords: ['Kubernetes', 'gRPC', 'OpenTelemetry'],
            gapAnalysis: 'Resume closely matches principal level core competencies. Adding gRPC and OTel will elevate match to 98%.',
          });
        setLoadingAts(false);
      }, 600);
    };

    const handleStarRewrite = () => {
      setStarResult(
        'Engineered decoupled NestJS billing microservices with Redis atomic Lua rate-limiting, decreasing invoice processing latency by 45% and eliminating payment race conditions across 250,000 monthly transactions.',
      );
    };

    const handleVoiceInterviewGrade = () => {
      setLoadingInterview(true);
      setTimeout(() => {
        setInterviewFeedback({
          overallScore: 91,
          starScore: 94,
          relevanceScore: 90,
          communicationScore: 89,
          strengths: [
            'Excellent Situation and Task articulation',
            'Quantified business outcome with concrete metrics',
            'Demonstrated high ownership under executive ambiguity',
          ],
          improvements: [
            'Consider pausing between Task and Action for rhetorical emphasis',
            'Highlight cross-functional stakeholder alignment earlier',
          ],
        });
        setLoadingInterview(false);
      }, 800);
    };

    return (
      <LayoutProvider>
        <AppShell appId="careerforge">
          <div className="flex flex-col gap-6">
            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border border-border bg-surface/60 backdrop-blur-sm">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text">CareerForge AI</h1>
                  <Badge variant="default">Model 1: 3 Free Scans/Mo</Badge>
                </div>
                <p className="text-xs sm:text-sm text-text-muted mt-1">
                  Executive Resume Builder, Voice Mock Interview Prep & Job Copilot ($19/mo)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="default" size="sm" className="shadow-sm">Upgrade to Copilot Pro</Button>
              </div>
            </div>

            {/* Appearance & Workspace Manager */}
            <AppearanceManager currentTheme="clean-slate" />

            {/* Modern Tabs Navigation */}
            <Tabs
              tabs={[
                {
                  id: 'editor',
                  label: 'FR-1.1: Live A4 Resume Editor',
                  content: (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
                      <Card>
                        <CardHeader>
                          <div className="flex justify-between items-center">
                            <CardTitle>Markdown Resume Editor</CardTitle>
                            <select
                              value={template}
                              onChange={(e) => setTemplate(e.target.value)}
                              className="text-xs bg-surface border border-border rounded px-2 py-1 text-text"
                            >
                              <option value="executive-modern">Executive Modern</option>
                              <option value="minimal-tech">Minimal Tech</option>
                              <option value="creative-bold">Creative Bold</option>
                            </select>
                          </div>
                          <CardDescription>Live real-time editing with instant typography rendering</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <textarea
                            value={resumeText}
                            onChange={(e) => setResumeText(e.target.value)}
                            className="w-full h-80 rounded-md border border-border bg-bg p-3 text-xs font-mono text-text focus:ring-2 focus:ring-primary focus:outline-none"
                          />
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <span className="text-xs text-text-muted">Words: {resumeText.split(/\s+/).length}</span>
                          <Button size="sm">Export High-Res A4 PDF</Button>
                        </CardFooter>
                      </Card>

                              {/* Live A4 Preview Container */}
                              <div className="border border-border rounded-xl bg-surface p-6 shadow-md flex flex-col justify-between">
                                <div>
                                  <div className="border-b border-border pb-3 mb-4 flex justify-between items-center">
                                    <span className="text-xs uppercase tracking-wider font-bold text-primary">A4 / Letter Live Preview</span>
                                    <Badge variant="outline">Template: {template}</Badge>
                                  </div>
                                  <div className="font-serif text-sm leading-relaxed whitespace-pre-line text-text">
                                    {resumeText}
                                  </div>
                                </div>
                                <div className="pt-4 border-t border-border flex justify-between items-center text-xs text-text-muted">
                                  <span>Page 1 of 1</span>
                                  <span>Compliant with ISO ATS Standards</span>
                                </div>
                              </div>
              </div>
          ),
          },
          {
            id: 'ats',
          label: 'FR-1.2 & FR-1.3: ATS Gap Scanner & STAR',
          content: (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>ATS Keyword Match Scanner</CardTitle>
                  {atsScore !== null && (
                    <Badge variant={atsScore >= 80 ? 'success' : 'destructive'}>
                      Match: {atsScore}%
                    </Badge>
                  )}
                </div>
                <CardDescription>Guarded by @UseQuota('ATS_SCAN', 1)</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste target job requirements here..."
                  className="w-full h-32 rounded-md border border-border bg-bg p-3 text-xs text-text"
                />
                <Button onClick={handleAtsScan} disabled={loadingAts}>
                  {loadingAts ? 'Scanning via Gemini Flash...' : 'Run ATS Gap Analysis'}
                </Button>
                {scanResult && (
                  <div className="p-3 rounded-lg border border-border bg-bg flex flex-col gap-2 text-xs">
                    <div className="font-semibold text-success">Matched Keywords:</div>
                    <div className="flex flex-wrap gap-1">
                      {scanResult.matchedKeywords.map((k: string) => (
                        <Badge key={k} variant="success">{k}</Badge>
                      ))}
                    </div>
                    <div className="font-semibold text-error mt-1">Missing Keywords:</div>
                    <div className="flex flex-wrap gap-1">
                      {scanResult.missingKeywords.map((k: string) => (
                        <Badge key={k} variant="destructive">{k}</Badge>
                      ))}
                    </div>
                    <p className="text-text-muted mt-1 italic">{scanResult.gapAnalysis}</p>
                  </div>
                )}
              </CardContent>
            </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>STAR-Method Bullet Optimizer</CardTitle>
                        <CardDescription>Guarded by @UseQuota('STAR_REWRITE', 1)</CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-3">
                        <Input
                          value={bullet}
                          onChange={(e) => setBullet(e.target.value)}
                          placeholder="Paste resume bullet..."
                        />
                        <Button variant="secondary" onClick={handleStarRewrite}>
                          Optimize with STAR Formula
                        </Button>
                        {starResult && (
                          <div className="p-4 rounded-lg border border-border bg-surface text-xs mt-2">
                            <span className="font-bold text-primary block mb-1">OPTIMIZED BULLET:</span>
                            <p className="leading-relaxed">{starResult}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                  ),
          },
                  {
                    id: 'voice',
                  label: 'FR-1.5: Voice Interview Prep (Copilot)',
                  content: (
                  <Card className="mt-2 border-primary/40 shadow-lg">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>Voice Mock Interview Coach</CardTitle>
                          <CardDescription>Grades spoken answers against Amazon/Google leadership rubrics</CardDescription>
                        </div>
                        <Badge variant="default">$19/mo Copilot</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                      <div className="p-4 rounded-lg border border-border bg-bg">
                        <span className="text-xs font-bold text-primary block mb-1">CURRENT INTERVIEW PROMPT:</span>
                        <p className="text-sm font-semibold">{interviewQuestion}</p>
                      </div>

                            <div className="flex flex-col gap-2">
                              <label className="text-xs text-text-muted">Your Spoken Response:</label>
                              <textarea
                                value={spokenTranscript}
                                onChange={(e) => setSpokenTranscript(e.target.value)}
                                placeholder="Speak or paste your answer: 'In my last role, we faced a major bottleneck with monolith deployments...'"
                                className="w-full h-28 rounded-md border border-border bg-bg p-3 text-xs text-text"
                              />
                            </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      variant={isRecording ? 'destructive' : 'secondary'}
                      onClick={() => setIsRecording(!isRecording)}
                    >
                      {isRecording ? '🛑 Stop Recording' : '🎙️ Record Voice Audio'}
                    </Button>
                    <Button onClick={handleVoiceInterviewGrade} disabled={loadingInterview}>
                      {loadingInterview ? 'Grading against Rubric...' : 'Grade Spoken Answer'}
                    </Button>
                  </div>

                  { interviewFeedback && (
                                  <div className="p-4 rounded-xl border border-border bg-surface flex flex-col gap-3 mt-2">
                                    <div className="flex items-center justify-between">
                                      <span className="font-bold text-sm">Overall Candidate Score</span>
                                      <Badge variant="success">{interviewFeedback.overallScore}/100</Badge>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                      <div className="p-2 rounded bg-bg">
                                        <span className="block font-bold">{interviewFeedback.starScore}/100</span>
                                        <span className="text-text-muted">STAR Structure</span>
                                      </div>
                                      <div className="p-2 rounded bg-bg">
                                        <span className="block font-bold">{interviewFeedback.relevanceScore}/100</span>
                                        <span className="text-text-muted">Relevance</span>
                                      </div>
                                      <div className="p-2 rounded bg-bg">
                                        <span className="block font-bold">{interviewFeedback.communicationScore}/100</span>
                                        <span className="text-text-muted">Delivery</span>
                                      </div>
                                    </div>
                                    <div className="text-xs text-text">
                                      <strong className="text-success block mb-1">Key Strengths:</strong>
                                      <ul className="list-disc pl-4 space-y-0.5 text-text-muted">
                                        {interviewFeedback.strengths.map((s: string) => (
                                          <li key={s}>{s}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                )}
                            </CardContent>
                          </Card>
                          ),
          },
                          {
                            id: 'tracker',
                          label: 'FR-1.6: Autonomous Auto-Tracker',
                          content: (
                          <Card className="mt-2 border-primary/40">
                            <CardHeader>
                              <div className="flex justify-between items-center">
                                <div>
                                  <CardTitle>Autonomous Job Application Pipeline</CardTitle>
                                  <CardDescription>BullMQ background worker auto-dispatches follow-up emails</CardDescription>
                                </div>
                                <Badge variant="default">Active Worker</Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                {applications.map((app) => (
                                  <div
                                    key={app.id}
                                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface"
                                  >
                                    <div>
                                      <p className="font-semibold text-sm">{app.company}</p>
                                      <p className="text-xs text-text-muted">{app.role} • {app.appliedAt}</p>
                                    </div>
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
