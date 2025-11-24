#!/bin/bash

# Jovo CLI Rebuild Script
# Rebuilds the CLI after making changes and re-links it globally

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo "🔨 Rebuilding Jovo CLI..."
echo ""

cd "$ROOT_DIR"

# Check if node_modules exists, if not run install
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Build all packages
echo "🏗️  Building all packages..."
npm run build
echo ""

# Create symlinks for command packages in CLI's node_modules
# (needed because lerna hoisting puts deps at root level)
echo "🔗 Creating local command symlinks..."
mkdir -p "$ROOT_DIR/cli/node_modules/@jovotech"
cd "$ROOT_DIR/cli/node_modules/@jovotech"
ln -sf ../../../commands/command-build cli-command-build 2>/dev/null || true
ln -sf ../../../commands/command-deploy cli-command-deploy 2>/dev/null || true
ln -sf ../../../commands/command-get cli-command-get 2>/dev/null || true
ln -sf ../../../commands/command-new cli-command-new 2>/dev/null || true
ln -sf ../../../commands/command-run cli-command-run 2>/dev/null || true
ln -sf ../../../commands/command-update cli-command-update 2>/dev/null || true
ln -sf ../../../core cli-core 2>/dev/null || true
echo ""

# Re-link globally
echo "🔗 Linking CLI globally..."
cd "$ROOT_DIR/cli"
npm link
echo ""

# Verify
echo "✅ Done! Verifying installation:"
echo ""
jovo --version
