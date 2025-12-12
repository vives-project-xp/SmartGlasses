# Tech stack

## Core AI/ML Stack

| Technologie | Versie | Rol | Voordelen |
|------------|--------|-----|-----------|
| **PyTorch** | 2.7.0 | Deep learning framework | - Flexibele modelarchitectuur; - Dynamische computation graphs; - Sterke community support; - Eenvoudige model serialisatie (.pth) |
| **MediaPipe** | 0.10.21 | Computer vision + keypoint extraction | • Real-time performance; • Pre-trained hand detection; • Robuuste landmark tracking; • Cross-platform support |
| **NumPy** | 1.26.4 | Numerieke operaties | Efficiënte array-operaties; Basis voor PyTorch tensors; Data preprocessing |
| **OpenCV (cv2)** | 4.11.0.86 | Image processing | Image decoding (JPEG/PNG); Color space conversies (BGR↔RGB); Basis image manipulatie |
| **Pandas** | 2.3.3 | Data handling (training) | Dataset management; CSV/JSON I/O; Data augmentatie |

## Package Management

Het `smart_gestures` package:

- **Structuur**: Hierarchische module-organisatie
  
  ```label
  smart_gestures/
  ├── alphabet/
  │   ├── asl_model/
  │   └── vgt_model/
  └── gestures/
      └── lstm_model/
  ```

- **Distributie**: PyPI package ([smart_gestures](https://pypi.org/project/smart_gestures/))
- **Versioning**: Semantic versioning
- **Dependencies**: Gedeclareerd in `pyproject.toml`

## Model Serialisatie

**PyTorch `.pth` formaat**:

- **Voordelen**:
  - Native PyTorch format
  - Inclusief `state_dict` (model weights)
  - Klein bestandsformaat (5-20 MB per model)
  - Makkelijk laden met `torch.load()`
- **Locatie**: `models/` directories binnen elk model-subpackage

## Waarom deze technologieën?

### PyTorch

- **Flexibiliteit**: Custom LSTM architectuur, eenvoudige debugging
- **Research-vriendelijk**: Snel prototypen en experimenteren
- **Production-ready**: Goede performance, mobile deployment mogelijk

### MediaPipe

- **Snelheid**: Geoptimaliseerd voor real-time (60+ FPS mogelijk)
- **Accuratesse**: State-of-the-art hand tracking
- **Gebruiksgemak**: Eenvoudige API voor integratie
