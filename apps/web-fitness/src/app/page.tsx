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
  ThemeSwitcher,
  Tabs,
  Progress,
} from '@repo/ui-web';
import Link from 'next/link';

export default function KineticFitnessPage() {
  // Rest Timer State (FR-2.1)
  const [restSeconds, setRestSeconds] = React.useState(90);
  const [timerRunning, setTimerRunning] = React.useState(false);
  const [timerInitial, setTimerInitial] = React.useState(90);

  React.useEffect(() => {
    let interval: any;
    if (timerRunning && restSeconds > 0) {
      interval = setInterval(() => setRestSeconds((prev) => prev - 1), 1000);
    } else if (restSeconds === 0 && timerRunning) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, restSeconds]);

  // 1RM Progression Calculator (FR-2.1)
  const [calcWeight, setCalcWeight] = React.useState(100);
  const [calcReps, setCalcReps] = React.useState(5);
  const oneRepMax = Math.round(calcWeight * (1 + calcReps / 30));

  // Multimodal Meal Scan State (FR-2.3)
  const [mealScanned, setMealScanned] = React.useState<any>(null);
  const [loadingMeal, setLoadingMeal] = React.useState(false);

  // Workout Split State (FR-2.2)
  const [splitGenerated, setSplitGenerated] = React.useState<any>(null);
  const [loadingSplit, setLoadingSplit] = React.useState(false);

  // 30FPS Pose Form Coach State (FR-2.4)
  const [isCameraActive, setIsCameraActive] = React.useState(false);
  const [liveSquatAngle, setLiveSquatAngle] = React.useState(98);
  const [repsDone, setRepsDone] = React.useState(8);
  const [formCue, setFormCue] = React.useState('Depth Parallel • Maintain Chest Up');

  // Biometric Auto-Regulation State (FR-2.5)
  const [hrvValue, setHrvValue] = React.useState(74);
  const [sleepHours, setSleepHours] = React.useState(8.0);
  const [readinessResult, setReadinessResult] = React.useState<any>(null);

  const handleMealScan = () => {
    setLoadingMeal(true);
    setTimeout(() => {
      setMealScanned({
        calories: 685,
        proteinGrams: 52,
        carbsGrams: 64,
        fatGrams: 21,
        identifiedFoods: ['Wild Caught Salmon', 'Sweet Potato Mash', 'Broccoli Florets'],
        confidence: 0.97,
      });
      setLoadingMeal(false);
    }, 600);
  };

  const handleGenerateSplit = () => {
    setLoadingSplit(true);
    setTimeout(() => {
      setSplitGenerated({
        splitName: '4-Day Athletic Periodization Microcycle',
        routine: [
          { day: 'Monday', focus: 'Upper Heavy Power', exercises: 'Barbell Bench 4x5, Pendlay Row 4x6, Overhead Press 3x8' },
          { day: 'Tuesday', focus: 'Lower Heavy Strength', exercises: 'Back Squat 4x5, Romanian Deadlift 3x8, Standing Calf Raises 4x12' },
          { day: 'Thursday', focus: 'Upper Volume Hypertrophy', exercises: 'Incline DB Press 3x10, Lat Pulldown 3x12, Lateral Raises 4x15' },
          { day: 'Friday', focus: 'Posterior Chain & Core', exercises: 'Conventional Deadlift 3x5, Bulgarian Split Squat 3x10/leg' },
        ],
      });
      setLoadingSplit(false);
    }, 600);
  };

  const handleBiometricSync = () => {
    setReadinessResult({
      readinessScore: 92,
      volumeMultiplier: 1.15,
      targetIntensity: 'HIGH',
      guidanceNotes: 'Optimal recovery status: Sleep debt 0%, HRV +12% above 30-day baseline. Target training load increased +15%.',
      dailyMacroAdjustment: { calories: 2850, proteinGrams: 195 },
    });
  };

  return (
    <div className="min-h-screen bg-[--bg] text-[--text] p-6 lg:p-12 max-w-7xl mx-auto flex flex-col gap-8">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[--border] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight">KineticAI</h1>
            <Badge variant="default">Model 1: 3 Free AI Scans/Wk</Badge>
          </div>
          <p className="text-sm text-[--text-muted] mt-1">
            Intelligent Fitness, 30FPS Biomechanics Pose Coach & Autoregulation ($14/mo)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin">
            <Button variant="outline" size="sm">Admin Telemetry</Button>
          </Link>
          <Button variant="default" size="sm">Upgrade to Copilot Pro</Button>
        </div>
      </header>

      {/* Theme Presets Switcher */}
      <ThemeSwitcher currentTheme="cyber-neon" />

                {/* Modern Tabs Navigation */}
                <Tabs
                  tabs={[
                    {
                      id: 'workout',
                      label: 'FR-2.1: Workout Log, 1RM & Timer',
                      content: (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
                {/* Rest Timer */}
                <Card>
                  <CardHeader>
                    <CardTitle>Smart Rest Interval Timer</CardTitle>
                    <CardDescription>Keeps training pacing optimal between intense compound sets</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center py-6 gap-4">
                    <div className="text-6xl font-black font-mono text-[--primary]">
                      {Math.floor(restSeconds / 60)}:{String(restSeconds % 60).padStart(2, '0')}
                    </div>
                    <Progress value={((timerInitial - restSeconds) / timerInitial) * 100} className="w-64" />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={timerRunning ? 'destructive' : 'default'}
                        onClick={() => setTimerRunning(!timerRunning)}
                      >
                        {timerRunning ? 'Pause Timer' : 'Start Interval'}
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setTimerRunning(false);
                          setRestSeconds(90);
                        }}
                      >
                        Reset (90s)
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* 1RM Calculator */}
                <Card>
                  <CardHeader>
                    <CardTitle>1-Rep Max Progression Calculator</CardTitle>
                    <CardDescription>Scientific Epley calculation with training load percentages</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-[--text-muted]">Weight (kg):</label>
                        <Input
                          type="number"
                          value={calcWeight}
                          onChange={(e) => setCalcWeight(Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[--text-muted]">Reps Completed:</label>
                        <Input
                          type="number"
                          value={calcReps}
                          onChange={(e) => setCalcReps(Number(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-[--border] bg-[--surface] flex justify-between items-center mt-2">
                      <div>
                        <span className="text-xs text-[--text-muted] block">Estimated 1RM:</span>
                        <span className="text-3xl font-extrabold text-[--primary]">{oneRepMax} kg</span>
                      </div>
                      <div className="text-right text-xs space-y-1">
                        <div>90% (Strength): <strong>{Math.round(oneRepMax * 0.9)} kg</strong></div>
                        <div>80% (Hypertrophy): <strong>{Math.round(oneRepMax * 0.8)} kg</strong></div>
                        <div>70% (Endurance): <strong>{Math.round(oneRepMax * 0.7)} kg</strong></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
                ),
          },
                {
                  id: 'nutrition',
                label: 'FR-2.3: Multimodal Meal Scan',
                content: (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Gemini Vision Meal Photo Scanner</CardTitle>
                        <Badge variant="success">3 Scans/Wk Free</Badge>
                      </div>
                      <CardDescription>Guarded by @UseQuota('MEAL_SCAN', 1)</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                      <div className="h-40 border-2 border-dashed border-[--border] rounded-xl flex flex-col items-center justify-center text-xs text-[--text-muted]">
                        📸 Drag & drop food snapshot or tap camera
                      </div>
                      <Button onClick={handleMealScan} disabled={loadingMeal}>
                        {loadingMeal ? 'Processing via Gemini Vision...' : 'Scan Meal & Extract Macros'}
                      </Button>
                    </CardContent>
                  </Card>

                  {mealScanned && (
                    <Card className="border-[--primary]/40">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle>Nutritional Breakdown</CardTitle>
                          <Badge variant="default">{Math.round(mealScanned.confidence * 100)}% Match</Badge>
                        </div>
                        <CardDescription>Detected: {mealScanned.identifiedFoods.join(', ')}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-4">
                        <div className="text-4xl font-black text-[--primary] text-center">
                          {mealScanned.calories} <span className="text-sm font-normal text-[--text-muted]">kcal</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="p-3 rounded-lg bg-[--surface] border border-[--border]">
                            <span className="block font-extrabold text-base text-[--accent]">{mealScanned.proteinGrams}g</span>
                            <span className="text-[--text-muted]">Protein</span>
                          </div>
                          <div className="p-3 rounded-lg bg-[--surface] border border-[--border]">
                            <span className="block font-extrabold text-base text-[--warning]">{mealScanned.carbsGrams}g</span>
                            <span className="text-[--text-muted]">Carbs</span>
                          </div>
                          <div className="p-3 rounded-lg bg-[--surface] border border-[--border]">
                            <span className="block font-extrabold text-base text-[--error]">{mealScanned.fatGrams}g</span>
                            <span className="text-[--text-muted]">Fat</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                    ),
          },
                    {
                      id: 'camera',
                    label: 'FR-2.4: 30FPS Form Coach (Copilot)',
                    content: (
                    <Card className="mt-2 border-[--primary]/40 shadow-xl">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle>30FPS Skeletal Pose & Biomechanics Tracker</CardTitle>
                            <CardDescription>Real-time joint angle tracking (Squat depth) with audio coaching cues</CardDescription>
                          </div>
                          <Badge variant="default">$14/mo Copilot</Badge>
                        </div>
                          </CardHeader>
                          <CardContent className="flex flex-col lg:flex-row gap-6 items-center">
                            <div className="w-full lg:w-1/2 h-64 rounded-xl border-2 border-[--primary] bg-black/80 flex flex-col items-center justify-center relative overflow-hidden">
                              {/* Skeletal simulation canvas */}
                              <div className="absolute inset-0 flex items-center justify-center opacity-60">
                                <div className="w-32 h-48 border-2 border-dashed border-[--accent] rounded-full" />
                              </div>
                                <div className="z-10 text-center text-white">
                                  <span className="text-4xl">🧘‍♂️</span>
                                  <p className="font-mono text-xl font-bold mt-2 text-[--primary]">Angle: {liveSquatAngle}°</p>
                                  <p className="text-xs text-gray-300">Target: &lt;= 90° for full depth</p>
                                </div>
                              </div>

                      <div className="w-full lg:w-1/2 flex flex-col gap-4">
                        <div className="p-4 rounded-xl border border-[--border] bg-[--surface]">
                          <span className="text-xs text-[--text-muted] block">Reps Counted:</span>
                          <span className="text-3xl font-black text-[--accent]">{repsDone} Reps</span>
                        </div>

                              <div className="p-4 rounded-xl border border-[--border] bg-[--surface]">
                                <span className="text-xs text-[--text-muted] block">Real-time Audio Coaching Cue:</span>
                                <span className="text-sm font-semibold text-[--success] block mt-1">"{formCue}"</span>
                              </div>

                                    <Button
                                      onClick={() => {
                                        setIsCameraActive(!isCameraActive);
                                        setLiveSquatAngle(88);
                                        setRepsDone((prev) => prev + 1);
                                        setFormCue('Great depth! Drive through midfoot.');
                                      }}
                                    >
                                      {isCameraActive ? 'Calibrate Tracker' : 'Simulate 30FPS Pose Rep'}
                                    </Button>
                                  </div>
                        </CardContent>
                    </Card>
                    ),
          },
                    {
                      id: 'biometrics',
                    label: 'FR-2.5: Biometric Auto-Regulation',
                    content: (
                    <Card className="mt-2 border-[--accent]/40">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle>Autonomous Microcycle Auto-Regulation</CardTitle>
                            <CardDescription>Syncs HRV & Sleep every morning at 06:00 to prescribe training volume</CardDescription>
                          </div>
                          <Badge variant="default">$14/mo Copilot</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs text-[--text-muted]">HRV (ms):</label>
                            <Input
                              type="number"
                              value={hrvValue}
                              onChange={(e) => setHrvValue(Number(e.target.value))}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-[--text-muted]">Sleep (Hours):</label>
                            <Input
                              type="number"
                              step="0.5"
                              value={sleepHours}
                              onChange={(e) => setSleepHours(Number(e.target.value))}
                            />
                          </div>
                        </div>
                        <Button variant="secondary" onClick={handleBiometricSync}>
                          Sync Biometrics & Calculate Daily Microcycle
                        </Button>

                  {readinessResult && (
                  <div className="p-4 rounded-xl border border-[--border] bg-[--surface] flex flex-col gap-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Readiness Index: {readinessResult.readinessScore}/100</span>
                      <Badge variant="success">Intensity: {readinessResult.targetIntensity}</Badge>
                    </div>
                    <p className="text-xs text-[--text-muted]">{readinessResult.guidanceNotes}</p>
                    <div className="pt-2 border-t border-[--border] text-xs flex justify-between">
                      <span>Daily Target Calories: <strong>{readinessResult.dailyMacroAdjustment.calories} kcal</strong></span>
                      <span>Protein: <strong>{readinessResult.dailyMacroAdjustment.proteinGrams}g</strong></span>
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>
          ),
          },
        ]}
      />
        </div>
        );
}
