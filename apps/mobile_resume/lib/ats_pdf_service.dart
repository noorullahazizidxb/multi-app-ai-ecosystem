import 'dart:typed_data';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;

class MobileResumeData {
  String fullName;
  String headline;
  String email;
  String phone;
  String location;
  String linkedin;
  String summary;
  String skillsCsv;
  String roleTitle;
  String company;
  String duration;
  List<String> bullets;
  String degree;
  String university;
  String gradYear;

  MobileResumeData({
    required this.fullName,
    required this.headline,
    required this.email,
    required this.phone,
    required this.location,
    required this.linkedin,
    required this.summary,
    required this.skillsCsv,
    required this.roleTitle,
    required this.company,
    required this.duration,
    required this.bullets,
    required this.degree,
    required this.university,
    required this.gradYear,
  });

  String toPlainText() {
    return [
      fullName,
      headline,
      '$email | $phone | $location | $linkedin',
      summary,
      skillsCsv,
      '$roleTitle $company $duration',
      ...bullets,
      '$degree $university $gradYear',
    ].join(' ');
  }
}

class AtsPdfService {
  /// Builds an Elite, single-column, 100% ATS-parsable vector PDF resume.
  static Future<Uint8List> buildEliteAtsPdf({
    required MobileResumeData data,
    required String templateId,
    required bool isA4,
  }) async {
    final doc = pw.Document(
      title: '${data.fullName} - Resume',
      author: data.fullName,
      subject: data.headline,
      creator: 'CareerForge AI Mobile — Elite ATS PDF Engine',
    );

    final isClassic = templateId == 'wall-street-classic';
    final isCompact = templateId == 'principal-minimal';

    final regularFont = isClassic ? pw.Font.times() : pw.Font.helvetica();
    final boldFont = isClassic ? pw.Font.timesBold() : pw.Font.helveticaBold();
    final italicFont = isClassic ? pw.Font.timesItalic() : pw.Font.helveticaOblique();

    final accentColor = isClassic
        ? PdfColor.fromInt(0xFF111827)
        : PdfColor.fromInt(0xFF1E3A5F);
    final inkPrimary = PdfColor.fromInt(0xFF111827);
    final inkBody = PdfColor.fromInt(0xFF374151);
    final inkMuted = PdfColor.fromInt(0xFF6B7280);

    final pageFormat = isA4 ? PdfPageFormat.a4 : PdfPageFormat.letter;
    final bodySize = isCompact ? 9.2 : 9.8;

    pw.Widget sectionHeader(String title) {
      return pw.Padding(
        padding: pw.EdgeInsets.only(top: isCompact ? 10 : 13, bottom: 5),
        child: pw.Column(
          crossAxisAlignment: isClassic
              ? pw.CrossAxisAlignment.center
              : pw.CrossAxisAlignment.start,
          children: [
            pw.Text(
              title.toUpperCase(),
              style: pw.TextStyle(
                font: boldFont,
                fontSize: 10,
                color: accentColor,
                letterSpacing: 0.8,
              ),
            ),
            pw.SizedBox(height: 2.5),
            pw.Container(height: 0.9, color: accentColor),
          ],
        ),
      );
    }

    doc.addPage(
      pw.MultiPage(
        pageFormat: pageFormat,
        margin: pw.EdgeInsets.all(isCompact ? 38 : 44),
        build: (context) => [
          // Single-Column Candidate Header
          pw.Column(
            crossAxisAlignment: isClassic
                ? pw.CrossAxisAlignment.center
                : pw.CrossAxisAlignment.start,
            children: [
              pw.Text(
                isClassic ? data.fullName.toUpperCase() : data.fullName,
                style: pw.TextStyle(
                  font: boldFont,
                  fontSize: 21,
                  color: inkPrimary,
                ),
              ),
              pw.SizedBox(height: 2),
              pw.Text(
                data.headline,
                style: pw.TextStyle(
                  font: isClassic ? italicFont : boldFont,
                  fontSize: 10.5,
                  color: accentColor,
                ),
              ),
              pw.SizedBox(height: 4),
              pw.Text(
                [data.email, data.phone, data.location, data.linkedin]
                    .where((s) => s.trim().isNotEmpty)
                    .join('  |  '),
                style: pw.TextStyle(
                  font: regularFont,
                  fontSize: 8.8,
                  color: inkMuted,
                ),
              ),
              pw.SizedBox(height: 6),
              pw.Container(height: 1.3, color: accentColor),
            ],
          ),

          // Professional Summary
          if (data.summary.trim().isNotEmpty) ...[
            sectionHeader('Professional Summary'),
            pw.Text(
              data.summary.trim(),
              style: pw.TextStyle(
                font: regularFont,
                fontSize: bodySize,
                lineSpacing: 3,
                color: inkBody,
              ),
            ),
          ],

          // Core Competencies
          if (data.skillsCsv.trim().isNotEmpty) ...[
            sectionHeader('Core Competencies & Technical Skills'),
            pw.Text(
              data.skillsCsv.trim(),
              style: pw.TextStyle(
                font: regularFont,
                fontSize: bodySize,
                lineSpacing: 2.5,
                color: inkBody,
              ),
            ),
          ],

          // Experience
          sectionHeader('Professional Experience'),
          pw.Row(
            mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
            crossAxisAlignment: pw.CrossAxisAlignment.end,
            children: [
              pw.Expanded(
                child: pw.RichText(
                  text: pw.TextSpan(
                    children: [
                      pw.TextSpan(
                        text: data.roleTitle,
                        style: pw.TextStyle(
                          font: boldFont,
                          fontSize: bodySize + 0.5,
                          color: inkPrimary,
                        ),
                      ),
                      pw.TextSpan(
                        text: '  —  ${data.company}',
                        style: pw.TextStyle(
                          font: italicFont,
                          fontSize: bodySize + 0.2,
                          color: inkBody,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              pw.Text(
                data.duration,
                style: pw.TextStyle(
                  font: regularFont,
                  fontSize: bodySize - 0.4,
                  color: inkMuted,
                ),
              ),
            ],
          ),
          pw.SizedBox(height: 4),
          ...data.bullets.where((b) => b.trim().isNotEmpty).map(
                (bullet) => pw.Padding(
                  padding: const pw.EdgeInsets.only(bottom: 3.5),
                  child: pw.Row(
                    crossAxisAlignment: pw.CrossAxisAlignment.start,
                    children: [
                      pw.SizedBox(
                        width: 11,
                        child: pw.Text(
                          '•',
                          style: pw.TextStyle(
                            font: boldFont,
                            fontSize: bodySize,
                            color: accentColor,
                          ),
                        ),
                      ),
                      pw.Expanded(
                        child: pw.Text(
                          bullet.trim(),
                          style: pw.TextStyle(
                            font: regularFont,
                            fontSize: bodySize,
                            lineSpacing: 2.5,
                            color: inkBody,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

          // Education
          sectionHeader('Education'),
          pw.Row(
            mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
            children: [
              pw.Expanded(
                child: pw.Text(
                  '${data.degree}  —  ${data.university}',
                  style: pw.TextStyle(
                    font: boldFont,
                    fontSize: bodySize,
                    color: inkPrimary,
                  ),
                ),
              ),
              pw.Text(
                data.gradYear,
                style: pw.TextStyle(
                  font: regularFont,
                  fontSize: bodySize - 0.4,
                  color: inkMuted,
                ),
              ),
            ],
          ),
        ],
      ),
    );

    return Uint8List.fromList(await doc.save());
  }
}
