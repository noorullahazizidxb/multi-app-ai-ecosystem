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

  final List<Map<String, String>> _tasks = [
    {'title': 'Implement Stripe Webhook', 'client': 'Fintech Inc', 'status': 'IN_PROGRESS'},
    {'title': 'Draft SOW Deliverables', 'client': 'Acme Corp', 'status': 'TODO'},
    {'title': 'Setup Turborepo CI', 'client': 'Acme Corp', 'status': 'DONE'},
  ];

  final List<Map<String, String>> _receipts = [
    {'vendor': 'JetBrains All Products', 'category': 'Software', 'amount': '\$289.00'},
    {'vendor': 'Vercel Pro Hosting', 'category': 'Cloud Infra', 'amount': '\$20.00'},
  ];

  String _scopeFeedback = 'Tap "Audit Client Message" to detect SOW scope drift.';

  void _toggleTimer() {
    setState(() => _timerActive = !_timerActive);
    if (_timerActive) {
      _timer = Timer.periodic(const Duration(seconds: 1), (_) {
        if (mounted) setState(() => _seconds += 1);
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
    final accrued = ((_seconds / 3600) * 125).toStringAsFixed(2);

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
          // Tab 0: Time Tracker & Interactive Kanban
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
                        const Text('FR-3.1: Offline Billable Tracker', style: TextStyle(fontWeight: FontWeight.bold)),
                        const SizedBox(height: 10),
                        Text(
                          _formatTime(),
                          style: TextStyle(
                            fontSize: 42,
                            fontWeight: FontWeight.bold,
                            fontFamily: 'monospace',
                            color: theme.colorScheme.primary,
                          ),
                        ),
                        Text('Accrued: \$$accrued @ \$125/hr', style: theme.textTheme.bodySmall),
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
                const SizedBox(height: 12),
                ..._tasks.asMap().entries.map((entry) {
                  final idx = entry.key;
                  final t = entry.value;
                  return Card(
                    margin: const EdgeInsets.only(bottom: 8),
                    child: ListTile(
                      title: Text(t['title']!),
                      subtitle: Text(t['client']!),
                      trailing: ActionChip(
                        label: Text(t['status']!),
                        onPressed: () {
                          const order = ['TODO', 'IN_PROGRESS', 'DONE'];
                          final next = order[(order.indexOf(t['status']!) + 1) % order.length];
                          setState(() => _tasks[idx]['status'] = next);
                        },
                      ),
                    ),
                  );
                }),
              ],
            ),
          ),

          // Tab 1: Receipt OCR
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
                        const Text('FR-3.3: Mobile Receipt OCR', style: TextStyle(fontWeight: FontWeight.bold)),
                        const SizedBox(height: 10),
                        const Icon(Icons.receipt_long, size: 52),
                        const SizedBox(height: 6),
                        const Text('5 Free Mobile Receipt Scans / Month'),
                        const SizedBox(height: 12),
                        ElevatedButton.icon(
                          icon: const Icon(Icons.camera_alt),
                          label: const Text('Capture Tax Deduction Receipt'),
                          onPressed: () {
                            setState(() {
                              _receipts.insert(0, {
                                'vendor': 'AWS Cloud Services',
                                'category': 'Infrastructure',
                                'amount': '\$142.50',
                              });
                            });
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Receipt Scanned: \$142.50 (Tax Deductible)')),
                            );
                          },
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                ..._receipts.map(
                  (r) => Card(
                    margin: const EdgeInsets.only(bottom: 8),
                    child: ListTile(
                      title: Text(r['vendor']!),
                      subtitle: Text(r['category']!),
                      trailing: Text(r['amount']!, style: const TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Tab 2: Scope-Creep Shield & Collections
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
                        Text('FR-3.4: Scope-Creep Shield', style: theme.textTheme.titleMedium),
                        const SizedBox(height: 8),
                        Text(_scopeFeedback),
                        const SizedBox(height: 12),
                        ElevatedButton.icon(
                          icon: const Icon(Icons.shield),
                          label: const Text('Audit Client Message'),
                          onPressed: () {
                            setState(() {
                              _scopeFeedback =
                                  '85% Scope Deviation Detected! Suggested Change Order: 40 hrs (\$5,000 USD) for mobile companion build.';
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
                    leading: const Icon(Icons.payments),
                    title: const Text('Venture Capital X (\$4,200)'),
                    subtitle: const Text('Overdue by 5 days • 2 Reminders Sent'),
                    trailing: ElevatedButton(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Dispatched Stripe pay-link reminder!')),
                        );
                      },
                      child: const Text('Chase'),
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
          NavigationDestination(icon: Icon(Icons.document_scanner), label: 'Receipts'),
          NavigationDestination(icon: Icon(Icons.shield), label: 'Copilot'),
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
