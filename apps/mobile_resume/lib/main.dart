import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_core/flutter_core.dart';
import 'package:printing/printing.dart';
import 'ats_pdf_service.dart';

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

  // Resume State
  final _nameCtrl = TextEditingController(text: 'Alexander Chen');
  final _headlineCtrl = TextEditingController(
    text: 'Principal Software Architect | Distributed Systems & Enterprise AI',
  );
  final _emailCtrl = TextEditingController(text: 'alex.chen@devminds.net');
  final _phoneCtrl = TextEditingController(text: '+1 (415) 890-4412');
  final _locationCtrl = TextEditingController(text: 'San Francisco, CA');
  final _linkedinCtrl = TextEditingController(text: 'linkedin.com/in/alexchen-arch');
  final _summaryCtrl = TextEditingController(
    text:
        'Principal Software Architect with 9+ years designing resilient TypeScript, NestJS, Next.js 15, and Flutter ecosystems with sub-50ms p95 latency and atomic Redis quota governance.',
  );
  final _skillsCtrl = TextEditingController(
    text: 'TypeScript, Next.js 15, NestJS, Flutter, PostgreSQL, Prisma ORM, Redis Lua, BullMQ, Docker, Gemini AI',
  );
  final _roleCtrl = TextEditingController(text: 'Principal Software Architect');
  final _companyCtrl = TextEditingController(text: 'DevMinds Cloud Systems');
  final _durationCtrl = TextEditingController(text: 'Jan 2023 – Present');
  final _bullet1Ctrl = TextEditingController(
    text: 'Architected decoupled Turborepo monorepo powering 4 commercial AI SaaS apps with 80% shared DRY modules.',
  );
  final _bullet2Ctrl = TextEditingController(
    text: 'Engineered atomic Redis Lua rate-limiting guards sustaining 2.4M+ monthly AI requests at 99.98% uptime.',
  );

  String _templateId = 'executive-modern';
  bool _isA4 = true;
  bool _exportingPdf = false;

  // ATS Scanner State
  final _jdCtrl = TextEditingController(
    text: 'Looking for a Principal Engineer with TypeScript, NestJS, PostgreSQL, Redis, Kubernetes, and OpenTelemetry.',
  );
  int _atsScore = 88;
  List<String> _matchedKeywords = ['TypeScript', 'NestJS', 'PostgreSQL', 'Redis'];
  List<String> _missingKeywords = ['Kubernetes', 'OpenTelemetry'];
  bool _isScanning = false;

  // Voice Mock Interview State
  bool _isRecording = false;
  final _transcriptCtrl = TextEditingController(
    text: 'In my previous role, I resolved an architectural bottleneck by decoupling services and cutting latency by 45%.',
  );
  String? _interviewFeedback;

  // Auto-Tracker Pipeline State
  final List<Map<String, String>> _applications = [
    {'company': 'Google', 'role': 'Staff Software Engineer', 'status': 'FOLLOW_UP_SENT'},
    {'company': 'Stripe', 'role': 'Infrastructure Tech Lead', 'status': 'TAILORED'},
    {'company': 'Neon Database', 'role': 'Principal Systems Engineer', 'status': 'QUEUED'},
  ];

  @override
  void dispose() {
    _nameCtrl.dispose();
    _headlineCtrl.dispose();
    _emailCtrl.dispose();
    _phoneCtrl.dispose();
    _locationCtrl.dispose();
    _linkedinCtrl.dispose();
    _summaryCtrl.dispose();
    _skillsCtrl.dispose();
    _roleCtrl.dispose();
    _companyCtrl.dispose();
    _durationCtrl.dispose();
    _bullet1Ctrl.dispose();
    _bullet2Ctrl.dispose();
    _jdCtrl.dispose();
    _transcriptCtrl.dispose();
    super.dispose();
  }

  MobileResumeData _buildResumeData() {
    return MobileResumeData(
      fullName: _nameCtrl.text,
      headline: _headlineCtrl.text,
      email: _emailCtrl.text,
      phone: _phoneCtrl.text,
      location: _locationCtrl.text,
      linkedin: _linkedinCtrl.text,
      summary: _summaryCtrl.text,
      skillsCsv: _skillsCtrl.text,
      roleTitle: _roleCtrl.text,
      company: _companyCtrl.text,
      duration: _durationCtrl.text,
      bullets: [_bullet1Ctrl.text, _bullet2Ctrl.text],
      degree: 'M.S. in Computer Science',
      university: 'UC Berkeley',
      gradYear: '2017',
    );
  }

  Future<void> _exportElitePdf() async {
    setState(() => _exportingPdf = true);
    try {
      final data = _buildResumeData();
      final bytes = await AtsPdfService.buildEliteAtsPdf(
        data: data,
        templateId: _templateId,
        isA4: _isA4,
      );
      final safeName = data.fullName.trim().replaceAll(RegExp(r'\s+'), '_');
      await Printing.layoutPdf(
        onLayout: (_) async => bytes,
        name: '${safeName}_Elite_ATS_Resume.pdf',
      );
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('PDF Export failed: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _exportingPdf = false);
    }
  }

  void _runAtsScan() {
    setState(() => _isScanning = true);
    Future.delayed(const Duration(milliseconds: 500), () {
      if (!mounted) return;
      final resumeText = _buildResumeData().toPlainText().toLowerCase();
      final jdText = _jdCtrl.text.toLowerCase();
      const targetTerms = [
        'TypeScript',
        'NestJS',
        'Next.js',
        'PostgreSQL',
        'Redis',
        'Kubernetes',
        'OpenTelemetry',
        'Docker',
        'Flutter',
        'gRPC',
      ];

      final matched = <String>[];
      final missing = <String>[];
      for (final term in targetTerms) {
        if (jdText.contains(term.toLowerCase())) {
          if (resumeText.contains(term.toLowerCase())) {
            matched.add(term);
          } else {
            missing.add(term);
          }
        }
      }
      final total = matched.length + missing.length;
      final score = total == 0 ? 85 : ((matched.length / total) * 75 + 25).round().clamp(30, 99);

      setState(() {
        _matchedKeywords = matched;
        _missingKeywords = missing;
        _atsScore = score;
        _isScanning = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('ATS Scan: $score% Match (${missing.length} gaps)')),
      );
    });
  }

  void _addSkillChip(String keyword) {
    final current = _skillsCtrl.text.trim();
    if (!current.toLowerCase().contains(keyword.toLowerCase())) {
      setState(() {
        _skillsCtrl.text = current.isEmpty ? keyword : '$current, $keyword';
      });
      _runAtsScan();
    }
  }

  void _toggleRecording() {
    setState(() => _isRecording = !_isRecording);
    if (!_isRecording) {
      final hasNumbers = RegExp(r'\d+%|\d+').hasMatch(_transcriptCtrl.text);
      setState(() {
        _interviewFeedback = hasNumbers
            ? 'Score: 93/100 (STAR: 95%, Relevance: 92%). Quantifiable metric detected with crisp ownership.'
            : 'Score: 81/100 (STAR: 82%, Relevance: 80%). Add concrete numbers (% / ms / \$) to elevate your Result.';
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
            tooltip: 'Export Elite ATS PDF',
            icon: const Icon(Icons.picture_as_pdf_outlined),
            onPressed: _exportingPdf ? null : _exportElitePdf,
          ),
          IconButton(
            tooltip: 'Theme Presets',
            icon: const Icon(Icons.palette_outlined),
            onPressed: () => _showThemePicker(context),
          ),
        ],
      ),
      body: IndexedStack(
        index: _selectedIndex,
        children: [
          // Tab 0: Resume Builder & Elite ATS PDF Export
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
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text('FR-1.1: Elite ATS PDF Studio', style: theme.textTheme.titleMedium),
                            Chip(
                              label: const Text('100% ATS Vector'),
                              backgroundColor: theme.colorScheme.primaryContainer,
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        DropdownButtonFormField<String>(
                          initialValue: _templateId,
                          decoration: const InputDecoration(
                            labelText: 'Executive Template',
                            border: OutlineInputBorder(),
                            isDense: true,
                          ),
                          items: const [
                            DropdownMenuItem(value: 'executive-modern', child: Text('Executive Modern (Helvetica)')),
                            DropdownMenuItem(value: 'wall-street-classic', child: Text('Wall Street Classic (Times Serif)')),
                            DropdownMenuItem(value: 'principal-minimal', child: Text('Principal Tech Minimal')),
                          ],
                          onChanged: (v) => setState(() => _templateId = v ?? 'executive-modern'),
                        ),
                        const SizedBox(height: 10),
                        SegmentedButton<bool>(
                          segments: const [
                            ButtonSegment(value: true, label: Text('ISO A4')),
                            ButtonSegment(value: false, label: Text('US Letter')),
                          ],
                          selected: {_isA4},
                          onSelectionChanged: (s) => setState(() => _isA4 = s.first),
                        ),
                        const SizedBox(height: 14),
                        ElevatedButton.icon(
                          icon: const Icon(Icons.download),
                          label: Text(_exportingPdf ? 'Generating Vector PDF...' : 'Export Elite ATS PDF'),
                          onPressed: _exportingPdf ? null : _exportElitePdf,
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
                        Text('Candidate Profile & Content', style: theme.textTheme.titleMedium),
                        const SizedBox(height: 10),
                        TextField(controller: _nameCtrl, decoration: const InputDecoration(labelText: 'Full Name', isDense: true)),
                        const SizedBox(height: 8),
                        TextField(controller: _headlineCtrl, decoration: const InputDecoration(labelText: 'Headline', isDense: true)),
                        const SizedBox(height: 8),
                        TextField(controller: _emailCtrl, decoration: const InputDecoration(labelText: 'Email', isDense: true)),
                        const SizedBox(height: 8),
                        TextField(
                          controller: _summaryCtrl,
                          maxLines: 3,
                          decoration: const InputDecoration(labelText: 'Professional Summary', isDense: true),
                        ),
                        const SizedBox(height: 8),
                        TextField(
                          controller: _skillsCtrl,
                          maxLines: 2,
                          decoration: const InputDecoration(labelText: 'Core Competencies (CSV)', isDense: true),
                        ),
                        const SizedBox(height: 8),
                        TextField(controller: _roleCtrl, decoration: const InputDecoration(labelText: 'Latest Role', isDense: true)),
                        const SizedBox(height: 8),
                        TextField(
                          controller: _bullet1Ctrl,
                          maxLines: 2,
                          decoration: const InputDecoration(labelText: 'STAR Impact Bullet #1', isDense: true),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Tab 1: ATS Keyword Gap Scanner
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
                        Text('FR-1.2: ATS Gap Scanner', style: theme.textTheme.titleMedium),
                        Chip(
                          label: Text('$_atsScore/100'),
                          backgroundColor: theme.colorScheme.primaryContainer,
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    TextField(
                      controller: _jdCtrl,
                      maxLines: 4,
                      decoration: const InputDecoration(
                        labelText: 'Target Job Description',
                        border: OutlineInputBorder(),
                      ),
                    ),
                    const SizedBox(height: 12),
                    ElevatedButton(
                      onPressed: _isScanning ? null : _runAtsScan,
                      child: _isScanning
                          ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2))
                          : const Text('Run ATS Keyword Scan'),
                    ),
                    const SizedBox(height: 14),
                    const Text('Matched Keywords:', style: TextStyle(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 6),
                    Wrap(
                      spacing: 6,
                      runSpacing: 6,
                      children: _matchedKeywords.map((k) => Chip(label: Text(k))).toList(),
                    ),
                    const SizedBox(height: 12),
                    const Text('Missing Keywords (Tap to add to Skills):', style: TextStyle(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 6),
                    Wrap(
                      spacing: 6,
                      runSpacing: 6,
                      children: _missingKeywords
                          .map((k) => ActionChip(
                                avatar: const Icon(Icons.add, size: 16),
                                label: Text(k),
                                onPressed: () => _addSkillChip(k),
                              ))
                          .toList(),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Tab 2: FR-1.5 Voice Interview Prep
          SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Text('FR-1.5: Voice Mock Interview', style: theme.textTheme.titleMedium),
                    const SizedBox(height: 8),
                    const Text('Prompt: "Describe a time you handled a critical outage in production."'),
                    const SizedBox(height: 12),
                    TextField(
                      controller: _transcriptCtrl,
                      maxLines: 4,
                      decoration: const InputDecoration(
                        labelText: 'Spoken Transcript',
                        border: OutlineInputBorder(),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Center(
                      child: FloatingActionButton.extended(
                        onPressed: _toggleRecording,
                        backgroundColor: _isRecording ? Colors.red : theme.colorScheme.primary,
                        icon: Icon(_isRecording ? Icons.stop : Icons.mic),
                        label: Text(_isRecording ? 'Stop & Grade Answer' : 'Record / Grade Response'),
                      ),
                    ),
                    if (_interviewFeedback != null) ...[
                      const SizedBox(height: 16),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: theme.colorScheme.surface,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: theme.colorScheme.primary.withValues(alpha: 0.5)),
                        ),
                        child: Text(_interviewFeedback!, style: theme.textTheme.bodyMedium),
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ),

          // Tab 3: FR-1.4 & FR-1.6 Tailor & Auto-Tracker
          ListView(
            padding: const EdgeInsets.all(16.0),
            children: [
              Card(
                child: ListTile(
                  leading: Icon(Icons.auto_awesome, color: theme.colorScheme.primary),
                  title: const Text('FR-1.4: Autonomous Job Tailor'),
                  subtitle: const Text('Generate tailored PDF & cover letter in 1 click'),
                  trailing: ElevatedButton(
                    onPressed: _exportingPdf ? null : _exportElitePdf,
                    child: const Text('Tailor PDF'),
                  ),
                ),
              ),
              const SizedBox(height: 12),
              ..._applications.asMap().entries.map((entry) {
                final idx = entry.key;
                final app = entry.value;
                return Card(
                  margin: const EdgeInsets.only(bottom: 10),
                  child: ListTile(
                    title: Text(app['company']!),
                    subtitle: Text(app['role']!),
                    trailing: ActionChip(
                      label: Text(app['status']!),
                      onPressed: () {
                        const order = ['QUEUED', 'TAILORED', 'APPLIED', 'FOLLOW_UP_SENT'];
                        final next = order[(order.indexOf(app['status']!) + 1) % order.length];
                        setState(() => _applications[idx]['status'] = next);
                      },
                    ),
                  ),
                );
              }),
            ],
          ),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedIndex,
        onDestinationSelected: (idx) => setState(() => _selectedIndex = idx),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.picture_as_pdf), label: 'PDF Studio'),
          NavigationDestination(icon: Icon(Icons.fact_check), label: 'ATS Scan'),
          NavigationDestination(icon: Icon(Icons.mic), label: 'Voice Prep'),
          NavigationDestination(icon: Icon(Icons.work_outline), label: 'Tracker'),
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
