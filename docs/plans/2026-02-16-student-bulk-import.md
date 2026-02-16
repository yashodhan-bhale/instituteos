# Student Bulk Import Implementation Plan

**Goal:** Implement a multi-format Excel import feature starting with "format-1" for student records, ensuring multi-tenancy and data integrity.

**Architecture:** A Strategy Pattern approach where different Excel formats are handled by specific strategy classes. Validation happens row-by-row, and imports are transactional (all-or-nothing).

**Tech Stack:** NestJS, Prisma (PostgreSQL), `xlsx` library, Zod for validation.

---

### Task 1: Database Model
**Files:**
- Modify: `packages/database/prisma/schema.prisma`

**Step 1: Add Student model and Institute relation**
```prisma
model Student {
  id              String    @id @default(uuid()) @db.Uuid
  instituteId     String    @map("institute_id") @db.Uuid
  grNo            String?   @map("gr_no")
  grSet           String?   @map("gr_set")
  division        String?
  studentIdTag    String?   @map("student_id_tag")
  studentName     String    @map("student_name")
  motherName      String?   @map("mother_name")
  rte             String?   @default("No")
  birthDate       DateTime? @map("birth_date")
  gender          String?
  religion        String?
  category        String?
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")
  institute       Institute @relation(fields: [instituteId], references: [id], onDelete: Cascade)
  @@unique([instituteId, grNo])
  @@index([instituteId])
  @@map("students")
}
```

**Step 2: Run Prisma generate**
Run: `pnpm run -F @instituteos/database generate`
Expected: PASS

---

### Task 2: Install Dependencies
**Step 1: Install xlsx and @types/multer**
Run: `pnpm add xlsx --filter @instituteos/api`
Run: `pnpm add -D @types/multer --filter @instituteos/api`

---

### Task 3: Import Strategy Pattern
**Files:**
- Create: `apps/api/src/modules/import/strategies/base-import.strategy.ts`
- Create: `apps/api/src/modules/import/strategies/student-format-1.strategy.ts`

**Step 1: Define Base Strategy and Result Types**
```typescript
export interface ImportRowError {
    row: number;
    errors: string[];
}
export interface ImportResult {
    success: boolean;
    importedCount: number;
    errors?: ImportRowError[];
    message?: string;
}
export abstract class BaseImportStrategy<TEntity = any> {
    abstract propertyName: string;
    abstract parseAndValidate(data: any[], instituteId: string): { entities: TEntity[]; errors: ImportRowError[] };
}
```

**Step 2: Implement StudentFormat1Strategy**
Implement logic to map headers: 'S.No', 'GR Set', 'GR No.', 'Division', 'Student ID', 'Student Name', "Mother's Name", 'RTE', 'Birth Date', 'Gender', 'Religion', 'Category'.
- Required: `studentName`
- Unique: `grNo` (checked in service)

---

### Task 4: Import Service (TDD)
**Files:**
- Create: `apps/api/src/modules/import/import.service.ts`
- Create: `apps/api/src/modules/import/import.service.spec.ts`

**Step 1: Write failing test for importStudents**
Verify it rejects empty files and invalid formats.

**Step 2: Implement minimal ImportService**
Register strategies and handle file reading with `xlsx`.

**Step 3: Implement Transaction and Duplicate Checks**
Check for `grNo` duplicates within file and database. Wrap `createMany` in `$transaction`.

---

### Task 5: Import Controller & Module
**Files:**
- Create: `apps/api/src/modules/import/import.controller.ts`
- Create: `apps/api/src/modules/import/import.module.ts`
- Modify: `apps/api/src/app.module.ts`

**Step 1: Implement Controller with FileInterceptor**
Define `POST /import/students` endpoint.

**Step 2: Register Module**
Export `ImportService` and add `ImportModule` to `AppModule`.

---

### Task 6: Final Verification
**Action:**
Use `curl` or a test script to upload `Catalog.xlsx` to the local API and verify database records.
