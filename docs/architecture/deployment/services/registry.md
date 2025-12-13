docker compose -f notebooks/docker-compose.yml up registry-server

# Docker Registry (private image registry)

Overview
--------

This project includes a local Docker Registry (open-source `distribution` / `registry`) to host built images during development. The registry allows local CI and developers to push/pull container images without using Docker Hub.

Official docs & context
------------------------

- Docker Registry docs: <https://docs.docker.com/registry/> (the upstream open-source project is CNCF Distribution)
- The registry implements the Docker Registry HTTP API V2 and supports basic features like pushing, pulling, and deleting image tags (if configured).

How the repo configures it
--------------------------

- `notebooks/docker-compose.yml` contains `registry-server` (`registry:2.8.2`) with a host mount `./registry/data:/var/lib/registry` for persistent storage.
- The compose file sets permissive HTTP headers for CORS and enables delete support (helpful for development to clean up images).

docker compose -f notebooks/docker-compose.yml up registry-server

# Docker Registry (private image registry)

## Overview

This project includes a local Docker Registry (open-source `distribution` / `registry`) to host built images during development. The registry allows local CI and developers to push/pull container images without using Docker Hub.

## Official docs & context

- Docker Registry docs: <https://docs.docker.com/registry/> (the upstream open-source project is CNCF Distribution)
- The registry implements the Docker Registry HTTP API V2 and supports basic features like pushing, pulling, and deleting image tags (if configured).

## How the repo configures it

- `notebooks/docker-compose.yml` contains `registry-server` (`registry:2.8.2`) with a host mount `./registry/data:/var/lib/registry` for persistent storage.
- The compose file sets permissive HTTP headers for CORS and enables delete support (helpful for development to clean up images).

## Security & TLS

- The registry in this repo is exposed via HTTP (port `5000`) and intended for local development only. For production or network-exposed registries:
  - Use TLS (configure the registry with certificates) or place it behind TLS-terminating proxy.
  - Configure authentication (htpasswd, token, or integrate with an identity provider).

## Operational notes

- Storage: the registry stores blobs under the configured directory; ensure sufficient disk space for images.
- Garbage collection: when images/tags are deleted, run the registry garbage-collect command to free disk space.

## References & resources

- Docker Registry HTTP API V2: <https://docs.docker.com/registry/spec/api/>
- Running a secure registry: <https://docs.docker.com/registry/deploying/>
- Storage & garbage collection: <https://docs.docker.com/registry/storage/>
