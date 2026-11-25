import { PDFDocument, StandardFonts, rgb, PDFName, PDFString, type PDFFont, type PDFPage } from 'pdf-lib';
import {
  RESUME_ACCENTS,
  type ResumeAccentId,
  type ResumeData,
  type ResumePaperSize,
  type ResumeTemplateId,
} from './resume-types';

const PAGE_DIMENSIONS: Record<ResumePaperSize, [number, number]> = {
  A4: [595.28, 841.89],
  LETTER: [612, 792],
};

/**
 * Standard PDF Type1 fonts use WinAnsi (Windows-1252) encoding.
 * Normalize any unsupported Unicode glyphs cleanly so text extraction and encoding never fail.
 */
function sanitizeWinAnsi(input: string): string {
  return input
    .replace(/\u2018|\u2019/g, "'")
    .replace(/\u201C|\u201D/g, '"')
    .replace(/\u2026/g, '...')
    .replace(/\u2192/g, '->')
    .replace(/\u2265/g, '>=')
    .replace(/\u2264/g, '<=')
    .replace(/[\u{1F000}-\u{1FFFF}]/gu, '')
    .replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF\u2013\u2014\u2022]/g, '');
}

function wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number): string[] {
  const clean = sanitizeWinAnsi(text).trim();
  if (!clean) return [];

  const paragraphs = clean.split(/\r?\n/);
  const lines: string[] = [];

  for (const para of paragraphs) {
    const words = para.split(/\s+/).filter(Boolean);
    if (words.length === 0) continue;
    let current = words[0];

    for (let i = 1; i < words.length; i++) {
      const candidate = `${current} ${words[i]}`;
      if (font.widthOfTextAtSize(candidate, fontSize) <= maxWidth) {
        current = candidate;
      } else {
        lines.push(current);
        current = words[i];
      }
    }
    lines.push(current);
  }
  return lines;
}

function addUriAnnotation(
  doc: PDFDocument,
  page: PDFPage,
  x: number,
  y: number,
  width: number,
  height: number,
  uri: string,
) {
  const normalizedUri = uri.startsWith('http://') || uri.startsWith('https://') || uri.startsWith('mailto:')
    ? uri
    : `https://${uri}`;

  const linkAnnotation = doc.context.obj({
    Type: 'Annot',
    Subtype: 'Link',
    Rect: [x, y - 2, x + width, y + height + 2],
    Border: [0, 0, 0],
    A: {
      Type: 'Action',
      S: 'URI',
      URI: PDFString.of(normalizedUri),
    },
  });

  const annots = page.node.Annots();
  if (annots) {
    annots.push(doc.context.register(linkAnnotation));
  } else {
    page.node.set(PDFName.of('Annots'), doc.context.obj([doc.context.register(linkAnnotation)]));
  }
}

export interface ExportResumePdfOptions {
  data: ResumeData;
  template: ResumeTemplateId;
  paperSize: ResumePaperSize;
  accent: ResumeAccentId;
}

/**
 * Generates an Elite, single-column, 100% ATS-parsable vector PDF resume.
 * Zero raster images, zero multi-column layout traps, real selectable text in logical reading order.
 */
export async function generateEliteAtsResumePdf({
  data,
  template,
  paperSize,
  accent,
}: ExportResumePdfOptions): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const [pageWidth, pageHeight] = PAGE_DIMENSIONS[paperSize];
  const isClassic = template === 'wall-street-classic';
  const isCompact = template === 'principal-minimal';

  const regularFont = await doc.embedFont(isClassic ? StandardFonts.TimesRoman : StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(isClassic ? StandardFonts.TimesRomanBold : StandardFonts.HelveticaBold);
  const italicFont = await doc.embedFont(isClassic ? StandardFonts.TimesRomanItalic : StandardFonts.HelveticaOblique);

  const accentSpec = RESUME_ACCENTS[accent] || RESUME_ACCENTS['executive-navy'];
  const accentColor = rgb(accentSpec.rgb[0], accentSpec.rgb[1], accentSpec.rgb[2]);
  const inkPrimary = rgb(0.08, 0.1, 0.14);
  const inkSecondary = rgb(0.24, 0.28, 0.34);
  const inkMuted = rgb(0.42, 0.46, 0.52);
  const ruleLight = rgb(0.82, 0.85, 0.89);

  // Document metadata for ATS & recruiter tools
  const allKeywords = data.skills.flatMap((s) => s.items).slice(0, 30);
  doc.setTitle(`${sanitizeWinAnsi(data.fullName)} - Resume`);
  doc.setAuthor(sanitizeWinAnsi(data.fullName));
  doc.setSubject(sanitizeWinAnsi(data.headline || 'Professional Resume'));
  doc.setKeywords(allKeywords.map(sanitizeWinAnsi));
  doc.setCreator('CareerForge AI — Elite ATS Resume Builder');
  doc.setProducer('pdf-lib Vector ATS Engine');

  const marginX = isCompact ? 40 : 46;
  const marginTop = isCompact ? 38 : 44;
  const marginBottom = isCompact ? 38 : 44;
  const contentWidth = pageWidth - marginX * 2;

  const bodySize = isCompact ? 9.2 : 9.7;
  const bodyLeading = isCompact ? 12.8 : 13.8;
  const sectionGap = isCompact ? 11 : 14;

  let page = doc.addPage([pageWidth, pageHeight]);
  let pageNumber = 1;
  let cursorY = pageHeight - marginTop;

  const startNewPage = () => {
    page = doc.addPage([pageWidth, pageHeight]);
    pageNumber += 1;
    cursorY = pageHeight - marginTop;

    // Subtle continuation header
    const contLabel = sanitizeWinAnsi(`${data.fullName}  |  Page ${pageNumber}`);
    page.drawText(contLabel, {
      x: marginX,
      y: cursorY + 12,
      size: 8,
      font: italicFont,
      color: inkMuted,
    });
    page.drawLine({
      start: { x: marginX, y: cursorY + 6 },
      end: { x: pageWidth - marginX, y: cursorY + 6 },
      thickness: 0.4,
      color: ruleLight,
    });
    cursorY -= 10;
  };

  const ensureSpace = (neededHeight: number) => {
    if (cursorY - neededHeight < marginBottom) {
      startNewPage();
    }
  };

  const drawSectionHeader = (title: string) => {
    ensureSpace(34);
    cursorY -= sectionGap;
    const upper = sanitizeWinAnsi(title.toUpperCase());

    if (isClassic) {
      const w = boldFont.widthOfTextAtSize(upper, 10.5);
      page.drawText(upper, {
        x: (pageWidth - w) / 2,
        y: cursorY,
        size: 10.5,
        font: boldFont,
        color: accentColor,
      });
      cursorY -= 5;
      page.drawLine({
        start: { x: marginX, y: cursorY },
        end: { x: pageWidth - marginX, y: cursorY },
        thickness: 0.75,
        color: accentColor,
      });
      cursorY -= 13;
    } else {
      page.drawText(upper, {
        x: marginX,
        y: cursorY,
        size: 10,
        font: boldFont,
        color: accentColor,
      });
      cursorY -= 4.5;
      page.drawLine({
        start: { x: marginX, y: cursorY },
        end: { x: pageWidth - marginX, y: cursorY },
        thickness: 0.9,
        color: accentColor,
      });
      cursorY -= 12.5;
    }
  };

  // ==================== HEADER BLOCK ====================
  const nameText = sanitizeWinAnsi(data.fullName || 'Candidate Name');
  const nameSize = isClassic ? 21 : 22;

  if (isClassic) {
    const nameWidth = boldFont.widthOfTextAtSize(nameText.toUpperCase(), nameSize);
    page.drawText(nameText.toUpperCase(), {
      x: (pageWidth - nameWidth) / 2,
      y: cursorY,
      size: nameSize,
      font: boldFont,
      color: inkPrimary,
    });
    cursorY -= 16;
  } else {
    page.drawText(nameText, {
      x: marginX,
      y: cursorY,
      size: nameSize,
      font: boldFont,
      color: inkPrimary,
    });
    cursorY -= 15;
  }

  if (data.headline.trim()) {
    const headlineText = sanitizeWinAnsi(data.headline.trim());
    const headlineSize = 10.5;
    if (isClassic) {
      const hw = italicFont.widthOfTextAtSize(headlineText, headlineSize);
      page.drawText(headlineText, {
        x: Math.max(marginX, (pageWidth - hw) / 2),
        y: cursorY,
        size: headlineSize,
        font: italicFont,
        color: accentColor,
      });
    } else {
      page.drawText(headlineText, {
        x: marginX,
        y: cursorY,
        size: headlineSize,
        font: boldFont,
        color: accentColor,
      });
    }
    cursorY -= 14;
  }

  // Contact bar with clickable URI link annotations
  const contactItems: Array<{ label: string; uri?: string }> = [];
  if (data.email.trim()) contactItems.push({ label: sanitizeWinAnsi(data.email.trim()), uri: `mailto:${data.email.trim()}` });
  if (data.phone.trim()) contactItems.push({ label: sanitizeWinAnsi(data.phone.trim()) });
  if (data.location.trim()) contactItems.push({ label: sanitizeWinAnsi(data.location.trim()) });
  if (data.linkedin.trim()) contactItems.push({ label: sanitizeWinAnsi(data.linkedin.trim()), uri: data.linkedin.trim() });
  if (data.website.trim()) contactItems.push({ label: sanitizeWinAnsi(data.website.trim()), uri: data.website.trim() });

  const contactFontSize = 8.8;
  const separator = '  |  ';
  const sepWidth = regularFont.widthOfTextAtSize(separator, contactFontSize);

  const totalContactWidth = contactItems.reduce(
    (sum, item, idx) =>
      sum + regularFont.widthOfTextAtSize(item.label, contactFontSize) + (idx > 0 ? sepWidth : 0),
    0,
  );

  let contactX = isClassic ? Math.max(marginX, (pageWidth - totalContactWidth) / 2) : marginX;
  for (let i = 0; i < contactItems.length; i++) {
    const item = contactItems[i];
    if (i > 0) {
      const nextWidth = regularFont.widthOfTextAtSize(item.label, contactFontSize) + sepWidth;
      if (contactX + nextWidth > pageWidth - marginX) {
        cursorY -= 12;
        contactX = marginX;
      } else {
        page.drawText(separator, {
          x: contactX,
          y: cursorY,
          size: contactFontSize,
          font: regularFont,
          color: inkMuted,
        });
        contactX += sepWidth;
      }
    }
    const itemWidth = regularFont.widthOfTextAtSize(item.label, contactFontSize);
    page.drawText(item.label, {
      x: contactX,
      y: cursorY,
      size: contactFontSize,
      font: regularFont,
      color: item.uri ? accentColor : inkSecondary,
    });
    if (item.uri) {
      addUriAnnotation(doc, page, contactX, cursorY, itemWidth, contactFontSize, item.uri);
    }
    contactX += itemWidth;
  }

  cursorY -= 9;
  page.drawLine({
    start: { x: marginX, y: cursorY },
    end: { x: pageWidth - marginX, y: cursorY },
    thickness: isClassic ? 0.5 : 1.4,
    color: isClassic ? ruleLight : accentColor,
  });
  cursorY -= 4;

  // ==================== PROFESSIONAL SUMMARY ====================
  if (data.summary.trim()) {
    drawSectionHeader('Professional Summary');
    const summaryLines = wrapText(data.summary, regularFont, bodySize, contentWidth);
    for (const line of summaryLines) {
      ensureSpace(bodyLeading);
      page.drawText(line, {
        x: marginX,
        y: cursorY,
        size: bodySize,
        font: regularFont,
        color: inkSecondary,
      });
      cursorY -= bodyLeading;
    }
  }

  // ==================== CORE COMPETENCIES / SKILLS ====================
  const validSkills = data.skills.filter((g) => g.items.length > 0);
  if (validSkills.length > 0) {
    drawSectionHeader('Core Competencies & Technical Skills');
    for (const group of validSkills) {
      const catPrefix = sanitizeWinAnsi(`${group.category}: `);
      const itemsText = sanitizeWinAnsi(group.items.join(', '));
      const catWidth = boldFont.widthOfTextAtSize(catPrefix, bodySize);
      const fullLines = wrapText(`${catPrefix}${itemsText}`, regularFont, bodySize, contentWidth);

      for (let i = 0; i < fullLines.length; i++) {
        ensureSpace(bodyLeading);
        if (i === 0 && fullLines[0].startsWith(catPrefix)) {
          page.drawText(catPrefix, {
            x: marginX,
            y: cursorY,
            size: bodySize,
            font: boldFont,
            color: inkPrimary,
          });
          const remainder = fullLines[0].slice(catPrefix.length);
          page.drawText(remainder, {
            x: marginX + catWidth,
            y: cursorY,
            size: bodySize,
            font: regularFont,
            color: inkSecondary,
          });
        } else {
          page.drawText(fullLines[i], {
            x: marginX,
            y: cursorY,
            size: bodySize,
            font: regularFont,
            color: inkSecondary,
          });
        }
        cursorY -= bodyLeading;
      }
      cursorY -= 2;
    }
  }

  // ==================== PROFESSIONAL EXPERIENCE ====================
  if (data.experience.length > 0) {
    drawSectionHeader('Professional Experience');
    for (let idx = 0; idx < data.experience.length; idx++) {
      const exp = data.experience[idx];
      // Prevent orphaned job header at bottom of page
      ensureSpace(44);

      const roleText = sanitizeWinAnsi(exp.role);
      const companyText = sanitizeWinAnsi(exp.company ? `  —  ${exp.company}` : '');
      const dateText = sanitizeWinAnsi(
        [exp.location, `${exp.startDate} – ${exp.endDate}`].filter(Boolean).join('  |  '),
      );

      const dateWidth = regularFont.widthOfTextAtSize(dateText, bodySize - 0.3);
      page.drawText(roleText, {
        x: marginX,
        y: cursorY,
        size: bodySize + 0.6,
        font: boldFont,
        color: inkPrimary,
      });

      const roleWidth = boldFont.widthOfTextAtSize(roleText, bodySize + 0.6);
      const maxCompanyWidth = contentWidth - roleWidth - dateWidth - 16;
      if (companyText && maxCompanyWidth > 40) {
        page.drawText(companyText, {
          x: marginX + roleWidth,
          y: cursorY,
          size: bodySize + 0.3,
          font: italicFont,
          color: inkSecondary,
        });
      }

      page.drawText(dateText, {
        x: pageWidth - marginX - dateWidth,
        y: cursorY,
        size: bodySize - 0.3,
        font: regularFont,
        color: inkMuted,
      });

      cursorY -= bodyLeading + 1;

      // Bullets with crisp hanging indent
      const bulletSymbol = '•';
      const bulletIndent = 11;
      for (const rawBullet of exp.bullets) {
        if (!rawBullet.trim()) continue;
        const wrapped = wrapText(rawBullet, regularFont, bodySize, contentWidth - bulletIndent);
        for (let bIdx = 0; bIdx < wrapped.length; bIdx++) {
          ensureSpace(bodyLeading);
          if (bIdx === 0) {
            page.drawText(bulletSymbol, {
              x: marginX + 2,
              y: cursorY,
              size: bodySize,
              font: boldFont,
              color: accentColor,
            });
          }
          page.drawText(wrapped[bIdx], {
            x: marginX + bulletIndent,
            y: cursorY,
            size: bodySize,
            font: regularFont,
            color: inkSecondary,
          });
          cursorY -= bodyLeading;
        }
        cursorY -= 1.5;
      }

      if (idx < data.experience.length - 1) {
        cursorY -= isCompact ? 5 : 7;
      }
    }
  }

  // ==================== EDUCATION ====================
  if (data.education.length > 0) {
    drawSectionHeader('Education');
    for (const edu of data.education) {
      ensureSpace(30);
      const degText = sanitizeWinAnsi(edu.degree);
      const instText = sanitizeWinAnsi(`  —  ${edu.institution}`);
      const rightText = sanitizeWinAnsi([edu.location, edu.graduationDate].filter(Boolean).join('  |  '));

      const rightWidth = regularFont.widthOfTextAtSize(rightText, bodySize - 0.3);
      page.drawText(degText, {
        x: marginX,
        y: cursorY,
        size: bodySize + 0.3,
        font: boldFont,
        color: inkPrimary,
      });

      const degWidth = boldFont.widthOfTextAtSize(degText, bodySize + 0.3);
      if (degWidth + rightWidth + 30 < contentWidth) {
        page.drawText(instText, {
          x: marginX + degWidth,
          y: cursorY,
          size: bodySize,
          font: regularFont,
          color: inkSecondary,
        });
      }

      page.drawText(rightText, {
        x: pageWidth - marginX - rightWidth,
        y: cursorY,
        size: bodySize - 0.3,
        font: regularFont,
        color: inkMuted,
      });
      cursorY -= bodyLeading;

      if (edu.details?.trim()) {
        const detailLines = wrapText(edu.details, italicFont, bodySize - 0.4, contentWidth);
        for (const dl of detailLines) {
          ensureSpace(bodyLeading);
          page.drawText(dl, {
            x: marginX,
            y: cursorY,
            size: bodySize - 0.4,
            font: italicFont,
            color: inkMuted,
          });
          cursorY -= bodyLeading;
        }
      }
      cursorY -= 3;
    }
  }

  // ==================== CERTIFICATIONS ====================
  if (data.certifications.length > 0) {
    drawSectionHeader('Certifications & Credentials');
    for (const cert of data.certifications) {
      ensureSpace(bodyLeading + 4);
      const leftText = sanitizeWinAnsi(`${cert.name}  —  ${cert.issuer}`);
      const rightText = sanitizeWinAnsi(cert.year);
      const rw = regularFont.widthOfTextAtSize(rightText, bodySize - 0.3);

      page.drawText(leftText, {
        x: marginX,
        y: cursorY,
        size: bodySize,
        font: regularFont,
        color: inkSecondary,
      });
      page.drawText(rightText, {
        x: pageWidth - marginX - rw,
        y: cursorY,
        size: bodySize - 0.3,
        font: regularFont,
        color: inkMuted,
      });
      cursorY -= bodyLeading;
    }
  }

  return doc.save();
}

export async function generateCoverLetterPdf({
  data,
  companyName,
  targetRole,
  letterBody,
  paperSize,
  accent,
}: {
  data: ResumeData;
  companyName: string;
  targetRole: string;
  letterBody: string;
  paperSize: ResumePaperSize;
  accent: ResumeAccentId;
}): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const [pageWidth, pageHeight] = PAGE_DIMENSIONS[paperSize];
  const regularFont = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);
  const accentSpec = RESUME_ACCENTS[accent] || RESUME_ACCENTS['executive-navy'];
  const accentColor = rgb(accentSpec.rgb[0], accentSpec.rgb[1], accentSpec.rgb[2]);
  const inkPrimary = rgb(0.08, 0.1, 0.14);
  const inkSecondary = rgb(0.24, 0.28, 0.34);

  doc.setTitle(`${sanitizeWinAnsi(data.fullName)} - Cover Letter (${sanitizeWinAnsi(companyName)})`);
  doc.setAuthor(sanitizeWinAnsi(data.fullName));
  doc.setSubject(`Application for ${sanitizeWinAnsi(targetRole)} at ${sanitizeWinAnsi(companyName)}`);
  doc.setCreator('CareerForge AI — Autonomous Job Tailor');

  const page = doc.addPage([pageWidth, pageHeight]);
  const marginX = 52;
  let y = pageHeight - 52;
  const contentWidth = pageWidth - marginX * 2;

  page.drawText(sanitizeWinAnsi(data.fullName), {
    x: marginX,
    y,
    size: 20,
    font: boldFont,
    color: inkPrimary,
  });
  y -= 16;
  page.drawText(
    sanitizeWinAnsi([data.email, data.phone, data.location].filter(Boolean).join('  |  ')),
    { x: marginX, y, size: 9, font: regularFont, color: accentColor },
  );
  y -= 10;
  page.drawLine({
    start: { x: marginX, y },
    end: { x: pageWidth - marginX, y },
    thickness: 1.2,
    color: accentColor,
  });
  y -= 28;

  const paragraphs = sanitizeWinAnsi(letterBody).split(/\n\s*\n/);
  for (const para of paragraphs) {
    const lines = wrapText(para, regularFont, 10.5, contentWidth);
    for (const line of lines) {
      page.drawText(line, {
        x: marginX,
        y,
        size: 10.5,
        font: regularFont,
        color: inkSecondary,
      });
      y -= 15.5;
    }
    y -= 9;
  }

  return doc.save();
}

export function triggerPdfDownload(bytes: Uint8Array, filename: string) {
  const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
