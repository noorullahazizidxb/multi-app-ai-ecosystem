'use client';

import * as React from 'react';
import {
  RESUME_ACCENTS,
  resumeToPlainText,
  type ResumeAccentId,
  type ResumeData,
  type ResumePaperSize,
  type ResumeTemplateId,
} from '../lib/resume-types';

export interface ResumePaperPreviewProps {
  data: ResumeData;
  template: ResumeTemplateId;
  paperSize: ResumePaperSize;
  accent: ResumeAccentId;
  viewMode: 'visual' | 'ats-text';
}

export function ResumePaperPreview({
  data,
  template,
  paperSize,
  accent,
  viewMode,
}: ResumePaperPreviewProps) {
  const accentHex = RESUME_ACCENTS[accent]?.hex || '#1e3a5f';
  const isClassic = template === 'wall-street-classic';
  const isCompact = template === 'principal-minimal';

  if (viewMode === 'ats-text') {
    return (
      <div className="rounded-xl border border-border bg-neutral-950 text-emerald-300 p-5 font-mono text-[11px] leading-relaxed whitespace-pre-wrap shadow-inner max-h-[760px] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800 text-[10px] uppercase tracking-wider text-neutral-400">
          <span>ATS Raw Linear Text Stream (100% Machine-Readable)</span>
          <span>Single-Column UTF-8 / WinAnsi</span>
        </div>
        {resumeToPlainText(data)}
      </div>
    );
  }

  return (
    <div
      className={`bg-white text-neutral-900 rounded-lg border border-neutral-300 shadow-xl mx-auto transition-all overflow-hidden ${
        paperSize === 'A4' ? 'max-w-[660px]' : 'max-w-[680px]'
      }`}
      style={{
        fontFamily: isClassic
          ? 'Georgia, "Times New Roman", Times, serif'
          : 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      <div className={isCompact ? 'p-6 sm:p-8 text-[11.5px] leading-[1.42]' : 'p-7 sm:p-9 text-[12px] leading-[1.48]'}>
        {/* Candidate Header */}
        <header
          className={`pb-3 mb-4 border-b-2 ${isClassic ? 'text-center' : 'text-left'}`}
          style={{ borderColor: accentHex }}
        >
          <h2
            className={`font-bold tracking-tight text-neutral-950 ${
              isClassic ? 'text-2xl uppercase tracking-wide' : 'text-2xl'
            }`}
          >
            {data.fullName || 'Your Name'}
          </h2>
          {data.headline && (
            <p
              className={`mt-0.5 text-[13px] ${isClassic ? 'italic' : 'font-semibold'}`}
              style={{ color: accentHex }}
            >
              {data.headline}
            </p>
          )}
          <div
            className={`mt-1.5 flex flex-wrap gap-x-2.5 gap-y-1 text-[10.5px] text-neutral-600 ${
              isClassic ? 'justify-center' : 'justify-start'
            }`}
          >
            {[data.email, data.phone, data.location, data.linkedin, data.website]
              .map((v) => v.trim())
              .filter(Boolean)
              .map((item, idx, arr) => (
                <React.Fragment key={`${item}-${idx}`}>
                  <span className={item.includes('@') || item.includes('.') ? 'underline decoration-neutral-300' : ''}>
                    {item}
                  </span>
                  {idx < arr.length - 1 && <span className="text-neutral-400">|</span>}
                </React.Fragment>
              ))}
          </div>
        </header>

        {/* Summary */}
        {data.summary.trim() && (
          <section className={isCompact ? 'mb-3.5' : 'mb-4'}>
            <SectionHeading title="Professional Summary" accentHex={accentHex} isClassic={isClassic} />
            <p className="text-neutral-700">{data.summary}</p>
          </section>
        )}

        {/* Skills */}
        {data.skills.some((s) => s.items.length > 0) && (
          <section className={isCompact ? 'mb-3.5' : 'mb-4'}>
            <SectionHeading
              title="Core Competencies & Technical Skills"
              accentHex={accentHex}
              isClassic={isClassic}
            />
            <div className="space-y-1">
              {data.skills
                .filter((g) => g.items.length > 0)
                .map((group) => (
                  <p key={group.id} className="text-neutral-700">
                    <strong className="text-neutral-900">{group.category}: </strong>
                    <span>{group.items.join(', ')}</span>
                  </p>
                ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <section className={isCompact ? 'mb-3.5' : 'mb-4'}>
            <SectionHeading title="Professional Experience" accentHex={accentHex} isClassic={isClassic} />
            <div className={isCompact ? 'space-y-3' : 'space-y-4'}>
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <div>
                      <span className="font-bold text-neutral-950">{exp.role}</span>
                      {exp.company && <span className="italic text-neutral-700"> — {exp.company}</span>}
                    </div>
                    <span className="text-[10.5px] text-neutral-500 shrink-0">
                      {[exp.location, `${exp.startDate} – ${exp.endDate}`].filter(Boolean).join(' | ')}
                    </span>
                  </div>
                  <ul className="mt-1 space-y-1 pl-4 list-disc marker:text-neutral-500 text-neutral-700">
                    {exp.bullets.filter((b) => b.trim()).map((bullet, bIdx) => (
                      <li key={bIdx} className="pl-0.5">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <section className={isCompact ? 'mb-3.5' : 'mb-4'}>
            <SectionHeading title="Education" accentHex={accentHex} isClassic={isClassic} />
            <div className="space-y-2">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <div>
                      <span className="font-bold text-neutral-950">{edu.degree}</span>
                      <span className="text-neutral-700"> — {edu.institution}</span>
                    </div>
                    <span className="text-[10.5px] text-neutral-500 shrink-0">
                      {[edu.location, edu.graduationDate].filter(Boolean).join(' | ')}
                    </span>
                  </div>
                  {edu.details && <p className="text-[11px] italic text-neutral-600">{edu.details}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <section>
            <SectionHeading
              title="Certifications & Credentials"
              accentHex={accentHex}
              isClassic={isClassic}
            />
            <div className="space-y-1">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="flex items-baseline justify-between gap-3 text-neutral-700">
                  <span>
                    <strong className="text-neutral-900">{cert.name}</strong> — {cert.issuer}
                  </span>
                  <span className="text-[10.5px] text-neutral-500 shrink-0">{cert.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Paper Footer Strip */}
      <div className="px-7 py-2 bg-neutral-100 border-t border-neutral-200 flex items-center justify-between text-[10px] text-neutral-500">
        <span>{paperSize === 'A4' ? 'ISO A4 (210 × 297 mm)' : 'US Letter (8.5 × 11 in)'}</span>
        <span>Vector Single-Column • 100% ATS Parsable</span>
      </div>
    </div>
  );
}

function SectionHeading({
  title,
  accentHex,
  isClassic,
}: {
  title: string;
  accentHex: string;
  isClassic: boolean;
}) {
  return (
    <h3
      className={`text-[11px] font-bold uppercase tracking-wider pb-0.5 mb-2 border-b ${
        isClassic ? 'text-center' : 'text-left'
      }`}
      style={{ color: accentHex, borderColor: accentHex }}
    >
      {title}
    </h3>
  );
}
