#!/bin/bash

echo "=== Fixing package.json issues ==="
echo ""

# Backup original
echo "📋 Creating backup..."
cp package.json package.json.backup
echo "✅ Backup created: package.json.backup"

# Remove BOM if present
echo ""
echo "🧹 Removing BOM..."
sed -i '1s/^\xEF\xBB\xBF//' package.json
echo "✅ BOM removed"

# Fix line endings
echo ""
echo "🔧 Fixing line endings..."
if command -v dos2unix >/dev/null 2>&1; then
    dos2unix package.json
    echo "✅ Line endings fixed with dos2unix"
else
    sed -i 's/\r$//' package.json
    echo "✅ Line endings fixed with sed"
fi

# Remove any trailing content after the last }
echo ""
echo "✂️ Removing trailing content..."
# Find the last } and truncate there
awk '/^}$/ {p=NR} END {if(p) system("head -n " p " package.json > package.json.tmp && mv package.json.tmp package.json")}' package.json
echo "✅ Trailing content removed"

# Test the result
echo ""
echo "🧪 Testing fixed JSON..."
if jq empty package.json 2>/dev/null; then
    echo "✅ JSON is now valid!"
else
    echo "❌ JSON still has issues:"
    jq empty package.json
    echo ""
    echo "🔄 Restoring backup..."
    mv package.json.backup package.json
fi
