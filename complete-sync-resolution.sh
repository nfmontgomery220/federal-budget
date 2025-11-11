#!/bin/bash

echo "=== Federal Budget Analysis Tool - Complete Sync Resolution ==="

# Step 1: Backup your current work
echo "1. Creating backup of current work..."
cd /path/to/your/current/project
git checkout -b backup-$(date +%Y%m%d-%H%M%S)
git add .
git commit -m "Backup before sync resolution"

# Step 2: Create fresh project using NPX
echo "2. Creating fresh project with NPX..."
cd ..
mkdir federal-budget-fresh
cd federal-budget-fresh

# Initialize new Next.js project
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"

# Install shadcn/ui
npx shadcn@latest init

# Install all required shadcn components
npx shadcn@latest add accordion alert alert-dialog avatar badge button card checkbox dialog dropdown-menu input label progress radio-group select separator slider switch tabs textarea toast tooltip

# Install additional dependencies
npm install @supabase/supabase-js recharts lucide-react date-fns react-hook-form @hookform/resolvers zod sonner vaul cmdk

echo "3. Project setup complete. Now copy the v0 files..."
echo "4. Replace the default files with v0 content..."
echo "5. Test locally with 'npm run dev'"
echo "6. Push to GitHub and deploy to Vercel"
