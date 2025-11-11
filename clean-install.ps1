# PowerShell version for Windows

Write-Host "=== Clean Installation Process ===" -ForegroundColor Green
Write-Host ""

# Remove problematic files
Write-Host "🧹 Cleaning up existing installation..." -ForegroundColor Yellow
if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }
if (Test-Path "package-lock.json") { Remove-Item -Force "package-lock.json" }
if (Test-Path "yarn.lock") { Remove-Item -Force "yarn.lock" }
if (Test-Path "pnpm-lock.yaml") { Remove-Item -Force "pnpm-lock.yaml" }
Write-Host "✅ Removed node_modules and lock files" -ForegroundColor Green

# Clear npm cache
Write-Host ""
Write-Host "🗑️ Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force
Write-Host "✅ NPM cache cleared" -ForegroundColor Green

# Install with legacy peer deps to resolve conflicts
Write-Host ""
Write-Host "📦 Installing dependencies with legacy peer deps..." -ForegroundColor Yellow
$installResult = Start-Process -FilePath "npm" -ArgumentList "install", "--legacy-peer-deps" -Wait -PassThru -NoNewWindow

if ($installResult.ExitCode -eq 0) {
    Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 You can now run:" -ForegroundColor Cyan
    Write-Host "  npm run dev" -ForegroundColor White
    Write-Host "  npx shadcn@latest add button" -ForegroundColor White
} else {
    Write-Host "❌ Installation failed. Trying with force flag..." -ForegroundColor Red
    $forceResult = Start-Process -FilePath "npm" -ArgumentList "install", "--force" -Wait -PassThru -NoNewWindow
    
    if ($forceResult.ExitCode -eq 0) {
        Write-Host "✅ Dependencies installed with --force!" -ForegroundColor Green
    } else {
        Write-Host "❌ Both methods failed. Manual intervention required." -ForegroundColor Red
        Write-Host ""
        Write-Host "Try these steps:" -ForegroundColor Yellow
        Write-Host "1. Delete package-lock.json" -ForegroundColor White
        Write-Host "2. Use yarn instead: yarn install" -ForegroundColor White
        Write-Host "3. Or use pnpm: pnpm install" -ForegroundColor White
    }
}
