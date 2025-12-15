# LSTM Woord/Gebaar Model

## Modelarchitectuur (LSTM)

The LSTM model is a **Recurrent Neural Network** built with PyTorch using `nn.LSTM`. The architecture processes input sequences of 40 frames with 258 features each. These sequences pass through two LSTM layers, each with 128 hidden units and Dropout of 0.2, followed by a fully connected layer that maps from 128 units to 5 word classes. The output consists of 5 word classes with confidence scores.

## Klassen (LSTM)

Het LSTM-model herkent **5 VGT-woorden**:

1. **goed**
2. **hallo**
3. **ja**
4. **nee**
5. **tot_ziens**

Deze mapping is gedefinieerd in `notebooks/package/smart_gestures/gestures/lstm_model/data/gesture_map.json`.

## Input-formaat

Het LSTM-model verwerkt **sequenties** van keypoints, niet individuele frames. Each sequence has a fixed length of **40 frames**, with **258 features per frame**. These 258 features are composed of pose keypoints (33 landmarks × 4 coordinates = 132 features), left hand keypoints (21 landmarks × 3 coordinates = 63 features), and right hand keypoints (21 landmarks × 3 coordinates = 63 features).

## Data preprocessing (LSTM)

De `normalize_landmarks` functie voert de normalisatie uit in meerdere stappen. Eerst worden hand keypoints geëxtraheerd uit de volledige sequentie, waarna ze gecentreerd worden op basis van de pols van het eerste frame. Vervolgens wordt er geschaald op basis van de pols-middelvinger afstand. Tot slot worden de genormaliseerde hand-keypoints geconcateneerd met de originele pose-keypoints. Deze preprocessing behoudt **temporele informatie** en maakt het model robuust tegen positie- en schaalvariaties.

## Sequentie-handling

Sequences shorter than the required length are padded to reach length 40, while longer sequences are truncated to length 40. For efficient LSTM processing, the implementation uses `pack_padded_sequence` and `pad_packed_sequence`.

## Integratie (LSTM Model)

The LSTM model is available through the `smart_gestures.gestures.lstm_model.LSTMModel` package and accessible via the `/gestures/lstm/predict` POST endpoint. The API accepts JSON input containing a sequence of frames (each frame with 258 features) and returns the predicted word along with a confidence score ranging from 0.0 to 1.0.

## Model-opslag (LSTM)

During training, the model is stored at `notebooks/training/lstm_model/models/lstm_model.pth`, and for package distribution it is located at `notebooks/package/smart_gestures/gestures/lstm_model/models/lstm_model.pth`.
