---
name: assuring-quality
description: Performs a mandatory Test Audit and Quality Assurance check before code is committed. Use this to ensure every logic change is accompanied by a corresponding test.
---

# Assurance: The Quality Gate

Use this skill whenever you are preparing a feature for release or conducting a code review.

## 🔍 The Test Audit Process

Before finalizing any task, you MUST perform the following scan:

### 1. Logic vs. Test Mapping
- **Scan the Diff**: Review all changed files in the `src` directories.
- **Identify Logic**: Look for new exports, modified services, or updated controllers.
- **Verify Coverage**: 
    - For every code file (e.g., `auth.service.ts`), a matching spec file (e.g., `auth.service.spec.ts`) must exist and contain changes.
    - If a logic file was changed but its spec file was NOT, this is a **Missing Test Flag**.

### 2. Flagging & Intervention
- If tests are missing, **Stop Execution**.
- **Action**: Inform the user: *"I see you added logic for [Feature Name], but I don't see any matching tests. Should we add them now?"*
- **Show Tests**: Whenever you generate or modify tests, you MUST present a summary of:
    - **New/Updated Tests**: Specifically highlight the test blocks added for the new logic.
    - **Existing Tests**: List the existing test files in the module to provide context of the total safety net.
- **Default Behavior**: If the user says yes or "do it for me", proactively generate the missing tests using the **TDD Skill**.

### 3. Coverage Gate Check
- Run `pnpm turbo test -- --coverage`.
- **Threshold**: The project goal is **80% coverage** across all packages (API, Web, and Mobile). 
- If the new code drops the total project coverage, refactor or add more tests until the coverage is restored or improved.

### 4. Integration & E2E Check
- **Web**: Check for matching component tests in Vitest.
- **Mobile (`staff-mobile`)**: 
    - Verify Unit/Integration tests use **Vitest + React Native Testing Library**.
    - For major flows, verify or suggest **Detox** E2E tests.
- **API**: Ensure complex flows have integration tests in Vitest.
