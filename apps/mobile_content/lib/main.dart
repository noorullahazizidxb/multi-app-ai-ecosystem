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

  final _urlCtrl = TextEditingController(text: 'https://youtube.com/watch?v=saas-2026');
  List<String> _hooks = [
    'Stop bundling 4 AI products into one slow monolith. Here is why:',
    'How we shared 80% DRY TypeScript + Flutter code across 4 apps:',
  ];

  final List<Map<String, String>> _channels = [
    {'name': 'TikTok (@viralmatrix)', 'slot': '18:00 UTC Peak', 'status': 'QUEUED'},
    {'name': 'YouTube Shorts', 'slot': '18:15 UTC Peak', 'status': 'QUEUED'},
    {'name': 'Instagram Reels', 'slot': '19:00 UTC', 'status': 'QUEUED'},
    {'name': 'X / Twitter', 'slot': '18:00 UTC Peak', 'status': 'QUEUED'},
  ];

  @override
  void dispose() {
    _urlCtrl.dispose();
    super.dispose();
  }

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
                    height: 410,
                    decoration: BoxDecoration(
                      color: Colors.black,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: theme.colorScheme.primary, width: 3),
                      boxShadow: [
                        BoxShadow(
                          color: theme.colorScheme.primary.withValues(alpha: 0.3),
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
                        const Positioned(
                          top: 12,
                          left: 12,
                          child: Chip(
                            label: Text('9:16 Reframed', style: TextStyle(fontSize: 10, color: Colors.white)),
                            backgroundColor: Colors.black54,
                          ),
                        ),
                        if (_showCaptions)
                          Positioned(
                            bottom: 20,
                            left: 12,
                            right: 12,
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
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
                  Wrap(
                    spacing: 12,
                    children: [
                      ElevatedButton.icon(
                        icon: Icon(_isPlaying ? Icons.pause : Icons.play_arrow),
                        label: Text(_isPlaying ? 'Pause' : 'Play'),
                        onPressed: () => setState(() => _isPlaying = !_isPlaying),
                      ),
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

          // Tab 1: FR-4.1 Repurposer
          SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Text('FR-4.1: Video to Social Hooks', style: theme.textTheme.titleMedium),
                    const SizedBox(height: 10),
                    TextField(
                      controller: _urlCtrl,
                      decoration: const InputDecoration(labelText: 'YouTube URL', border: OutlineInputBorder()),
                    ),
                    const SizedBox(height: 12),
                    ElevatedButton(
                      onPressed: () {
                        setState(() {
                          _hooks = [
                            '5 Architecture Rules Every AI SaaS Founder Needs in 2026:',
                            'Why Isolated NestJS Containers Beat Monoliths Under FFmpeg Load:',
                            'How Redis Lua Rate Limiting Protects Your Gemini API Budget:',
                          ];
                        });
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Synthesized viral hooks & X thread!')),
                        );
                      },
                      child: const Text('Synthesize Hooks & Thread'),
                    ),
                    const SizedBox(height: 12),
                    ..._hooks.asMap().entries.map(
                          (e) => ListTile(
                            dense: true,
                            leading: CircleAvatar(radius: 12, child: Text('${e.key + 1}')),
                            title: Text(e.value),
                          ),
                        ),
                  ],
                ),
              ),
            ),
          ),

          // Tab 2: FR-4.4 Omnichannel Auto-Publisher
          ListView(
            padding: const EdgeInsets.all(16.0),
            children: [
              ElevatedButton.icon(
                icon: const Icon(Icons.send),
                label: const Text('Publish All Channels Now'),
                onPressed: () {
                  setState(() {
                    for (final c in _channels) {
                      c['status'] = 'PUBLISHED';
                    }
                  });
                },
              ),
              const SizedBox(height: 12),
              ..._channels.map(
                (c) => Card(
                  margin: const EdgeInsets.only(bottom: 8),
                  child: ListTile(
                    leading: const Icon(Icons.share),
                    title: Text(c['name']!),
                    subtitle: Text(c['slot']!),
                    trailing: Chip(label: Text(c['status']!)),
                  ),
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
          NavigationDestination(icon: Icon(Icons.auto_awesome), label: 'Repurpose'),
          NavigationDestination(icon: Icon(Icons.schedule), label: 'Publish'),
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
