# Jovo CLI (Fork)

This is a **privately maintained fork** of the Jovo CLI v4, updated with modern dependencies and simplified for Alexa skill development.

## Installation (From Source)

### Prerequisites

- Node.js 24+
- npm 10+

### Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd jovo-cli

# Install dependencies and build
npm install
npm run build

# Link globally to use as 'jovo' command
cd cli
npm link

# Verify installation
jovo --version
# Should show: @jovotech/cli: 5.0.0
```

### Quick Setup (Alternative)

```bash
# From the root directory, run the dev setup script
npm run setup:dev

# Then link globally
cd cli
npm link
```

## Usage

After linking, use the `jovo` command globally:

```bash
# Create a new project
jovo new myproject

# Build platform files (in a Jovo project directory)
jovo build:platform alexa

# Run local development server
jovo run

# Deploy to platform
jovo deploy:platform alexa

# Update Jovo packages in your project
jovo update
```

## Development

### Rebuilding After Changes

After making any changes to the CLI, run:

```bash
npm run rebuild
```

This script will:
1. Install dependencies (if needed)
2. Build all packages
3. Re-link the CLI globally
4. Verify the installation

### Manual Rebuild

If you prefer to run steps manually:

```bash
# Build only (after code changes)
npm run build

# Full rebuild (after dependency changes)
npm install
npm run build
cd cli && npm link
```

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run eslint
```

### Project Structure

```
jovo-cli/
├── cli/                    # Main CLI entry point (@jovotech/cli)
├── core/                   # Shared utilities (@jovotech/cli-core)
├── commands/               # CLI command plugins
│   ├── command-build/      # jovo build:platform
│   ├── command-deploy/     # jovo deploy:platform, deploy:code
│   ├── command-get/        # jovo get:platform
│   ├── command-new/        # jovo new
│   ├── command-run/        # jovo run
│   └── command-update/     # jovo update
├── integrations/           # Additional integrations
│   ├── nlu-lex/            # Amazon Lex NLU
│   └── target-serverless/  # Serverless Framework deployment
└── docs/                   # Documentation
```

## Changes from Upstream

This fork includes the following updates from the original Jovo CLI v4:

### Dependency Updates
| Package | Original | Updated |
|---------|----------|---------|
| TypeScript | ~4.2.4 | ~5.3.0 |
| ESLint | ^7.17.0 | ^8.50.0 |
| Jest | ^27.3.1 | ^29.7.0 |
| Lerna | ^4.0.0 | 8.1.2 |
| axios | ^0.21.1 | ^1.6.0 |
| @aws-sdk/* | ^3.14.0 | ^3.700.0 |
| Prettier | ^2.4.1 | ^3.1.0 |

### Removed
- Google Assistant platform support
- Facebook Messenger platform support
- Google Business platform support
- Unused socket.io-client dependency

### Build System
- Migrated from `lerna bootstrap` to npm workspaces
- Updated to Lerna 8 with Nx-powered execution

## Switching Back to npm Version

If you need to switch back to the official npm version:

```bash
# Unlink the local version
npm unlink -g @jovotech/cli

# Install from npm
npm install -g @jovotech/cli
```

## Related

- [jovo-framework](https://github.com/jovotech/jovo-framework) - The Jovo Framework (use with matching fork for full compatibility)

## License

Apache-2.0
