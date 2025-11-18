# Image Optimization Check Script for Windows
# Überprüft die Website und gibt Optimierungsempfehlungen

Write-Host "🔍 Website Quality Check - Vural Avci Portfolio" -ForegroundColor Cyan
Write-Host ""

$issues = @()
$warnings = @()
$success = @()

# Prüfe kritische Dateien
Write-Host "📁 Checking Files..." -ForegroundColor Yellow

$criticalFiles = @(
    "index.html",
    "styles.css", 
    "script.js",
    "js/particles.js",
    "manifest.json",
    "sitemap.xml",
    "robots.txt",
    ".htaccess",
    "404.html"
)

foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        $success += "✅ $file exists"
    } else {
        $issues += "❌ $file missing!"
    }
}

# Prüfe Bilder
Write-Host ""
Write-Host "🖼️  Checking Images..." -ForegroundColor Yellow

$imageFiles = @(
    "images/vural-avci-avatar.jpg",
    "images/project-1.jpg",
    "images/project-2.jpg", 
    "images/project-3.jpg"
)

foreach ($img in $imageFiles) {
    if (Test-Path $img) {
        $fileInfo = Get-Item $img
        $sizeMB = [math]::Round($fileInfo.Length / 1MB, 2)
        
        if ($sizeMB -gt 0.5) {
            $warnings += "⚠️  $img ist $sizeMB MB (sollte < 0.5 MB sein)"
        } else {
            $success += "✅ $img OK ($sizeMB MB)"
        }
    } else {
        $issues += "❌ $img fehlt - bitte ersetzen!"
    }
}

# Prüfe OG-Image
if (!(Test-Path "images/og-image.jpg")) {
    $issues += "❌ images/og-image.jpg fehlt - ERSTELLEN Sie ein 1200x630px Bild!"
}

# Prüfe PDFs
Write-Host ""
Write-Host "📄 Checking PDFs..." -ForegroundColor Yellow

if (!(Test-Path "docs/profile_vural_avci.pdf")) {
    $warnings += "⚠️  docs/profile_vural_avci.pdf fehlt"
}
if (!(Test-Path "docs/projects_vural_avci.pdf")) {
    $warnings += "⚠️  docs/projects_vural_avci.pdf fehlt"
}

# Prüfe Impressum
Write-Host ""
Write-Host "📋 Checking Content..." -ForegroundColor Yellow

$impressum = Get-Content "impressum.html" -Raw
if ($impressum -match "\[Ihre") {
    $issues += "❌ Impressum nicht ausgefüllt (impressum.html)"
} else {
    $success += "✅ Impressum ausgefüllt"
}

# Ausgabe
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📊 RESULTS" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

if ($success.Count -gt 0) {
    Write-Host "✅ SUCCESS ($($success.Count))" -ForegroundColor Green
    foreach ($item in $success) {
        Write-Host "   $item" -ForegroundColor Green
    }
    Write-Host ""
}

if ($warnings.Count -gt 0) {
    Write-Host "⚠️  WARNINGS ($($warnings.Count))" -ForegroundColor Yellow
    foreach ($item in $warnings) {
        Write-Host "   $item" -ForegroundColor Yellow
    }
    Write-Host ""
}

if ($issues.Count -gt 0) {
    Write-Host "❌ CRITICAL ISSUES ($($issues.Count))" -ForegroundColor Red
    foreach ($item in $issues) {
        Write-Host "   $item" -ForegroundColor Red
    }
    Write-Host ""
}

# Zusammenfassung
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

if ($issues.Count -eq 0 -and $warnings.Count -eq 0) {
    Write-Host "🎉 PERFEKT! Ihre Website ist bereit für den Go-Live!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Nächste Schritte:" -ForegroundColor Cyan
    Write-Host "1. Laden Sie alle Dateien auf Ihren Webserver hoch" -ForegroundColor White
    Write-Host "2. Konfigurieren Sie SSL (Let's Encrypt)" -ForegroundColor White
    Write-Host "3. Testen Sie die Live-Website" -ForegroundColor White
    Write-Host "4. Lighthouse-Score prüfen (Ziel: 90+)" -ForegroundColor White
} elseif ($issues.Count -eq 0) {
    Write-Host "🟡 Fast fertig! Noch ein paar Warnings..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Bitte beheben Sie die Warnings oben." -ForegroundColor White
} else {
    Write-Host "Noch nicht fertig - Bitte beheben Sie die Issues!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Siehe TODO.md fuer Details" -ForegroundColor White
}

Write-Host ""
Write-Host "Details siehe: TODO.md" -ForegroundColor Cyan
Write-Host ""
