# Lokale Setup & Data Versioning

## Inleiding

Dit document beschrijft hoe je de Python-omgeving opzet en hoe je LakeFS en Minio lokaal kunt draaien voor data-versioning.

We splitsen dit op in vier duidelijke stappen:

- De Services Starten: LakeFS & Minio via Docker.

- De Services Configureren: Je lokale clients (CLIs) instellen om met de services te praten.

- De Python Scripts Draaien: Twee opties om je code uit te voeren.

- Basis Workflow: Hoe je een repository clonet.

## Vereisten

Zorg dat je de volgende tools hebt geïnstalleerd voordat je begint:

- Python 3.12

- Docker

- Docker Compose

- Git

## Start de Core Services (LakeFS & Minio)

Dit is de basis. We gebruiken één docker-compose.yml bestand om zowel de LakeFS- als de Minio-server te starten. Dit bestand start ook een Python/Jupyter-container die je later kunt gebruiken (zie Deel 3, Optie B).

Clone de repository (als je dat nog niet hebt gedaan):

```Shell
git clone <repository_url>
```

Navigeer naar de notebooks map (waar de docker-compose.yml staat):

```Shell
cd /pad/naar/je/repo/notebooks
```

Maak een .env bestand aan vanuit het template. Hierin staan je keys en wachtwoorden.

```Shell
cp .env.template .env
```

Belangrijk: Open het .env bestand en pas de variabelen (zoals MINIO_ACCESS_KEY en MINIO_SECRET_KEY) aan naar wens.

Start alle services met Docker Compose:

```Shell

docker compose up -d
```

Je services zijn nu (lokaal) bereikbaar:

- LakeFS Web UI: [http://localhost:8000/setup](http://localhost:8000/setup)

  - Volg de setup-instructies in de browser om je eerste admin-gebruiker aan te maken.

- Minio Web UI: [http://localhost:9001](http://localhost:9001)

  - Log in met de MINIO_ACCESS_KEY en MINIO_SECRET_KEY uit je .env bestand.

## Configureer de Services (Eerste Gebruik)

Nu de servers draaien, moeten we ze vertellen wat ze moeten doen. Hiervoor installeren en configureren we de lokale command-line clients (mc voor Minio en lakectl voor LakeFS).

### Minio Client (mc) Setup

Met de mc client maken we de storage bucket waar LakeFS zijn data zal opslaan.

#### Installatie

Windows (PowerShell):

```PowerShell

# Download de Minio client
iwr https://dl.min.io/client/mc/release/windows-amd64/mc.exe -OutFile $env:USERPROFILE\mc.exe

# Voeg toe aan je PATH (voor deze sessie)
$env:PATH += ";" + $env:USERPROFILE

# Verifieer
mc.exe --version

```

Linux (Bash):

```Bash

# Download de Minio client
curl -O https://dl.min.io/client/mc/release/linux-amd64/mc

# Maak uitvoerbaar en verplaats
chmod +x mc
sudo mv mc /usr/local/bin/

# Verifieer
mc --version
```

#### Configuratie & Bucket Aanmaken

Configureer een alias: Vertel mc waar je Minio-server draait. Vervang <access_key> en <secret_key> met de waarden uit je .env bestand.

```Bash

# We gebruiken poort 9000, de standaard API-poort voor Minio
mc alias set myminio http://localhost:9000 <access_key> <secret_key>
```

Maak een bucket: Dit is de opslaglocatie voor je data.

```Bash

mc mb myminio/<bucket_name>
```

(Vervang <bucket_name> door een naam, bijv. lakefs-storage)

### LakeFS Client (lakectl) Setup
  
Met de lakectl client maken we een LakeFS repository die gelinkt is aan de Minio-bucket.

#### Installatie (lakectl)

Windows (PowerShell):

```PowerShell

# Download de LakeFS CLI (v1.71.0)
$zip = "$env:TEMP\lakectl.zip"
iwr https://github.com/treeverse/lakeFS/releases/download/v1.71.0/lakeFS_1.71.0_Windows_x86_64.zip -OutFile $zip

# Unzip naar een map
$dst = "$env:USERPROFILE\bin\lakectl"
mkdir $dst -Force | Out-Null
Expand-Archive $zip -DestinationPath $dst -Force

# Voeg toe aan je PATH (permanent)
$env:Path = "$env:Path;$dst"
setx PATH "$($env:Path)"

# Herstart je terminal en verifieer
lakectl --version
```

Linux (Bash):

```Bash

# Download de LakeFS CLI (v1.71.0)
curl -L https://github.com/treeverse/lakeFS/releases/download/v1.71.0/lakeFS_1.71.0_Linux_x86_64.tar.gz -o lakectl.tar.gz

# Uitpakken en verplaatsen
tar -xzf lakectl.tar.gz
chmod +x lakectl
sudo mv lakectl /usr/local/bin/

# Opruimen en verifiëren
rm lakectl.tar.gz
lakectl --version
```

#### Configuratie & Repository Aanmaken

Configureer de client: Dit start een interactieve wizard.

```Bash
lakectl config
```

Access Key & Secret Key: Gebruik de credentials van de admin-gebruiker die je in Start de core services (via de Web UI) hebt aangemaakt alsook het eindpoint die je daar hebt gebruikt.

#### Maak een repository: Link LakeFS aan je Minio-bucket

```Bash

lakectl repo create lakefs://<repo_name> s3://<bucket_name>
```

Vervang <repo_name> door je gewenste reponaam (bijv. mijn-data-project).

Vervang <bucket_name> door de Minio-bucketnaam (bijv. lakefs-storage).

Je bent nu klaar! De services draaien en zijn geconfigureerd.

## Typische Workflow met LakeFS

Nu alles is opgezet, kun je de lakectl client gebruiken om met je data te werken, vergelijkbaar met Git.

Clone een repository lokaal: Dit "mount" de LakeFS-repository als een lokale map, zodat je bestanden kunt zien en bewerken.

```Bash

lakectl local clone lakefs://<repo_name> <local_directory>
```

Vervang <repo_name> door de naam die je in stap 2b hebt gemaakt.

Vervang <local_directory> door een mapnaam (bijv. ./mijn-data).

Check de status: Nadat je bestanden hebt toegevoegd of gewijzigd in de <local_directory>, kun je de status zien:

```Bash
# Controleer de status in de lokale directory
lakectl local status <local_directory>

# Maak een commit met een bericht ( . alle wijzigingen in de directory)
lakectl local commit . -m "Je commit bericht hier"

# Pull de laatste wijzigingen van de remote repository
lakectl local pull <local_directory>

# Maak een nieuwe branch
lakectl branch create lakefs://<repo_name>/<branch_name> --source lakefs://<repo_name>/<source_branch>

# Wissel van branch (binnen een geclonede directory)
lakectl local checkout <local_directory> --ref lakefs://<repo_name>/<branch_name>

```

Voor meer commando's (zoals commit, push, merge), raadpleeg de LakeFS [documentatie](https://docs.lakefs.io/v1.60/howto/local-checkouts/)

## De Python Scripts Draaien (Kies je Methode)

Je hebt twee opties om de Python-scripts uit te voeren. Kies er één.

### Optie A: Lokaal op je Machine (met Virtual Environment)

Gebruik deze methode als je de scripts direct op je eigen besturingssysteem wilt draaien.

Maak een virtual environment:

```Bash

# Windows
py -3.12 -m venv .\.venv

# Linux
python3.12 -m venv ./.venv`
```

Activeer de virtual environment:

```Bash

# Windows
.\.venv\Scripts\activate

# Linux
source ./.venv/bin/activate
```

Installeer de dependencies:

```Bash

pip install -r requirements.txt
```

Draai je script:

```Bash

python your_script.py
```

### Optie B: Via Docker (met de Ingebouwde Jupyter/Python Container)

Gebruik deze methode als je liever binnen de geïsoleerde Docker-omgeving werkt. De docker compose up opdracht uit Start de Core Services heeft deze container al voor je gestart.

#### Jupyter Notebook Interface

Navigeer in je browser naar: [http://localhost:8888](http://localhost:8888)

Je hebt een token nodig. Vind deze door de logs van de container te bekijken:

```Shell

# Zoek de containernaam (bijv. 'notebooks-jupyter-1')
docker ps

# Vraag de logs op (vervang containernaam)
docker logs <jupyter_container_name>
```

Kopieer de token uit de logs (het deel na ?token=...) en plak dit in je browser.

#### Direct scripts uitvoeren (via docker exec) Je kunt ook direct een commando uitvoeren binnen de draaiende Python-container

```Shell
docker exec -it <jupyter_container_name> python your_script.py
```

(Vervang <jupyter_container_name> en your_script.py.)
