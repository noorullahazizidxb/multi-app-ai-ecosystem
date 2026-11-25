import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_core/flutter_core.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const KineticAIApp());
}

class KineticAIApp extends StatelessWidget {
  const KineticAIApp({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => ThemeBloc()..add(const LoadThemesEvent(defaultAppId: 'kinetic')),
      child: BlocBuilder<ThemeBloc, ThemeState>(
        builder: (context, state) {
          if (state is ThemeLoaded) {
            return MaterialApp(
              title: 'KineticAI Coach',
              debugShowCheckedModeBanner: false,
              theme: state.currentTheme.themeData,
              home: KineticHomeScreen(currentTheme: state.currentTheme),
            );
          }
          return const MaterialApp(
            home: Scaffold(
              body: Center(child: CircularProgressIndicator()),
            ),
          );
        },
      ),
    );
  }
}

class KineticHomeScreen extends StatefulWidget {
  final AppThemeData currentTheme;
  const KineticHomeScreen({super.key, required this.currentTheme});

  @override
  State<KineticHomeScreen> createState() => _KineticHomeScreenState();
}

class _KineticHomeScreenState extends State<KineticHomeScreen> {
  int _tabIndex = 0;
  int _repCount = 12;
  double _squatDepthDegrees = 89.2;

  // Working Rest Timer
  int _initialRest = 90;
  int _restTimer = 90;
  bool _timerActive = false;
  Timer? _timer;

  // 1RM & Workout Log
  final _weightCtrl = TextEditingController(text: '120');
  final _repsCtrl = TextEditingController(text: '5');
  final List<String> _loggedSets = ['Back Squat: 4×5 @ 140kg', 'Bench Press: 4×6 @ 100kg'];

  // Meal & Readiness
  String _mealResult = '685 kcal • 52g Protein • 64g Carbs • 21g Fat (Salmon & Sweet Potato)';
  int _readinessScore = 92;

  @override
  void dispose() {
    _timer?.cancel();
    _weightCtrl.dispose();
    _repsCtrl.dispose();
    super.dispose();
  }

  void _toggleTimer() {
    setState(() => _timerActive = !_timerActive);
    if (_timerActive) {
      _timer = Timer.periodic(const Duration(seconds: 1), (_) {
        if (!mounted) return;
        setState(() {
          if (_restTimer > 0) {
            _restTimer -= 1;
          } else {
            _timerActive = false;
            _timer?.cancel();
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Rest interval complete — start next set!')),
            );
          }
        });
      });
    } else {
      _timer?.cancel();
    }
  }

  void _resetTimer(int seconds) {
    _timer?.cancel();
    setState(() {
      _timerActive = false;
      _initialRest = seconds;
      _restTimer = seconds;
    });
  }

  void _triggerRep() {
    setState(() {
      _repCount += 1;
      _squatDepthDegrees = _repCount % 2 == 0 ? 87.5 : 89.0;
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Rep #$_repCount Validated! Knee Angle: ${_squatDepthDegrees.toStringAsFixed(1)}°')),
    );
  }

  int _compute1RM() {
    final w = double.tryParse(_weightCtrl.text) ?? 100;
    final r = int.tryParse(_repsCtrl.text) ?? 5;
    return (w * (1 + r / 30)).round();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final mins = (_restTimer ~/ 60).toString().padLeft(2, '0');
    final secs = (_restTimer % 60).toString().padLeft(2, '0');

    return Scaffold(
      appBar: AppBar(
        title: const Text('KineticAI Form Coach'),
        actions: [
          IconButton(
            icon: const Icon(Icons.color_lens_outlined),
            onPressed: () => _showThemePicker(context),
          ),
        ],
      ),
      body: IndexedStack(
        index: _tabIndex,
        children: [
          // Tab 0: 30FPS Camera Pose Coach
          SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('FR-2.4: 30FPS Pose Coach', style: TextStyle(fontWeight: FontWeight.bold)),
                        Chip(label: Text('$_repCount Reps'), backgroundColor: theme.colorScheme.primaryContainer),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Container(
                      height: 210,
                      decoration: BoxDecoration(
                        color: Colors.black,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: theme.colorScheme.primary, width: 2),
                      ),
                      child: Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.camera_alt, size: 48, color: theme.colorScheme.primary),
                            const SizedBox(height: 8),
                            Text(
                              'Knee Angle: ${_squatDepthDegrees.toStringAsFixed(1)}°',
                              style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                            ),
                            const Text('Status: Parallel Depth Cleared', style: TextStyle(color: Colors.greenAccent)),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    ElevatedButton.icon(
                      icon: const Icon(Icons.play_arrow),
                      label: const Text('Simulate Camera Rep'),
                      onPressed: _triggerRep,
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Tab 1: Rest Timer & 1RM Logger
          SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      children: [
                        const Text('FR-2.1: Rest Timer', style: TextStyle(fontWeight: FontWeight.bold)),
                        const SizedBox(height: 10),
                        Text(
                          '$mins:$secs',
                          style: TextStyle(fontSize: 48, fontWeight: FontWeight.bold, color: theme.colorScheme.primary),
                        ),
                        const SizedBox(height: 8),
                        LinearProgressIndicator(value: (_initialRest - _restTimer) / _initialRest),
                        const SizedBox(height: 12),
                        Wrap(
                          spacing: 8,
                          children: [
                            ElevatedButton(
                              onPressed: _toggleTimer,
                              child: Text(_timerActive ? 'Pause' : 'Start'),
                            ),
                            OutlinedButton(onPressed: () => _resetTimer(60), child: const Text('60s')),
                            OutlinedButton(onPressed: () => _resetTimer(90), child: const Text('90s')),
                            OutlinedButton(onPressed: () => _resetTimer(120), child: const Text('120s')),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Text('1RM Calculator: ${_compute1RM()} kg', style: theme.textTheme.titleMedium),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            Expanded(
                              child: TextField(
                                controller: _weightCtrl,
                                keyboardType: TextInputType.number,
                                decoration: const InputDecoration(labelText: 'Weight (kg)', isDense: true),
                                onChanged: (_) => setState(() {}),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: TextField(
                                controller: _repsCtrl,
                                keyboardType: TextInputType.number,
                                decoration: const InputDecoration(labelText: 'Reps', isDense: true),
                                onChanged: (_) => setState(() {}),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        OutlinedButton(
                          onPressed: () => setState(() {
                            _loggedSets.insert(0, 'Set: ${_repsCtrl.text} reps @ ${_weightCtrl.text}kg (1RM ${_compute1RM()}kg)');
                          }),
                          child: const Text('Log Set to Session'),
                        ),
                        const SizedBox(height: 8),
                        ..._loggedSets.map((s) => Text('• $s', style: theme.textTheme.bodySmall)),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Tab 2: Meal Scan & Biometric Readiness
          SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('FR-2.3: Multimodal Meal Scan', style: theme.textTheme.titleMedium),
                        const SizedBox(height: 8),
                        Text(_mealResult),
                        const SizedBox(height: 12),
                        ElevatedButton.icon(
                          icon: const Icon(Icons.restaurant),
                          label: const Text('Scan Next Meal Photo'),
                          onPressed: () {
                            setState(() {
                              _mealResult = '610 kcal • 56g Protein • 58g Carbs • 16g Fat (Chicken Quinoa Bowl)';
                            });
                          },
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                Card(
                  child: ListTile(
                    leading: Icon(Icons.favorite, color: theme.colorScheme.primary),
                    title: Text('FR-2.5: Readiness $_readinessScore/100'),
                    subtitle: const Text('HRV 76ms • Sleep 7.8h • Target Intensity: HIGH (+12% vol)'),
                    trailing: ActionChip(
                      label: const Text('Sync'),
                      onPressed: () => setState(() => _readinessScore = _readinessScore == 92 ? 95 : 92),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _tabIndex,
        onDestinationSelected: (idx) => setState(() => _tabIndex = idx),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.videocam), label: 'Pose Cam'),
          NavigationDestination(icon: Icon(Icons.timer), label: 'Workout'),
          NavigationDestination(icon: Icon(Icons.restaurant_menu), label: 'Nutrition'),
        ],
      ),
    );
  }

  void _showThemePicker(BuildContext context) {
    final bloc = context.read<ThemeBloc>();
    final state = bloc.state;
    if (state is ThemeLoaded) {
      showModalBottomSheet(
        context: context,
        builder: (_) => ListView.builder(
          itemCount: state.availableThemes.length,
          itemBuilder: (_, index) {
            final t = state.availableThemes[index];
            return ListTile(
              title: Text(t.name),
              subtitle: Text(t.persona),
              trailing: t.id == state.currentTheme.id ? const Icon(Icons.check, color: Colors.green) : null,
              onTap: () {
                bloc.add(ChangeThemeEvent(t.id));
                Navigator.pop(context);
              },
            );
          },
        ),
      );
    }
  }
}
