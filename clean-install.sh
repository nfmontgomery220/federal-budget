#!/bin/bash

echo "=== Clean Installation Process ==="
echo ""

# Remove problematic files
echo "🧹 Cleaning up existing installation..."
rm -rf node_modules
rm -f package-lock.json
rm -f yarn.lock
rm -f pnpm-lock.yaml
echo "✅ Removed node_modules and lock files"

# Clear npm cache
echo ""
echo "🗑️ Clearing npm cache..."
npm cache clean --force
echo "✅ NPM cache cleared"

# Install with legacy peer deps to resolve conflicts
echo ""
echo "📦 Installing dependencies with legacy peer deps..."
npm install --legacy-peer-deps

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
    echo ""
    echo "🎉 You can now run:"
    echo "  npm run dev"
    echo "  npx shadcn@latest add button"
else
    echo "❌ Installation failed. Trying with force flag..."
    npm install --force
    
    if [ $? -eq 0 ]; then
        echo "✅ Dependencies installed with --force!"
    else
        echo "❌ Both methods failed. Manual intervention required."
        echo ""
        echo "Try these steps:"
        echo "1. Delete package-lock.json"
        echo "2. Use yarn instead: yarn install"
        echo "3. Or use pnpm: pnpm install"
    fi
fi
