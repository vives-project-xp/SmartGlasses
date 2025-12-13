# Deployment: Services and k3s tutorial

This document lists the services used across the repository (from the project's Docker Compose files) and provides an advanced tutorial for deploying the `k8s/` manifests to a local k3s cluster.

## Services (from docker-compose)

The following services are defined in the repository Compose files (`docker-compose.yaml` at the repo root and `notebooks/docker-compose.yml`).

# Deployment: services index

The per-service documentation has been split into individual folders under `docs/architecture/deployment/services/`.

Open the service index for concise links and per-service `index.md` pages:

- [Services index](./services/index.md)
- [Advanced k3s tutorial](./advanced/k3s/index.md)
  - Purpose: FastAPI backend handling keypoints, AI inference and WebSocket
