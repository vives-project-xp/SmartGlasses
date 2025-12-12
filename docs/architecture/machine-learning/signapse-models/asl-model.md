# ASL Alfabet Model

## Modelarchitectuur (ASL)

- **Type**: Feed-forward Neural Network (PyTorch)
- **Framework**: PyTorch (`nn.Sequential`)
- **Architectuur**:

```label
  Input Layer:     63 features (21 landmarks × 3 coördinaten)
  Hidden Layer 1:  256 neuronen + ReLU + Dropout(0.2)
  Hidden Layer 2:  256 neuronen + ReLU + Dropout(0.2)
  Output Layer:    35 klassen
 ```

## Klassen (ASL)

Het ASL-model herkent **35 klassen** (American Sign Language alfabet + cijfers):

- **Letters**: a-z (zonder bewegingen)
- **Cijfers**: 0-9
- **Totaal**: 35 statische gebaren
- **Opmerking**: De letter `q` ontbreekt in de huidige dataset omdat MediaPipe geen stabiele keypoints kon extraheren uit de gebruikte Kaggle-bron. Dit gebaar volgt zodra er betrouwbare trainingsdata beschikbaar is.

De klassen zijn gedefinieerd in `notebooks/package/smart_gestures/alphabet/asl_model/data/classes.json`.

## Data preprocessing

**Normalisatie** (`normalize_landmarks` functie):

1. **Translatie**: Verplaats alle landmarks zodat de pols (index 0) op de oorsprong ligt
2. **Schaling**: Schaal op basis van de afstand tussen pols en middelvinger MCP (landmark 9)
3. **Flattenin**: Converteer naar 1D-array van 63 features

Deze normalisatie maakt het model **invariant** voor handpositie en -grootte.

## Integratie (ASL Model)

- **Package**: `smart_gestures.alphabet.asl_model.ASLModel`
- **API-endpoint**: `/alphabet/asl/predict` (POST)
- **Input**: JSON met lijst van 21 landmarks
- **Output**: Voorspelde klasse (string)

## Model-opslag (ASL)

- **Training**: `notebooks/training/asl_model/models/asl_alphabet_model.pth`
- **Package**: `notebooks/package/smart_gestures/alphabet/asl_model/models/asl_alphabet_model.pth`

Het model wordt automatisch geladen bij instantiatie van de `ASLModel` klasse.
