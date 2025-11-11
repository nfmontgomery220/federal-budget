#!/bin/bash

# Step 1: Check current status
echo "=== Checking Git Status ==="
git status
git log --oneline -5

# Step 2: Backup current work (just in case)
echo "=== Creating Backup Branch ==="
git checkout -b backup-$(date +%Y%m%d-%H%M%S)
git add .
git commit -m "Backup before sync resolution"

# Step 3: Return to main and clean up
echo "=== Cleaning Up Main Branch ==="
git checkout main
git fetch origin
git status

# Step 4: Reset to match remote (CAUTION: This will lose local changes)
echo "=== Hard Reset to Remote (WARNING: Will lose uncommitted changes) ==="
# git reset --hard origin/main

# Alternative Step 4: Merge strategy (safer)
echo "=== Alternative: Merge Remote Changes ==="
git pull origin main --no-ff

# Step 5: Check for conflicts and resolve
echo "=== Checking for Conflicts ==="
git status
