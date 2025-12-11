# Model Retraining & LakeFS Workflow

Deze README begeleidt nieuwe teamleden die **nieuwe data** willen toevoegen en een `smart_gestures`-model opnieuw moeten trainen. We behandelen eerst het **VGT-alfabetmodel** en vervolgens het **LSTM-woordmodel**.

## Overzicht Stappen

1. Verzamel/normaliseer je data (bijv. `webcam_landmarks.py` voor alfabetten, `capture_dataset_lstm.py` voor sequenties).
2. Check een LakeFS-branch uit, voeg de ruwe en verwerkte data toe en commit/push.
3. Download de data via `lakectl local clone` of `lakectl local pull` en wijs de trainingsscripts naar die map (`LAKEFS_DATA_PATH`).
4. Train, valideer en sla het `.pth`-bestand op.
5. Kopieer het model naar `notebooks/package/smart_gestures/.../models/`, bump `smart_gestures` en update de FastAPI- afhankelijkheid (zie [AI-Packages.md](./AI-Packages.md#model-lifecycle)).

## 1. Voorwaarden

- LakeFS + Minio draaien lokaal en CLI-tools zijn geconfigureerd. Volg [setup_guide_lakefs_minio.md](../Getting%20Started/Development/setup_guide_lakefs_minio.md) om:
  - `docker compose up -d` te draaien in `notebooks/`.
  - `lakectl`/`mc` te installeren en `lakectl config` uit te voeren.
- Virtuele omgeving met de notebook-dependencies (bijv. `python3.12 -m venv .venv && source .venv/bin/activate && pip install -r notebooks/requirements.txt`).

## 2. VGT-alfabet opnieuw trainen

### 2.1 Data verzamelen (VGT)

1. Gebruik één van de utilities in `notebooks/utilities/`:
   - `webcam_landmarks.py` / `static_image_landmarks.py` voor snelle opnames.
   - `extract_landmarks_from_dataset.py` of `csv_to_json.py` om bestaande datasets om te zetten.
2. Bewaar de labels exact zoals in `smart_gestures/alphabet/vgt_model/data/classes.json` (A-Z). Elk record in de JSONL/CSV bevat 21 landmarks (x,y,z).
3. Voeg context toe (datum, gebaarder, camerapositie) in een `README-data.md` zodat reviewers weten waar de samples vandaan komen.

### 2.2 Data naar LakeFS pushen (VGT)

Gebruik hetzelfde LakeFS-proces voor elke dataset:

```bash
# Maak branch
lakectl branch create lakefs://signapse-data/feature/new-vgt-data \
  --source lakefs://signapse-data/main

# Clone lokaal
lakectl local clone lakefs://signapse-data/feature/new-vgt-data data-lake
cd data-lake
```

Kopieer je nieuwe alfabetdataset naar `datasets/vgt/<datum>/hand_landmarks.json` (of .csv) en voer `lakectl local commit` + `lakectl local push` uit.

### 2.3 Data gebruiken in notebooks (VGT)

1. Op de trainingsmachine:

   ```bash
   lakectl local pull data-lake
   export LAKEFS_DATA_PATH=/pad/naar/data-lake/datasets/vgt/2024-12
   ```

2. Kopieer of symlink het bestand naar `notebooks/training/vgt_model/data/hand_landmarks.json` (of update de scripts om rechtstreeks naar `LAKEFS_DATA_PATH` te wijzen).

### 2.4 VGT-model trainen

1. Activeer de venv en ga naar de trainingsmap:

   ```bash
   cd notebooks
   pip install -r requirements.txt
   cd training/vgt_model
   ```

2. Start de training met de gewenste hyperparameters (zie [CLI-tabel](./AI-Packages.md#cli-argumenten-per-trainingsscript)):

   ```bash
   python run_training.py \
     --batch_size 64 \
     --epochs 60 \
     --lr 5e-4 \
     --augment \
     --augment_prob 0.6 \
     --noise_std 0.02 \
     --rotate_deg 15 \
     --scheduler plateau \
     --label_smoothing 0.1 \
     --lambda_brier 1.0 \
     --output vgt_alphabet_model_2024_12.pth
   ```

3. Controleer accuracy/loss en noteer belangrijke metrics (bijv. calibratie resultaten).

### 2.5 Valideren & promoten (VGT)

1. Kopieer het model naar het package:

   ```bash
   cp vgt_alphabet_model_2024_12.pth ../../package/smart_gestures/alphabet/vgt_model/models/vgt_alphabet_model.pth
   ```

2. Update `classes.json` indien de labelset uitbreidt.
3. Volg de [model lifecycle](./AI-Packages.md#model-lifecycle) voor package bump, dependency-updates en smoke-tests (focus op `/alphabet/vgt/predict`).

## 3. LSTM-woordmodel opnieuw trainen

### 3.1 Nieuwe data verzamelen (LSTM)

1. Gebruik `notebooks/utilities/capture_dataset_lstm.py` om keypoint-sequenties op te nemen. Het script creëert een mapstructuur van de vorm:

   ```
   dataset/
     ├── hallo/
     │   └── 000/
     │       └── 2024-12-11T10-00-00/
     │           ├── keypoints_000.npy
     │           ├── keypoints_001.npy
     │           └── ...
   ```

2. Controleer of elk gebaar minstens `SEQUENCE_LENGTH` (40) frames bevat. Bij minder frames vult het trainingsscript wel aan, maar variatie per gebaar is gewenst.
3. Documenteer meta-informatie (datum, performer, omgeving) zodat reviewers weten waar de data vandaan komt. Bewaar deze info in een `README-data.md` in dezelfde map.

### 3.2 Data naar LakeFS pushen (LSTM)

Volg dezelfde werkwijze als voor VGT, maar groepeer je data onder `datasets/lstm/<datum>/`. Gebruik een specifieke branchnaam, bijvoorbeeld `feature/new-lstm-data`, en commit/push via `lakectl local commit`.

### 3.3 Data downloaden/verwijzen in notebooks

1. Clone/pull de branch op de machine waar je gaat trainen (`lakectl local clone ...` of `lakectl local pull`).
2. Wijs het trainingsscript naar de LakeFS-checkout door de env var `LAKEFS_DATA_PATH` te zetten:

   ```bash
   export LAKEFS_DATA_PATH=/pad/naar/data-lake/datasets/lstm/2024-12-new-recordings
   ```

   De LSTM `data_utils.py` haalt automatisch dit pad op. Zonder env var gebruikt het script de lokale `notebooks/training/lstm_model/dataset` map.

### 3.4 LSTM-model trainen

1. Activeer je virtuele omgeving en installeer dependencies:

   ```bash
   cd notebooks
   pip install -r requirements.txt
   ```

2. Start training vanuit `notebooks/training/lstm_model/`:

   ```bash
   cd notebooks/training/lstm_model
   python run_training.py \
     --batch_size 32 \
     --epochs 60 \
     --lr 5e-4 \
     --hidden_size 128 \
     --num_layers 2 \
     --output lstm_model_2024_12.pth
   ```

   Pas de argumenten aan op basis van [de CLI-tabel](./AI-Packages.md#cli-argumenten-per-trainingsscript).

3. Controleer de console-output en noteer de validatie-accuracy.

### 3.5 Valideren & promoten (LSTM)

1. Gebruik `evaluate_model` of schrijf een extra notebook/testscript dat inference doet op bekende sequences.
2. Kopieer het beste `.pth` bestand naar het package:

   ```bash
   cp lstm_model_2024_12.pth ../../package/smart_gestures/gestures/lstm_model/models/lstm_model.pth
   ```

3. Update eventueel `gesture_map.json` en commit de wijzigingen.
4. Volg de [model lifecycle checklist](./AI-Packages.md#model-lifecycle):
   - Bump `smart_gestures` versie in `notebooks/package/pyproject.toml`.
   - Bouw/publiceer of installeer het nieuwe package (bijv. `pip install -e notebooks/package`).
   - Update `server/pyproject.toml` en `server/requirements.txt` zodat de FastAPI backend het nieuwe package gebruikt.
   - Draai smoke-tests (`/alphabet/asl/predict`, `/alphabet/vgt/predict`, `/gestures/lstm/predict`) en commit de code.

## 4. LakeFS housekeeping

1. Voeg je nieuwe `.pth` en alle dataset changes toe aan dezelfde LakeFS-branch (zowel ruwe als verwerkte bestanden).
2. Commit en maak een merge request richting `main`. Gebruik de LakeFS UI om diffs te keuren en een reviewer te taggen.
3. Na merge kun je de lokale checkout updaten en de branch opruimen:

   ```bash
   lakectl local pull data-lake
   lakectl branch delete lakefs://signapse-data/feature/new-data
   ```

Nu is de dataset geversioneerd, het model opnieuw getraind en het backend package bijgewerkt. Nieuwe teamleden kunnen deze README volgen voor alle toekomstige retrainings.

**Document-informatie**:

- **Versie**: 1.0
- **Datum**: December 2025
- **Auteurs**: Lynn Delaere
- **Contact**: Zie [GitHub repository](https://github.com/vives-project-xp/Signapse)
