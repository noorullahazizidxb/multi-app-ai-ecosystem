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
  int _restTimer = 90;
  bool _timerActive = false;

  void _triggerRep() {
    setState(() {
      _repCount += 1;
      _squatDepthDegrees = 87.5;
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Rep Validated! Audio: "Parallel depth achieved."')),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

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
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.between,
                          children: [
                            const Text('FR-2.4: 30FPS Pose Coach', style: TextStyle(fontWeight: FontWeight.bold)),
                            Chip(label: Text('$_repCount Reps'), backgroundColor: theme.colorScheme.primaryContainer),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Container(
                          height: 200,
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
              ],
            ),
          ),

          // Tab 1: Rest Timer & 1RM
          Padding(
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
                        const SizedBox(height: 12),
                        Text(
                          '01:${_restTimer.toString().padLeft(2, '0')}',
                          style: TextStyle(fontSize: 48, fontWeight: FontWeight.bold, color: theme.colorScheme.primary),
                        ),
                        const SizedBox(height: 12),
                        ElevatedButton(
                          onPressed: () => setState(() => _timerActive = !_timerActive),
                          child: Text(_timerActive ? 'Pause' : 'Start Interval'),
                        ),
                      ],
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
          NavigationDestination(icon: Icon(Icons.timer), label: 'Rest Timer'),
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
