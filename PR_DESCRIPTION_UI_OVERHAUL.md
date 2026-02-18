# PR Description: Admin Dashboard Design Overhaul

## Overview
This PR implements a significant visual update to the Admin Web Dashboard to align with the provided design references. The layout has been moved from a generic indigo theme to a premium teal/green aesthetic under the branding **"EduDash"**.

## Changes
### 🎨 Styling
- **Global Theme (`globals.css`)**: 
  - Updated primary color to Teal (#1d9c79).
  - Refined Slate background for Light and Dark modes.
  - Standardized border radius and shadows for a more modern look.

### 🏗️ Layout (`dashboard-layout.tsx`)
- **Branding**: Renamed project branding to **EduDash**.
- **Sidebar**: Re-styled with white background (light) and teal active states. Updated logo to a teal/emerald gradient.
- **Top Bar**: Updated header with centered search bar and user profile card.
- **Logo**: Updated branding from 'IO' to 'ED' with modern styling.

### 📊 Dashboard Page (`page.tsx`)
- **Stat Cards**: Completely redesigned to match reference images:
  - Colored icon backgrounds (Orange, Blue, Purple, Emerald).
  - Clear trend indicators and consistent typography.
- **Notice Board**: Replaced generic quick actions with a styled Notice Board and Upcoming Events widgets.
- **Attendance**: Added a visual progress bar for Student Attendance.

## Verification
- [x] **Linting**: Passed `pnpm turbo lint` (minor UI warnings only).
- [x] **Building**: Passed `pnpm turbo build` (Next.js production build verified).
- [x] **Testing**: Passed `pnpm turbo test` (Smoke tests and existing package tests verified).

## Assurance (Test Audit)
- **Logic Coverage**: These changes are primarily visual/JSX structure. No new complex business logic was introduced.
- **Tests**: Existing smoke tests pass. Component-level tests for the new layout are recommended for future iterations if visual regression testing is required.
