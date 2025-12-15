# Registry UI

## Overview

We use `joxit/docker-registry-ui` to provide a simple web interface for browsing and managing images in the local registry. The UI queries the Registry HTTP API V2 and renders repositories, tags and manifests so developers can inspect or delete images during development.

Run it locally with the Notebooks compose file:

```bash
docker compose -f notebooks/docker-compose.yml up registry-ui
```

The service exposes the UI on host port `5001` (container `80`). Because it communicates directly with the registry, treat the UI as a development convenience and restrict or remove it in production environments where access should be authenticated and proxied.
