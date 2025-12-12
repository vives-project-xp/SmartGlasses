# LSTM Woord/Gebaar Model

## Modelarchitectuur (LSTM)

- **Type**: Recurrent Neural Network (LSTM)
- **Framework**: PyTorch (`nn.LSTM`)
- **Architectuur**:
  
  ```label
  Input:          Sequentie van 40 frames × 258 features
  LSTM Layer 1:   128 hidden units + Dropout(0.2)
  LSTM Layer 2:   128 hidden units + Dropout(0.2)
  Fully Connected: 128 → 5 klassen
  Output:         5 woordklassen + confidence score
  ```

## Klassen (LSTM)

Het LSTM-model herkent **5 VGT-woorden**:

1. **goed**
2. **hallo**
3. **ja**
4. **nee**
5. **tot_ziens**

Deze mapping is gedefinieerd in `notebooks/package/smart_gestures/gestures/lstm_model/data/gesture_map.json`.

## Input-formaat

Het LSTM-model verwerkt **sequenties** van keypoints, niet individuele frames:

- **Sequentielengte**: 40 frames (vast)
- **Features per frame**: 258
  - **Pose keypoints**: 33 landmarks × 4 coördinaten = 132 features
  - **Linkerhand**: 21 landmarks × 3 coördinaten = 63 features
  - **Rechterhand**: 21 landmarks × 3 coördinaten = 63 features

## Data preprocessing (LSTM)

**Normalisatie** (`normalize_landmarks` functie):

1. Extract hand keypoints uit volledige sequentie
2. **Centreer** op basis van pols eerste frame
3. **Schaal** op basis van pols-middelvinger afstand
4. Concateneer genormaliseerde hand-keypoints met originele pose-keypoints

Deze preprocessing behoudt **temporele informatie** en maakt het model robuust tegen positie- en schaalvariaties.

## Sequentie-handling

- **Padding**: Kortere sequenties worden gepad naar lengte 40
- **Truncation**: Langere sequenties worden ingekort tot lengte 40
- **Pack/Unpack**: Gebruik van `pack_padded_sequence` voor efficiënte LSTM-verwerking

## Integratie (LSTM Model)

- **Package**: `smart_gestures.gestures.lstm_model.LSTMModel`
- **API-endpoint**: `/gestures/lstm/predict` (POST)
- **Input**: JSON met sequentie van frames (elk frame bevat 258 features)
- **Output**: Voorspelde woord + confidence score (0.0 - 1.0)

## Model-opslag (LSTM)

- **Training**: `notebooks/training/lstm_model/models/lstm_model.pth`
- **Package**: `notebooks/package/smart_gestures/gestures/lstm_model/models/lstm_model.pth`
