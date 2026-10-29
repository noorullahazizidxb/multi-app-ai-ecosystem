import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_core/flutter_core.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const FreelanceOSApp());
}

class FreelanceOSApp extends StatelessWidget {
  const FreelanceOSApp({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => ThemeBloc()..add(const LoadThemesEvent(defaultAppId: 'freelanceos')),
      child: BlocBuilder<ThemeBloc, ThemeState>(
        builder: (context, state) {
          if (state is ThemeLoaded) {
            return MaterialApp(
              title: 'FreelanceOS',
              debugShowCheckedModeBanner: false,
              theme: state.currentTheme.themeData,
              home: FreelanceHomeScreen(currentTheme: state.currentTheme),
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

class FreelanceHomeScreen extends StatefulWidget {
  final AppThemeData currentTheme;
  const FreelanceHomeScreen({super.key, required this.currentTheme});

  @override
  State<FreelanceHomeScreen> createState() => _FreelanceHomeScreenState();
}

class _FreelanceHomeScreenState extends State<FreelanceHomeScreen> {
  int _navIndex = 0;
  int _seconds = 1845;
  bool _timerActive = false;
  Timer? _timer;

  void _toggleTimer() {
    setState(() => _timerActive = !_timerActive);
    if (_timerActive) {
      _timer = Timer.periodic(const Duration(seconds: 1), (_) {
        setState(() => _seconds += 1);
      });
    } else {
      _timer?.cancel();
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  String _formatTime() {
    final h = _seconds ~/ 3600;
    final m = (_seconds % 3600) ~/ 60;
    final s = _seconds % 60;
    return '${h.toString().padLeft(2, '0')}:${m.toString().padLeft(2, '0')}:${s.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('FreelanceOS'),
        actions: [
          IconButton(
            icon: const Icon(Icons.style_outlined),
            onPressed: () => _showThemePicker(context),
          ),
        ],
      ),
      body: IndexedStack(
        index: _navIndex,
        children: [
          // Tab 0: Time Tracker & Kanban
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
                        const Text('FR-3.1: Offline Time Tracker', style: TextStyle(fontWeight: FontWeight.bold)),
                        const SizedBox(height: 12),
                        Text(
                          _formatTime(),
                          style: TextStyle(
                            fontSize: 44,
                            fontWeight: FontWeight.bold,
                            fontFamily: 'monospace',
                            color: theme.colorScheme.primary,
                          ),
                        ),
                        const SizedBox(height: 12),
                        ElevatedButton.icon(
                          icon: Icon(_timerActive ? Icons.stop : Icons.play_arrow),
                          label: Text(_timerActive ? 'Pause Session' : 'Start Billable Timer'),
                          onPressed: _toggleTimer,
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Card(
                  child: ListTile(
                    leading: Icon(Icons.shield, color: theme.colorScheme.secondary),
                    title: const Text('FR-3.4: Scope-Creep Shield'),
                    subtitle: const Text('Audit client email against contract SOW'),
                    trailing: const Icon(Icons.chevron_right),
                  ),
                ),
              ],
            ),
          ),

          // Tab 1: Receipt OCR
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
                        const Text('FR-3.3: Mobile Receipt OCR', style: TextStyle(fontWeight: FontWeight.bold)),
                        const SizedBox(height: 12),
                        const Icon(Icons.receipt_long, size: 64),
                        const SizedBox(height: 8),
                        const Text('5 Free Mobile Receipt Scans / Month'),
                        const SizedBox(height: 16),
                        ElevatedButton.icon(
                          icon: const Icon(Icons.camera_alt),
                          label: const Text('Capture Tax Deduction Receipt'),
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Receipt Scanned: \$142.50 (Software Subscription)')),
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
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _navIndex,
        onDestinationSelected: (idx) => setState(() => _navIndex = idx),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.timer), label: 'Timer & Tasks'),
          NavigationDestination(icon: Icon(Icons.document_scanner), label: 'Receipt OCR'),
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
