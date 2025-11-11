Write-Host "=== Debugging package.json issues ===" -ForegroundColor Green
Write-Host ""

# Check file encoding
Write-Host "1. Checking file encoding:" -ForegroundColor Yellow
try {
    $bytes = [System.IO.File]::ReadAllBytes("package.json")
    Write-Host "First 10 bytes: $($bytes[0..9] -join ', ')" -ForegroundColor White
} catch {
    Write-Host "Error reading file bytes: $_" -ForegroundColor Red
}

# Check for BOM
Write-Host ""
Write-Host "2. Checking for BOM:" -ForegroundColor Yellow
try {
    $bytes = [System.IO.File]::ReadAllBytes("package.json")
    if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
        Write-Host "❌ UTF-8 BOM detected" -ForegroundColor Red
    } else {
        Write-Host "✅ No BOM detected" -ForegroundColor Green
    }
} catch {
    Write-Host "Error checking BOM: $_" -ForegroundColor Red
}

# Check line endings
Write-Host ""
Write-Host "3. Checking line endings:" -ForegroundColor Yellow
$content = Get-Content package.json -Raw
if ($content -match "`r`n") {
    Write-Host "Windows line endings (CRLF) detected" -ForegroundColor White
} elseif ($content -match "`n") {
    Write-Host "Unix line endings (LF) detected" -ForegroundColor White
} else {
    Write-Host "No line endings detected" -ForegroundColor Yellow
}

# Check content around position 2298
Write-Host ""
Write-Host "4. Content around position 2298:" -ForegroundColor Yellow
if ($content.Length -gt 2310) {
    $start = [Math]::Max(0, 2290)
    $end = [Math]::Min($content.Length - 1, 2310)
    $snippet = $content.Substring($start, $end - $start + 1)
    Write-Host "Characters $start-$end`: '$snippet'" -ForegroundColor White
    
    for ($i = $start; $i -le $end; $i++) {
        if ($i -lt $content.Length) {
            $char = $content[$i]
            $ascii = [int][char]$char
            Write-Host "Pos $i`: '$char' (ASCII: $ascii)" -ForegroundColor Gray
        }
    }
}

# Test JSON parsing
Write-Host ""
Write-Host "5. Testing JSON parsing:" -ForegroundColor Yellow
try {
    $json = Get-Content package.json -Raw | ConvertFrom-Json
    Write-Host "✅ JSON is valid" -ForegroundColor Green
} catch {
    Write-Host "❌ JSON Error: $($_.Exception.Message)" -ForegroundColor Red
}
