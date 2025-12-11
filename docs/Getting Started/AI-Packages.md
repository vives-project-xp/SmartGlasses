# AI Package Deep Dive

Dit document beschrijft de `smart_gestures`-package die de Signapse AI-modellen bundelt. De focus ligt op module-indeling, gebruikte PyTorch-componenten, inference-preprocessing en trainingsutilities rond MediaPipe en NumPy.

## Package-overzicht

`smart_gestures` wordt vanuit `notebooks/package/` gebouwd en als PyPI-package gedeeld. De submodules zijn strikt gescheiden per taak zodat modellen onafhankelijk kunnen worden geüpdatet.

```text
smart_gestures/
├── __init__.py
├── alphabet/
│   ├── __init__.py
│   ├── asl_model/
│   │   ├── model.py            # ASLModel + normalize_landmarks
│   │   ├── data/classes.json   # label mapping
│   │   └── models/*.pth        # getrainde weights
│   └── vgt_model/
│       ├── model.py
│       ├── data/classes.json
│       └── models/*.pth
└── gestures/
    └── lstm_model/
        ├── model.py            # LSTMModel + sequence normalisatie
        ├── data/gesture_map.json
        └── models/lstm_model.pth
```

### Modelbestanden & laden

- Elke submodule bewaart `.pth`-bestanden onder `models/`. De bestanden bevatten het `state_dict` van de PyTorch-module.
- De corresponderende `model.py` laadt de klassen (`classes.json` of `gesture_map.json`), instantiëert de architectuur en roept `torch.load(..., map_location=DEVICE)` om de gewichten in te lezen.
- Tijdens instantiatie wordt het model direct in `eval()`-modus gezet zodat inference consistent blijft (`ASLModel` en `VGTModel` in hun `__init__`, `LSTMModel` idem).

## PyTorch-componenten

| Component | Gebruikt in | Functie | Motivatie |
|-----------|-------------|---------|-----------|
| `nn.Sequential` | Alphabet-modellen (`asl_model/model.py`, `vgt_model/model.py`) | Lineaire feed-forward stack | Eenvoudig te lezen/aanpassen; ideaal voor statische 63-d input. |
| `nn.Linear` | Alle modellen | Projecteert features naar volgende laag of klassenruimte | Volledige connectiviteit nodig omdat keypoints al dense zijn. |
| `nn.ReLU` | Alphabet-netwerken | Niet-lineariteit | Houdt training stabiel zonder extra parameters. |
| `nn.Dropout(0.2)` | Alphabet- en LSTM-outputlaag | Regularisatie | Vermindert overfitting bij beperkte datasets zonder inference-penalty. |
| `nn.LSTM` | `gestures/lstm_model/model.py` | Tijdelijke verwerking van 40×258 sequenties | Bewaart temporele context van pose + beide handen. |
| `torch.nn.utils.rnn.pack_padded_sequence` + `pad_packed_sequence` | `LSTMModel.forward` | Efficiënte verwerking van ge-padding sequenties | Bespaart rekenkracht doordat daadwerkelijke lengtes worden gebruikt. |
| `torch.softmax` | Alle `predict()`-methodes | Confidence berekening | Nodig voor REST-responses en loss-functies (Brier-penalty). |
| `torch.load` / `state_dict` | Alle `model.py` | Modelgewichten laden | Houdt package-artefacten klein en compatibel met PyTorch tooling. |

## Inference-paden

### Alphabet-modellen (ASL/VGT)
1. **Data-ingang**: lijst van 21 landmarks met `x,y,z`-velden (MediaPipe Hands output).
2. **Normalisatie** (`normalize_landmarks`): translatie naar pols-oorsprong + schaling op `wrist_to_middle` afstand; resulteert in een `(21, 3)` array.
3. **Flattening**: `reshape(-1)` → 63 features.
4. **Tensor-voorbereiding**: `torch.from_numpy(...).reshape(1, IN_DIM)` op CPU of CUDA device.
5. **Forward pass**: `nn.Sequential` produceert logits, daarna softmax voor klasse + confidence.

### LSTM woordmodel
1. **Data-ingang**: sequentie van maximaal 40 frames waarin elk frame 258 features heeft (`pose + left hand + right hand`). Deze 258-d vectoren worden opgebouwd door de MediaPipe `/keypoints/pose` endpoint.
2. **Normalisatie** (`normalize_landmarks` in `gestures/lstm_model/model.py`): centreert hand-keypoints op het eerst gedetecteerde polskoordinaat en schaalt op de pols → middelvinger afstand. Pose-coördinaten blijven ongewijzigd.
3. **Padding/Truncation** (`prepare_input`): sequenties korter dan 40 frames worden met nullen opgevuld; langere sequenties worden afgekapt. De bijhorende lengte wordt meegegeven voor packed sequences.
4. **LSTM forward**: `pack_padded_sequence` zorgt dat alleen echte frames door de `nn.LSTM` gaan. De laatste time-step output passeert door dropout + `nn.Linear`.
5. **Softmax** geeft de vijf woordklassen (`gesture_map.json`) met confidence terug.

## Training utilities

| Module | Pad | Rol |
|--------|-----|-----|
| `data_utils.py` | `notebooks/training/*/data_utils.py` | Normaliseert landmerken, voorziet PyTorch `Dataset`/`DataLoader`, en ondersteunt augmentaties zoals rotatie en Gaussian noise (belangrijk om MediaPipe-variaties te simuleren). |
| `train_utils.py` | `notebooks/training/*/train_utils.py` | Train-loop met mixup, label smoothing, Brier-regularisatie, misclassificatie-penalty, scheduler/early-stop hooks. Verbindt NumPy batches met PyTorch-modellen. |
| `callbacks.py` | `notebooks/training/vgt_model/callbacks.py` (gedeeld) | `EarlyStopping`, `ModelCheckpoint` en `create_scheduler` wrappers voor ReduceLROnPlateau/Step/Cosine. |
| `model_utils.py` | `notebooks/training/*/model_utils.py` | Bouwt dezelfde architecturen die later in `smart_gestures` terechtkomen. |
| `run_training.py` | `notebooks/training/*/run_training.py` | CLI-entrypoint dat hyperparameters en augmentatie/scheduler-opties bundelt. |

De utilities combineren PyTorch met MediaPipe-output door datasets eerst via `normalize_landmarks` te aligneren. Augmentaties zoals rotatie/noise en mixup zorgen dat modellen robuust blijven voor variaties in MediaPipe-detecties op verschillende devices. NumPy wordt gebruikt voor bulkmanipulaties, waarna `torch.from_numpy` tensors genereert voor training en inference.

## Model lifecycle

Onderstaande checklist beschrijft hoe een nieuw `.pth`-model in productie komt:

1. **Train** – gebruik de relevante `notebooks/training/*/run_training.py` of Jupyter-notebook en leg hyperparameters vast (zie tabel hieronder).
2. **Valideer** – evalueer met `evaluate_model`/`evaluate_metrics` en archiveer accuracy-, loss- en calibratiecijfers.
3. **Promoot gewichten** – kopieer het beste `.pth` naar de juiste `notebooks/package/smart_gestures/.../models/` map en commit/bewaar de bijhorende `classes.json`/`gesture_map.json` updates.
4. **Bump package** – verhoog `version` in `notebooks/package/pyproject.toml`, voer `python -m build` uit en publiceer/installeer de nieuwe `smart_gestures` release (lokaal kan `pip install -e .` volstaan).
5. **Update server** – pas `server/pyproject.toml` en `server/requirements.txt` aan naar de nieuwe `smart-gestures` versie zodat FastAPI het juiste artefact laadt.
6. **Regressietests** – draai minimaal de API smoke-tests (ASL/VGT/LSTM inferentie tegen bekende voorbeelden) voordat er gedeployed wordt.

## CLI-argumenten per trainingsscript

### ASL alphabet (`notebooks/training/asl_model/run_training.py`)

| Argument | Default | Omschrijving |
|----------|---------|--------------|
| `--batch_size` | 32 | Batchgrootte voor DataLoader. |
| `--epochs` | 20 | Aantal volledige epochs. |
| `--lr` | 1e-3 | Learning rate voor Adam-optimizer. |
| `--output` | `asl_alphabet_model.pth` | Doelpad voor het opgeslagen model (wordt later naar `smart_gestures` gekopieerd). |

### VGT alphabet (`notebooks/training/vgt_model/run_training.py`)

| Argument | Default | Omschrijving |
|----------|---------|--------------|
| `--batch_size` | 32 | Batchgrootte voor trainingen/validatie. |
| `--epochs` | 50 | Maximale epochs (early stop kan eerder afbreken). |
| `--lr` | 1e-3 | Learning rate voor Adam. |
| `--output` | `vgt_alphabet_model.pth` | Bestandsnaam voor de finale `.pth`. |
| `--augment` | `False` (flag) | Activeer data-augmentatie in `LandmarksDataset`. |
| `--augment_prob` | 0.5 | Kans dat augmentaties worden toegepast per sample. |
| `--noise_std` | 0.01 | Std-dev van Gaussian noise tijdens augmentatie. |
| `--rotate_deg` | 10.0 | Maximale random rotatie in graden. |
| `--scheduler` | `plateau` | Scheduler-type: `none`, `plateau`, `step`, `cosine`. |
| `--scheduler_factor` | 0.5 | Factor voor `ReduceLROnPlateau`. |
| `--scheduler_patience` | 3 | Patience voor `ReduceLROnPlateau`. |
| `--step_size` | 10 | Stapgrootte indien `scheduler=step`. |
| `--gamma` | 0.1 | Decayfactor voor StepLR. |
| `--early_stop_patience` | 5 | #epochs zonder verbetering voordat training stopt. |
| `--early_stop_min_delta` | 0.0 | Minimale verbetering om early stop te resetten. |
| `--monitor` | `val_loss` | Metric voor early stop/checkpoint (`val_loss` of `val_acc`). |
| `--checkpoint` | `False` (flag) | Schakel model-checkpointing in. |
| `--checkpoint_path` | `best_vgt_model.ckpt` | Pad/naam voor checkpoints. |
| `--label_smoothing` | 0.1 | Factor voor CrossEntropy label smoothing. |
| `--lambda_brier` | 1.1 | Weights voor Brier-score regularisatie. |
| `--misclass_alpha` | 0.1 | gewicht voor misclassificatie-confidence penalty. |
| `--mixup_alpha` | 0.2 | Mixup Beta-parameter (0 schakelt mixup uit). |

### LSTM gestures (`notebooks/training/lstm_model/run_training.py`)

| Argument | Default | Omschrijving |
|----------|---------|--------------|
| `--batch_size` | 32 | Batchgrootte voor sequenties. |
| `--epochs` | 50 | Aantal epochs voor sequentietraining. |
| `--lr` | 1e-3 | Learning rate. |
| `--hidden_size` | 128 | Verborgen dimensie van de LSTM-layer(s). |
| `--num_layers` | 2 | Aantal gestapelde LSTM-lagen. |
| `--output` | `lstm_model.pth` | Bestandsnaam voor het opgeslagen woordmodel. |

## Relevante bronnen & links

- `notebooks/package/smart_gestures/alphabet/asl_model/model.py` — inference-logica en `nn.Sequential` opbouw voor ASL.
- `notebooks/package/smart_gestures/alphabet/vgt_model/model.py` — identieke architectuur met aangepaste label-set en calibratie callbacks.
- `notebooks/package/smart_gestures/gestures/lstm_model/model.py` — sequentiële preprocess, `nn.LSTM` en padded sequence handling.
- `notebooks/training/asl_model/run_training.py`, `.../vgt_model/run_training.py`, `.../lstm_model/run_training.py` — beschrijven hoe datasets geladen en modellen getraind worden met augmentaties, callbacks en checkpoints.
- `docs/Architecture/README.md` — high-level architectuur; combineer dit document voor deep-dive info met het hoofdarchitectuuroverzicht.

**Document-informatie**:

- **Versie**: 1.0
- **Datum**: December 2025
- **Auteurs**: Lynn Delaere
- **Contact**: Zie [GitHub repository](https://github.com/vives-project-xp/Signapse)
