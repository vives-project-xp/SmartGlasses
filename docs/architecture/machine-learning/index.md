# Software Architectuur: AI-Componenten

## Inleiding & Scope

### Projectbeschrijving

Het **Signapse** project is een toegankelijkheidsoplossing die gebarentaal vertaalt naar tekst met behulp van een app op een mobiele telefoon. Het systeem maakt gebruik van computer vision en deep learning om handgebaren en gebarentaal in real-time te herkennen en te interpreteren.

### Scope van dit document

Dit document beschrijft uitsluitend de **AI-componenten** en hun integratie binnen de totale software-architectuur van het Signapse project. De focus ligt op:

- De deep learning modellen (ASL, VGT, LSTM)
- De MediaPipe feature extraction pipeline
- De API-laag die de AI-functionaliteit aanbiedt
- De gebruikte technologieën en frameworks

Voor een deep-dive in het `smart_gestures` package, model lifecycle en alle CLI-opties, zie [AI-Packages.md](../../getting-started/AI-Packages.md).

## Overzicht Architectuur

### High-level AI-architectuur

Het Signapse AI-systeem bestaat uit een **multi-model pipeline** die verschillende soorten gebaren kan herkennen:

1. **Alfabet-herkenning**: Individuele letters in American Sign Language (ASL) en Vlaams Gebarentaal (VGT)
2. **Woord-herkenning**: Volledige woorden via sequentiële keypoint-analyse met LSTM

Alle modellen zijn gebundeld in het `smart_gestures` Python package en worden aangeboden via een FastAPI backend.

### Contextdiagram

```mermaid
graph LR
  %% ====== CAPTURE LAYER ======
  subgraph Capture["Capture layer"]
    CAM["Camera / Frames<br/>(Smartphone / SmartGlasses)"]
  end

  %% ====== FEATURE EXTRACTION ======
  subgraph FeatureExtraction["Feature extraction (MediaPipe)"]
    MP["MediaPipe Hands & Pose<br/>21 hand landmarks · 33 pose landmarks"]
    KP["Keypoints / Landmarks<br/>numeric features"]
  end

  %% ====== AI MODELS ======
  subgraph Models["AI models (PyTorch)"]
    ASL["ASL Alphabet Model<br/>Feed-forward NN (63-dim)"]
    VGT["VGT Alphabet Model<br/>Feed-forward NN (63-dim)<br/>'wrist_to_middle' normalisation"]
    LSTM["LSTM Word Model<br/>40 × 258 sequence (Pose + Hands)"]
  end

  %% ====== BACKEND ======
  subgraph Backend["Backend (FastAPI)"]
    API["REST API<br/>/alphabet/{asl|vgt}/predict<br/>/alphabet/{asl|vgt}/classes<br/>/keypoints/"]
    WS["WebSocket<br/>/ws – streaming feedback"]
  end

  %% ====== CLIENT ======
  subgraph Client["Client (Expo / React Native / Web)"]
    UI["Camera & UI scherm<br/>(Client/app/camera.tsx)"]
    APIClient["API client<br/>Client/lib/api.ts"]
  end

  %% ====== TRAINING PIPELINE ======
  subgraph Training["Training & evaluatie<br/>(notebooks + utilities)"]
    DATAUTILS["data_utils.py<br/>preprocessing & augmentatie"]
    MODELUTILS["model_utils.py<br/>modeldefinities (ASL/VGT/LSTM)"]
    TRAIN["train_utils.py & run_training.py<br/>train / eval / save .pth"]
    NB["Jupyter-notebooks<br/>model_*.ipynb"]
  end

  %% -------- DATAFLOW: CAPTURE → FEATURES --------
  CAM --> MP --> KP

  %% -------- DATAFLOW: FEATURES → MODELS --------
  KP --> ASL
  KP --> VGT
  KP --> LSTM

  %% -------- MODELS → BACKEND API --------
  ASL --> API
  VGT --> API
  LSTM --> API

  API --> WS

  %% -------- CLIENT → BACKEND --------
  UI --> CAM
  UI --> APIClient --> API
  WS --> UI

  %% -------- TRAINING PIPELINE → MODELS --------
  NB --> TRAIN
  DATAUTILS --> TRAIN
  MODELUTILS --> TRAIN
  TRAIN -->|save .pth modelbestanden| ASL
  TRAIN -->|save .pth modelbestanden| VGT
  TRAIN -->|save .pth modelbestanden| LSTM
```

## AI-Componenten

De specifieke AI-componenten worden in detail beschreven in de volgende secties:

- [MediaPipe Keypoint-extractie](mediapipe.md)
- [ASL Alfabet Model](asl-model.md)
- [VGT Alfabet Model](vgt-model.md)
- [LSTM Woord/Gebaar Model](lstm-model.md)

Zie ook:

- [Gebruikte Technologieën en Frameworks](tech-stack.md)
- [Kwaliteitsaspecten & Uitbreidbaarheid](quality-extensibility.md)

## Conclusie

De AI-architectuur van het Signapse project combineert **moderne deep learning technieken** met **pragmatische software engineering**:

- **MediaPipe** als robuuste feature extractor
- **PyTorch feed-forward networks** voor snelle alfabet-herkenning (ASL + VGT)
- **PyTorch LSTM** voor contextuele woord-herkenning
- **Modulaire package-structuur** voor eenvoudige uitbreidbaarheid
- **REST API** voor platform-agnostische integratie
- **Real-time performance** op CPU-only devices

De architectuur is ontworpen met **schaalbaarheid** en **onderhoudbaarheid** in gedachten, waardoor nieuwe modellen, talen of functies eenvoudig toegevoegd kunnen worden zonder grote refactoring.

---

**Document-informatie**:

- **Versie**: 1.3
- **Datum**: December 2025
- **Auteurs**: Lynn Delaere
- **Contact**: Zie [GitHub repository](https://github.com/vives-project-xp/Signapse)
