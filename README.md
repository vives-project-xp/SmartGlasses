# 👓 SmartGlasses - Gebarentaal naar Tekst & Geluid

[![VIVES](https://img.shields.io/badge/VIVES-Bachelor_ICT-blue?style=flat&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K)](https://www.vives.be)
[![Project Experience](https://img.shields.io/badge/Project_Experience-2.1-green?style=flat)](https://github.com/vives-project-xp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/github/stars/vives-project-xp/SmartGlasses?style=social)](https://github.com/vives-project-xp/SmartGlasses)

> **🎯 Een innovatief project voor de vertaling van gebarentaal naar tekst en spraak met behulp van smart glasses technologie.**

---

## 📋 Projectoverzicht

Het **SmartGlasses** project is een ambitieus initiatief ontwikkeld door studenten van **VIVES Bachelor ICT** voor het vak **Project Experience 2.1**. Ons doel is het creëren van een toegankelijkheidsoplossing die de communicatiekloof tussen dove/slechthorende personen en horende personen overbrugt.

### 🎯 Missie

Onze smart glasses herkennen gebarentaal in real-time en vertalen deze naar:

- **📝 Tekstweergave** op het display van de bril
- **🔊 Spraakuitvoer** voor omstanders
- **📱 Mobiele notificaties** voor uitgebreide communicatie

---

## ✨ Hoofdfuncties

| Functie | Beschrijving | Status |
|---------|--------------|--------|
| **🤖 Gebarenherkenning** | AI-gestuurde herkenning van Nederlandse Gebarentaal (NGT) | 🔄 In ontwikkeling |
| **📝 Tekst Conversie** | Real-time vertaling naar Nederlandse tekst | 🔄 In ontwikkeling |
| **🔊 Text-to-Speech** | Spraakuitvoer met Nederlandse stem | 📋 Gepland |
| **📱 App Integratie** | Mobiele app voor instellingen en geschiedenis | 📋 Gepland |
| **⚡ Batterij Optimalisatie** | Energiezuinig ontwerp voor dagelijks gebruik | 🔄 In onderzoek |
| **🌐 Cloud Sync** | Synchronisatie met cloud voor verbeterde herkenning | 📋 Gepland |

---

## 🏗️ Technische Architectuur

### Hardware Components

```text
👓 Smart Glasses
├── 📷 Camera Module (Gebarendetectie)
├── 🖥️ OLED Display (Tekstweergave)  
├── 🎤 Microfoon Array (Audio input)
├── 🔊 Mini Speaker (Audio output)
├── 🔋 Lithium Batterij (Voeding)
├── 📡 Wi-Fi/Bluetooth Module (Connectiviteit)
└── 💻 Raspberry Pi Zero/Compute Module (Processing)
```

### Software Stack

```text
🧠 AI & Machine Learning
├── 🎥 Computer Vision (OpenCV, MediaPipe)
├── 🤖 Deep Learning (TensorFlow, PyTorch)
├── 🗣️ NLP & TTS (pyttsx3, gTTS)
└── 📊 Data Processing (NumPy, Pandas)

💾 Backend Services
├── 🐍 Python API (Flask/FastAPI)
├── 🗄️ Database (SQLite/PostgreSQL)
├── ☁️ Cloud Services (Azure/AWS)
└── 🔄 Real-time Processing
```

---

## 📁 Project Structuur

```text
SmartGlasses/
├── 📖 README.md                    # Dit bestand
├── 🔬 research/                    # Onderzoek en documentatie
│   ├── 🔧 hardware/               # Hardware research
│   │   └── raspberry-pi/          # Raspberry Pi specs & power consumption
│   └── 💻 software/               # Software research
├── 🏗️ src/                        # Source code (komt binnenkort)
├── 📱 mobile-app/                 # Mobiele app (komt binnenkort)
├── 🧪 tests/                      # Unit tests en integratie tests
├── 📊 data/                       # Training data en modellen
└── 📋 docs/                       # Technische documentatie
```

---

## 🚀 Getting Started

### Vereisten

- **🐍 Python 3.8+**
- **📷 Camera** (voor testen)
- **🖥️ Linux/Windows/macOS**
- **📦 Git** voor version control

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

## 👥 Team

## VIVES Bachelor ICT - Project Experience 2.1

| Member                    |
| ---------------------- |
| [<img src="https://github.com/SimonStnn.png" alt="" width="25" style="margin-bottom:-6px;"> Simon Stijnen](https://github.com/SimonStnn)    |
| [<img src="https://github.com/kyell182.png" alt="" width="25" style="margin-bottom:-6px;"> Kyell De Windt](https://github.com/kyell182)    |
| [<img src="https://github.com/LynnDelaere.png" alt="" width="25" style="margin-bottom:-6px;"> Lynn Delaere](https://github.com/LynnDelaere)    |
| [<img src="https://github.com/OlivierWesterman.png" alt="" width="25" style="margin-bottom:-6px;"> Olivier Westerman](https://github.com/OlivierWesterman)    |
| [<img src="https://github.com/TimoPlets.png" alt="" width="25" style="margin-bottom:-6px;"> Timo Plets](https://github.com/TimoPlets)    |


---

## 📈 Roadmap

### 🏃‍♂️ Sprint 1 (Huidig)

- [x] 📋 Project setup en planning
- [x] 🔬 Technisch onderzoek
- [ ] 🎥 Basis camera integratie
- [ ] 🤖 Eerste ML model training

### 🏃‍♂️ Sprint 2 (Volgende)

- [ ] 📝 Text-to-speech implementatie
- [ ] 🖥️ Display integratie
- [ ] 📱 Basis mobile app
- [ ] 🔋 Power management optimalisatie

### 🏃‍♂️ Sprint 3 (Toekomst)

- [ ] ☁️ Cloud services setup
- [ ] 🧪 User testing & feedback
- [ ] 🚀 Beta release
- [ ] 📊 Performance optimalisatie

---

## 🤝 Bijdragen

We verwelkomen bijdragen van de VIVES community!

1. **🍴 Fork** het project
2. **🌿 Maak** een feature branch (`git checkout -b feature/AmazingFeature`)
3. **💾 Commit** je wijzigingen (`git commit -m 'Add AmazingFeature'`)
4. **📤 Push** naar de branch (`git push origin feature/AmazingFeature`)
5. **🔃 Open** een Pull Request(`git pull origin main`)

---

## 📚 Documentatie

- **📋 [Hardware Research](./research/hardware/)** - Raspberry Pi specificaties en power consumption
- **💻 [Software Research](./research/software/)** - AI/ML frameworks en implementaties
- **📖 [API Documentation](./docs/api/)** - REST API endpoints (komt binnenkort)
- **📱 [Mobile App Guide](./docs/mobile/)** - App setup en gebruik (komt binnenkort)

---

## 🎓 Academische Context

**Universiteit:** VIVES Hogeschool  
**Opleiding:** Bachelor ICT  
**Vak:** Project Experience 2.1  
**Academiejaar:** 2025-2026  
**Semester:** 1  

### Leeruitkomsten

- 💡 **Innovatie**: Toepassing van emerging technologies
- 🤝 **Teamwerk**: Agile projectmanagement en samenwerking
- 🔬 **Onderzoek**: Technisch onderzoek en documentatie
- 🛠️ **Ontwikkeling**: Full-stack ontwikkeling met hardware integratie
- 🎯 **Probleemoplossing**: Toegankelijkheidsuitdagingen aanpakken

---

## 📄 Licentie

Dit project valt onder de **MIT License**. Zie het [LICENSE](LICENSE) bestand voor details.

---

## 📞 Contact

**📧 Email:** [projectteam@student.vives.be](mailto:projectteam@student.vives.be)  
**🌐 Website:** [VIVES Hogeschool](https://www.vives.be)  
**📱 GitHub:** [@vives-project-xp](https://github.com/vives-project-xp)

---

## 🙏 Dankwoord

Speciale dank aan:

- **👨‍🏫 VIVES docenten** voor hun begeleiding en expertise
- **🤝 Dove gemeenschap** voor input en feedback over toegankelijkheid
- **🛠️ Open source community** voor de geweldige tools en frameworks
- **🎓 Medestudenten** voor samenwerking en peer review

---

**⭐ Vergeet niet om dit project een ster te geven als je het interessant vindt!**

Gemaakt met ❤️ door VIVES Bachelor ICT studenten
