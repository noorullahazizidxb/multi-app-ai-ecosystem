'use client';

import * as React from 'react';
import {
  Dumbbell,
  Timer,
  Utensils,
  Camera,
  HeartPulse,
  Plus,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  Flame,
  TrendingUp,
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

interface LoggedSet {
  id: string;
  exercise: string;
  sets: number;
  reps: number;
  weightKg: number;
  rpe: number;
}

interface MealEntry {
  id: string;
  name: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  confidence: number;
}

const SAMPLE_MEALS = [
  {
    label: 'Wild Salmon & Sweet Potato',
    calories: 685,
    proteinGrams: 52,
    carbsGrams: 64,
    fatGrams: 21,
    foods: ['Wild Caught Salmon', 'Sweet Potato Mash', 'Steamed Broccoli'],
  },
  {
    label: 'Chicken Quinoa Power Bowl',
    calories: 610,
    proteinGrams: 56,
    carbsGrams: 58,
    fatGrams: 16,
    foods: ['Grilled Chicken Breast', 'Tri-Color Quinoa', 'Avocado & Spinach'],
  },
  {
    label: 'Post-Workout Whey & Oats',
    calories: 440,
    proteinGrams: 42,
    carbsGrams: 52,
    fatGrams: 7,
    foods: ['Whey Isolate', 'Rolled Oats', 'Blueberries'],
  },
];

function KineticWorkspace() {
  const { toast } = useToast();
  const monetization = useAppMonetization('kinetic');

  // FR-2.1 Rest Timer
  const [timerInitial, setTimerInitial] = React.useState(90);
  const [restSeconds, setRestSeconds] = React.useState(90);
  const [timerRunning, setTimerRunning] = React.useState(false);

  React.useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => {
      setRestSeconds((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          toast({ title: 'Rest Interval Complete', description: 'Time for your next working set!', variant: 'success' });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, toast]);

  // FR-2.1 1RM & Workout Logger
  const [calcWeight, setCalcWeight] = React.useState(120);
  const [calcReps, setCalcReps] = React.useState(5);
  const oneRepMax = Math.round(calcWeight * (1 + calcReps / 30));
  const [workoutLog, setWorkoutLog] = React.useState<LoggedSet[]>([
    { id: 'w1', exercise: 'Back Squat', sets: 4, reps: 5, weightKg: 140, rpe: 8.5 },
    { id: 'w2', exercise: 'Barbell Bench Press', sets: 4, reps: 6, weightKg: 100, rpe: 8 },
  ]);
  const [newExercise, setNewExercise] = React.useState('Romanian Deadlift');
  const [newSets, setNewSets] = React.useState(3);
  const [newReps, setNewReps] = React.useState(8);
  const [newWeight, setNewWeight] = React.useState(130);

  // FR-2.2 Workout Split Generator
  const [daysPerWeek, setDaysPerWeek] = React.useState(4);
  const [expLevel, setExpLevel] = React.useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [equipment, setEquipment] = React.useState<string[]>(['Barbell', 'Dumbbells', 'Cables']);
  const [loadingSplit, setLoadingSplit] = React.useState(false);
  const [splitGenerated, setSplitGenerated] = React.useState<{
    splitName: string;
    routine: Array<{ day: string; focus: string; exercises: string }>;
  } | null>(null);

  // FR-2.3 Meal Scanner
  const [selectedSampleMeal, setSelectedSampleMeal] = React.useState(0);
  const [uploadedMealName, setUploadedMealName] = React.useState<string | null>(null);
  const [loadingMeal, setLoadingMeal] = React.useState(false);
  const [mealScanned, setMealScanned] = React.useState<(MealEntry & { identifiedFoods: string[] }) | null>(null);
  const [dailyMeals, setDailyMeals] = React.useState<MealEntry[]>([
    { id: 'm1', name: 'Greek Yogurt & Chia Parfait', calories: 380, proteinGrams: 32, carbsGrams: 40, fatGrams: 9, confidence: 0.96 },
  ]);

  // FR-2.4 30FPS Pose Form Coach
  const [poseExercise, setPoseExercise] = React.useState<'Back Squat' | 'Deadlift' | 'Overhead Press'>('Back Squat');
  const [isCameraActive, setIsCameraActive] = React.useState(false);
  const [audioCues, setAudioCues] = React.useState(true);
  const [liveAngle, setLiveAngle] = React.useState(92);
  const [repsDone, setRepsDone] = React.useState(8);
  const [formCue, setFormCue] = React.useState('Depth Parallel • Chest Proud');

  // FR-2.5 Biometrics
  const [hrvValue, setHrvValue] = React.useState(76);
  const [sleepHours, setSleepHours] = React.useState(7.8);
  const [restingHr, setRestingHr] = React.useState(52);
  const [readinessResult, setReadinessResult] = React.useState<{
    readinessScore: number;
    volumeMultiplier: number;
    targetIntensity: string;
    guidanceNotes: string;
    calories: number;
    proteinGrams: number;
  } | null>(null);

  const totalVolumeKg = workoutLog.reduce((sum, s) => sum + s.sets * s.reps * s.weightKg, 0);
  const totalCalories = dailyMeals.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = dailyMeals.reduce((sum, m) => sum + m.proteinGrams, 0);

  const progressionWeeks = [
    Math.round(oneRepMax * 0.88),
    Math.round(oneRepMax * 0.91),
    Math.round(oneRepMax * 0.94),
    Math.round(oneRepMax * 0.97),
    oneRepMax,
  ];

  const handleLogSet = () => {
    if (!newExercise.trim()) return;
    setWorkoutLog((prev) => [
      {
        id: `w_${Date.now()}`,
        exercise: newExercise.trim(),
        sets: Math.max(1, newSets),
        reps: Math.max(1, newReps),
        weightKg: Math.max(0, newWeight),
        rpe: 8.5,
      },
      ...prev,
    ]);
    toast({ title: 'Set Logged', description: `${newExercise}: ${newSets}×${newReps} @ ${newWeight} kg`, variant: 'success' });
  };

  const handleGenerateSplit = () => {
    if (!monetization.consumeQuota('AI Workout Split')) return;
    setLoadingSplit(true);
    setTimeout(() => {
      const equipLabel = equipment.length ? equipment.join(', ') : 'Bodyweight';
      const routines = [
        { day: 'Day 1', focus: 'Upper Strength Power', exercises: `Bench Press 4×5, Barbell Row 4×6 (${equipLabel})` },
        { day: 'Day 2', focus: 'Lower Squat & Posterior', exercises: `Back Squat 4×5, RDL 3×8, Split Squats 3×10` },
        { day: 'Day 3', focus: 'Upper Hypertrophy', exercises: `Incline Press 3×10, Pulldown 3×12, Lateral Raise 4×15` },
        { day: 'Day 4', focus: 'Deadlift & Athletic Core', exercises: `Deadlift 3×5, Weighted Carry 4×40m, Hanging Leg Raise 3×12` },
        { day: 'Day 5', focus: 'Arms & Conditioning', exercises: `Incline Curl 3×12, Overhead Tricep Ext 3×12, Zone-2 25m` },
        { day: 'Day 6', focus: 'Mobility & Weak-Point', exercises: `Face Pulls 4×15, Tempo Goblet Squat 3×12, Thoracic Flow` },
      ].slice(0, daysPerWeek);

      setSplitGenerated({
        splitName: `${daysPerWeek}-Day ${expLevel} Periodization (${equipLabel})`,
        routine: routines,
      });
      setLoadingSplit(false);
      toast({ title: 'AI Split Generated', description: `Tailored ${daysPerWeek}-day program ready.`, variant: 'success' });
    }, 500);
  };

  const handleMealScan = () => {
    if (!monetization.consumeQuota('Meal Photo Scan')) return;
    setLoadingMeal(true);
    setTimeout(() => {
      const preset = SAMPLE_MEALS[selectedSampleMeal];
      const scanned = {
        id: `meal_${Date.now()}`,
        name: uploadedMealName || preset.label,
        calories: preset.calories,
        proteinGrams: preset.proteinGrams,
        carbsGrams: preset.carbsGrams,
        fatGrams: preset.fatGrams,
        confidence: 0.97,
        identifiedFoods: preset.foods,
      };
      setMealScanned(scanned);
      setDailyMeals((prev) => [scanned, ...prev]);
      setLoadingMeal(false);
      toast({
        title: `Meal Scanned: ${scanned.calories} kcal`,
        description: `${scanned.proteinGrams}g protein logged to daily nutrition.`,
        variant: 'success',
      });
    }, 550);
  };

  const handleSimulatePoseRep = () => {
    const nextAngle = Math.floor(82 + Math.random() * 14);
    setIsCameraActive(true);
    setLiveAngle(nextAngle);
    setRepsDone((prev) => prev + 1);
    const cue =
      nextAngle <= 90
        ? `Optimal depth (${nextAngle}°)! Drive forcefully through midfoot.`
        : `Depth ${nextAngle}° — drop 2° lower to break parallel.`;
    setFormCue(cue);
    if (audioCues && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(nextAngle <= 90 ? 'Good depth. Drive up.' : 'Go slightly deeper.');
      utter.rate = 1.1;
      window.speechSynthesis.speak(utter);
    }
  };

  const handleBiometricSync = () => {
    const hrvScore = Math.min(45, Math.max(10, (hrvValue / 85) * 40));
    const sleepScore = Math.min(40, Math.max(10, (sleepHours / 8.5) * 38));
    const rhrBonus = restingHr <= 56 ? 18 : restingHr <= 66 ? 12 : 6;
    const score = Math.min(99, Math.max(35, Math.round(hrvScore + sleepScore + rhrBonus)));
    const multiplier = score >= 85 ? 1.12 : score >= 70 ? 1.0 : 0.8;
    const intensity = score >= 85 ? 'HIGH' : score >= 70 ? 'MODERATE' : 'DELOAD';

    setReadinessResult({
      readinessScore: score,
      volumeMultiplier: multiplier,
      targetIntensity: intensity,
      guidanceNotes:
        score >= 85
          ? `Peak CNS recovery (${score}/100). HRV (${hrvValue}ms) and ${sleepHours}h sleep support +12% progressive overload.`
          : score >= 70
            ? `Solid baseline (${score}/100). Maintain prescribed microcycle sets at RPE 8.`
            : `Fatigue detected (${score}/100). Auto-regulating volume down 20% and prioritizing sleep recovery.`,
      calories: score >= 85 ? 2850 : 2550,
      proteinGrams: 190,
    });
    toast({ title: `Readiness Synced: ${score}/100 (${intensity})`, variant: 'success' });
  };

  return (
    <div className="flex flex-col gap-6">
      <AppHeroHeader
        appId="kinetic"
        title="KineticAI"
        subtitle="Workout Progression, AI Split Periodization, Gemini Vision Meal Scanner & 30FPS Pose Form Coach"
        usedQuota={monetization.usedQuota}
        freeLimit={monetization.spec.freeLimit}
        quotaUnit={monetization.spec.quotaUnit}
        isCopilotPro={monetization.isCopilotPro}
        onOpenUpgrade={() => monetization.setUpgradeOpen(true)}
      />

      {/* Athletic KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">Est. 1RM</p>
              <p className="text-2xl font-extrabold text-primary mt-0.5">{oneRepMax} kg</p>
              <p className="text-[11px] text-text-muted">Epley calculation</p>
            </div>
            <TrendingUp className="size-7 text-primary/70" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">Session Volume</p>
              <p className="text-2xl font-extrabold text-text mt-0.5">{totalVolumeKg.toLocaleString()} kg</p>
              <p className="text-[11px] text-text-muted">{workoutLog.length} exercises logged</p>
            </div>
            <Dumbbell className="size-7 text-accent/70" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">Daily Nutrition</p>
              <p className="text-2xl font-extrabold text-success mt-0.5">{totalCalories} kcal</p>
              <p className="text-[11px] text-text-muted">{totalProtein}g protein today</p>
            </div>
            <Flame className="size-7 text-success/70" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">Form Coach Reps</p>
              <p className="text-2xl font-extrabold text-accent mt-0.5">{repsDone} Reps</p>
              <p className="text-[11px] text-text-muted">Last angle: {liveAngle}°</p>
            </div>
            <Camera className="size-7 text-primary/70" />
          </CardContent>
        </Card>
      </div>

      <Tabs
        tabs={[
          {
            id: 'workout',
            label: 'Workout Log, Timer & 1RM',
            badge: 'FR-2.1',
            icon: <Timer className="size-3.5" />,
            content: (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Rest Timer + Workout Logger */}
                <div className="flex flex-col gap-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Smart Rest Interval Timer</CardTitle>
                          <CardDescription>Optimal CNS recovery pacing between compound sets</CardDescription>
                        </div>
                        <div className="flex gap-1">
                          {[60, 90, 120, 180].map((sec) => (
                            <button
                              key={sec}
                              type="button"
                              onClick={() => {
                                setTimerRunning(false);
                                setTimerInitial(sec);
                                setRestSeconds(sec);
                              }}
                              className={`px-2 py-1 rounded text-[11px] font-semibold cursor-pointer border ${
                                timerInitial === sec
                                  ? 'bg-primary text-white border-primary'
                                  : 'bg-bg text-text-muted border-border'
                              }`}
                            >
                              {sec}s
                            </button>
                          ))}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center py-4 gap-4">
                      <div className="text-6xl font-black font-mono text-primary tracking-tight">
                        {Math.floor(restSeconds / 60)}:{String(restSeconds % 60).padStart(2, '0')}
                      </div>
                      <Progress value={((timerInitial - restSeconds) / timerInitial) * 100} className="max-w-xs" />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={timerRunning ? 'destructive' : 'default'}
                          onClick={() => setTimerRunning(!timerRunning)}
                          className="gap-1.5"
                        >
                          {timerRunning ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                          {timerRunning ? 'Pause' : 'Start Interval'}
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setTimerRunning(false);
                            setRestSeconds(timerInitial);
                          }}
                          className="gap-1.5"
                        >
                          <RotateCcw className="size-3.5" /> Reset
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Unlimited Workout Logger</CardTitle>
                      <CardDescription>Manual sets &amp; volume tracking (always free)</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <Input
                          value={newExercise}
                          onChange={(e) => setNewExercise(e.target.value)}
                          placeholder="Exercise"
                          className="col-span-2 sm:col-span-4"
                        />
                        <Input type="number" value={newSets} onChange={(e) => setNewSets(Number(e.target.value))} placeholder="Sets" />
                        <Input type="number" value={newReps} onChange={(e) => setNewReps(Number(e.target.value))} placeholder="Reps" />
                        <Input type="number" value={newWeight} onChange={(e) => setNewWeight(Number(e.target.value))} placeholder="kg" />
                        <Button size="sm" onClick={handleLogSet} className="gap-1 h-10">
                          <Plus className="size-3.5" /> Log
                        </Button>
                      </div>
                      <div className="space-y-2 max-h-48 overflow-y-auto pt-1">
                        {workoutLog.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-bg/60 text-xs">
                            <div>
                              <p className="font-semibold text-text">{item.exercise}</p>
                              <p className="text-text-muted">
                                {item.sets} sets × {item.reps} reps @ {item.weightKg} kg
                              </p>
                            </div>
                            <Badge variant="outline">{(item.sets * item.reps * item.weightKg).toLocaleString()} kg vol</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 1RM Progression Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>1-Rep Max &amp; 5-Week Progression</CardTitle>
                    <CardDescription>Epley formula + percentage training zones</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-text-muted">Weight (kg):</label>
                        <Input type="number" value={calcWeight} onChange={(e) => setCalcWeight(Number(e.target.value))} />
                      </div>
                      <div>
                        <label className="text-xs text-text-muted">Reps Completed:</label>
                        <Input type="number" value={calcReps} onChange={(e) => setCalcReps(Number(e.target.value))} />
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-border bg-bg/70 flex justify-between items-center">
                      <div>
                        <span className="text-xs text-text-muted block">Estimated 1RM:</span>
                        <span className="text-3xl font-extrabold text-primary">{oneRepMax} kg</span>
                      </div>
                      <div className="text-right text-xs space-y-1">
                        <div>90% (Strength): <strong>{Math.round(oneRepMax * 0.9)} kg</strong></div>
                        <div>80% (Hypertrophy): <strong>{Math.round(oneRepMax * 0.8)} kg</strong></div>
                        <div>70% (Endurance): <strong>{Math.round(oneRepMax * 0.7)} kg</strong></div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-border bg-bg/50">
                      <p className="text-xs font-semibold text-text mb-3">5-Week Estimated 1RM Trend</p>
                      <div className="flex items-end justify-between gap-2 h-32 pt-2">
                        {progressionWeeks.map((val, idx) => {
                          const maxVal = Math.max(...progressionWeeks, 1);
                          const heightPct = Math.max(25, Math.round((val / maxVal) * 100));
                          return (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                              <span className="text-[10px] font-mono text-text-muted">{val}</span>
                              <div
                                className="w-full max-w-10 rounded-t-md bg-primary/80 transition-all"
                                style={{ height: `${heightPct}%` }}
                              />
                              <span className="text-[10px] text-text-muted">W{idx + 1}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ),
          },
          {
            id: 'split',
            label: 'AI Workout Split',
            badge: 'FR-2.2',
            icon: <Sparkles className="size-3.5" />,
            content: (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>AI Workout Split Generator</CardTitle>
                        <CardDescription>Guarded by @UseQuota(&apos;WORKOUT_SPLIT&apos;, 1) • Tailored to your equipment</CardDescription>
                      </div>
                      <Badge variant="success">3 Free / Wk</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-text-muted block mb-1">Experience</label>
                        <select
                          value={expLevel}
                          onChange={(e) => setExpLevel(e.target.value as any)}
                          className="w-full h-10 rounded-md border border-border bg-bg px-3 text-xs text-text"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-text-muted block mb-1">Days / Week</label>
                        <select
                          value={daysPerWeek}
                          onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                          className="w-full h-10 rounded-md border border-border bg-bg px-3 text-xs text-text"
                        >
                          {[3, 4, 5, 6].map((d) => (
                            <option key={d} value={d}>{d} Days / Week</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-text-muted block mb-2">Available Gym Equipment</label>
                      <div className="flex flex-wrap gap-2">
                        {['Barbell', 'Dumbbells', 'Cables', 'Kettlebells', 'Bodyweight'].map((item) => {
                          const active = equipment.includes(item);
                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() =>
                                setEquipment((prev) =>
                                  prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item],
                                )
                              }
                              className={`px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer transition-colors ${
                                active
                                  ? 'bg-primary text-white border-primary'
                                  : 'bg-bg text-text-muted border-border hover:text-text'
                              }`}
                            >
                              {item}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <Button onClick={handleGenerateSplit} disabled={loadingSplit} className="gap-2">
                      <Sparkles className="size-4" />
                      {loadingSplit ? 'Synthesizing Periodization...' : 'Generate Tailored Split'}
                    </Button>
                  </CardContent>
                </Card>

                <Card className={splitGenerated ? 'border-primary/40' : ''}>
                  <CardHeader>
                    <CardTitle>{splitGenerated?.splitName || 'Generated Microcycle Preview'}</CardTitle>
                    <CardDescription>Click &quot;Generate Tailored Split&quot; to build your weekly program</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!splitGenerated ? (
                      <p className="text-xs text-text-muted py-8 text-center">
                        Select your training frequency and equipment to generate a periodized split.
                      </p>
                    ) : (
                      <div className="space-y-2.5">
                        {splitGenerated.routine.map((r) => (
                          <div key={r.day} className="p-3 rounded-xl border border-border bg-bg/60 text-xs">
                            <div className="flex items-center justify-between mb-1">
                              <strong className="text-primary">{r.day}</strong>
                              <Badge variant="outline">{r.focus}</Badge>
                            </div>
                            <p className="text-text-muted">{r.exercises}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ),
          },
          {
            id: 'nutrition',
            label: 'Meal Photo Scan',
            badge: 'FR-2.3',
            icon: <Utensils className="size-3.5" />,
            content: (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Gemini Vision Meal Scanner</CardTitle>
                        <CardDescription>Guarded by @UseQuota(&apos;MEAL_SCAN&apos;, 1)</CardDescription>
                      </div>
                      <Badge variant="success">3 Scans/Wk Free</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    <div className="flex flex-wrap gap-2">
                      {SAMPLE_MEALS.map((m, idx) => (
                        <button
                          key={m.label}
                          type="button"
                          onClick={() => {
                            setSelectedSampleMeal(idx);
                            setUploadedMealName(null);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border cursor-pointer ${
                            selectedSampleMeal === idx && !uploadedMealName
                              ? 'bg-primary text-white border-primary'
                              : 'bg-bg text-text-muted border-border'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>

                    <label className="h-32 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-xs text-text-muted cursor-pointer hover:border-primary/60 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setUploadedMealName(file.name.replace(/\.[^.]+$/, ''));
                        }}
                      />
                      <span>{uploadedMealName ? `Selected Photo: ${uploadedMealName}` : 'Upload meal snapshot or select preset above'}</span>
                    </label>

                    <Button onClick={handleMealScan} disabled={loadingMeal}>
                      {loadingMeal ? 'Processing via Gemini Vision...' : 'Scan Meal & Log Macros'}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-primary/30">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>{mealScanned ? 'Latest Scan & Daily Log' : "Today's Macro Log"}</CardTitle>
                      {mealScanned && <Badge variant="default">{Math.round(mealScanned.confidence * 100)}% Match</Badge>}
                    </div>
                    {mealScanned && (
                      <CardDescription>Detected: {mealScanned.identifiedFoods.join(', ')}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    {mealScanned && (
                      <div className="grid grid-cols-4 gap-2 text-center text-xs">
                        <div className="p-2.5 rounded-lg bg-bg border border-border">
                          <span className="block font-extrabold text-base text-primary">{mealScanned.calories}</span>
                          <span className="text-text-muted">kcal</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-bg border border-border">
                          <span className="block font-extrabold text-base text-accent">{mealScanned.proteinGrams}g</span>
                          <span className="text-text-muted">Protein</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-bg border border-border">
                          <span className="block font-extrabold text-base text-warning">{mealScanned.carbsGrams}g</span>
                          <span className="text-text-muted">Carbs</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-bg border border-border">
                          <span className="block font-extrabold text-base text-error">{mealScanned.fatGrams}g</span>
                          <span className="text-text-muted">Fat</span>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2 max-h-44 overflow-y-auto">
                      {dailyMeals.map((m) => (
                        <div key={m.id} className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-bg/60 text-xs">
                          <span className="font-medium text-text">{m.name}</span>
                          <span className="text-text-muted">{m.calories} kcal • {m.proteinGrams}g P</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ),
          },
          {
            id: 'camera',
            label: '30FPS Form Coach',
            badge: 'FR-2.4',
            icon: <Camera className="size-3.5" />,
            content: (
              <div className="flex flex-col gap-4">
                <CopilotGateBanner
                  isCopilotPro={monetization.isCopilotPro}
                  price="$14/mo"
                  featureName="30FPS Skeletal Pose Form Coach"
                  onUpgrade={() => monetization.setUpgradeOpen(true)}
                />
                <Card className="border-primary/40">
                  <CardHeader>
                    <div className="flex flex-wrap justify-between items-center gap-2">
                      <div>
                        <CardTitle>30FPS Skeletal Pose &amp; Biomechanics Tracker</CardTitle>
                        <CardDescription>Real-time joint angle tracking with voice audio coaching cues</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {(['Back Squat', 'Deadlift', 'Overhead Press'] as const).map((ex) => (
                          <Button
                            key={ex}
                            size="sm"
                            variant={poseExercise === ex ? 'default' : 'outline'}
                            className="h-7 text-xs"
                            onClick={() => setPoseExercise(ex)}
                          >
                            {ex}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col lg:flex-row gap-6 items-center">
                    <div className="w-full lg:w-1/2 h-64 rounded-xl border-2 border-primary bg-neutral-950 flex flex-col items-center justify-center relative overflow-hidden p-4">
                      {/* Dynamic SVG Skeletal Joint Overlay */}
                      <svg viewBox="0 0 200 160" className="w-48 h-40">
                        <circle cx="100" cy="24" r="10" stroke="#34d399" strokeWidth="2.5" fill="none" />
                        <line x1="100" y1="34" x2="92" y2="82" stroke="#38bdf8" strokeWidth="3" />
                        <line x1="92" y1="82" x2={liveAngle <= 90 ? 124 : 114} y2="108" stroke="#38bdf8" strokeWidth="3" />
                        <line x1={liveAngle <= 90 ? 124 : 114} y1="108" x2="102" y2="145" stroke="#34d399" strokeWidth="3" />
                        <circle cx="92" cy="82" r="4.5" fill="#facc15" />
                        <circle cx={liveAngle <= 90 ? 124 : 114} cy="108" r="4.5" fill="#facc15" />
                      </svg>
                      <div className="text-center text-white">
                        <p className="font-mono text-lg font-bold text-primary">
                          {poseExercise} Joint Angle: {liveAngle}°
                        </p>
                        <p className="text-[11px] text-neutral-400">Target: &lt;= 90° for full depth</p>
                      </div>
                    </div>

                    <div className="w-full lg:w-1/2 flex flex-col gap-3">
                      <div className="p-4 rounded-xl border border-border bg-bg/60 flex items-center justify-between">
                        <div>
                          <span className="text-xs text-text-muted block">Reps Validated</span>
                          <span className="text-3xl font-black text-accent">{repsDone} Reps</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAudioCues(!audioCues)}
                          className="gap-1.5 text-xs"
                        >
                          <Volume2 className="size-3.5" />
                          Audio Cues: {audioCues ? 'ON' : 'OFF'}
                        </Button>
                      </div>

                      <div className="p-4 rounded-xl border border-border bg-bg/60">
                        <span className="text-xs text-text-muted block">Real-Time Coaching Cue:</span>
                        <span className="text-sm font-semibold text-success block mt-1">&quot;{formCue}&quot;</span>
                      </div>

                      <Button onClick={handleSimulatePoseRep} className="gap-2">
                        <Camera className="size-4" />
                        {isCameraActive ? 'Track Next 30FPS Rep' : 'Start 30FPS Pose Tracking'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ),
          },
          {
            id: 'biometrics',
            label: 'Biometric Auto-Reg',
            badge: 'FR-2.5',
            icon: <HeartPulse className="size-3.5" />,
            content: (
              <div className="flex flex-col gap-4">
                <CopilotGateBanner
                  isCopilotPro={monetization.isCopilotPro}
                  price="$14/mo"
                  featureName="06:00 Biometric Auto-Regulation"
                  onUpgrade={() => monetization.setUpgradeOpen(true)}
                />
                <Card className="border-accent/40">
                  <CardHeader>
                    <CardTitle>Autonomous Microcycle Auto-Regulation</CardTitle>
                    <CardDescription>Ingests Apple Health / Health Connect HRV, sleep &amp; resting HR</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs text-text-muted">HRV (ms):</label>
                        <Input type="number" value={hrvValue} onChange={(e) => setHrvValue(Number(e.target.value))} />
                      </div>
                      <div>
                        <label className="text-xs text-text-muted">Sleep (Hours):</label>
                        <Input type="number" step="0.5" value={sleepHours} onChange={(e) => setSleepHours(Number(e.target.value))} />
                      </div>
                      <div>
                        <label className="text-xs text-text-muted">Resting HR (bpm):</label>
                        <Input type="number" value={restingHr} onChange={(e) => setRestingHr(Number(e.target.value))} />
                      </div>
                    </div>
                    <Button variant="secondary" onClick={handleBiometricSync}>
                      Sync Biometrics &amp; Calculate Daily Microcycle
                    </Button>

                    {readinessResult && (
                      <div className="p-4 rounded-xl border border-border bg-bg/70 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold">Readiness Index: {readinessResult.readinessScore}/100</span>
                          <Badge variant={readinessResult.targetIntensity === 'DELOAD' ? 'destructive' : 'success'}>
                            Intensity: {readinessResult.targetIntensity} ({readinessResult.volumeMultiplier}× vol)
                          </Badge>
                        </div>
                        <p className="text-xs text-text-muted">{readinessResult.guidanceNotes}</p>
                        <div className="pt-2 border-t border-border text-xs flex justify-between">
                          <span>Daily Target Calories: <strong>{readinessResult.calories} kcal</strong></span>
                          <span>Protein: <strong>{readinessResult.proteinGrams}g</strong></span>
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

      <CopilotUpgradeDialog
        appId="kinetic"
        isOpen={monetization.upgradeOpen}
        onClose={() => monetization.setUpgradeOpen(false)}
        isCopilotPro={monetization.isCopilotPro}
        onToggleCopilot={monetization.toggleCopilotPro}
        onResetQuota={monetization.resetDemoQuota}
      />
    </div>
  );
}

export default function KineticFitnessPage() {
  return (
    <LayoutProvider>
      <AppShell appId="kinetic">
        <KineticWorkspace />
      </AppShell>
    </LayoutProvider>
  );
}
