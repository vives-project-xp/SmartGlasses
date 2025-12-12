# Kwaliteitsaspecten & Uitbreidbaarheid

## Modulaire Architectuur

De AI-componenten zijn **sterk ontkoppeld** via het `smart_gestures` package:

- Elk model is een zelfstandig subpackage
- Uniforme interface: `get_classes()`, `predict()`
- Makkelijk toevoegen van nieuwe modellen zonder bestaande code te wijzigen

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

**Huidige aanpak**:

- Model weights opgeslagen als `.pth` files
- Versie-tracking via Git

**Toekomstige verbeteringen**:

- Model registry (bijv. MLflow, Weights & Biases)
- A/B testing infrastructure
- Automated retraining pipelines

## Testing & Validatie

### Unit Tests

Mogelijke test-coverage:

- Data preprocessing (normalisatie, augmentatie)
- Model loading (check architectuur, weights)
- Endpoint validatie (correcte responses)

### Integration Tests

- End-to-end pipeline: image → keypoints → prediction
- Error handling: ongeldige inputs, edge cases

### Model Performance

- **Training metrics**: Accuracy, loss curves (zie `notebooks/training/`)
- **Validation**: Hold-out test set evaluatie
- **Calibration**: Confidence scores afstemmen op echte accuratesse
