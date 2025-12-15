# Lokale Data Platform Setup (LakeFS + MinIO)

## Inleiding & Scope

### Context

Het Signapse data-platform combineert **LakeFS** voor data-versioning en **MinIO** als S3-compatibele object store. Deze gids beschrijft hoe je dezelfde lokale basis opzet als in de centrale ontwikkelomgeving.

### Scope

Dit document behandelt:

- Het starten van LakeFS, MinIO en de notebook container via Docker Compose
- De installatie en configuratie van de MinIO (`mc`) en LakeFS (`lakectl`) CLI's
- Een standaard LakeFS workflow (clone, status, commit, branches)
- Twee opties om Python-scripts uit te voeren (lokaal of in de container)

## Platformoverzicht

### Componenten

- **LakeFS** – Git-achtige versiecontrole voor data; web-UI op `http://localhost:8000/setup`
- **MinIO** – S3-compatible storage back-end; web-UI op `http://localhost:9001`
- **Notebook container** – Jupyter/Python runtime die automatisch mee start voor Optie B

### Dataflow

```label
Data scientist → Docker Compose stack → MinIO bucket → LakeFS repository → lokale clone/Jupyter jobs
```

## Vereisten

Installeer deze basis-tools voordat je begint:

- Python 3.12
- Docker + Docker Compose
- Git

## Stap 1 – Start de core services

### Repository & Docker Compose

```bash
git clone <repository_url>
cd /pad/naar/je/repo/notebooks
```

Maak een `.env` bestand op basis van het template en vul je eigen secrets in (`MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`, ...):

```bash
cp .env.template .env
```

### Start stack

```bash
docker compose up -d
```

- **LakeFS UI**: [http://localhost:8000/setup](http://localhost:8000/setup) – maak je eerste admin user aan
- **MinIO UI**: [http://localhost:9001](http://localhost:9001) – login met de waarden uit `.env`

## Stap 2 – Configureer storage (MinIO CLI)

### Installatie (mc)

**Windows (PowerShell)**:

```powershell
iwr https://dl.min.io/client/mc/release/windows-amd64/mc.exe -OutFile $env:USERPROFILE\mc.exe
$env:PATH += ";" + $env:USERPROFILE
mc.exe --version
```

**Linux (Bash)**:

```bash
curl -O https://dl.min.io/client/mc/release/linux-amd64/mc
chmod +x mc
sudo mv mc /usr/local/bin/
mc --version
```

### Configuratie

1. **Alias aanmaken** – wijs `mc` naar je lokale MinIO API (`:9000`):

   ```bash
   mc alias set myminio http://localhost:9000 <access_key> <secret_key>
   ```

2. **Bucket provisioneren** – dit wordt de fysieke opslag voor LakeFS:

   ```bash
   mc mb myminio/<bucket_name>
   ```

   Gebruik bijvoorbeeld `lakefs-storage` als bucketnaam.

## Stap 3 – Configureer LakeFS (lakectl)

### Installatie (lakectl)

**Windows (PowerShell)**:

```powershell
$zip = "$env:TEMP\lakectl.zip"
iwr https://github.com/treeverse/lakeFS/releases/download/v1.71.0/lakeFS_1.71.0_Windows_x86_64.zip -OutFile $zip
$dst = "$env:USERPROFILE\bin\lakectl"
mkdir $dst -Force | Out-Null
Expand-Archive $zip -DestinationPath $dst -Force
$env:Path = "$env:Path;$dst"
setx PATH "$($env:Path)"
lakectl --version
```

**Linux (Bash)**:

```bash
curl -L https://github.com/treeverse/lakeFS/releases/download/v1.71.0/lakeFS_1.71.0_Linux_x86_64.tar.gz -o lakectl.tar.gz
tar -xzf lakectl.tar.gz
chmod +x lakectl
sudo mv lakectl /usr/local/bin/
rm lakectl.tar.gz
lakectl --version
```

### Configuratie wizard

Voer `lakectl config` uit en gebruik de admin credentials en endpoint die je in de LakeFS UI hebt aangemaakt (`http://localhost:8000`).

### Repository koppelen

```bash
lakectl repo create lakefs://<repo_name> s3://<bucket_name>
```

- `<repo_name>` – kies bv. `mijn-data-project`
- `<bucket_name>` – de MinIO bucket uit stap 2 (`lakefs-storage`)

Je LakeFS-installatie is nu gekoppeld aan MinIO.

## Stap 4 – Typische LakeFS workflow

LakeFS werkt lokaal als Git voor data. Kerncommando's:

```bash
lakectl local clone lakefs://<repo_name> <local_directory>
lakectl local status <local_directory>
lakectl local commit . -m "Beschrijf je wijziging"
lakectl local pull <local_directory>
lakectl branch create lakefs://<repo_name>/<branch_name> --source lakefs://<repo_name>/<source_branch>
lakectl local checkout <local_directory> --ref lakefs://<repo_name>/<branch_name>
```

Gebruik `lakectl --help` of de [LakeFS documentatie](https://docs.lakefs.io/v1.60/howto/local-checkouts/) voor aanvullende workflows (push, merge, etc.).

## Stap 5 – Python runtimes

Je draait de Python/AI code lokaal of in de VS Code dev container. De oude Jupyter container uit `docker-compose.yml` is verwijderd, dus kies een van onderstaande workflows.

### Optie A – Native (virtual environment)

```bash
# Windows
py -3.12 -m venv .\.venv
.\.venv\Scripts\activate

# Linux
python3.12 -m venv ./.venv
source ./.venv/bin/activate

pip install -r requirements.txt
python your_script.py
```

### Optie B – VS Code Dev Container

1. Installeer de **Dev Containers** extensie in VS Code.
2. Open de command palette (`Ctrl/Cmd+Shift+P`) en kies `Dev Containers: Open Folder in Container...`.
3. Selecteer de repository; VS Code bouwt de container op basis van `.devcontainer/devcontainer.json` (Python 3.12 image + tooling).
4. Zodra de container draait kun je terminals starten binnen VS Code. Alle Python-commando's (inclusief `pip install -r requirements.txt` en `python your_script.py`) draaien geïsoleerd binnen dezelfde omgeving als de rest van het team.

## Document-informatie

- **Versie**: 1.3
- **Datum**: December 2025
- **Auteurs**: Lynn Delaere
- **Contact**: Zie [GitHub repository](https://github.com/vives-project-xp/Signapse)
