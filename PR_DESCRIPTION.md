## 🚀 CI/CD Stability & Mobile Testing Migration

### 📝 Summary
This PR addresses critical stability issues in the CI pipeline and migrates the mobile application testing infrastructure to a more robust setup.

### ✅ Key Changes
- **Testing Infrastructure**: Migrated `staff-mobile` from Vitest to Jest (`jest-expo`) to resolve compatibility issues with React Native components.
- **Linting & Quality**: 
  - Fixed `eslint-config-universe` peer dependency conflicts.
  - Resolved `prettier` v3 compatibility issues in `eslint-plugin-prettier`.
  - Added missing ESLint plugins for React Native and TypeScript.
- **Build Stability**: 
  - Updated `feature-release` workflow to run build/test steps sequentially (`--concurrency 1`) to prevent resource exhaustion.
  - Added necessary type definitions (`node`, `express`, `multer`, etc.) to `apps/api/tsconfig.json` to fix build errors.

### 🔍 Verification
- **Lint**: `pnpm turbo lint` ✅ Passed (with minor warnings)
- **type-check**: `pnpm turbo build` ✅ Passed
- **Test**: `pnpm turbo test` ✅ Passed for all packages (API, Admin, Mobile)

### 📦 Dependencies
- Added `jest`, `jest-expo`, `eslint-plugin-react-native` (and related plugins) to `staff-mobile`.
- Updated `pnpm-lock.yaml`.

This ensures a green pipeline for future feature releases! 🟢
