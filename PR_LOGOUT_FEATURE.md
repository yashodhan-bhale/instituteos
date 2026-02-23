# Pull Request: Add Logout Functionality to Administrative Portals

## Description
This PR implements the missing logout functionality across the **Platform (Super Admin)** and **Institute** portals. Users can now securely terminate their sessions from both the sidebar and the top header.

### Key Changes
- **Platform Portal**:
    - Added a "Log Out" button to the sidebar footer (Lucide `LogOut` icon).
    - Integrated a quick-access logout icon in the top header next to the profile.
    - Implemented session termination logic that clears authentication cookies.
- **Institute Portal**:
    - Added a logout option to the sidebar using 🚪 emoji icons.
    - Added a logout button to the top header profile section.
- **Shared Logic**:
    - Centralized `handleLogout` function in layout components to handle cross-domain cookie clearing (`localhost` vs production domains).

## Verification Results
### Automated Tests
- `pnpm turbo lint`: **Passed** ✅
- `pnpm turbo build`: **Passed** ✅
- `pnpm turbo test`: **Passed** ✅

### Manual Verification
- Verified that clicking Logout redirects the user to the appropriate login page (`/login?target=platform` or `/login?target=institute`).
- Confirmed that the `auth_token` cookie is successfully removed from the browser.

## Checklist
- [x] Logic is accompanied by UI changes in relevant layouts.
- [x] Conventional commit messages used.
- [x] All existing tests pass.
