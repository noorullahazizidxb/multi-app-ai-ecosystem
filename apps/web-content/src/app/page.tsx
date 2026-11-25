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

export default function ViralMatrixPage() {
  const [videoUrl, setVideoUrl] = React.useState('https://youtube.com/watch?v=dQw4w9WgXcQ');
  const [repurposedData, setRepurposedData] = React.useState<any>(null);
  const [loadingRepurpose, setLoadingRepurpose] = React.useState(false);

  // Active-Speaker 9:16 State (FR-4.3)
  const [reframing, setReframing] = React.useState(false);
  const [reframeProgress, setReframeProgress] = React.useState(0);
  const [reframedShort, setReframedShort] = React.useState<string | null>(null);

  // Omnichannel Publisher State (FR-4.4)
  const [scheduledPosts, setScheduledPosts] = React.useState([
    { platform: 'TikTok', account: '@viralmatrix', time: '18:00 UTC (Peak)', status: 'QUEUED' },
    { platform: 'YouTube Shorts', account: 'ViralMatrix AI', time: '18:15 UTC (Peak)', status: 'QUEUED' },
    { platform: 'Instagram Reels', account: '@viralmatrix.ai', time: '19:00 UTC', status: 'QUEUED' },
    { platform: 'X / Twitter', account: '@viralmatrix_ai', time: '18:00 UTC', status: 'QUEUED' },
  ]);

  const handleRepurpose = () => {
    setLoadingRepurpose(true);
    setTimeout(() => {
      setRepurposedData({
        viralHooks: [
          'Most software developers scaffold SaaS completely backwards. Here is the 10x blueprint:',
          'Stop bundling 4 apps into one slow monolithic server. Here is why:',
          'How we decoupled 4 enterprise AI products with 80% shared DRY libraries:',
          'The real secret to high-converting $29/mo AI Copilot features:',
          'Why Turborepo + pnpm is dominating modern full-stack workflows in 2026:',
        ],
        xThread: [
          '1/6 🧵 Scaling multiple AI SaaS products without operational chaos? Here is the blueprint 👇',
          '2/6 Instead of a single backend where video rendering halts billing, each domain runs an isolated NestJS container.',
          '3/6 Shared Prisma v8 Dynamic Adapter connects seamlessly to Neon, Turso, or local MySQL on demand.',
          '4/6 10 pre-engineered OKLCH theme presets load with zero CSS runtime lag across Web & Flutter.',
          '5/6 Free tier is capped using Redis Lua atomic scripts; Copilot features validate Stripe entitlements directly in memory.',
          '6/6 Inspect the repository and launch your multi-app ecosystem today! 🚀',
        ],
        linkedInPost:
        'In modern SaaS engineering, monolithic coupling kills developer velocity. By decoupling 4 application verticals into isolated NestJS containers while sharing 80% of foundational TypeScript packages via Turborepo, we achieved extreme developer velocity with zero cross-tenant interference.\n\n#SoftwareEngineering #TypeScript #NestJS #NextJS15',
      });
    setLoadingRepurpose(false);
  }, 700);
};

const handleReframe = () => {
  setReframing(true);
  setReframeProgress(20);
  setTimeout(() => setReframeProgress(55), 400);
  setTimeout(() => setReframeProgress(85), 700);
  setTimeout(() => {
    setReframeProgress(100);
    setReframedShort('https://storage.viralmatrix.example.com/shorts/active_speaker_916_export.mp4');
    setReframing(false);
}, 1100);
  };

  return (
    <LayoutProvider>
      <AppShell appId="viralmatrix">
        <div className="flex flex-col gap-6">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border border-border bg-surface/60 backdrop-blur-sm">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text">ViralMatrix AI</h1>
                <Badge variant="default">Model 1: 3 Free Conversions/Mo</Badge>
              </div>
              <p className="text-xs sm:text-sm text-text-muted mt-1">
                Omnichannel Content Repurposer, 9:16 Active-Speaker Reframer & Publisher ($29/mo)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="default" size="sm" className="shadow-sm">Upgrade to Copilot Pro</Button>
            </div>
          </div>

          {/* Appearance & Workspace Manager */}
          <AppearanceManager currentTheme="synthwave-sunset" />

            {/* Tabs */}
            <Tabs
              tabs={[
                {
                  id: 'repurpose',
                  label: 'FR-4.1: Long-Form Repurposer',
                  content: (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
                      <Card>
                        <CardHeader>
                          <div className="flex justify-between items-center">
                            <CardTitle>Video to Social Engine</CardTitle>
                            <Badge variant="success">3 Free Videos/Mo</Badge>
                          </div>
                          <CardDescription>Guarded by @UseQuota('VIDEO_REPURPOSE', 1)</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                          <Input
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            placeholder="https://youtube.com/watch?v=..."
                          />
                          <Button onClick={handleRepurpose} disabled={loadingRepurpose}>
                            {loadingRepurpose ? 'Processing Video Audio with Gemini...' : 'Synthesize Social Assets'}
                          </Button>
                        </CardContent>
                      </Card>

                {repurposedData && (
                  <div className="flex flex-col gap-4">
                    <Card className="border-primary/40">
                      <CardHeader>
                        <CardTitle className="text-base text-primary">5 Viral High-CTR Hooks</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-xs space-y-2">
                          {repurposedData.viralHooks.map((h: string, i: number) => (
                            <li key={i} className="flex gap-2 p-2 rounded bg-surface border border-border">
                              <span className="text-accent font-bold">#{i + 1}</span>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="border-accent/40">
                      <CardHeader>
                        <CardTitle className="text-base text-accent">6-Part X (Twitter) Thread</CardTitle>
                      </CardHeader>
                      <CardContent className="text-xs space-y-1.5 text-text-muted">
                        {repurposedData.xThread.map((tweet: string, i: number) => (
                          <p key={i} className="p-2 rounded bg-surface border border-border text-text">
                            {tweet}
                          </p>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            ),
          },
          {
            id: 'reframer',
            label: 'FR-4.3: 9:16 Active-Speaker Reframing (Copilot)',
            content: (
              <Card className="mt-2 border-primary/40 shadow-xl">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>9:16 Active-Speaker Kinetic Reframer</CardTitle>
                      <CardDescription>Autonomous face-tracking crops 16:9 to 9:16 shorts with animated kinetic captions</CardDescription>
                    </div>
                    <Badge variant="default">$29/mo Copilot (Watermark-Free)</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col lg:flex-row gap-8 items-center justify-center py-4">
                  <div className="aspect-[9/16] w-56 rounded-2xl border-4 border-primary bg-black/90 p-4 flex flex-col justify-between text-white relative shadow-2xl">
                    <div className="flex justify-between items-center text-[10px]">
                      <Badge variant="success">9:16 HD 60FPS</Badge>
                      <span className="text-gray-400">00:45</span>
                    </div>

                    <div className="text-center">
                      <span className="text-5xl">🗣️</span>
                      {reframing && (
                        <div className="mt-4">
                          <Progress value={reframeProgress} className="w-full" />
                          <p className="text-[10px] text-accent mt-2 animate-pulse">
                            Tracking speaker centroid & applying kinetic captions...
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Word-level animated captions preview */}
                    <div className="text-center p-2 rounded bg-black/70 backdrop-blur-xs border border-white/20">
                      <p className="text-xs font-black uppercase text-yellow-300">
                        "Stop Building Monoliths!"
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 max-w-md">
                    <p className="text-xs text-text-muted">
                      FFmpeg background queue isolates the primary speaker, tracks facial coordinates, and renders TikTok/Reels compatible vertical video with dynamic word-by-word highlighted captions.
                    </p>
                    <Button onClick={handleReframe} disabled={reframing}>
                      {reframing ? 'Rendering via FFmpeg Worker...' : 'Render 9:16 Reframed Short'}
                    </Button>
                    {reframedShort && (
                      <div className="p-3 rounded-lg border border-success bg-surface text-xs text-success flex items-center justify-between">
                        <span>✅ 9:16 Short Ready for Export</span>
                        <Button size="sm" variant="default">Download MP4</Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
        ),
          },
        {
          id: 'publisher',
        label: 'FR-4.4: Omnichannel Auto-Publisher',
        content: (
        <Card className="mt-2 border-primary/40">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Omnichannel Algorithmic Publisher</CardTitle>
                <CardDescription>Schedules shorts across all platforms at peak algorithmic engagement hours</CardDescription>
              </div>
              <Badge variant="default">$29/mo Copilot</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scheduledPosts.map((post) => (
                <div
                  key={post.platform}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-surface"
                >
                  <div>
                    <p className="font-bold text-sm">{post.platform}</p>
                    <p className="text-xs text-text-muted">{post.account} • Scheduled: {post.time}</p>
                  </div>
                  <Badge variant="outline">{post.status}</Badge>
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
