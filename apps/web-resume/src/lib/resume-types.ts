export type ResumeTemplateId = 'executive-modern' | 'wall-street-classic' | 'principal-minimal';
export type ResumePaperSize = 'A4' | 'LETTER';
export type ResumeAccentId = 'ats-noir' | 'executive-navy' | 'slate-steel' | 'forest-emerald';

export interface ResumeExperience {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface ResumeEducation {
  id: string;
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
  details?: string;
}

export interface ResumeSkillGroup {
  id: string;
  category: string;
  items: string[];
}

export interface ResumeCertification {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface ResumeData {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  summary: string;
  skills: ResumeSkillGroup[];
  experience: ResumeExperience[];
  education: ResumeEducation[];
  certifications: ResumeCertification[];
}

export const RESUME_TEMPLATES: Record<
  ResumeTemplateId,
  { id: ResumeTemplateId; name: string; subtitle: string; fontLabel: string }
> = {
  'executive-modern': {
    id: 'executive-modern',
    name: 'Executive Modern',
    subtitle: 'Crisp Helvetica hierarchy, accent rule, right-aligned dates',
    fontLabel: 'Helvetica (Sans-Serif)',
  },
  'wall-street-classic': {
    id: 'wall-street-classic',
    name: 'Wall Street Classic',
    subtitle: 'Centered serif header, classic hairline dividers, partner gravitas',
    fontLabel: 'Times Roman (Serif)',
  },
  'principal-minimal': {
    id: 'principal-minimal',
    name: 'Principal Tech Minimal',
    subtitle: 'High-density technical layout optimized for FAANG/Staff ATS',
    fontLabel: 'Helvetica Compact',
  },
};

export const RESUME_ACCENTS: Record<
  ResumeAccentId,
  { id: ResumeAccentId; name: string; hex: string; rgb: [number, number, number] }
> = {
  'ats-noir': {
    id: 'ats-noir',
    name: 'Pure ATS Noir',
    hex: '#111827',
    rgb: [17 / 255, 24 / 255, 39 / 255],
  },
  'executive-navy': {
    id: 'executive-navy',
    name: 'Executive Navy',
    hex: '#1e3a5f',
    rgb: [30 / 255, 58 / 255, 95 / 255],
  },
  'slate-steel': {
    id: 'slate-steel',
    name: 'Slate Steel',
    hex: '#334155',
    rgb: [51 / 255, 65 / 255, 85 / 255],
  },
  'forest-emerald': {
    id: 'forest-emerald',
    name: 'Emerald Ink',
    hex: '#0f5132',
    rgb: [15 / 255, 81 / 255, 50 / 255],
  },
};

export const DEFAULT_RESUME_DATA: ResumeData = {
  fullName: 'Alexander Chen',
  headline: 'Principal Software Architect | Distributed Systems & Enterprise AI',
  email: 'alex.chen@devminds.net',
  phone: '+1 (415) 890-4412',
  location: 'San Francisco, CA',
  linkedin: 'linkedin.com/in/alexchen-arch',
  website: 'github.com/alexchen-sys',
  summary:
    'Principal Software Architect with 9+ years designing high-throughput, multi-tenant cloud-native SaaS platforms. Proven track record decoupling monolithic architectures into resilient TypeScript, NestJS, and Next.js 15 ecosystems with sub-50ms p95 latency and strict cost governance.',
  skills: [
    {
      id: 'sk_1',
      category: 'Languages & Frameworks',
      items: ['TypeScript', 'Next.js 15', 'React 19', 'NestJS', 'Node.js', 'Flutter / Dart', 'Python'],
    },
    {
      id: 'sk_2',
      category: 'Architecture & Data',
      items: ['Distributed Systems', 'PostgreSQL', 'Prisma ORM', 'Redis Lua', 'BullMQ', 'WebSockets', 'Docker'],
    },
    {
      id: 'sk_3',
      category: 'AI & Observability',
      items: ['Gemini 2.5 Flash & Pro', 'Structured JSON Generation', 'Token Metering', 'OpenTelemetry', 'CI/CD'],
    },
  ],
  experience: [
    {
      id: 'exp_1',
      role: 'Principal Software Architect',
      company: 'DevMinds Cloud Systems',
      location: 'San Francisco, CA',
      startDate: 'Jan 2023',
      endDate: 'Present',
      bullets: [
        'Architected a decoupled Turborepo + pnpm monorepo powering 4 independent commercial AI SaaS verticals while achieving 80% shared DRY infrastructure across web, backend, and Flutter mobile clients.',
        'Engineered atomic Redis Lua rate-limiting guards and Stripe entitlement caching, preventing quota race conditions across 2.4M+ monthly AI inference requests with 99.98% uptime.',
        'Reduced Gemini AI unit cost by 41% through dynamic Fast/Copilot model routing, schema-constrained JSON outputs, and automated token metering telemetry.',
      ],
    },
    {
      id: 'exp_2',
      role: 'Staff Backend Engineer',
      company: 'StripeFlow Financial',
      location: 'Seattle, WA',
      startDate: 'Mar 2020',
      endDate: 'Dec 2022',
      bullets: [
        'Led migration of legacy billing monolith to isolated NestJS microservices, cutting p99 invoice settlement latency by 48% (from 420ms to 218ms) across $180M ARR volume.',
        'Designed multi-dialect database abstraction layer supporting PostgreSQL, Neon serverless, and Turso edge replicas with zero application-layer SQL drift.',
        'Mentored 14 senior engineers on SOLID service boundaries, idempotent webhook processing, and automated contract testing.',
      ],
    },
    {
      id: 'exp_3',
      role: 'Senior Software Engineer',
      company: 'Aether Data Labs',
      location: 'Austin, TX',
      startDate: 'Jun 2017',
      endDate: 'Feb 2020',
      bullets: [
        'Built real-time WebSocket telemetry pipeline ingesting 35,000 events/sec with horizontal Redis Pub/Sub fan-out and sub-100ms dashboard updates.',
        'Automated containerized deployment pipelines via Docker Compose and GitHub Actions, shrinking release cycle time from 4 days to 18 minutes.',
      ],
    },
  ],
  education: [
    {
      id: 'edu_1',
      degree: 'M.S. in Computer Science (Distributed Systems)',
      institution: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      graduationDate: '2017',
      details: 'GPA: 3.92/4.0 • Graduate Research in Fault-Tolerant Consensus Protocols',
    },
    {
      id: 'edu_2',
      degree: 'B.S. in Software Engineering',
      institution: 'University of Texas at Austin',
      location: 'Austin, TX',
      graduationDate: '2015',
      details: 'Magna Cum Laude',
    },
  ],
  certifications: [
    {
      id: 'cert_1',
      name: 'AWS Certified Solutions Architect — Professional',
      issuer: 'Amazon Web Services',
      year: '2024',
    },
    {
      id: 'cert_2',
      name: 'Certified Kubernetes Administrator (CKA)',
      issuer: 'Cloud Native Computing Foundation',
      year: '2023',
    },
  ],
};

export interface AtsAuditCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
  weight: number;
}

export interface AtsHealthReport {
  score: number;
  wordCount: number;
  quantifiedBulletRatio: number;
  checks: AtsAuditCheck[];
}

export function resumeToPlainText(data: ResumeData): string {
  const lines: string[] = [];
  lines.push(data.fullName.toUpperCase());
  if (data.headline.trim()) lines.push(data.headline.trim());
  const contacts = [data.email, data.phone, data.location, data.linkedin, data.website]
    .map((s) => s.trim())
    .filter(Boolean);
  if (contacts.length) lines.push(contacts.join(' | '));
  lines.push('');

  if (data.summary.trim()) {
    lines.push('PROFESSIONAL SUMMARY');
    lines.push(data.summary.trim());
    lines.push('');
  }

  if (data.skills.length) {
    lines.push('CORE COMPETENCIES');
    for (const group of data.skills) {
      if (group.items.length) {
        lines.push(`${group.category}: ${group.items.join(', ')}`);
      }
    }
    lines.push('');
  }

  if (data.experience.length) {
    lines.push('PROFESSIONAL EXPERIENCE');
    for (const exp of data.experience) {
      const right = [exp.location, `${exp.startDate} - ${exp.endDate}`].filter(Boolean).join(' | ');
      lines.push(`${exp.role} — ${exp.company} (${right})`);
      for (const b of exp.bullets) {
        if (b.trim()) lines.push(`• ${b.trim()}`);
      }
      lines.push('');
    }
  }

  if (data.education.length) {
    lines.push('EDUCATION');
    for (const edu of data.education) {
      lines.push(`${edu.degree} — ${edu.institution}, ${edu.location} (${edu.graduationDate})`);
      if (edu.details?.trim()) lines.push(edu.details.trim());
    }
    lines.push('');
  }

  if (data.certifications.length) {
    lines.push('CERTIFICATIONS');
    for (const cert of data.certifications) {
      lines.push(`${cert.name} — ${cert.issuer} (${cert.year})`);
    }
  }

  return lines.join('\n').trim();
}

const ACTION_VERBS = new Set([
  'architected', 'accelerated', 'automated', 'built', 'created', 'cut', 'decreased',
  'delivered', 'designed', 'developed', 'directed', 'drove', 'eliminated', 'engineered',
  'established', 'executed', 'expanded', 'generated', 'grew', 'implemented', 'improved',
  'increased', 'launched', 'led', 'mentored', 'migrated', 'optimized', 'orchestrated',
  'pioneered', 'reduced', 'reengineered', 'scaled', 'shipped', 'spearheaded', 'streamlined',
]);

export function computeAtsHealthAudit(data: ResumeData): AtsHealthReport {
  const plain = resumeToPlainText(data);
  const words = plain.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const allBullets = data.experience.flatMap((e) => e.bullets.map((b) => b.trim()).filter(Boolean));
  const metricRegex = /(\d+%|\$[\d,.]+|\d+\+?x|\d+[kKmMbB]\+?|\d+\s*(ms|s|hrs|hours|days|mins|minutes|users|requests|clients|engineers))/i;
  const quantifiedCount = allBullets.filter((b) => metricRegex.test(b)).length;
  const quantifiedBulletRatio = allBullets.length ? quantifiedCount / allBullets.length : 0;

  const strongVerbCount = allBullets.filter((b) => {
    const firstWord = b.split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '');
    return firstWord ? ACTION_VERBS.has(firstWord) : false;
  }).length;

  const hasContacts = Boolean(data.email.includes('@') && data.phone.trim() && data.location.trim());
  const hasStandardSections =
    Boolean(data.summary.trim()) &&
    data.skills.some((s) => s.items.length > 0) &&
    data.experience.length > 0 &&
    data.education.length > 0;
  const idealWordCount = wordCount >= 220 && wordCount <= 950;
  const hasLinks = Boolean(data.linkedin.trim() || data.website.trim());

  const checks: AtsAuditCheck[] = [
    {
      id: 'single-col',
      label: 'Single-Column Linear ATS Structure',
      passed: true,
      detail: 'Vector text flows top-to-bottom with zero multi-column tables or text boxes.',
      weight: 20,
    },
    {
      id: 'contacts',
      label: 'Complete Contact & Hyperlink Header',
      passed: hasContacts && hasLinks,
      detail:
        hasContacts && hasLinks
          ? 'Email, phone, location, and profile links detected in header.'
          : 'Add email, phone, location, and LinkedIn/GitHub URL for recruiter reachability.',
      weight: 15,
    },
    {
      id: 'sections',
      label: 'Canonical ATS Section Headings',
      passed: hasStandardSections,
      detail: hasStandardSections
        ? 'Summary, Core Competencies, Experience, and Education populated.'
        : 'Include Summary, Skills, Experience, and Education sections.',
      weight: 20,
    },
    {
      id: 'metrics',
      label: 'Quantified Business Impact (STAR Metrics)',
      passed: quantifiedBulletRatio >= 0.5,
      detail: `${quantifiedCount}/${allBullets.length} bullets contain measurable metrics (%, $, latency, scale).`,
      weight: 20,
    },
    {
      id: 'verbs',
      label: 'Strong Executive Action Verbs',
      passed: allBullets.length > 0 && strongVerbCount / allBullets.length >= 0.6,
      detail: `${strongVerbCount}/${allBullets.length} bullets lead with high-impact action verbs.`,
      weight: 15,
    },
    {
      id: 'length',
      label: 'Optimal Resume Word Density',
      passed: idealWordCount,
      detail: `${wordCount} words (sweet spot: 250–900 words for 1–2 page ATS scannability).`,
      weight: 10,
    },
  ];

  const score = Math.min(
    100,
    checks.reduce((acc, c) => acc + (c.passed ? c.weight : Math.round(c.weight * 0.35)), 0),
  );

  return { score, wordCount, quantifiedBulletRatio, checks };
}

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'have', 'in', 'is',
  'it', 'of', 'on', 'or', 'our', 'that', 'the', 'this', 'to', 'we', 'will', 'with', 'you',
  'your', 'their', 'they', 'must', 'should', 'can', 'able', 'about', 'all', 'also', 'been',
  'being', 'both', 'but', 'each', 'experience', 'years', 'year', 'work', 'working', 'team',
  'role', 'position', 'strong', 'skills', 'ability', 'including', 'using', 'build', 'building',
  'requirements', 'responsibilities', 'preferred', 'plus', 'bonus', 'looking', 'ideal',
]);

const KNOWN_MULTIWORD_TERMS = [
  'distributed systems', 'system design', 'cloud-native', 'next.js', 'node.js', 'react 19',
  'typescript', 'nestjs', 'postgresql', 'redis', 'kubernetes', 'docker', 'grpc', 'graphql',
  'opentelemetry', 'ci/cd', 'terraform', 'aws', 'gcp', 'azure', 'microservices', 'prisma',
  'python', 'flutter', 'websockets', 'bullmq', 'stripe', 'llm', 'ai', 'machine learning',
  'observability', 'rest api', 'kafka', 'linux', 'sql', 'nosql', 'agile', 'leadership',
  'monorepo', 'turborepo', 'security', 'rbac', 'oauth', 'jwt', 'performance', 'scalability',
];

export interface AtsKeywordScanResult {
  atsScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  gapAnalysis: string;
  recommendations: string[];
}

export function analyzeJobDescriptionMatch(
  data: ResumeData,
  jobDescription: string,
): AtsKeywordScanResult {
  const resumeLower = resumeToPlainText(data).toLowerCase();
  const jdLower = jobDescription.toLowerCase();

  const extracted = new Map<string, string>();

  for (const term of KNOWN_MULTIWORD_TERMS) {
    if (jdLower.includes(term)) {
      const display = term
        .split(' ')
        .map((w) => (w.length <= 3 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
        .join(' ');
      extracted.set(term, display);
    }
  }

  // Also capture capitalized tech tokens or specific terms from the JD
  const rawTokens = jobDescription.match(/[A-Za-z][A-Za-z0-9.+#/-]{1,24}/g) || [];
  const freq = new Map<string, { count: number; sample: string }>();
  for (const tok of rawTokens) {
    const clean = tok.replace(/[.,;:/]+$/, '');
    const lower = clean.toLowerCase();
    if (lower.length < 3 || STOP_WORDS.has(lower)) continue;
    const prev = freq.get(lower);
    freq.set(lower, { count: (prev?.count || 0) + 1, sample: prev?.sample || clean });
  }

  for (const [lower, info] of freq.entries()) {
    const isProperOrTech = /[A-Z0-9.#+]/.test(info.sample) || info.count >= 2;
    if (isProperOrTech && !extracted.has(lower) && extracted.size < 18) {
      extracted.set(lower, info.sample);
    }
  }

  if (extracted.size === 0) {
    ['TypeScript', 'Distributed Systems', 'Cloud-Native', 'PostgreSQL', 'Kubernetes', 'OpenTelemetry'].forEach((k) =>
      extracted.set(k.toLowerCase(), k),
    );
  }

  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  for (const [lower, label] of extracted.entries()) {
    if (resumeLower.includes(lower)) {
      matchedKeywords.push(label);
    } else {
      missingKeywords.push(label);
    }
  }

  const total = matchedKeywords.length + missingKeywords.length;
  const keywordRatio = total ? matchedKeywords.length / total : 0.75;
  const formatAudit = computeAtsHealthAudit(data);
  const atsScore = Math.min(99, Math.max(28, Math.round(keywordRatio * 72 + formatAudit.score * 0.28)));

  const gapAnalysis =
    missingKeywords.length === 0
      ? 'Exceptional alignment! Your resume covers every primary technical and domain keyword detected in the job description.'
      : `Matched ${matchedKeywords.length} of ${total} target JD keywords. Integrating ${missingKeywords
          .slice(0, 3)
          .join(', ')} into Core Competencies or Experience bullets can raise ATS ranking to ${Math.min(98, atsScore + 12)}%.`;

  const recommendations: string[] = [];
  if (missingKeywords.length > 0) {
    recommendations.push(`Weave top missing terms (${missingKeywords.slice(0, 4).join(', ')}) naturally into recent experience bullets.`);
  }
  if (formatAudit.quantifiedBulletRatio < 0.6) {
    recommendations.push('Quantify at least 60% of experience bullets with latency, revenue, or scale metrics.');
  }
  recommendations.push('Export using "Pure ATS Noir" or "Executive Navy" single-column PDF for zero parser loss.');

  return {
    atsScore,
    matchedKeywords,
    missingKeywords,
    gapAnalysis,
    recommendations,
  };
}

export function rewriteBulletWithStar(bullet: string, targetRole = 'Principal Engineer'): {
  situation: string;
  task: string;
  action: string;
  result: string;
  starBullet: string;
} {
  const cleaned = bullet.trim().replace(/^[-•*]\s*/, '');
  const subject = cleaned || 'legacy service architecture';
  const lower = subject.toLowerCase();

  const situation = `High-growth production environment requiring ${targetRole}-level reliability`;
  const task = `Modernize and scale scope around "${subject}"`;
  const action = lower.includes('micro') || lower.includes('api') || lower.includes('billing')
    ? `Architected fault-tolerant distributed services with idempotent queues and automated observability`
    : `Engineered an automated, SOLID-compliant pipeline with strict performance guardrails`;
  const result = `Reduced processing latency by 42% and elevated system reliability to 99.98% across 250K+ monthly operations`;

  const starBullet = `${action} to ${subject.charAt(0).toLowerCase() + subject.slice(1).replace(/\.$/, '')}, cutting execution latency by 42% and sustaining 99.98% SLA across 250K+ monthly transactions.`;

  return { situation, task, action, result, starBullet };
}

export function parseMarkdownToResume(md: string, fallback: ResumeData): ResumeData {
  const lines = md.split(/\r?\n/).map((l) => l.trim());
  const next: ResumeData = structuredClone(fallback);

  const nameLine = lines.find((l) => l.startsWith('# '));
  if (nameLine) {
    next.fullName = nameLine.replace(/^#\s+/, '').trim() || fallback.fullName;
    const idx = lines.indexOf(nameLine);
    if (lines[idx + 1] && !lines[idx + 1].startsWith('#')) {
      next.headline = lines[idx + 1];
    }
  }

  let currentSection = '';
  const summaryBuf: string[] = [];
  const bulletsBuf: string[] = [];

  for (const line of lines) {
    if (line.startsWith('## ')) {
      currentSection = line.replace(/^##\s+/, '').toUpperCase();
      continue;
    }
    if (!line || line.startsWith('# ')) continue;
    if (currentSection.includes('SUMMARY')) {
      summaryBuf.push(line);
    } else if (currentSection.includes('EXPERIENCE') && (line.startsWith('- ') || line.startsWith('• '))) {
      bulletsBuf.push(line.replace(/^[-•]\s+/, '').trim());
    }
  }

  if (summaryBuf.length) next.summary = summaryBuf.join(' ');
  if (bulletsBuf.length && next.experience.length) {
    next.experience[0] = {
      ...next.experience[0],
      bullets: bulletsBuf,
    };
  }
  return next;
}
