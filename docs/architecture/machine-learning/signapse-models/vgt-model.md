# VGT Alfabet Model

## Modelarchitectuur (VGT)

The VGT model is a **Feed-forward Neural Network** built with PyTorch using the `nn.Sequential` framework, identical in architecture to the ASL model. It features an input layer with 63 features (21 landmarks × 3 coordinates), two hidden layers each with 256 neurons plus ReLU activation and Dropout of 0.2, and an output layer with 26 classes.

## Klassen (VGT)

Het VGT-model herkent **26 klassen** voor het Vlaams Gebarentaal alfabet, bestaande uit de letters a-z (zonder bewegingen). Deze klassen zijn gedefinieerd in `notebooks/package/smart_gestures/alphabet/vgt_model/data/classes.json`.

## Verschillen met ASL

| Aspect | ASL Model | VGT Model |
|--------|-----------|-----------|
| Klassen | 35 (a-z, 0-9) | 26 (A-Z) |
| Gebarentaal | American Sign Language | Vlaams Gebarentaal |
| Architectuur | Identiek | Identiek |
| Preprocessing | Identiek | Identiek |

Hoewel de **modelarchitectuur identiek** is, zijn de modellen getraind op verschillende datasets en herkennen ze verschillende gebaren uit verschillende gebarentalen. Het VGT-model werkt met callbacks die er voor zorgen dat het model niet overfit op de trainingsdata, vroeger stopt en de confidence scores beter kalibreert.

## Integratie (VGT Model)

The VGT model is available through the `smart_gestures.alphabet.vgt_model.VGTModel` package and accessible via the `/alphabet/vgt/predict` POST endpoint. The API accepts JSON input with a list of 21 landmarks and returns the predicted class as a string.

## Model-opslag (VGT)

During training, the model is stored at `notebooks/training/vgt_model/models/vgt_alphabet_model.pth`, while for package distribution it is located at `notebooks/package/smart_gestures/alphabet/vgt_model/models/vgt_alphabet_model.pth`.
