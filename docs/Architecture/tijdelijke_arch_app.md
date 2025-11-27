## 4. Datastroom & Verwerking

### 4.1 Alfabet-herkenning Pipeline (ASL/VGT)

```
┌─────────────┐
│   Camera    │
│   Input     │
└──────┬──────┘
       │ Raw image (JPEG/PNG)
       │
┌──────▼──────────────────────────────────────────────┐
│  Client Application (Web/Mobile)                    │
│  - Capture image from camera                        │
│  - Send via HTTP POST to /keypoints                 │
└──────┬──────────────────────────────────────────────┘
       │ HTTP multipart/form-data
       │
┌──────▼──────────────────────────────────────────────┐
│  Backend: /keypoints endpoint                       │
│  File: server/src/routes/keypoints/__init__.py      │
│                                                      │
│  1. Decode image bytes → numpy array                │
│  2. Convert BGR → RGB                               │
│  3. MediaPipe Hands.process()                       │
│  4. Extract 21 landmarks per hand                   │
│  5. Return JSON: {landmarks: [...]}                 │
└──────┬──────────────────────────────────────────────┘
       │ JSON response: 21 × {x, y, z}
       │
┌──────▼──────────────────────────────────────────────┐
│  Client Application                                  │
│  - Receive landmarks JSON                           │
│  - Send to /asl/predict OR /vgt/predict             │
└──────┬──────────────────────────────────────────────┘
       │ HTTP POST with landmarks
       │
┌──────▼──────────────────────────────────────────────┐
│  Backend: /asl/predict of /vgt/predict endpoint     │
│  Files: server/src/routes/alphabet/{asl,vgt}_model/ │
│                                                      │
│  1. Validate input (21 landmarks)                   │
│  2. Convert to list of dicts                        │
│  3. Call model.predict(landmarks)                   │
│     ├─ Normalize landmarks                          │
│     ├─ Convert to PyTorch tensor                    │
│     ├─ Model inference (forward pass)               │
│     ├─ Softmax → probabilities                      │
│     └─ Argmax → predicted class                     │
│  4. Map class index → class name                    │
│  5. Return JSON: {prediction: "a"}                  │
└──────┬──────────────────────────────────────────────┘
       │ JSON response: {prediction: string}
       │
┌──────▼──────────────────────────────────────────────┐
│  Client Application                                  │
│  - Display predicted letter/number                  │
│  - Update UI / build word                           │
└─────────────────────────────────────────────────────┘
```

### 4.2 Woord-herkenning Pipeline (LSTM)

```
┌─────────────┐
│   Camera    │
│   Stream    │
└──────┬──────┘
       │ Video stream (continuous frames)
       │
┌──────▼──────────────────────────────────────────────┐
│  Client Application                                  │
│  - Capture 40 consecutive frames                    │
│  - For each frame:                                  │
│    ├─ Extract pose keypoints (33 × 4)              │
│    ├─ Extract left hand keypoints (21 × 3)         │
│    └─ Extract right hand keypoints (21 × 3)        │
│  - Build sequence: [frame1, frame2, ..., frame40]  │
│  - Each frame: 258 features                         │
└──────┬──────────────────────────────────────────────┘
       │ Sequence: 40 × 258 numpy array
       │
┌──────▼──────────────────────────────────────────────┐
│  Client Application                                  │
│  - Send sequence to /lstm/predict                   │
└──────┬──────────────────────────────────────────────┘
       │ HTTP POST with sequence JSON
       │
┌──────▼──────────────────────────────────────────────┐
│  Backend: /lstm/predict endpoint                    │
│  File: server/src/routes/gestures/lstm_model/       │
│                                                      │
│  1. Parse JSON → numpy array (40 × 258)            │
│  2. Validate sequence shape                         │
│  3. Call model.predict(sequence)                    │
│     ├─ Normalize hand keypoints                     │
│     ├─ Convert to PyTorch tensor                    │
│     ├─ LSTM forward pass (processes sequence)       │
│     ├─ Extract final hidden state                   │
│     ├─ Fully connected layer                        │
│     ├─ Softmax → probabilities                      │
│     ├─ Argmax → predicted class                     │
│     └─ Max probability → confidence                 │
│  4. Map class index → word name                     │
│  5. Return JSON: {prediction: "hallo",              │
│                   confidence: 0.95}                 │
└──────┬──────────────────────────────────────────────┘
       │ JSON response: {prediction, confidence}
       │
┌──────▼──────────────────────────────────────────────┐
│  Client Application                                  │
│  - Display recognized word + confidence             │
│  - Update UI / conversation log                     │
└─────────────────────────────────────────────────────┘
```

### 4.3 Belangrijke modules per stap

| Stap | Module/Bestand | Verantwoordelijkheid |
|------|----------------|----------------------|
| Camera capture | `client/app/camera.tsx` | Frame capture, UI |
| Keypoint extractie | `server/src/routes/keypoints/__init__.py` | MediaPipe integratie |
| ASL inferentie | `notebooks/package/smart_gestures/alphabet/asl_model/model.py` | Model loading, normalisatie, predictie |
| VGT inferentie | `notebooks/package/smart_gestures/alphabet/vgt_model/model.py` | Model loading, normalisatie, predictie |
| LSTM inferentie | `notebooks/package/smart_gestures/gestures/lstm_model/model.py` | Sequentie-verwerking, LSTM predictie |
| API routing | `server/src/main.py` | FastAPI setup, CORS, endpoints registratie |
| Schemas | `server/src/schemas/` | Request/response validatie (Pydantic) |

---
### 5.2 Backend Stack

| Technologie | Versie | Rol |
|------------|--------|-----|
| **FastAPI** | ≥0.104 | REST API framework |
| **Pydantic** | ≥2.5 | Data validatie + serialisatie |
| **Uvicorn** | ≥0.24 | ASGI server |

#### FastAPI
- **Performance**: Async/await support, hoge throughput
- **Developer Experience**: Automatische OpenAPI docs, type hints
- **Validatie**: Pydantic integratie voor robuuste input validatie

## 6. Integratie met de Rest van het Systeem

### 6.1 API-architectuur

De AI-modellen worden aangeboden via een **RESTful API** gebouwd met FastAPI.

#### Endpoint-overzicht

| Endpoint | Method | Functie | Input | Output |
|----------|--------|---------|-------|--------|
| `/keypoints` | POST | Extraheer hand landmarks | Image (multipart) | JSON: 21 landmarks |
| `/asl/classes` | GET | Lijst ASL klassen | - | JSON: array van 35 strings |
| `/asl/predict` | POST | ASL letter predictie | JSON: landmarks | JSON: predicted class |
| `/vgt/classes` | GET | Lijst VGT klassen | - | JSON: array van 26 strings |
| `/vgt/predict` | POST | VGT letter predictie | JSON: landmarks | JSON: predicted class |
| `/lstm/classes` | GET | Lijst LSTM woorden | - | JSON: gesture map |
| `/lstm/predict` | POST | Woord predictie | JSON: sequence | JSON: prediction + confidence |
| `/health` | GET | Server status | - | JSON: status + versie |

#### API Documentatie
FastAPI genereert automatisch **interactieve API-documentatie**:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### 6.2 Request/Response Flow

```python
# Voorbeeld: ASL predictie request
POST /asl/predict
Content-Type: application/json

{
  "landmarks": [
    {"x": 0.5, "y": 0.6, "z": 0.0},
    {"x": 0.52, "y": 0.58, "z": -0.02},
    ...  // 21 landmarks totaal
  ]
}

# Response
{
  "prediction": "a"
}
```

```python
# Voorbeeld: LSTM predictie request
POST /lstm/predict
Content-Type: application/json

{
  "sequence": [
    [0.1, 0.2, ..., 0.5],  // Frame 1: 258 features
    [0.1, 0.2, ..., 0.5],  // Frame 2: 258 features
    ...  // 40 frames totaal
  ]
}

# Response
{
  "prediction": "hallo",
  "confidence": 0.95
}
```

### 6.3 Client-side Integratie

#### Web Client (React/TypeScript)
- **Locatie**: `client/` directory
- **API calls**: `client/lib/api.ts`
- **Camera**: `client/app/camera.tsx`
- **Features**:
  - Real-time camera feed
  - Frame capture en upload naar `/keypoints`
  - Landmarks verzamelen voor sequentie-opbouw
  - Display van predictions

#### Typische client-side flow:
1. **Capture frame** van camera (CameraView component)
2. **Upload naar `/keypoints`** → ontvang landmarks
3. **Upload landmarks naar `/asl/predict` of `/vgt/predict`** → ontvang letter
4. **Build word** door letters te combineren (useWordBuilder hook)
5. OF **Build sequence** van 40 frames → upload naar `/lstm/predict` → ontvang woord

### 6.4 WebSocket Support

Hoewel de huidige implementatie primair REST gebruikt, is er infrastructuur voor **WebSocket**-communicatie:
- **ConnectionManager**: `server/src/websocket/connection_manager.py`
- **Doel**: Real-time bidirectionele communicatie (toekomstige feature)
- **Gebruik**: Live streaming van predictions, multi-user sessies

### 6.5 CORS & Security

```python
# server/src/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Development: alle origins toegestaan
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Productie**: Origins beperken tot specifieke domeinen (smart glasses app, web client).

### 6.6 Error Handling

De API implementeert **gestructureerde error responses**:
- **400 Bad Request**: Ongeldige input (bijv. verkeerde aantal landmarks)
- **404 Not Found**: Geen hand gedetecteerd in afbeelding
- **500 Internal Server Error**: Model inference errors

Voorbeeld:
```json
{
  "detail": "Invalid input: Expected 21 landmarks, got 15"
}
```

---

