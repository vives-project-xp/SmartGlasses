# ASL Alfabet Model

## Modelarchitectuur (ASL)

The ASL model is a **Feed-forward Neural Network** built with PyTorch using the `nn.Sequential` framework. The architecture consists of an input layer with 63 features (calculated from 21 landmarks multiplied by 3 coordinates), followed by two hidden layers each containing 256 neurons with ReLU activation and Dropout regularization of 0.2, and finally an output layer with 35 classes.

## Klassen (ASL)

Het ASL-model herkent **35 klassen** voor American Sign Language, bestaande uit letters a-z (zonder bewegingen) en cijfers 0-9. De letter `q` ontbreekt in de huidige dataset omdat MediaPipe geen stabiele keypoints kon extraheren uit de gebruikte Kaggle-bron. Dit gebaar volgt zodra er betrouwbare trainingsdata beschikbaar is.

De klassen zijn gedefinieerd in `notebooks/package/smart_gestures/alphabet/asl_model/data/classes.json`.

## Data preprocessing

De `normalize_landmarks` functie voert de normalisatie uit in drie stappen. Eerst worden alle landmarks getranslateerd zodat de pols (index 0) op de oorsprong ligt. Vervolgens wordt er geschaald op basis van de afstand tussen pols en middelvinger MCP (landmark 9). Ten slotte worden de landmarks geconverteerd naar een 1D-array van 63 features door flattening. Deze normalisatie maakt het model **invariant** voor handpositie en -grootte.

## Integratie (ASL Model)

The ASL model is available through the `smart_gestures.alphabet.asl_model.ASLModel` package and can be accessed via the `/alphabet/asl/predict` POST endpoint. The API accepts JSON input containing a list of 21 landmarks and returns the predicted class as a string.

## Model-opslag (ASL)

During training, the model is stored in `notebooks/training/asl_model/models/asl_alphabet_model.pth`, and for package distribution it resides in `notebooks/package/smart_gestures/alphabet/asl_model/models/asl_alphabet_model.pth`. Het model wordt automatisch geladen bij instantiatie van de `ASLModel` klasse.
