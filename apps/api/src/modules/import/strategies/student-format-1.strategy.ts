import { BaseImportStrategy, ImportRowError } from "./base-import.strategy";
import { Prisma } from "@instituteos/database";

export class StudentFormat1Strategy extends BaseImportStrategy<Prisma.StudentCreateManyInput> {
  propertyName = "format-1";

  // Column mapping based on Catalog.xlsx
  private readonly columnMap: Record<
    string,
    keyof Prisma.StudentCreateManyInput
  > = {
    "GR Set": "grSet",
    "GR No.": "grNo",
    Division: "division",
    "Student ID": "studentIdTag",
    "Student Name": "studentName",
    "Mother's Name": "motherName",
    RTE: "rte",
    "Birth Date": "birthDate",
    Gender: "gender",
    Religion: "religion",
    Category: "category",
  };

  parseAndValidate(
    data: any[],
    instituteId: string,
  ): { entities: Prisma.StudentCreateManyInput[]; errors: ImportRowError[] } {
    const entities: Prisma.StudentCreateManyInput[] = [];
    const errors: ImportRowError[] = [];

    // Find header row (usually the one containing "Student Name")
    let headerIndex = -1;
    for (let i = 0; i < data.length; i++) {
      if (Array.isArray(data[i]) && data[i].includes("Student Name")) {
        headerIndex = i;
        break;
      }
    }

    if (headerIndex === -1) {
      errors.push({
        row: 0,
        errors: ["Could not find 'Student Name' header row."],
      });
      return { entities, errors };
    }

    const headers = data[headerIndex];
    const dataRows = data.slice(headerIndex + 1);

    dataRows.forEach((row, index) => {
      if (!Array.isArray(row) || row.length === 0) return;

      const rowNum = headerIndex + index + 2; // 1-indexed Excel row
      const rowData: Partial<Prisma.StudentCreateManyInput> = {};

      headers.forEach((header: string, i: number) => {
        const key = this.columnMap[header];
        if (key) {
          rowData[key] = row[i] as any;
        }
      });

      const rowErrors: string[] = [];

      // 1. Required Field: Student Name
      if (!rowData.studentName || String(rowData.studentName).trim() === "") {
        rowErrors.push("Student Name is required.");
      }

      // 2. Format Birth Date if present
      let formattedBirthDate: Date | null = null;
      if (rowData.birthDate) {
        const d = new Date(rowData.birthDate);
        if (isNaN(d.getTime())) {
          // Try parsing DD-MM-YYYY
          const parts = String(rowData.birthDate).split("-");
          if (parts.length === 3) {
            const parsedD = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
            if (!isNaN(parsedD.getTime())) {
              formattedBirthDate = parsedD;
            } else {
              rowErrors.push(`Invalid Birth Date format: ${rowData.birthDate}`);
            }
          } else {
            rowErrors.push(`Invalid Birth Date format: ${rowData.birthDate}`);
          }
        } else {
          formattedBirthDate = d;
        }
      }

      if (rowErrors.length > 0) {
        errors.push({ row: rowNum, errors: rowErrors });
      } else {
        entities.push({
          instituteId,
          studentName: String(rowData.studentName).trim(),
          grNo: rowData.grNo ? String(rowData.grNo).trim() : null,
          grSet: rowData.grSet ? String(rowData.grSet).trim() : null,
          division: rowData.division ? String(rowData.division).trim() : null,
          studentIdTag: rowData.studentIdTag
            ? String(rowData.studentIdTag).trim()
            : null,
          motherName: rowData.motherName
            ? String(rowData.motherName).trim()
            : null,
          rte: rowData.rte ? String(rowData.rte).trim() : "No",
          gender: rowData.gender ? String(rowData.gender).trim() : null,
          religion: rowData.religion ? String(rowData.religion).trim() : null,
          category: rowData.category ? String(rowData.category).trim() : null,
          birthDate: formattedBirthDate,
        });
      }
    });

    return { entities, errors };
  }
}
