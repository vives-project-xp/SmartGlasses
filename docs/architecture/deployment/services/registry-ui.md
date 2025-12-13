docker compose -f notebooks/docker-compose.yml up registry-ui
docker compose -f notebooks/docker-compose.yml up registry-ui

# Registry UI (web interface for Docker registry)

## Overview

This repository uses `joxit/docker-registry-ui` to provide a human-friendly UI to browse and manage the images stored in the local Docker registry. The UI queries the registry API and renders catalogs, repositories, and tag lists.

## Key points & docs

- The UI interacts with the Docker Registry HTTP API V2; see <https://docs.docker.com/registry/spec/api/> for the underlying API.
- `joxit/docker-registry-ui` project: <https://github.com/Joxit/docker-registry-ui> (documentation and configuration details).

## Running locally

```bash
docker compose -f notebooks/docker-compose.yml up registry-ui
```

Ports: host `5001` → container `80`.

## Notes & security

- The UI is convenient in development to inspect tags and to delete images; remove or protect it in production.
- Because it talks directly to the registry, ensure proper CORS and authentication are configured if the registry is exposed over a network.

## References

- Docker Registry API: <https://docs.docker.com/registry/spec/api/>
- docker-registry-ui GitHub: <https://github.com/Joxit/docker-registry-ui>
