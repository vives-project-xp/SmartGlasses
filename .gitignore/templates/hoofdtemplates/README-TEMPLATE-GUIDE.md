# 📋 README Template Gebruikershandleiding

Deze handleiding legt uit hoe je de `README-TEMPLATE.md` kunt gebruiken voor je VIVES Bachelor ICT projecten.

## 🎯 Wat is deze template?

De README template is een herbruikbare structuur die je kunt gebruiken voor al je Project Experience projecten. Het bevat alle essentiële secties die een professionele GitHub README nodig heeft.

## 🔄 Hoe gebruik je de template?

### Stap 1: Kopieer de template
```bash
cp README-TEMPLATE.md README.md
```

### Stap 2: Vervang alle placeholders

Zoek en vervang de volgende placeholders in je nieuwe README.md:

| Placeholder | Vervang door | Voorbeeld |
|-------------|-------------|-----------|
| `[PROJECT_NAME]` | Je projectnaam | SmartGlasses |
| `[PROJECT_SUBTITLE]` | Korte beschrijving | Gebarentaal naar Tekst & Geluid |
| `[VERSION]` | Project Experience versie | 2.1 |
| `[REPO_NAME]` | GitHub repository naam | SmartGlasses |
| `[PROJECT_DESCRIPTION]` | Uitgebreide beschrijving | Een innovatief project voor... |
| `[PROJECT_GOAL_DESCRIPTION]` | Doel van het project | Ons doel is het creëren van... |
| `[PROJECT_MISSION_DESCRIPTION]` | Missie beschrijving | Onze smart glasses herkennen... |
| `[FRONTEND_TECH]` | Frontend technologie | React, Vue.js, Angular |
| `[BACKEND_TECH]` | Backend technologie | Node.js, Python, Java |
| `[DATABASE_TECH]` | Database technologie | MongoDB, PostgreSQL, MySQL |
| `[PROCESSING_TECH]` | Processing technologie | TensorFlow, OpenCV |
| `[SERVICE_DESCRIPTION]` | Service beschrijving | Authentication, File Storage |
| `[ANALYTICS_TOOL]` | Analytics tool | Google Analytics, Mixpanel |
| `[DATABASE]` | Database type | PostgreSQL, MongoDB |
| `[NAAM]` | Teamlid naam | Jan Janssen |
| `[YEAR]` | Huidige jaar | 2025 |
| `[SEMESTER]` | Semester nummer | 1 |
| `[team-email@student.vives.be]` | Team email | smartglasses@student.vives.be |

### Stap 3: Pas secties aan naar je project

#### 🔧 Technische Architectuur
- Pas de hardware/infrastructure componenten aan
- Update de software stack naar je technologieën
- Voeg specifieke tools toe die je gebruikt

#### 📁 Project Structuur
- Wijzig de mappenstructuur naar je werkelijke setup
- Voeg/verwijder mappen die relevant zijn voor je project
- Update bestandsnamen en extensies

#### 👥 Team
- Vul echte namen en rollen in
- Pas verantwoordelijkheden aan naar jullie taakverdeling
- Voeg GitHub usernames toe

#### 📈 Roadmap
- Update de sprints naar je werkelijke planning
- Pas taken aan naar je project requirements
- Zet de juiste statussen (✅ voltooid, 🔄 bezig, ⏳ gepland)

### Stap 4: Verwijder niet-relevante secties

Niet alle secties zijn voor elk project nodig. Verwijder secties die niet van toepassing zijn:

- **🐳 Docker sectie** - als je geen containerization gebruikt
- **📱 Mobile app** - als je geen mobile component hebt
- **☁️ Cloud services** - als je alleen lokaal werkt
- **🏆 Achievements** - in het begin van het project
- **📊 Statistics badges** - totdat je repository actief is

### Stap 5: Voeg project-specifieke content toe

#### Voor Hardware projecten:
- Voeg component diagrammen toe
- Elektrische schema's (in docs/ folder)
- 3D modellen of CAD bestanden
- Power consumption berekeningen

#### Voor Software projecten:
- API documentatie
- Database schema's
- Wireframes/mockups
- Architecture diagrammen

#### Voor AI/ML projecten:
- Dataset beschrijvingen
- Model architectuur
- Training procedures
- Performance metrics

## 🎨 Styling Tips

### Emoji gebruik
- Gebruik consistent emoji's voor secties
- Kies emoji's die passen bij je project thema
- Houd het professioneel en niet overdreven

### Badge aanpassingen
```markdown
<!-- Voeg project-specifieke badges toe -->
[![Build Status](https://img.shields.io/github/workflow/status/user/repo/CI)](link)
[![Code Coverage](https://img.shields.io/codecov/c/github/user/repo)](link)
[![Dependencies](https://img.shields.io/david/user/repo)](link)
```

### Tabellen
- Gebruik tabellen voor gestructureerde informatie
- Houd kolommen niet te breed
- Voeg status indicators toe waar relevant

## ✅ Checklist voor een complete README

- [ ] **Project titel en beschrijving** duidelijk en aantrekkelijk
- [ ] **VIVES badges** correct ingesteld
- [ ] **Installatie instructies** getest en werkend
- [ ] **Team informatie** compleet en up-to-date
- [ ] **Roadmap** realistisch en actueel
- [ ] **Contact informatie** correct
- [ ] **Licentie** toegevoegd (MIT is standaard)
- [ ] **Contributing guidelines** aangepast aan je workflow
- [ ] **Links naar documentatie** werkend
- [ ] **Screenshots/demo** toegevoegd (indien applicable)
- [ ] **Alle placeholders vervangen**
- [ ] **Markdown lint errors opgelost**
- [ ] **Spelling en grammatica gecontroleerd**

## 🚀 Pro Tips

1. **Voeg screenshots toe vroeg in het project** - ook work-in-progress shots zijn waardevol
2. **Update regelmatig** - houd de roadmap en status up-to-date
3. **Link naar live demo** - als je een deployed versie hebt
4. **Voeg GIF's toe** - voor demonstratie van functionaliteit
5. **Gebruik relative links** - voor interne documentatie
6. **Test alle links** - zorg dat externe links werken
7. **Markdown preview** - bekijk altijd de gerenderde versie
8. **Mobile-friendly** - GitHub toont README's op mobile devices

## 🔗 Handige Resources

- [Markdown Guide](https://www.markdownguide.org/) - Voor markdown syntax
- [Shields.io](https://shields.io/) - Voor mooie badges
- [GitHub Emoji Cheat Sheet](https://github.com/ikatyang/emoji-cheat-sheet) - Voor emoji codes
- [Awesome README](https://github.com/matiassingers/awesome-readme) - Inspiratie voorbeelden

## 🐛 Veelvoorkomende Problemen

### Markdown Lint Errors
```bash
# Installeer markdownlint (optioneel)
npm install -g markdownlint-cli

# Check je README
markdownlint README.md
```

### Badge URLs niet werkend
- Controleer repository naam spelling
- Zorg dat repository public is
- Wacht even na aanmaken repository

### Links naar documentatie werken niet
- Gebruik relative paths: `./docs/` niet `/docs/`
- Zorg dat bestanden bestaan
- Let op case sensitivity

---

**💡 Tip**: Bewaar deze template in je eigen GitHub als persoonlijke reference!