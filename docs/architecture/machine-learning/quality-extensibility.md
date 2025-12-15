# Kwaliteitsaspecten & Uitbreidbaarheid

## Modulaire Architectuur

De AI-componenten zijn sterk ontkoppeld via het `smart_gestures` package. Elk model is georganiseerd als een zelfstandig subpackage met een uniforme interface die `get_classes()` en `predict()` methoden aanbiedt. Deze structuur maakt het eenvoudig om nieuwe modellen toe te voegen zonder bestaande code te wijzigen.

## Uitbreidingsmogelijkheden

### Nieuw Gebarentaal-Model Toevoegen

**Stappen**:

1. **Training**: Train model in `notebooks/training/nieuwe_taal_model/`
2. **Package**: Kopieer model naar `notebooks/package/smart_gestures/alphabet/nieuwe_taal_model/`
3. **Interface**: Implementeer `Model` klasse met `predict()` en `get_classes()`
4. **API**: Registreer nieuwe router in `server/src/routes/alphabet/nieuwe_taal_model/__init__.py`
5. **Import**: Add route naar `server/src/main.py`

**Benodigde bestanden**:

```label
smart_gestures/alphabet/nieuwe_taal_model/
├── __init__.py          # Exporteer Model en get_classes
├── model.py             # Model klasse + utilities
├── data/
│   └── classes.json     # Label mapping
└── models/
    └── model.pth        # Trained weights
```

### Extra LSTM Woorden Toevoegen

**Stappen**:

1. **Data verzamelen**: Gebruik `notebooks/utilities/capture_dataset_lstm.py`
2. **Retrain**: Run `notebooks/training/lstm_model/run_training.py` met nieuwe data
3. **Update mapping**: Pas `data/gesture_map.json` aan met nieuwe woorden
4. **Deploy**: Kopieer nieuwe model.pth naar package

Geen code-wijzigingen nodig in de API—de `/lstm/classes` endpoint leest automatisch de nieuwe mapping.

## Performance Overwegingen

### Latency

- **MediaPipe extractie**: ~50-100ms per frame (CPU)
- **Model inferentie**:
  - ASL/VGT: ~5-10ms (CPU)
  - LSTM: ~10-20ms (CPU)
- **Totale pipeline**: ~60-130ms (voldoende voor near-real-time gebruik)

### Optimalisaties

- **Persistent MediaPipe instance**: Vermijdt re-initialisatie overhead
- **Batch processing**: Mogelijk voor multiple predictions (niet geïmplementeerd)
- **Model quantization**: PyTorch biedt INT8 quantization voor kleinere models (toekomstig)
- **ONNX export**: Voor cross-platform deployment (mobiel, embedded)

### Resource-gebruik

- **Memory**: ~200-300 MB per model geladen
- **CPU**: Single-threaded inferentie (mogelijkheid voor threading bij hogere throughput)
- **GPU**: Niet vereist (belangrijk voor edge devices)

## Model Versioning

De huidige aanpak slaat model weights op als `.pth` bestanden met versie-tracking via Git. Toekomstige verbeteringen kunnen een model registry omvatten zoals MLflow of Weights & Biases, samen met A/B testing infrastructuur en geautomatiseerde retraining pipelines.

## Testing & Validatie

### Unit Tests

Mogelijke test-coverage omvat data preprocessing zoals normalisatie en augmentatie, model loading waarbij architectuur en weights worden gecontroleerd, en endpoint validatie voor correcte responses.

### Integration Tests

Integration tests dekken de end-to-end pipeline van image naar keypoints naar prediction, en error handling voor ongeldige inputs en edge cases.

### Model Performance

Model performance wordt gemonitord via training metrics zoals accuracy en loss curves (beschikbaar in `notebooks/training/`), validation op hold-out test sets, en calibration waarbij confidence scores worden afgestemd op echte accuratesse.
