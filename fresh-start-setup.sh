#!/bin/bash

echo "=== Federal Budget Analysis Tool - Fresh Start Setup ==="

# Step 1: Backup current work
echo "1. Creating backup of current work..."
mv federal-budget federal-budget.old
echo "✅ Moved current code to federal-budget.old"

# Step 2: Create fresh project
echo "2. Creating fresh Next.js project..."
npx create-next-app@latest federal-budget --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
cd federal-budget

# Step 3: Initialize shadcn/ui
echo "3. Setting up shadcn/ui..."
npx shadcn@latest init -y

# Step 4: Install all required shadcn components
echo "4. Installing shadcn components..."
npx shadcn@latest add accordion alert alert-dialog avatar badge button card checkbox dialog dropdown-menu input label progress radio-group select separator slider switch tabs textarea toast tooltip

# Step 5: Install additional dependencies
echo "5. Installing additional dependencies..."
npm install @supabase/supabase-js recharts lucide-react date-fns react-hook-form @hookform/resolvers zod sonner vaul cmdk

echo "6. ✅ Fresh project setup complete!"
echo "7. Now copy the v0 files to replace the default ones..."
