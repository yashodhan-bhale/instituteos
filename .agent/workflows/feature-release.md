---
description: Automatically verify, commit, and prepare a feature for release to main
---

This workflow automates the "Professional Git Flow". When you run this, I will perform a sequence of safety checks and Git operations to move code from your feature/dev branch to the production main branch.

// turbo-all

### Phase 1: Local Verification (The Safety Catch)
1. **Linting**: I will run `pnpm turbo lint` to ensure code style consistency.
2. **Generating**: I will run `pnpm turbo generate` to sync Prisma clients.
3. **Building**: I will run `pnpm turbo build` to verify the monorepo compiles correctly.
4. **Testing**: I will run `pnpm turbo test` to ensure no regressions were introduced.
*If any of these fail, I will stop and show you the errors so we can fix them before committing.*

### Phase 2: Staging & Documentation
5. **Stage Changes**: I will run `git add .` to stage all verified changes.
6. **Commit**: I will prompt you for a feature summary, then craft a "Conventional Commit" message (e.g., `feat: ...`, `fix: ...`).
7. **Document**: I will generate a rich Markdown description for your GitHub Pull Request based on the code changes.

### Phase 3: Remote Sync
8. **Push**: I will push the current branch to `origin` so it's visible on GitHub.
9. **PR Link**: I will provide the URL for you to open the Pull Request on GitHub.

### Phase 4: Local Synch (The Final Polish)
10. **Checkout Main**: I will switch to the `main` branch.
11. **Pull**: I will run `git pull origin main` to ensure your local production branch matches the server.
12. **Status**: I will show you the final state of your repository.

---
**Tip**: A "Professional Git Flow" keeps the `main` branch stable and deployable at all times. By running these checks locally, we ensure that the remote CI (GitHub Actions) always turns green! ✅
