# Vural Avci — SAP BTP AI & Full-Stack Architecture

Produktive Portfolio-Website für [vuralavci.de](https://vuralavci.de/).

## Positionierung

- SAP BTP AI & Full-Stack Solution Architect
- Enterprise AI, Clean Core und Side-by-Side Extensibility
- CAP, ABAP RAP, SAPUI5/Fiori, Integration Suite und Event Mesh
- Verfügbar nach Absprache für Remote-Projekte im DACH-Raum

Die Projektdarstellungen sind bewusst anonymisiert. Die bestehenden Kundenlogos
unter `images/logos/` sind freigegebene Bestandsassets und dürfen bei Änderungen
nicht ersetzt, umbenannt oder einzelnen anonymisierten Cases zugeordnet werden.
Das primäre Markenlogo liegt unverändert unter `images/vural-avci-logo.png` und
wird im Header, Footer sowie in den Marken-Metadaten der Website verwendet.

## Technischer Aufbau

- Statisches HTML, CSS und Vanilla JavaScript
- Netlify Hosting mit Forms, Redirects und Security Headern
- Responsive Dark-/Light-Theme ohne externe Fonts oder Tracking
- Strukturierte Daten, Sitemap, Manifest und Social Preview

## Lokal starten

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

Danach `http://127.0.0.1:8765/` öffnen.

## Checks

```powershell
npm run check
git diff --check
```

Vor einer Veröffentlichung zusätzlich Desktop und Mobile, Navigation,
Formularvalidierung, rechtliche Seiten, Kundenlogos und alle lokalen Assets
visuell prüfen.

## Datenschutz im Betrieb

- Verifizierte und als Spam markierte Netlify-Forms-Einsendungen regelmäßig
  prüfen und grundsätzlich spätestens sechs Monate nach Abschluss der Anfrage
  löschen, sofern keine gesetzlichen Aufbewahrungsgründe entgegenstehen.
- Benachrichtigungen und Webhooks im Netlify-Dashboard bei Änderungen als
  zusätzliche Empfänger in der Datenschutzerklärung dokumentieren.
- Die Auftragsverarbeitungsregelungen für Netlify und IONOS im jeweiligen
  Kundenkonto aktuell halten.
- Vor dem Einbau von Analytics, externen Medien, Schriftarten oder weiteren
  Formularanbietern die Datenschutzerklärung und eine mögliche
  Einwilligungspflicht neu prüfen.

## Deployment

Netlify veröffentlicht den Repository-Root. Der produktive Stand wird über
`main` ausgeliefert. CSS, JavaScript und das Markenlogo werden wegen ihrer
stabilen Dateinamen bei jedem Aufruf revalidiert; nur die unveränderten
Kundenlogos werden dauerhaft immutable gecacht.
