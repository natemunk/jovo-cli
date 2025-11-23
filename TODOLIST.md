# Jovo CLI Fork - Maintenance Todo List

This document tracks maintenance tasks for the privately maintained Jovo CLI fork.

---

## Version History

| Version | Date | Notes |
|---------|------|-------|
| 5.0.0 | (planned) | Fork release - simplified, updated dependencies |
| 4.1.10 | (upstream) | Last official Jovo CLI release |

---

## Phase 1: Immediate Tasks (Safety & Cleanup)

### 1. Remove Deprecated Platform References
**Priority:** High | **Effort:** 10 minutes | **Risk:** None

Remove references to discontinued platforms from the marketplace.

**File to modify:** `commands/command-new/src/utilities.ts`

**Current state (lines 89-109):**
```typescript
// These platforms no longer exist in jovo-framework
{
  module: 'GoogleAssistantPlatform',
  cliModule: 'GoogleAssistantCli',
  package: '@jovotech/platform-googleassistant',
},
{
  module: 'FacebookMessengerPlatform',
  package: '@jovotech/platform-facebookmessenger',
},
{
  module: 'GoogleBusinessPlatform',
  package: '@jovotech/platform-googlebusiness',
},
```

**Target state:** Delete lines 89-109 entirely.

**Also update docs:**
- `docs/README.md` - Remove Google Assistant references
- `docs/project-config.md` - Remove Google Assistant references

---

### 2. Fix Critical Security Dependencies
**Priority:** Critical | **Effort:** 15 minutes | **Risk:** Low

Update packages with known security vulnerabilities.

**Changes needed across all package.json files:**

| Package | Current | Target | Location |
|---------|---------|--------|----------|
| axios | ^0.21.1 | ^1.6.0 | command-new |
| socket.io-client | ^2.1.1 | ^4.7.0 | command-run |

**Steps:**
1. Edit `commands/command-new/package.json`:
   - Change `"axios": "^0.21.1"` to `"axios": "^1.6.0"`

2. Edit `commands/command-run/package.json`:
   - Change `"socket.io-client": "^2.1.1"` to `"socket.io-client": "^4.7.0"`
   - Note: May require code changes due to API differences

3. Run `npm install && npm run build && npm test`

---

### 3. Update AWS SDK
**Priority:** Medium | **Effort:** 5 minutes | **Risk:** None

Align AWS SDK version with jovo-framework.

**File:** `integrations/nlu-lex/package.json`

**Change:**
```json
"@aws-sdk/client-lex-model-building-service": "^3.14.0"
// to
"@aws-sdk/client-lex-model-building-service": "^3.700.0"
```

---

## Phase 2: Dependency Alignment (Match jovo-framework)

### 4. Update TypeScript
**Priority:** High | **Effort:** 30 minutes | **Risk:** Medium

Align TypeScript version with jovo-framework (5.3.0).

**Files to update (all package.json files):**

| Package | File |
|---------|------|
| root | package.json |
| cli | cli/package.json |
| core | core/package.json |
| command-build | commands/command-build/package.json |
| command-deploy | commands/command-deploy/package.json |
| command-get | commands/command-get/package.json |
| command-new | commands/command-new/package.json |
| command-run | commands/command-run/package.json |
| command-update | commands/command-update/package.json |
| nlu-lex | integrations/nlu-lex/package.json |
| target-serverless | integrations/target-serverless/package.json |

**Change in each:**
```json
"typescript": "~4.2.4"
// to
"typescript": "~5.3.0"
```

**Also update:**
```json
"@types/node": "^16.11.7"
// to
"@types/node": "^20.10.0"
```

**Steps:**
1. Update all package.json files
2. Run `npm install`
3. Run `npm run build` - fix any type errors
4. Run `npm test`

---

### 5. Update ESLint & TypeScript-ESLint
**Priority:** High | **Effort:** 30 minutes | **Risk:** Medium

ESLint 7 is EOL. Update to match jovo-framework.

**Files to update:** All package.json files (same as Task 4)

**Changes:**
```json
// Root package.json
"eslint": "^7.17.0" → "^8.50.0"
"@typescript-eslint/eslint-plugin": "^4.12.0" → "^6.0.0"
"@typescript-eslint/parser": "^4.12.0" → "^6.0.0"
"eslint-config-prettier": "^7.1.0" → "^9.0.0"
"eslint-plugin-prettier": "^3.3.1" → "^5.0.0"
```

**Also update .eslintrc.js if needed** for ESLint 8 compatibility.

---

### 6. Update Jest
**Priority:** Medium | **Effort:** 20 minutes | **Risk:** Low

**Files to update:** All package.json files

**Changes:**
```json
"jest": "^27.3.1" → "^29.7.0"
"ts-jest": "^27.0.7" → "^29.1.0"
"@types/jest": "^27.0.2" → "^29.5.0"
```

---

### 7. Update Lerna
**Priority:** Medium | **Effort:** 15 minutes | **Risk:** Medium

Align with jovo-framework (8.1.2).

**File:** Root `package.json`

**Change:**
```json
"lerna": "^4.0.0" → "8.1.2"
```

**Note:** Lerna 8 has different CLI syntax. May need to update:
- `lerna.json` configuration
- npm scripts that use lerna commands

---

### 8. Update Prettier
**Priority:** Low | **Effort:** 5 minutes | **Risk:** None

**Files:** All package.json files

**Change:**
```json
"prettier": "^2.4.1" → "^3.1.0"
```

---

## Phase 3: Code Modernization

### 9. Replace lodash.* with Native JS
**Priority:** Low | **Effort:** 2-4 hours | **Risk:** Medium

The codebase uses individual lodash packages (deprecated pattern).

**Packages to replace:**
- `lodash.get` → Optional chaining (`?.`)
- `lodash.set` → Custom setter or direct assignment
- `lodash.merge` → `Object.assign()` or spread operator
- `lodash.mergewith` → Custom deep merge
- `lodash.pick` → Destructuring
- `lodash.isequal` → `JSON.stringify()` or custom equality
- `lodash.intersectionby` → `Array.filter()`
- `lodash.intersectionwith` → `Array.filter()`

**Files using lodash:**
- `core/src/*.ts` (multiple files)
- `cli/src/*.ts`
- `commands/command-new/src/*.ts`
- `commands/command-run/src/*.ts`
- `integrations/nlu-lex/src/*.ts`

**Recommendation:** Do this incrementally, one lodash package at a time.

---

### 10. Evaluate oclif Migration
**Priority:** Low | **Effort:** Days-Weeks | **Risk:** High

The CLI uses deprecated @oclif v1 packages. Modern oclif uses `@oclif/core`.

**Current (deprecated):**
- @oclif/command
- @oclif/config
- @oclif/help
- @oclif/errors
- @oclif/parser

**Target:**
- @oclif/core (combines all above)

**Assessment:** This is a **major refactor**. The plugin system heavily depends on oclif v1 APIs. Consider:
- Option A: Stay on oclif v1 (works, but deprecated)
- Option B: Full migration to @oclif/core v2+ (significant effort)

**Recommendation:** Defer this unless oclif v1 stops working.

---

## Phase 4: Testing & Validation

### 11. Test CLI with Local Framework
**Priority:** High | **Effort:** 30 minutes | **Risk:** None

Verify CLI works with the local jovo-framework fork.

**Steps:**
1. In lautmaler project (or test project):
   ```bash
   jovo build:platform alexa
   jovo run
   ```

2. Verify:
   - Build command generates Alexa skill files
   - Run command starts local server
   - Debugger connects properly

---

### 12. Test Fresh Project Creation
**Priority:** Medium | **Effort:** 15 minutes | **Risk:** None

Verify `jovo new` command works after platform cleanup.

**Steps:**
1. Run `jovodev new test-project`
2. Select Alexa platform
3. Verify project is created correctly
4. Build and run the new project

---

## Phase 5: Release

### 13. Version Bump to 5.0.0
**Priority:** After all above | **Effort:** 10 minutes | **Risk:** None

Align CLI version with jovo-framework fork.

**Steps:**
```bash
# Bump all packages to 5.0.0
npx lerna version 5.0.0 --yes --no-push --no-git-tag-version

# Commit
git add -A
git commit -m "chore: release v5.0.0 - fork with updated dependencies"
git tag v5.0.0
```

---

## Quick Reference

### Dependency Version Targets (aligned with jovo-framework)

| Package | Current | Target |
|---------|---------|--------|
| TypeScript | ~4.2.4 | ~5.3.0 |
| @types/node | ^16.11.7 | ^20.10.0 |
| ESLint | ^7.17.0 | ^8.50.0 |
| @typescript-eslint/* | ^4.12.0 | ^6.0.0 |
| Jest | ^27.3.1 | ^29.7.0 |
| ts-jest | ^27.0.7 | ^29.1.0 |
| Prettier | ^2.4.1 | ^3.1.0 |
| Lerna | ^4.0.0 | 8.1.2 |
| rimraf | ^3.0.2 | ^5.0.0 |
| axios | ^0.21.1 | ^1.6.0 |
| socket.io-client | ^2.1.1 | ^4.7.0 |
| @aws-sdk/* | ^3.14.0 | ^3.700.0 |

### Package.json Files to Update

```
jovo-cli/
├── package.json                              # Root
├── cli/package.json                          # @jovotech/cli
├── core/package.json                         # @jovotech/cli-core
├── commands/command-build/package.json
├── commands/command-deploy/package.json
├── commands/command-get/package.json
├── commands/command-new/package.json
├── commands/command-run/package.json
├── commands/command-update/package.json
├── integrations/nlu-lex/package.json
└── integrations/target-serverless/package.json
```

### Commands for Maintenance

```bash
# Setup
npm run setup:dev

# Build all
npm run build

# Test all
npm test

# Lint all
npm run eslint

# Clean rebuild
npm run clean && npm install && npm run build

# Use local binary
jovodev --version
jovodev build:platform alexa
```

---

## Long-term Considerations

### 1. Remove nlu-lex Integration?
If not using Amazon Lex, consider removing `integrations/nlu-lex/` to simplify.

### 2. Remove target-serverless Integration?
If using AWS Lambda directly (not Serverless Framework), consider removing.

### 3. Node.js Version
Current target: ES2017 (Node 8+)
Consider updating to ES2020+ when Node 18 is minimum.

### 4. Socket.io Compatibility
The debugger uses socket.io-client. Version 4.x has breaking changes.
May need to verify debugger server compatibility.

---

## Files Reference

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Development guide and architecture |
| `TODOLIST.md` | This file - maintenance tasks |
| `lerna.json` | Monorepo configuration |
| `package.json` | Root workspace config |
| `tsconfig.json` | Base TypeScript settings |
