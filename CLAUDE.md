# CLAUDE.md - Jovo CLI Maintenance Guide

## Project Status

This is a **privately maintained fork** of the Jovo CLI v4, originally an open-source project that was archived in April 2025. The CLI works alongside the maintained jovo-framework fork.

**Maintenance Goals:**
- Keep the CLI working for Alexa skill development
- Security updates and dependency maintenance
- Simplification by removing unused platform integrations
- Align tooling versions with jovo-framework fork

---

## Quick Start

```bash
# Install dependencies and build
npm run setup:dev    # Full setup (install, bootstrap, link, build)

# Or manually:
npm install
npm run bootstrap
npm run build

# Development
npm test             # Run tests across all packages
npm run eslint       # Lint and fix code
npm run prettier     # Format code

# Local development binary
jovodev --help       # Uses linked local build
```

---

## Project Structure

```
jovo-cli/
├── cli/                    # Main CLI entry point (@jovotech/cli)
│   ├── bin/run            # CLI binary wrapper
│   ├── src/
│   │   ├── Collector.ts   # Dynamic plugin loader
│   │   ├── hooks/         # Init and version hooks
│   │   └── help/          # Custom help formatters
│   └── package.json
├── core/                   # Shared CLI utilities (@jovotech/cli-core)
│   ├── src/
│   │   ├── JovoCli.ts         # Main CLI orchestrator (singleton)
│   │   ├── ProjectConfig.ts   # jovo.project.js loader
│   │   ├── Project.ts         # Project context manager
│   │   ├── JovoCliPlugin.ts   # Plugin base class
│   │   ├── PluginCommand.ts   # Command base class
│   │   ├── PluginHook.ts      # Hook base class
│   │   ├── EventEmitter.ts    # Middleware engine
│   │   └── UserConfig.ts      # ~/.jovo/config manager
│   └── package.json
├── commands/               # CLI command plugins (6 packages)
│   ├── command-build/     # jovo build:platform
│   ├── command-deploy/    # jovo deploy:platform, deploy:code
│   ├── command-get/       # jovo get:platform
│   ├── command-new/       # jovo new
│   ├── command-run/       # jovo run (local dev server)
│   └── command-update/    # jovo update
├── integrations/           # Additional integrations (2 packages)
│   ├── nlu-lex/           # Amazon Lex NLU integration
│   └── target-serverless/ # Serverless Framework deployment
├── docs/                   # Documentation (8 markdown files)
├── lerna.json             # Monorepo config (Lerna 4.0.0)
└── package.json           # Root workspace
```

**Total: 9 packages** (1 cli + 1 core + 6 commands + 2 integrations)

---

## Architecture Overview

### Plugin System

The CLI uses **oclif** as the base framework with a custom plugin overlay:

```
User runs: jovo build:platform alexa
    │
    └─→ oclif routes to Collector plugin
         │
         ├─→ JovoCli (singleton)
         │   ├─→ Detect project (package.json + jovo.project.js)
         │   ├─→ Load UserConfig (~/.jovo/config)
         │   ├─→ Load ProjectConfig (jovo.project.js)
         │   └─→ collectPlugins()
         │
         ├─→ EventEmitter (middleware engine)
         │
         └─→ Command.run()
              ├─→ emit 'before.build:platform'
              ├─→ emit 'build:platform'
              └─→ emit 'after.build:platform'
```

### Key Classes

| Class | Location | Purpose |
|-------|----------|---------|
| `JovoCli` | core/src/JovoCli.ts | Singleton orchestrator, plugin loading |
| `ProjectConfig` | core/src/ProjectConfig.ts | Reads jovo.project.js |
| `Project` | core/src/Project.ts | Project context (models, locales, platforms) |
| `JovoCliPlugin` | core/src/JovoCliPlugin.ts | Base class for all plugins |
| `PluginCommand` | core/src/PluginCommand.ts | Base class for commands |
| `EventEmitter` | core/src/EventEmitter.ts | Async middleware system |
| `Collector` | cli/src/Collector.ts | Dynamic plugin loader for oclif |

### Configuration Files

**Project config (`jovo.project.js`):**
```javascript
const { ProjectConfig } = require('@jovotech/cli-core');
const { AlexaCli } = require('@jovotech/platform-alexa');

module.exports = new ProjectConfig({
  plugins: [
    new AlexaCli({
      skillId: 'amzn1.ask.skill.xxx',
      askProfile: 'default',
      locales: { en: ['en-US'] }
    })
  ],
  models: {
    enabled: true,
    directory: 'models'
  }
});
```

**User config (`~/.jovo/config`):**
```json
{
  "webhook": { "uuid": "unique-id" },
  "cli": {
    "plugins": [
      "@jovotech/cli-command-build",
      "@jovotech/cli-command-deploy"
    ]
  }
}
```

---

## Current Package Set (9 packages)

### Core:
1. **cli/** - Main CLI entry (@jovotech/cli v4.1.9)
2. **core/** - Shared utilities (@jovotech/cli-core v4.1.10)

### Commands:
3. **commands/command-build/** - Build platform files (v4.1.9)
4. **commands/command-deploy/** - Deploy to platforms (v4.1.9)
5. **commands/command-get/** - Sync from platforms (v4.1.9)
6. **commands/command-new/** - Create new projects (v4.1.9)
7. **commands/command-run/** - Local dev server (v4.1.10)
8. **commands/command-update/** - Update packages (v4.1.9)

### Integrations:
9. **integrations/nlu-lex/** - Amazon Lex NLU (v4.1.9)
10. **integrations/target-serverless/** - Serverless deployment (v4.1.9)

---

## Build System

### Monorepo: Lerna 4.0.0 + npm

```json
// lerna.json
{
  "packages": ["cli", "core", "commands/*", "integrations/*"],
  "version": "independent"
}
```

### TypeScript Configuration

- **Current Version:** ~4.2.4 (OUTDATED - framework uses 5.3)
- **Target:** ES2017 / CommonJS
- **Output:** `dist/` directory per package

### Package Scripts

```bash
# Root level
npm run setup:dev    # Full setup + link jovodev binary
npm run bootstrap    # Lerna bootstrap with hoisting
npm run build        # Build all packages
npm run clean        # Clean all dist directories
npm run test         # Run all tests

# Per-package pattern:
npm run prebuild     # rimraf dist
npm run build        # tsc
npm run watch        # tsc --watch
npm run test         # jest
npm run eslint       # eslint src --fix
```

---

## Dependencies Status (CRITICAL)

### Severely Outdated:

| Package | Current | Target | Risk |
|---------|---------|--------|------|
| TypeScript | ~4.2.4 | ~5.3.0 | HIGH - 3 major versions behind |
| ESLint | ^7.17.0 | ^8.50.0 | HIGH - v7 is EOL |
| @typescript-eslint/* | ^4.12.0 | ^6.0.0 | HIGH |
| Jest | ^27.3.1 | ^29.7.0 | MEDIUM |
| ts-jest | ^27.0.7 | ^29.1.0 | MEDIUM |
| Lerna | ^4.0.0 | 8.1.2 | MEDIUM |
| @types/node | ^16.11.7 | ^20.10.0 | MEDIUM |

### Security Concerns:

| Package | Current | Issue |
|---------|---------|-------|
| socket.io-client | ^2.1.1 | EOL - v2 has security issues |
| axios | ^0.21.1 | Known CVEs - needs ^1.6.x |
| @aws-sdk/* | ^3.14.0 | Very old - needs ^3.700.0 |

### Deprecated Packages:

| Package | Status |
|---------|--------|
| @oclif/command | Deprecated - use @oclif/core |
| @oclif/config | Deprecated - use @oclif/core |
| @oclif/help | Deprecated |
| @oclif/errors | Deprecated |
| lodash.get, lodash.merge, etc. | Use native JS |

---

## Platform References to Clean Up

Only one file contains platform marketplace definitions:

**`commands/command-new/src/utilities.ts` (lines 56-132):**

| Platform | Keep? | Lines |
|----------|-------|-------|
| Core Platform | YES | 74-79 |
| Amazon Alexa | YES | 81-87 |
| Google Assistant | NO | 89-95 |
| Facebook Messenger | NO | 97-102 |
| Google Business | NO | 104-109 |
| ExpressJS Server | YES | 111-116 |
| AWS Lambda | YES | 118-123 |

---

## CLI Commands Reference

```bash
# Project commands (require jovo.project.js)
jovo build:platform [PLATFORM]    # Build platform files
jovo deploy:platform [PLATFORM]   # Deploy to platform console
jovo deploy:code TARGET           # Deploy code to cloud
jovo get:platform [PLATFORM]      # Sync from platform console
jovo run                          # Start local dev server

# Global commands (work anywhere)
jovo new [NAME]                   # Create new project
jovo update                       # Update Jovo packages
```

---

## Relationship to jovo-framework

The CLI is **separate** from the framework but **tightly integrated**:

1. **CLI loads platform plugins** from `jovo.project.js` (e.g., `AlexaCli`)
2. **Platform plugins live in jovo-framework** (`platforms/platform-alexa/src/cli/`)
3. **CLI builds models** using framework's model validation
4. **CLI runs the app** via framework's server integrations

The CLI doesn't import framework code directly; plugins bridge the two.

---

## Files to Know

| File | Purpose |
|------|---------|
| `cli/src/Collector.ts` | Plugin loader, oclif integration |
| `core/src/JovoCli.ts` | Main orchestrator (200+ lines) |
| `core/src/ProjectConfig.ts` | jovo.project.js parser |
| `core/src/PluginCommand.ts` | Command base class with middleware |
| `commands/command-new/src/utilities.ts` | Platform marketplace (NEEDS CLEANUP) |
| `commands/command-build/src/commands/build.platform.ts` | Build command |
| `commands/command-run/src/commands/run.ts` | Dev server command |

---

## Local Development

### Testing with local CLI:

```bash
# After setup:dev, use jovodev instead of jovo
jovodev --version
jovodev build:platform alexa
```

### Linking to local framework:

The CLI loads platform plugins from the project's node_modules. To use local framework:

1. In your test project, use file references:
```json
{
  "@jovotech/platform-alexa": "file:../jovo-framework/platforms/platform-alexa"
}
```

2. The CLI will load `AlexaCli` from that local package.

---

## Notes for Claude

When working on this codebase:
1. The CLI uses oclif v1 (deprecated) - migration to v2+ is complex
2. Plugin system is custom overlay on oclif
3. EventEmitter provides async middleware chains
4. All commands follow before/during/after lifecycle
5. Platform-specific CLI code is in jovo-framework, not here
6. Alexa is the priority platform - remove others from marketplace
7. Align dependency versions with jovo-framework fork
