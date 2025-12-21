# Signapse <!-- omit from toc -->

> Gebarentaal naar Tekst

[![VIVES Elektronica-ICT](https://img.shields.io/badge/VIVES-Bachelor_Electronica_–_ICT-blue?style=flat)](https://www.vives.be/nl/technology/elektronica-ict)
[![Project Experience](https://img.shields.io/badge/VIVES-Project_Experience-green?style=flat)](https://github.com/vives-project-xp)
[![GitHub](https://img.shields.io/github/stars/vives-project-xp/Signapse?style=social)](https://github.com/vives-project-xp/Signapse)
[![Signapse contributors](https://img.shields.io/github/contributors/vives-project-xp/Signapse?style=social&logo=github)](https://github.com/vives-project-xp/Signapse/graphs/contributors)
[![Signapse API Version](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.smart-gestures.devbitapp.be%2Fhealth&query=%24.version&prefix=v&style=flat&label=API%20Version&color=green)](https://api.signapse.devbitapp.be/docs)
[![PyPI - Version](https://img.shields.io/pypi/v/smart_gestures?style=flat)](https://pypi.org/project/smart_gestures/)

> **Een innovatief project voor de vertaling van gebarentaal naar tekst en spraak met behulp van smart glasses technologie.**

<https://github.com/user-attachments/assets/7532cefe-bf65-432a-b65d-5af1405edaf9>

---

## Inhoudsopgave

- [Inhoudsopgave](#inhoudsopgave)
- [Projectoverzicht](#projectoverzicht)
- [Functies](#functies)
- [Technologieën](#technologieën)
  - [Frontend (Client)](#frontend-client)
  - [Backend (Server)](#backend-server)
  - [AI \& Machine Learning](#ai--machine-learning)
  - [DevOps \& Deployment](#devops--deployment)
  - [AI Pipeline](#ai-pipeline)
- [Installatie](#installatie)
  - [Vereisten](#vereisten)
  - [Snelle Start](#snelle-start)
- [Gebruik](#gebruik)
- [Team](#team)
- [Academische Context](#academische-context)
  - [Leeruitkomsten](#leeruitkomsten)

---

## Projectoverzicht

Het **Signapse** project is een ambitieus initiatief ontwikkeld door studenten van **VIVES Bachelor ICT** voor het vak **Project Experience**. Ons doel is het creëren van een toegankelijkheidsoplossing die de communicatiekloof tussen dove/slechthorende personen en horende personen overbrugt.

Het systeem gebruikt geavanceerde computer vision en machine learning technieken om gebarentaal in real-time te herkennen en om te zetten naar tekst en spraak, geïntegreerd in een smart glasses applicatie.

## Functies

- **Real-time Gebarenherkenning**: Herkent individuele letters en woorden in ASL (American Sign Language) en VGT (Vlaams Gebarentaal)
- **Smart Glasses Integratie**: Ontworpen voor gebruik met smart glasses apparaten
- **Multi-Model AI Pipeline**: Combineert verschillende deep learning modellen voor optimale nauwkeurigheid
- **Mobiele App**: React Native applicatie voor iOS en Android
- **REST API Backend**: FastAPI-gebaseerde server voor AI-verwerking
- **Modulaire Architectuur**: Gescheiden componenten voor eenvoudige uitbreiding en onderhoud

## Technologieën

### Frontend (Client)

- **React Native** met **Expo**
- **TypeScript** voor typeveiligheid
- **NativeWind** (Tailwind CSS voor React Native)
- **MediaPipe** voor computer vision taken
- **Expo Camera** voor camera toegang

### Backend (Server)

- **Python 3.12+**
- **FastAPI** voor REST API
- **PyTorch** voor machine learning modellen
- **MediaPipe** voor landmark extractie

### AI & Machine Learning

- **PyTorch** modellen voor alfabet- en woordherkenning
- **LSTM** netwerken voor sequentiële woordanalyse
- **MediaPipe Hands & Pose** voor keypoint extractie
- **Custom `smart_gestures` package** (beschikbaar op PyPI)

### DevOps & Deployment

- **Docker** containers
- **Kubernetes** (K3s) voor productie deployment
- **GitHub Actions** voor CI/CD
- **VS Code Dev Containers** voor consistente development omgeving

### AI Pipeline

1. **Capture**: Camera frames van smart glasses
2. **Feature Extraction**: MediaPipe extraheert hand- en pose-landmarks
3. **Prediction**: AI modellen voorspellen letters/woorden
4. **Output**: Tekst en spraak output naar gebruiker

Voor gedetailleerde architectuurdocumentatie, zie [Architectuur](docs/architecture/).

## Installatie

Voor gedetailleerde installatie-instructies, zie [Getting Started](docs/getting-started/).

### Vereisten

- Docker Desktop
- VS Code met Dev Containers extensie
- Git

### Snelle Start

```bash
git clone https://github.com/vives-project-xp/Signapse.git
cd Signapse
code SmartGlasses.code-workspace
# VS Code zal automatisch de dev container openen
```

## Gebruik

1. **Start de Services**: Gebruik Docker Compose om alle componenten te starten
2. **Open de App**: Start de Expo app op je apparaat
3. **Geef Toestemming**: Sta camera toegang toe
4. **Begin met Gebaren**: Maak gebaren voor de camera
5. **Bekijk Resultaten**: Zie de vertaalde tekst in real-time

Voor API documentatie, bezoek [api.signapse.devbitapp.be/docs](https://api.signapse.devbitapp.be/docs).

## Team

| | Member                                                | Taak |
|---| ----------------------------------------------------- | ---- |
| [<img src="https://github.com/SimonStnn.png" alt="" width="25" style="margin-bottom:-6px;">](https://github.com/SimonStnn) | [Simon Stijnen](https://github.com/SimonStnn)            | Full Stack & DevOps Engineer |
| [<img src="https://github.com/kyell182.png" alt="" width="25" style="margin-bottom:-6px;">](https://github.com/kyell182) | [Kyell De Windt](https://github.com/kyell182)            | Full Stack Developer  |
| [<img src="https://github.com/LynnDelaere.png" alt="" width="25" style="margin-bottom:-6px;">](https://github.com/LynnDelaere) | [Lynn Delaere](https://github.com/LynnDelaere)           | Machine Learning Engineer  |
| [<img src="https://github.com/OlivierWesterman.png" alt="" width="25" style="margin-bottom:-6px;">](https://github.com/OlivierWesterman) | [Olivier Westerman](https://github.com/OlivierWesterman) | Machine Learning Engineer    |
| [<img src="https://github.com/TimoPlts.png" alt="" width="25" style="margin-bottom:-6px;">](https://github.com/TimoPlts) | [Timo Plets](https://github.com/TimoPlts)               | Full Stack Developer  |

## Academische Context

|||
|--|--|
|**Universiteit**|VIVES Hogeschool|
|**Opleiding**|Bachelor ICT|
|**Vak**|Project Experience|
|**Academiejaar**|2025-2026|
|**Semester**| 1ste semester |

### Leeruitkomsten

Dit project draagt bij aan verschillende leeruitkomsten:

- **Innovatie**: Toepassing van emerging technologies (AI, computer vision, edge computing)
- **Teamwerk**: Agile projectmanagement en cross-functionele samenwerking
- **Onderzoek**: Technisch onderzoek en documentatie van AI-modellen
- **Ontwikkeling**: Full-stack development en hardware integratie
- **Probleemoplossing**: Aanpakken van toegankelijkheidsuitdagingen

---

**Vergeet niet om dit project een ster te geven als je het interessant vindt!**

Gemaakt met ❤️ door [VIVES Bachelor Electronica-ICT studenten](#team)
