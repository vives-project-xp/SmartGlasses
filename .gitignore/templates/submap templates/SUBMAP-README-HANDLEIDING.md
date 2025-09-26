# 📖 Handleiding: Sub-map README Template

## 🎯 Wat is dit Template?

Deze template is een **universele basis** voor README bestanden in sub-mappen van jullie project. Het is ontworpen om:

- **Consistentie** te bieden tussen verschillende onderdelen
- **Tijd te besparen** - geen nieuwe README vanaf nul schrijven  
- **Volledigheid** te garanderen - alle belangrijke secties zijn er
- **Flexibiliteit** te hebben - gebruik alleen wat je nodig hebt

## 🚀 Hoe Te Gebruiken

### Stap 1: Kopieer het Template
```bash
# Navigeer naar je sub-map
cd research/[je-submap]

# Kopieer het template  
cp ../SUBMAP-README-TEMPLATE.md README.md
```

### Stap 2: Pas Aan Voor Jouw Context

#### Basis Aanpassingen (ALTIJD doen)
Vervang alle **[placeholders]** met jouw specifieke inhoud:

| Placeholder | Vervang door | Voorbeeld |
|-------------|--------------|-----------|
| `[MAP NAAM]` | Naam van je map | `Sensors`, `Camera Module`, `Power Management` |
| `[ONDERWERP/COMPONENT]` | Wat dit onderdeel is | `Hardware Sensoren`, `Energy Analysis`, `Software Testing` |
| `[Datum]` | Huidige datum | `26 September 2024` |
| `[Naam]` | Jouw naam | `Jan Janssen` |
| `[map-naam]` | Technische map naam | `sensors`, `camera-module`, `power-mgmt` |

#### Status Instellen
Kies de juiste status emoji:
- 🟡 **In Progress** - Als je er nu aan werkt
- ✅ **Voltooid** - Als alles klaar is  
- ⭕ **Gepland** - Als je nog moet beginnen
- ❌ **Geblokkeerd** - Als je wacht op iets anders

### Stap 3: Secties Aanpassen

#### Verwijder Niet-Relevante Secties
Niet elke map heeft alles nodig. Verwijder secties die niet van toepassing zijn:

**Voor Hardware Research**:
- Behoud: Doelstellingen, Status, Documentatie, Testing
- Overweeg weg te laten: Environment Variables, Scripts

**Voor Software Development**:  
- Behoud: Testing, Configuratie, Commands/Scripts
- Overweeg weg te laten: Metrics (tenzij performance testing)

**Voor Documentatie/Research**:
- Behoud: Overzicht, Status, Documentatie, Resultaten  
- Overweeg weg te laten: Commands/Scripts, Testing

#### Voeg Specifieke Secties Toe
Voeg secties toe die specifiek zijn voor jouw context:

**Hardware**:
```markdown
## 🔌 Hardware Specs
- **Model**: [Model nummer]
- **Voeding**: [Voltage/Current]  
- **Interface**: [I2C/SPI/GPIO]
- **Afmetingen**: [L x B x H]
```

**Software**:
```markdown
## 🏗️ Architectuur
- **Framework**: [Naam framework]
- **Dependencies**: [Belangrijkste deps]
- **API Endpoints**: [Als relevant]
```

**Research**:
```markdown
## 🔬 Methodologie  
- **Approach**: [Hoe aangepakt]
- **Tools Used**: [Software/hardware gebruikt]
- **Data Sources**: [Waar data vandaan]
```

## 📋 Checklist voor Goede README

### ✅ Basis Vereisten
- [ ] Alle [placeholders] vervangen
- [ ] Status emoji ingesteld
- [ ] Doel/overzicht ingevuld
- [ ] Bestandsstructuur correct
- [ ] Contact info toegevoegd

### ✅ Content Quality
- [ ] Doelstellingen zijn SMART (Specific, Measurable, Achievable, Relevant, Time-bound)
- [ ] Status tabel is up-to-date
- [ ] Belangrijke bestanden uitgelegd
- [ ] Links werken (intern en extern)
- [ ] Stappen zijn actionable

### ✅ Team Collaboration  
- [ ] Verantwoordelijkheden duidelijk
- [ ] Contact info accuraat
- [ ] Dependencies met andere teams genoemd
- [ ] Changelog bijgehouden

## 🎨 Aanpassings Voorbeelden

### Voorbeeld 1: Hardware Sensor Map
```markdown
# Gyroscope Sensor - Hardware Research

> **Laatst bijgewerkt**: 26 Sept 2024 door Marie Peeters
> **Status**: 🟡 In Progress

## 📋 Overzicht
**Doel van deze map**: Onderzoek en documentatie van de gyroscope sensor voor bewegingsdetectie in de SmartGlasses.

**Wat vind je hier**:
- Datasheet en specificaties
- Test resultaten en kalibratie data  
- Arduino code voorbeelden
- Integratie documentatie met Raspberry Pi
```

### Voorbeeld 2: Software Component Map  
```markdown  
# User Interface - Frontend Components

> **Laatst bijgewerkt**: 26 Sept 2024 door Tom Willems  
> **Status**: ✅ Voltooid

## 📋 Overzicht
**Doel van deze map**: React componenten voor de SmartGlasses companion app interface.

**Wat vind je hier**:
- React component library
- CSS/SCSS styling bestanden
- Unit tests en Storybook stories  
- Design system documentatie
```

### Voorbeeld 3: Research/Analysis Map
```markdown
# Energy Consumption Analysis - Research Results  

> **Laatst bijgewerkt**: 26 Sept 2024 door Lisa Chen
> **Status**: ✅ Voltooid

## 📋 Overzicht  
**Doel van deze map**: Analyse van energie-verbruik patronen voor verschillende SmartGlasses configuraties.

**Wat vind je hier**:
- Meetdata en Excel analyses
- Python scripts voor data processing
- Grafieken en visualisaties
- Conclusies en aanbevelingen
```

## 🔧 Handige Tips

### Voor Markdown Formatting
```markdown  
# Gebruik headers consequent
## Hoofdsectie (##)
### Subsectie (###)  
#### Details (####)

# Status emoji's consistent gebruiken
✅ Voltooid    🟡 In Progress    ⭕ Gepland    ❌ Geblokkeerd

# Tables voor gestructureerde data
| Kolom 1 | Kolom 2 | Status |
|---------|---------|--------|
| Data    | Data    | ✅     |
```

### Voor Links
```markdown
# Interne links (relatieve paden)  
[Andere map](../andere-map/)
[Bestand in parent](../README.md)
[Sub-bestand](./subfolder/file.md)

# Externe links
[Resource](https://example.com) - Beschrijf waarom nuttig

# Anker links binnen document
[Spring naar sectie](#-resultaten--bevindingen)
```

### Voor Code Blocks
```markdown
# Specifieke taal voor syntax highlighting
```python
# Python code hier
import numpy as np
```

```bash  
# Terminal commands hier
cd /path/to/directory
npm install
```

```json
{
  "config": "value"
}
```

## 🚨 Veelgemaakte Fouten

### ❌ Wat NIET te doen
- Placeholders laten staan zonder invullen
- Links die niet werken (test ze!)
- Status niet updaten als je klaar bent
- Te lange paragrafen - gebruik bullets en headers
- Geen contact info - team kan je niet vinden

### ✅ Best Practices  
- Houd het beknopt maar compleet
- Update regelmatig (minimaal wekelijks)
- Test alle links voordat je commit
- Gebruik screenshots voor complexe UI/setup
- Voeg altijd datum toe bij belangrijke updates

## 🔄 Onderhoud & Updates

### Wekelijks
- [ ] Status updaten in tabel
- [ ] Nieuwe bestanden toevoegen aan structuur  
- [ ] Changelog bijwerken voor belangrijke changes

### Per Milestone
- [ ] Doelstellingen reviewen en aanpassen
- [ ] Lessons learned toevoegen
- [ ] Team verantwoordelijkheden checken  
- [ ] Links en references valideren

### Bij Project Einde  
- [ ] Finale status zetten (alles ✅ of duidelijk waarom niet)
- [ ] Complete conclusies en resultaten
- [ ] Handover documentatie voor volgende team/semester
- [ ] Archive oude/irrelevante secties

---

**Template versie**: 1.0  
**Voor vragen over dit template**: [Je naam en contact]  
**Laatst bijgewerkt**: 26 September 2024