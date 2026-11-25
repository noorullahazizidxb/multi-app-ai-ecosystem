'use client';

import * as React from 'react';
import {
  Video,
  Scissors,
  Share2,
  Sparkles,
  Copy,
  Download,
  Send,
  Flame,
  Clock,
  CheckCircle2,
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
  AppShell,
  LayoutProvider,
  AppHeroHeader,
  CopilotUpgradeDialog,
  CopilotGateBanner,
  useAppMonetization,
  useToast,
} from '@repo/ui-web';

function ViralMatrixWorkspace() {
  const { toast } = useToast();
  const monetization = useAppMonetization('viralmatrix');

  // FR-4.1 Long-Form Repurposer
  const [videoUrl, setVideoUrl] = React.useState('https://youtube.com/watch?v=saas-architecture-2026');
  const [videoTitle, setVideoTitle] = React.useState('How We Scaled 4 Decoupled AI SaaS Apps');
  const [loadingRepurpose, setLoadingRepurpose] = React.useState(false);
  const [repurposedData, setRepurposedData] = React.useState<{
    viralHooks: string[];
    xThread: string[];
    linkedInPost: string;
    suggestedClips: Array<{ start: string; end: string; hook: string; score: number }>;
  } | null>(null);

  // FR-4.2 & FR-4.3 9:16 Reframer
  const [captionStyle, setCaptionStyle] = React.useState<'yellow' | 'white' | 'neon'>('yellow');
  const [reframing, setReframing] = React.useState(false);
  const [reframeProgress, setReframeProgress] = React.useState(0);
  const [reframedReady, setReframedReady] = React.useState(false);
  const [activeCaptionIdx, setActiveCaptionIdx] = React.useState(0);

  const captionPhrases = [
    '"Stop Building Slow Monoliths!"',
    '"80% Shared DRY Packages"',
    '"Sub-50ms Live WebSockets"',
  ];

  React.useEffect(() => {
    const t = setInterval(() => setActiveCaptionIdx((i) => (i + 1) % captionPhrases.length), 2200);
    return () => clearInterval(t);
  }, []);

  // FR-4.4 Omnichannel Publisher
  const [scheduledPosts, setScheduledPosts] = React.useState([
    { id: 'p1', platform: 'TikTok', account: '@viralmatrix', time: '18:00 UTC (Peak)', status: 'QUEUED' },
    { id: 'p2', platform: 'YouTube Shorts', account: 'ViralMatrix AI', time: '18:15 UTC (Peak)', status: 'QUEUED' },
    { id: 'p3', platform: 'Instagram Reels', account: '@viralmatrix.ai', time: '19:00 UTC', status: 'QUEUED' },
    { id: 'p4', platform: 'X / Twitter', account: '@viralmatrix_ai', time: '18:00 UTC', status: 'QUEUED' },
  ]);

  const copyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: `${label} Copied`, variant: 'success' });
    } catch {
      toast({ title: 'Copy Failed', variant: 'error' });
    }
  };

  const handleRepurpose = () => {
    if (!monetization.consumeQuota('Video Repurpose')) return;
    setLoadingRepurpose(true);
    setTimeout(() => {
      const topic = videoTitle.trim() || 'Modern AI SaaS Architecture';
      setRepurposedData({
        viralHooks: [
          `Most teams build "${topic}" completely backwards. Here is the 10x blueprint:`,
          'Stop bundling 4 AI products into one slow monolithic server. Here is why:',
          'How we shared 80% DRY TypeScript + Flutter code across 4 isolated verticals:',
          'The real secret behind profitable $14–$29/mo AI Copilot subscriptions:',
          'Why Turborepo + Redis Lua rate-limiting eliminates SaaS scaling bottlenecks:',
        ],
        xThread: [
          `1/6 🧵 Scaling "${topic}" without operational chaos? Here is the exact architecture 👇`,
          '2/6 Instead of a monolith where FFmpeg video encoding starves billing, each app runs an isolated NestJS container.',
          '3/6 Shared Prisma v8 Dynamic Adapter connects to Neon, Turso, or MySQL from one schema.',
          '4/6 10 OKLCH theme presets render identically across Next.js 15 & Flutter BLoC with zero lag.',
          '5/6 Free tiers use Redis Lua atomic counters; Copilot Pro unlocks BullMQ background agents.',
          '6/6 Bookmark this thread & ship faster with clean vertical isolation! 🚀',
        ],
        linkedInPost: `In modern SaaS engineering (${topic}), monolithic coupling silently kills velocity.\n\nBy decoupling 4 application verticals into isolated NestJS containers while sharing 80% of core TypeScript & Dart infrastructure via Turborepo, teams ship faster with zero cross-domain blast radius.\n\n#SoftwareArchitecture #TypeScript #NextJS15 #NestJS #AI`,
        suggestedClips: [
          { start: '01:12', end: '02:08', hook: 'Why Monoliths Fail Under Video Encoding Load', score: 94 },
          { start: '04:35', end: '05:30', hook: 'Atomic Redis Lua Rate Limiting Explained in 55s', score: 91 },
          { start: '08:04', end: '08:58', hook: '10 OKLCH Themes Shared Across Web & Flutter', score: 87 },
        ],
      });
      setLoadingRepurpose(false);
      toast({
        title: 'Social Assets Synthesized',
        description: 'Generated 5 viral hooks, 6-part X thread, LinkedIn post & 3 clip timestamps.',
        variant: 'success',
      });
    }, 600);
  };

  const handleReframe = () => {
    setReframing(true);
    setReframedReady(false);
    setReframeProgress(20);
    setTimeout(() => setReframeProgress(60), 350);
    setTimeout(() => setReframeProgress(90), 650);
    setTimeout(() => {
      setReframeProgress(100);
      setReframing(false);
      setReframedReady(true);
      toast({
        title: monetization.isCopilotPro ? '9:16 Watermark-Free Short Ready' : '9:16 Watermarked Short Ready',
        description: 'Active-speaker crop & word-level captions rendered.',
        variant: 'success',
      });
    }, 1000);
  };

  const handleDownloadSrt = () => {
    const srt = `1\n00:00:00,000 --> 00:00:03,200\nStop Building Slow Monoliths!\n\n2\n00:00:03,200 --> 00:00:06,500\n80% Shared DRY Packages across Web & Flutter\n\n3\n00:00:06,500 --> 00:00:10,000\nSub-50ms Live WebSockets with Redis Pub/Sub\n`;
    const blob = new Blob([srt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'viralmatrix_916_captions.srt';
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Downloaded SRT Captions File', variant: 'success' });
  };

  const publishAll = (targetStatus: 'SCHEDULED' | 'PUBLISHED') => {
    setScheduledPosts((prev) => prev.map((p) => ({ ...p, status: targetStatus })));
    toast({
      title: targetStatus === 'PUBLISHED' ? 'Published Across All 4 Channels' : 'Scheduled for Peak Hours',
      description: 'TikTok, YouTube Shorts, Reels & X queue updated.',
      variant: 'success',
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <AppHeroHeader
        appId="viralmatrix"
        title="ViralMatrix AI"
        subtitle="Long-Form Video Repurposer, 9:16 Active-Speaker Kinetic Reframer & Omnichannel Auto-Publisher"
        usedQuota={monetization.usedQuota}
        freeLimit={monetization.spec.freeLimit}
        quotaUnit={monetization.spec.quotaUnit}
        isCopilotPro={monetization.isCopilotPro}
        onOpenUpgrade={() => monetization.setUpgradeOpen(true)}
      />

      {/* Creator KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">Hooks Ready</p>
              <p className="text-2xl font-extrabold text-primary mt-0.5">{repurposedData ? repurposedData.viralHooks.length : 0}</p>
              <p className="text-[11px] text-text-muted">High-CTR openers</p>
            </div>
            <Flame className="size-7 text-primary/70" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">Clip Candidates</p>
              <p className="text-2xl font-extrabold text-accent mt-0.5">{repurposedData ? repurposedData.suggestedClips.length : 0}</p>
              <p className="text-[11px] text-text-muted">60s vertical segments</p>
            </div>
            <Clock className="size-7 text-accent/70" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">Watermark Mode</p>
              <p className="text-2xl font-extrabold text-text mt-0.5">{monetization.isCopilotPro ? 'Clean HD' : 'Branded'}</p>
              <p className="text-[11px] text-text-muted">{monetization.isCopilotPro ? 'Copilot Pro' : 'Free Tier'}</p>
            </div>
            <Scissors className="size-7 text-primary/70" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">Published Channels</p>
              <p className="text-2xl font-extrabold text-success mt-0.5">
                {scheduledPosts.filter((p) => p.status === 'PUBLISHED').length}/{scheduledPosts.length}
              </p>
              <p className="text-[11px] text-text-muted">Omnichannel queue</p>
            </div>
            <Share2 className="size-7 text-success/70" />
          </CardContent>
        </Card>
      </div>

      <Tabs
        tabs={[
          {
            id: 'repurpose',
            label: 'Long-Form Repurposer',
            badge: 'FR-4.1',
            icon: <Video className="size-3.5" />,
            content: (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <Card className="lg:col-span-5">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Video to Social Engine</CardTitle>
                        <CardDescription>Guarded by @UseQuota(&apos;VIDEO_REPURPOSE&apos;, 1)</CardDescription>
                      </div>
                      <Badge variant="success">3 Free / Mo</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    <div>
                      <label className="text-xs text-text-muted block mb-1">YouTube / Video URL</label>
                      <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." />
                    </div>
                    <div>
                      <label className="text-xs text-text-muted block mb-1">Video Topic / Title</label>
                      <Input value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} placeholder="Episode title..." />
                    </div>
                    <Button onClick={handleRepurpose} disabled={loadingRepurpose} className="gap-2">
                      <Sparkles className="size-4" />
                      {loadingRepurpose ? 'Processing Transcript with Gemini...' : 'Synthesize Social Assets'}
                    </Button>
                  </CardContent>
                </Card>

                <div className="lg:col-span-7 flex flex-col gap-4">
                  {!repurposedData ? (
                    <Card>
                      <CardContent className="py-12 text-center text-xs text-text-muted">
                        Click &quot;Synthesize Social Assets&quot; to generate 5 viral hooks, a 6-part X thread, LinkedIn authority post, and 60s clip timestamps.
                      </CardContent>
                    </Card>
                  ) : (
                    <>
                      <Card className="border-primary/40">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base text-primary">5 Viral High-CTR Hooks</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-xs">
                          {repurposedData.viralHooks.map((h, i) => (
                            <div key={i} className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-bg border border-border">
                              <div className="flex gap-2">
                                <span className="text-accent font-bold">#{i + 1}</span>
                                <span>{h}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => copyText(h, `Hook #${i + 1}`)}
                                className="text-text-muted hover:text-text p-1 cursor-pointer shrink-0"
                                title="Copy hook"
                              >
                                <Copy className="size-3.5" />
                              </button>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="border-accent/40">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base text-accent">6-Part X Thread</CardTitle>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 text-xs gap-1"
                                onClick={() => copyText(repurposedData.xThread.join('\n\n'), 'X Thread')}
                              >
                                <Copy className="size-3" /> Copy All
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="text-xs space-y-1.5">
                            {repurposedData.xThread.map((tweet, i) => (
                              <p key={i} className="p-2 rounded-lg bg-bg border border-border text-text">
                                {tweet}
                              </p>
                            ))}
                          </CardContent>
                        </Card>

                        <div className="flex flex-col gap-4">
                          <Card>
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-base">LinkedIn Authority Post</CardTitle>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 text-xs gap-1"
                                  onClick={() => copyText(repurposedData.linkedInPost, 'LinkedIn Post')}
                                >
                                  <Copy className="size-3" /> Copy
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-xs text-text-muted whitespace-pre-line bg-bg p-3 rounded-lg border border-border">
                                {repurposedData.linkedInPost}
                              </p>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base">Suggested 60s Clips</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-xs">
                              {repurposedData.suggestedClips.map((clip, i) => (
                                <div key={i} className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-bg border border-border">
                                  <div>
                                    <p className="font-semibold text-text">{clip.hook}</p>
                                    <span className="text-[10px] text-text-muted">
                                      {clip.start} → {clip.end}
                                    </span>
                                  </div>
                                  <Badge variant="success">{clip.score} Score</Badge>
                                </div>
                              ))}
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ),
          },
          {
            id: 'reframer',
            label: '9:16 Active-Speaker Reframer',
            badge: 'FR-4.2 / 4.3',
            icon: <Scissors className="size-3.5" />,
            content: (
              <div className="flex flex-col gap-4">
                <CopilotGateBanner
                  isCopilotPro={monetization.isCopilotPro}
                  price="$29/mo"
                  featureName="Watermark-Free 9:16 Active-Speaker Reframing"
                  onUpgrade={() => monetization.setUpgradeOpen(true)}
                />
                <Card className="border-primary/40">
                  <CardHeader>
                    <div className="flex flex-wrap justify-between items-center gap-2">
                      <div>
                        <CardTitle>9:16 Active-Speaker Kinetic Reframer</CardTitle>
                        <CardDescription>Face-tracking crops 16:9 video to 9:16 vertical shorts with word-level animated captions</CardDescription>
                      </div>
                      <Badge variant={monetization.isCopilotPro ? 'success' : 'secondary'}>
                        {monetization.isCopilotPro ? 'Watermark-Free HD' : 'Free Tier (Watermarked)'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col lg:flex-row gap-8 items-center justify-center py-4">
                    <div className="aspect-[9/16] w-56 rounded-2xl border-4 border-primary bg-neutral-950 p-4 flex flex-col justify-between text-white relative shadow-2xl">
                      <div className="flex justify-between items-center text-[10px]">
                        <Badge variant="success">9:16 60FPS</Badge>
                        <span className="text-neutral-400">00:45</span>
                      </div>

                      {!monetization.isCopilotPro && (
                        <div className="text-center text-[9px] uppercase tracking-widest text-white/40 font-mono">
                          ViralMatrix Free Watermark
                        </div>
                      )}

                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto rounded-full border-2 border-dashed border-accent flex items-center justify-center text-xs font-mono text-accent">
                          FACE LOCK
                        </div>
                        {reframing && (
                          <div className="mt-4">
                            <Progress value={reframeProgress} className="w-full" />
                            <p className="text-[10px] text-accent mt-2 animate-pulse">
                              Tracking speaker centroid ({reframeProgress}%)...
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="text-center p-2 rounded-lg bg-black/75 border border-white/20">
                        <p
                          className={`text-xs font-black uppercase ${
                            captionStyle === 'yellow'
                              ? 'text-yellow-300'
                              : captionStyle === 'neon'
                                ? 'text-pink-400'
                                : 'text-white'
                          }`}
                        >
                          {captionPhrases[activeCaptionIdx]}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 max-w-md w-full">
                      <div>
                        <label className="text-xs text-text-muted block mb-2">Kinetic Caption Style</label>
                        <div className="flex gap-2">
                          {[
                            { id: 'yellow', label: 'Bold Yellow' },
                            { id: 'white', label: 'Clean White' },
                            { id: 'neon', label: 'Neon Pop' },
                          ].map((st) => (
                            <button
                              key={st.id}
                              type="button"
                              onClick={() => setCaptionStyle(st.id as any)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${
                                captionStyle === st.id
                                  ? 'bg-primary text-white border-primary'
                                  : 'bg-bg text-text-muted border-border'
                              }`}
                            >
                              {st.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-text-muted">
                        FFmpeg BullMQ pipeline isolates the active speaker, crops 16:9 to 9:16, and burns animated word-by-word captions.
                      </p>

                      <div className="flex flex-wrap gap-2">
                        <Button onClick={handleReframe} disabled={reframing} className="gap-1.5">
                          <Scissors className="size-4" />
                          {reframing ? 'Rendering via FFmpeg...' : 'Render 9:16 Vertical Short'}
                        </Button>
                        <Button variant="outline" onClick={handleDownloadSrt} className="gap-1.5">
                          <Download className="size-4" /> Export SRT Captions
                        </Button>
                      </div>

                      {reframedReady && (
                        <div className="p-3 rounded-xl border border-success/50 bg-success/10 text-xs text-success flex items-center justify-between gap-2">
                          <span className="flex items-center gap-1.5 font-semibold">
                            <CheckCircle2 className="size-4" /> 9:16 Short Ready
                          </span>
                          <Button size="sm" onClick={handleDownloadSrt}>
                            Download Package
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ),
          },
          {
            id: 'publisher',
            label: 'Omnichannel Publisher',
            badge: 'FR-4.4',
            icon: <Share2 className="size-3.5" />,
            content: (
              <div className="flex flex-col gap-4">
                <CopilotGateBanner
                  isCopilotPro={monetization.isCopilotPro}
                  price="$29/mo"
                  featureName="Omnichannel Auto-Publisher"
                  onUpgrade={() => monetization.setUpgradeOpen(true)}
                />
                <Card className="border-primary/40">
                  <CardHeader>
                    <div className="flex flex-wrap justify-between items-center gap-3">
                      <div>
                        <CardTitle>Omnichannel Algorithmic Publisher</CardTitle>
                        <CardDescription>Schedules &amp; distributes shorts across TikTok, Shorts, Reels &amp; X at peak hours</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => publishAll('SCHEDULED')}>
                          Schedule Peak Slots
                        </Button>
                        <Button size="sm" onClick={() => publishAll('PUBLISHED')} className="gap-1.5">
                          <Send className="size-3.5" /> Publish All Now
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {scheduledPosts.map((post) => (
                      <div
                        key={post.id}
                        className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-border bg-bg/60"
                      >
                        <div>
                          <p className="font-bold text-sm text-text">{post.platform}</p>
                          <p className="text-xs text-text-muted">
                            {post.account} • {post.time}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              post.status === 'PUBLISHED'
                                ? 'success'
                                : post.status === 'SCHEDULED'
                                  ? 'default'
                                  : 'outline'
                            }
                          >
                            {post.status}
                          </Badge>
                          {post.status !== 'PUBLISHED' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 text-xs"
                              onClick={() => {
                                setScheduledPosts((prev) =>
                                  prev.map((p) => (p.id === post.id ? { ...p, status: 'PUBLISHED' } : p)),
                                );
                                toast({ title: `Published to ${post.platform}`, variant: 'success' });
                              }}
                            >
                              Post Now
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            ),
          },
        ]}
      />

      <CopilotUpgradeDialog
        appId="viralmatrix"
        isOpen={monetization.upgradeOpen}
        onClose={() => monetization.setUpgradeOpen(false)}
        isCopilotPro={monetization.isCopilotPro}
        onToggleCopilot={monetization.toggleCopilotPro}
        onResetQuota={monetization.resetDemoQuota}
      />
    </div>
  );
}

export default function ViralMatrixPage() {
  return (
    <LayoutProvider>
      <AppShell appId="viralmatrix">
        <ViralMatrixWorkspace />
      </AppShell>
    </LayoutProvider>
  );
}
