# PR Description: API Cleanup and Logging Optimization

## Proposed Changes
This PR focuses on reducing terminal noise during development and cleaning up technical debt from previous debugging sessions.

### 1. Logging Optimization
- **Prisma Query Logging**: Removed the `query` log level from `PrismaService` and the shared `@instituteos/database` package in development mode. This significantly reduces the volume of SQL output in the terminal.
- **Startup Logs**: Removed verbose console logs from the NestJS bootstrap process in `main.ts` to provide a cleaner application startup experience.

### 2. Code Cleanup
- **Deleted Debugging Scripts**: Removed several one-time-use scripts used for database and module verification:
    - `apps/api/scripts/check-admin.ts`
    - `apps/api/test-node.js`
    - `apps/api/test-app-module.js`
- **Removed Temporary Assets**: Deleted `apps/api/temp/Catalog.xlsx` which was used for testing import functionality.
- **Log Cleanup**: Deleted stale log files (`api-log.txt`, `api-dist-log.txt`, `output.txt`).

## Verification Results
- **Linting**: Passed with standard workspace warnings.
- **Builds**: Verified that `@instituteos/database` and `@instituteos/api` build correctly.
- **Tests**: Ran all API unit tests; 14/14 tests passed.

## Impact
- Cleaner development experience with less log noise.
- Reduced repository clutter by removing transient scripts and data files.
