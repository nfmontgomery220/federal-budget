#!/bin/bash

echo "=== Debugging package.json issues ==="
echo ""

# Check for hidden characters
echo "1. Checking for hidden/non-printable characters:"
cat -A package.json | head -20
echo ""

# Check file encoding
echo "2. Checking file encoding:"
file package.json
hexdump -C package.json | head -5

# Check for BOM (Byte Order Mark)
echo ""
echo "3. Checking for BOM:"
if [[ $(head -c 3 package.json | od -t x1 -N 3 | head -1 | cut -d' ' -f2-4) == "ef bb bf" ]]; then
    echo "❌ UTF-8 BOM detected"
else
    echo "✅ No BOM detected"
fi
echo ""

# Check line endings
echo "4. Checking line endings:"
if grep -q $'\r' package.json; then
    echo "Windows line endings (CRLF) detected"
else
    echo "Unix line endings (LF) detected"
fi
echo ""

# Try to parse with Node.js directly
echo "5. Testing JSON parsing with Node.js:"
node -e "
try {
  const fs = require('fs');
  const content = fs.readFileSync('package.json', 'utf8');
  console.log('File length:', content.length);
  console.log('First 100 chars:', JSON.stringify(content.substring(0, 100)));
  console.log('Around position 2298:', JSON.stringify(content.substring(2290, 2310)));
  const parsed = JSON.parse(content);
  console.log('✅ JSON is valid');
} catch (error) {
  console.log('❌ JSON Error:', error.message);
  console.log('Error position:', error.message.match(/position (\d+)/)?.[1]);
}
"

echo ""
echo "6. Checking for duplicate keys:"
grep -n '".*":' package.json | sort | uniq -d

echo ""
echo "7. Looking for common JSON issues around line 72:"
sed -n '65,80p' package.json | cat -n

# Check around position 2298
echo "8. Content around position 2298:"
if [[ -f package.json ]]; then
    echo "Characters around position 2298:"
    tail -c +2290 package.json | head -c 21 | od -c
fi

# Find extra content after JSON
echo ""
echo "9. Finding where JSON should end:"
# Find the last closing brace
last_brace_line=$(grep -n '^}$' package.json | tail -1 | cut -d: -f1)
total_lines=$(wc -l < package.json)

if [ "$last_brace_line" -lt "$total_lines" ]; then
    echo "❌ Extra content found after line $last_brace_line:"
    tail -n +$((last_brace_line + 1)) package.json
else
    echo "✅ No extra content after JSON"
fi

# Test JSON parsing
echo ""
echo "10. Testing JSON parsing:"
if jq empty package.json 2>/dev/null; then
    echo "✅ JSON is valid"
else
    echo "❌ JSON Error:"
    jq empty package.json
fi
