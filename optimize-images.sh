#!/bin/bash

# Image Optimization Script
# Dieses Script optimiert alle Bilder für bessere Performance

echo "🖼️  Starting Image Optimization..."

# Prüfe ob ImageMagick installiert ist
if ! command -v convert &> /dev/null; then
    echo "⚠️  ImageMagick ist nicht installiert!"
    echo "Installation:"
    echo "  Ubuntu/Debian: sudo apt-get install imagemagick"
    echo "  macOS: brew install imagemagick"
    echo "  Windows: https://imagemagick.org/script/download.php"
    exit 1
fi

# Erstelle optimierte Versionen
echo "📦 Optimizing images..."

# Avatar optimieren
if [ -f "images/vural-avci-avatar.jpg" ]; then
    convert images/vural-avci-avatar.jpg -resize 400x400^ -gravity center -extent 400x400 -quality 85 images/vural-avci-avatar-optimized.jpg
    echo "✅ Avatar optimiert"
fi

# Projekt-Bilder optimieren
for i in 1 2 3; do
    if [ -f "images/project-$i.jpg" ]; then
        convert images/project-$i.jpg -resize 800x600^ -gravity center -extent 800x600 -quality 85 images/project-$i-optimized.jpg
        echo "✅ Projekt $i optimiert"
    fi
done

# OG Image erstellen (falls nicht vorhanden)
if [ ! -f "images/og-image.jpg" ]; then
    echo "⚠️  OG-Image nicht gefunden. Bitte erstellen Sie images/og-image.jpg (1200x630px)"
fi

echo ""
echo "🎉 Optimierung abgeschlossen!"
echo ""
echo "Nächste Schritte:"
echo "1. Überprüfen Sie die optimierten Bilder (*-optimized.jpg)"
echo "2. Ersetzen Sie die Originale mit den optimierten Versionen"
echo "3. Laden Sie alles auf Ihren Server hoch"
echo ""
