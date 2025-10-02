# SmartGlasses - Gebarentaal naar Tekst & Geluid

[![VIVES](https://img.shields.io/badge/VIVES-Bachelor_ICT-blue?style=flat)](https://www.vives.be)
[![Project Experience](https://img.shields.io/badge/Project_Experience-2.1-green?style=flat)](https://github.com/vives-project-xp)
[![GitHub](https://img.shields.io/github/stars/vives-project-xp/SmartGlasses?style=social)](https://github.com/vives-project-xp/SmartGlasses)

> **Een innovatief project voor de vertaling van gebarentaal naar tekst en spraak met behulp van smart glasses technologie.**

---

## Projectoverzicht

Het **SmartGlasses** project is een ambitieus initiatief ontwikkeld door studenten van **VIVES Bachelor ICT** voor het vak **Project Experience 2.1**. Ons doel is het creëren van een toegankelijkheidsoplossing die de communicatiekloof tussen dove/slechthorende personen en horende personen overbrugt.

### Missie

Onze smart glasses herkennen gebarentaal in real-time en vertalen deze naar:

- **Tekstweergave** op het display van de bril
- **Spraakuitvoer** voor omstanders
- **Mobiele notificaties** voor uitgebreide communicatie

---

## Hoofdfuncties

| Functie | Beschrijving | Status |
|---------|--------------|--------|
| **Gebarenherkenning** | AI-gestuurde herkenning van Nederlandse Gebarentaal (NGT) |  In ontwikkeling |
| **Tekst Conversie** | Real-time vertaling naar Nederlandse tekst |  In ontwikkeling |
| **Text-to-Speech** | Spraakuitvoer met Nederlandse stem |  Gepland |
| **App Integratie** | Mobiele app voor instellingen en geschiedenis |  Gepland |


---

## Technische Architectuur

### Hardware Components

```text
 Smart Glasses
├── camera Module (Gebarendetectie)
├── Display (Tekstweergave)  
├── Microfoon Array (Audio input)
├── Mini Speaker (Audio output)
├── Lithium Batterij (Voeding)
├── Wi-Fi/Bluetooth Module (Connectiviteit)
└── Raspberry Pi Zero/Compute Module (Processing)
```

### Software Stack

```text
AI & Machine Learning
├── Computer Vision (OpenCV, MediaPipe)
├── Deep Learning (TensorFlow, PyTorch)
├── NLP & TTS (pyttsx3, gTTS)
└── Data Processing (NumPy, Pandas)

 Backend Services
├── Python API (Flask/FastAPI)
├── Database (SQLite/PostgreSQL)
└── Real-time Processing
```

---

## Project Structuur

```text
SmartGlasses/
├── README.md                    # Dit bestand
├── research/                    # Onderzoek en documentatie
│   ├── hardware/               # Hardware research
│   │   └── raspberry-pi/          # Raspberry Pi specs & power consumption
│   └── software/               # Software research
├── src/                        # Source code (komt binnenkort)
├── mobile-app/                 # Mobiele app (komt binnenkort)
├── tests/                      # Unit tests en integratie tests
├── data/                       # Training data en modellen
└── docs/                       # Technische documentatie
```

---

## Getting Started

### Vereisten

- **Python 3.8+**
- **Camera** (voor testen)
- **Linux/Windows/macOS**
- **Git** voor version control

### Installatie

```bash
# Clone de repository
git clone https://github.com/vives-project-xp/SmartGlasses.git
cd SmartGlasses

# Maak virtuele omgeving aan
python -m venv venv
source venv/bin/activate  # Linux/macOS
# venv\Scripts\activate   # Windows

# Installeer dependencies (komt binnenkort)
pip install -r requirements.txt
```

---

## Team

## VIVES Bachelor ICT - Project Experience 2.1

| Member                    |Taak|
| ---------------------- |------------------------------|
| [Simon Stijnen](https://github.com/SimonStnn)    | tba  |
| [Kyell De Windt](https://github.com/kyell182)    | tba  |
| [Lynn Delaere](https://github.com/LynnDelaere)    | tba  |
| [Olivier Westerman](https://github.com/OlivierWesterman)    | tba  |
| [Timo Plets](https://github.com/TimoPlets)    | tba  |

---

## Roadmap

### Sprint 1 (Huidig)

- [ ] Project setup en planning
- [ ] Technisch onderzoek
- [ ] Basis camera integratie
- [ ] Eerste ML model training

### Sprint 2 (Volgende)

### Sprint 3 (Toekomst)

---

## Bijdragen

We verwelkomen bijdragen van de VIVES community!

1. **Fork** het project
2. **Maak** een feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** je wijzigingen (`git commit -m 'Add AmazingFeature'`)
4. **Push** naar de branch (`git push origin feature/AmazingFeature`)
5. **Open** een Pull Request(`git pull origin main`)

---

## Documentatie

---

## Academische Context

**Universiteit:** VIVES Hogeschool  
**Opleiding:** Bachelor ICT  
**Vak:** Project Experience 2.1  
**Academiejaar:** 2025-2026  
**Semester:** 1  

### Leeruitkomsten

- **Innovatie**: Toepassing van emerging technologies
- **Teamwerk**: Agile projectmanagement en samenwerking
- **Onderzoek**: Technisch onderzoek en documentatie
- **Ontwikkeling**: Full-stack ontwikkeling met hardware integratie
- **Probleemoplossing**: Toegankelijkheidsuitdagingen aanpakken

---

## Dankwoord

Speciale dank aan:

- **VIVES docenten** voor hun begeleiding en expertise
- **Dove gemeenschap** voor input en feedback over toegankelijkheid
- **Open source community** voor de geweldige tools en frameworks
- **Medestudenten** voor samenwerking en peer review

---

**Vergeet niet om dit project een ster te geven als je het interessant vindt!**

Gemaakt met liefde door VIVES Bachelor ICT studenten
