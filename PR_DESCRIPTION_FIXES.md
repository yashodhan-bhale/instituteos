# PR Description: Dev Environment & Node 22 Fixes

## Summary
This PR resolves critical issues preventing the development environment from starting correctly on modern Node.js versions (v22+). 

## Changes
- **API service (`apps/api`)**: Replaced `nest start --watch` with a direct Node execution using `ts-node/register` and `--watch`. This fixes an issue where the `dist` folder was not being correctly resolved/populated during development.
- **Mobile App (`apps/staff-mobile`)**: Upgraded Expo and internal dependencies to address the `TypeError: Body is unusable: Body has already been read` error, ensuring compatibility with Node.js 22's fetch implementation.
- **Environment**: Updated `.gitignore` and added the `ui-architect` skill to the agent configuration.

## Verification Results
- `pnpm turbo build`: All packages built successfully.
- `pnpm turbo test`: All unit tests passed (7 suites, 9 tests).
- `pnpm turbo lint`: Clean (with minor warnings in mobile).
