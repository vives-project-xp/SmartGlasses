# MediaPipe

## Rol in de architectuur

MediaPipe fungeert als **feature extractor** en is de eerste stap in de AI-pipeline. Het detecteert handen in afbeeldingen en extraheert gestructureerde 3D-coördinaten (keypoints/landmarks) die vervolgens door de classificatiemodellen gebruikt worden.

## Technische implementatie

- **Library**: Google MediaPipe Hands (`mediapipe.python.solutions.hands`) — [MediaPipe Solutions Guide](https://ai.google.dev/edge/mediapipe/solutions/guide)
- **Configuratie**:
  - `static_image_mode=True`: Geoptimaliseerd voor enkele afbeeldingen
  - `max_num_hands=2`: Detecteert maximaal 2 handen
  - `min_detection_confidence=0.5`: Balans tussen precisie en recall
  - `min_tracking_confidence=0.5`: Minimale tracking threshold

## Output

MediaPipe levert **21 hand landmarks** per gedetecteerde hand:

- **x, y**: Genormaliseerde 2D-coördinaten (0.0 - 1.0)
- **z**: Relatieve diepte ten opzichte van de pols

De 21 landmarks representeren:

- Pols (1 punt)
- Duim (4 punten)
- Wijsvinger (4 punten)
- Middelvinger (4 punten)
- Ringvinger (4 punten)
- Pink (4 punten)

## Integratie (MediaPipe)

MediaPipe wordt gebruikt om keypoints te extraheren uit een dataset van afbeeldingen en video-frames. Deze keypoints worden vervolgens genormaliseerd en doorgegeven aan de deep learning modellen voor inferentie.

MediaPipe is eveneens geïntegreerd in de FastAPI backend via een dedicated router:

- `POST /keypoints/hands`: accepteert een afbeelding (multipart/form-data) en retourneert 21 hand-landmarks als JSON.
- `POST /keypoints/pose`: accepteert een afbeelding en retourneert een `LSTMFrame` met pose + linker/rechterhand landmarks voor sequentiële modellen.
- `POST /keypoints/` (root): deprecated; redirect naar `/keypoints/hands`.

```json
{
  "landmarks": [
    {"x": 0.5, "y": 0.6, "z": 0.0},
    ...
  ]
}
```
