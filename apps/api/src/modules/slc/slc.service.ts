import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import PDFDocument from "pdfkit";

export interface SlcData {
  // Student identifiers
  studentId: string;
  uidNumber: string;
  fullName: string;
  motherName: string;

  // Personal details
  nationality: string;
  motherTongue: string;
  religion: string;
  caste: string;
  subCaste: string;
  birthPlace: string;
  dateOfBirth: string;
  dateOfBirthInWords: string;

  // Academic details
  previousSchool: string;
  dateOfAdmission: string;
  admissionClass: string;
  educationalProgress: string;
  behaviour: string;
  dateOfLeaving: string;
  lastClass: string;
  periodOfLearning: string;
  reasonForLeaving: string;
  remark: string;
}

@Injectable()
export class SlcService {
  constructor(private readonly prisma: PrismaService) {}

  async getStudentSlcData(
    studentId: string,
    instituteId: string,
  ): Promise<{ student: any; institute: any }> {
    const student = await this.prisma.student.findFirst({
      where: { id: studentId, instituteId },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    const institute = await this.prisma.institute.findUnique({
      where: { id: instituteId },
    });

    if (!institute) {
      throw new NotFoundException("Institute not found");
    }

    return { student, institute };
  }

  async generateSlcPdf(slcData: SlcData, instituteId: string): Promise<Buffer> {
    const institute = await this.prisma.institute.findUnique({
      where: { id: instituteId },
    });

    if (!institute) {
      throw new NotFoundException("Institute not found");
    }

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: "A4",
        margins: { top: 40, bottom: 40, left: 50, right: 50 },
      });

      const chunks: Buffer[] = [];
      doc.on("data", (chunk: Buffer) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      const pageWidth = doc.page.width - 100; // 50 margin each side

      // ─── HEADER ───
      doc
        .fontSize(16)
        .font("Helvetica-Bold")
        .text(institute.name, { align: "center" });

      doc
        .fontSize(10)
        .font("Helvetica")
        .text(`School Code: ${institute.schoolCode || "—"}`, {
          align: "center",
        });

      doc.moveDown(0.5);
      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("SCHOOL LEAVING CERTIFICATE", { align: "center" });

      doc.moveDown(0.3);
      doc
        .moveTo(50, doc.y)
        .lineTo(50 + pageWidth, doc.y)
        .lineWidth(1.5)
        .stroke();

      doc.moveDown(1);

      // ─── SLC FIELDS ───
      const fields: [string, string][] = [
        ["1.  Student ID", slcData.studentId],
        ["2.  UID Number", slcData.uidNumber],
        ["3.  Full Name of Student", slcData.fullName],
        ["4.  Mother's Name", slcData.motherName],
        ["5.  Nationality", slcData.nationality],
        ["6.  Mother Tongue", slcData.motherTongue],
        ["7.  Religion", slcData.religion],
        ["8.  Caste", slcData.caste],
        ["9.  Sub-Caste", slcData.subCaste],
        ["10. Birth Place", slcData.birthPlace],
        ["11. Date of Birth (in digits)", slcData.dateOfBirth],
        ["12. Date of Birth (in words)", slcData.dateOfBirthInWords],
        ["13. Previous School/College and Class", slcData.previousSchool],
        [
          "14. Date of Admission and Class",
          `${slcData.dateOfAdmission}  |  Class: ${slcData.admissionClass}`,
        ],
        ["15. Educational Progress", slcData.educationalProgress],
        ["16. Behaviour", slcData.behaviour],
        ["17. Date of Leaving this School/College", slcData.dateOfLeaving],
        [
          "18. Last Class (Standard) and Period of Learning",
          `${slcData.lastClass}  |  Period: ${slcData.periodOfLearning}`,
        ],
        ["19. Reason for Leaving the School/College", slcData.reasonForLeaving],
        ["20. Remark", slcData.remark],
      ];

      const labelWidth = 250;
      const valueWidth = pageWidth - labelWidth - 20;

      for (const [label, value] of fields) {
        const startY = doc.y;

        doc
          .fontSize(10)
          .font("Helvetica-Bold")
          .text(label, 50, startY, { width: labelWidth, continued: false });

        doc
          .fontSize(10)
          .font("Helvetica")
          .text(`:  ${value || "—"}`, 50 + labelWidth + 10, startY, {
            width: valueWidth,
          });

        // Ensure both columns move to same line
        doc.y = Math.max(doc.y, startY + 16);
        doc.moveDown(0.3);
      }

      // ─── CERTIFICATION NOTE ───
      doc.moveDown(1);
      doc
        .moveTo(50, doc.y)
        .lineTo(50 + pageWidth, doc.y)
        .lineWidth(0.5)
        .stroke();
      doc.moveDown(0.5);

      doc
        .fontSize(9)
        .font("Helvetica-Oblique")
        .text(
          "Note: It is certified that this information is according to the information in the admission record.",
          50,
          doc.y,
          { align: "center", width: pageWidth },
        );

      // ─── ISSUE DATE ───
      doc.moveDown(1.5);
      const today = new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      doc
        .fontSize(10)
        .font("Helvetica")
        .text(`Date of Issue: ${today}`, 50, doc.y);

      // ─── SIGNATURES ───
      doc.moveDown(3);
      const sigY = doc.y;
      const colWidth = pageWidth / 3;

      // Class Teacher
      doc.fontSize(9).font("Helvetica").text("____________________", 50, sigY, {
        width: colWidth,
        align: "center",
      });
      doc.text("Class Teacher", 50, sigY + 14, {
        width: colWidth,
        align: "center",
      });

      // Clerk
      doc.text("____________________", 50 + colWidth, sigY, {
        width: colWidth,
        align: "center",
      });
      doc.text("Clerk", 50 + colWidth, sigY + 14, {
        width: colWidth,
        align: "center",
      });

      // Principal (with stamp area)
      doc.text("____________________", 50 + colWidth * 2, sigY, {
        width: colWidth,
        align: "center",
      });
      doc.text("Principal", 50 + colWidth * 2, sigY + 14, {
        width: colWidth,
        align: "center",
      });

      // Stamp area
      doc.moveDown(2);
      const stampY = doc.y;
      const stampX = 50 + colWidth * 2 + (colWidth - 80) / 2;
      doc
        .roundedRect(stampX, stampY, 80, 40, 4)
        .lineWidth(0.5)
        .dash(3, { space: 2 })
        .stroke();
      doc
        .undash()
        .fontSize(7)
        .text("(Stamp)", stampX, stampY + 15, { width: 80, align: "center" });

      doc.end();
    });
  }
}
