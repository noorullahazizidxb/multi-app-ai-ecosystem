import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_core/flutter_core.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const CareerForgeApp());
}

class CareerForgeApp extends StatelessWidget {
  const CareerForgeApp({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => ThemeBloc()..add(const LoadThemesEvent(defaultAppId: 'careerforge')),
      child: BlocBuilder<ThemeBloc, ThemeState>(
        builder: (context, state) {
          if (state is ThemeLoaded) {
            return MaterialApp(
              title: 'CareerForge AI',
              debugShowCheckedModeBanner: false,
              theme: state.currentTheme.themeData,
              home: CareerForgeHomeScreen(currentTheme: state.currentTheme),
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

class CareerForgeHomeScreen extends StatefulWidget {
  final AppThemeData currentTheme;
  const CareerForgeHomeScreen({super.key, required this.currentTheme});

  @override
  State<CareerForgeHomeScreen> createState() => _CareerForgeHomeScreenState();
}

class _CareerForgeHomeScreenState extends State<CareerForgeHomeScreen> {
  int _selectedIndex = 0;
  int _atsScore = 93;
  bool _isScanning = false;
  bool _isRecording = false;
  String? _interviewFeedback;

  void _runAtsScan() {
    setState(() => _isScanning = true);
    Future.delayed(const Duration(milliseconds: 700), () {
      setState(() {
        _atsScore = 96;
        _isScanning = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('ATS Scan: 96% Match! Missing: [Kubernetes]')),
      );
    });
  }

  void _toggleRecording() {
    setState(() => _isRecording = !_isRecording);
    if (!_isRecording) {
      setState(() {
        _interviewFeedback =
            'Score: 92/100 (STAR: 95%, Relevance: 90%). Strong situation framing; quantifiable business metric highlighted.';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('CareerForge AI'),
        actions: [
          IconButton(
            icon: const Icon(Icons.palette_outlined),
            onPressed: () => _showThemePicker(context),
          ),
        ],
      ),
      body: IndexedStack(
        index: _selectedIndex,
        children: [
          // Tab 0: ATS Scan & Resume
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
                        Row(
                          mainAxisAlignment: MainAxisAlignment.between,
                          children: [
                            Text('ATS Match Readiness', style: theme.textTheme.titleMedium),
                            Chip(
                              label: Text('$_atsScore/100'),
                              backgroundColor: theme.colorScheme.primaryContainer,
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        const Text('Target: Principal Full-Stack Engineer'),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _isScanning ? null : _runAtsScan,
                          child: _isScanning
                              ? const SizedBox(
                                  width: 18,
                                  height: 18,
                                  child: CircularProgressIndicator(strokeWidth: 2),
                                )
                              : const Text('Run Mobile ATS Scan'),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('FR-1.4: Autonomous Job Tailor', style: theme.textTheme.titleMedium),
                        const SizedBox(height: 6),
                        const Text('One-click bespoke cover letter & PDF variant generation.'),
                        const SizedBox(height: 12),
                        OutlinedButton.icon(
                          icon: const Icon(Icons.auto_awesome),
                          label: const Text('Tailor for Job URL'),
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Queued autonomous tailoring job...')),
                            );
                          },
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Tab 1: FR-1.5 Voice Interview Prep
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
                        Text('FR-1.5: Voice Mock Interview', style: theme.textTheme.titleMedium),
                        const SizedBox(height: 6),
                        const Text('Prompt: "Describe a time you handled a critical outage in production."'),
                        const SizedBox(height: 16),
                        Center(
                          child: FloatingActionButton.extended(
                            onPressed: _toggleRecording,
                            backgroundColor: _isRecording ? Colors.red : theme.colorScheme.primary,
                            icon: Icon(_isRecording ? Icons.stop : Icons.mic),
                            label: Text(_isRecording ? 'Listening...' : 'Speak Spoken Response'),
                          ),
                        ),
                        if (_interviewFeedback != null) ...[
                          const SizedBox(height: 16),
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: theme.colorScheme.surface,
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: theme.colorScheme.primary.withOpacity(0.5)),
                            ),
                            child: Text(
                              _interviewFeedback!,
                              style: theme.textTheme.bodyMedium,
                            ),
                          ),
                        ],
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
        selectedIndex: _selectedIndex,
        onDestinationSelected: (idx) => setState(() => _selectedIndex = idx),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.description), label: 'ATS Resume'),
          NavigationDestination(icon: Icon(Icons.mic), label: 'Voice Prep'),
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
