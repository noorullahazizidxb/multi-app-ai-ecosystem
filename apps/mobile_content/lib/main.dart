import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_core/flutter_core.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const ViralMatrixApp());
}

class ViralMatrixApp extends StatelessWidget {
  const ViralMatrixApp({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => ThemeBloc()..add(const LoadThemesEvent(defaultAppId: 'viralmatrix')),
      child: BlocBuilder<ThemeBloc, ThemeState>(
        builder: (context, state) {
          if (state is ThemeLoaded) {
            return MaterialApp(
              title: 'ViralMatrix AI',
              debugShowCheckedModeBanner: false,
              theme: state.currentTheme.themeData,
              home: ViralMatrixHomeScreen(currentTheme: state.currentTheme),
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

class ViralMatrixHomeScreen extends StatefulWidget {
  final AppThemeData currentTheme;
  const ViralMatrixHomeScreen({super.key, required this.currentTheme});

  @override
  State<ViralMatrixHomeScreen> createState() => _ViralMatrixHomeScreenState();
}

class _ViralMatrixHomeScreenState extends State<ViralMatrixHomeScreen> {
  int _navIndex = 0;
  bool _isPlaying = true;
  bool _showCaptions = true;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('ViralMatrix AI'),
        actions: [
          IconButton(
            icon: const Icon(Icons.palette),
            onPressed: () => _showThemePicker(context),
          ),
        ],
      ),
      body: IndexedStack(
        index: _navIndex,
        children: [
          // Tab 0: 9:16 Shorts Player
          Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    width: 240,
                    height: 420,
                    decoration: BoxDecoration(
                      color: Colors.black,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: theme.colorScheme.primary, width: 3),
                      boxShadow: [
                        BoxShadow(
                          color: theme.colorScheme.primary.withOpacity(0.3),
                          blurRadius: 16,
                          spreadRadius: 2,
                        ),
                      ],
                    ),
                    child: Stack(
                      children: [
                        Center(
                          child: Icon(
                            _isPlaying ? Icons.play_circle_fill : Icons.pause_circle_filled,
                            size: 64,
                            color: theme.colorScheme.primary,
                          ),
                        ),
                        Positioned(
                          top: 12,
                          left: 12,
                          child: Chip(
                            label: const Text('9:16 Reframed', style: TextStyle(fontSize: 10, color: Colors.white)),
                            backgroundColor: Colors.black54,
                          ),
                        ),
                        if (_showCaptions)
                          Positioned(
                            bottom: 20,
                            left: 12,
                            right: 12,
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: Colors.black87,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Text(
                                '"Stop building monoliths in 2026!"',
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  color: Colors.yellowAccent,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 12,
                                ),
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      ElevatedButton.icon(
                        icon: Icon(_isPlaying ? Icons.pause : Icons.play_arrow),
                        label: Text(_isPlaying ? 'Pause' : 'Play'),
                        onPressed: () => setState(() => _isPlaying = !_isPlaying),
                      ),
                      const SizedBox(width: 12),
                      OutlinedButton.icon(
                        icon: Icon(_showCaptions ? Icons.subtitles_off : Icons.subtitles),
                        label: Text(_showCaptions ? 'Hide Captions' : 'Show Captions'),
                        onPressed: () => setState(() => _showCaptions = !_showCaptions),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),

          // Tab 1: Omnichannel Schedules
          ListView(
            padding: const EdgeInsets.all(16.0),
            children: [
              Card(
                child: ListTile(
                  leading: const Icon(Icons.share, color: Colors.purpleAccent),
                  title: const Text('FR-4.4: Omnichannel Auto-Publisher'),
                  subtitle: const Text('TikTok, Shorts, Reels & X scheduled for 18:00 UTC'),
                  trailing: const Icon(Icons.check_circle, color: Colors.green),
                ),
              ),
            ],
          ),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _navIndex,
        onDestinationSelected: (idx) => setState(() => _navIndex = idx),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.videocam), label: '9:16 Player'),
          NavigationDestination(icon: Icon(Icons.schedule), label: 'Publishing'),
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
