# VGT Alfabet Model

## Modelarchitectuur (VGT)

- **Type**: Feed-forward Neural Network (PyTorch)
- **Framework**: PyTorch (`nn.Sequential`)
- **Architectuur**: Identiek aan ASL-model

  ```label
  Input Layer:     63 features (21 landmarks × 3 coördinaten)
  Hidden Layer 1:  256 neuronen + ReLU + Dropout(0.2)
  Hidden Layer 2:  256 neuronen + ReLU + Dropout(0.2)
  Output Layer:    26 klassen
  ```

## Klassen (VGT)

Het VGT-model herkent **26 klassen** (Vlaams Gebarentaal alfabet):

- **Letters**: a-z (zonder bewegingen)
- Deze klassen zijn gedefinieerd in `notebooks/package/smart_gestures/alphabet/vgt_model/data/classes.json`

## Verschillen met ASL

| Aspect | ASL Model | VGT Model |
|--------|-----------|-----------|
| Klassen | 35 (a-z, 0-9) | 26 (A-Z) |
| Gebarentaal | American Sign Language | Vlaams Gebarentaal |
| Architectuur | Identiek | Identiek |
| Preprocessing | Identiek | Identiek |

Hoewel de **modelarchitectuur identiek** is, zijn de modellen getraind op verschillende datasets en herkennen ze verschillende gebaren uit verschillende gebarentalen. Het VGT-model werkt met callbacks die er voor zorgen dat het model niet overfit op de trainingsdata, vroeger stopt en de confidence scores beter kalibreert.

## Integratie (VGT Model)

- **Package**: `smart_gestures.alphabet.vgt_model.VGTModel`
- **API-endpoint**: `/alphabet/vgt/predict` (POST)
- **Input**: JSON met lijst van 21 landmarks
- **Output**: Voorspelde klasse (string)

## Model-opslag (VGT)

- **Training**: `notebooks/training/vgt_model/models/vgt_alphabet_model.pth`
- **Package**: `notebooks/package/smart_gestures/alphabet/vgt_model/models/vgt_alphabet_model.pth`
