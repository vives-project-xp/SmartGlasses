docker compose up heimdall

# Heimdall (application dashboard)

Overview
--------

Heimdall is a lightweight home dashboard used to aggregate links to services and applications. It’s not critical to the platform but is convenient for local demos and developer workflows.

Why use Heimdall?
------------------

- Centralizes links and quick access to internal services (docs, API UIs, registry UI, lakeFS console).
- Lightweight and easy to run as a Docker container (linuxserver/heimdall).

docker compose up heimdall

# Heimdall (application dashboard)

## Overview

Heimdall is a lightweight home dashboard used to aggregate links to services and applications. It’s not critical to the platform but is convenient for local demos and developer workflows.

## Why use Heimdall?

- Centralizes links and quick access to internal services (docs, API UIs, registry UI, lakeFS console).
- Lightweight and easy to run as a Docker container (linuxserver/heimdall).

## Running locally

```bash
docker compose up heimdall
```

Ports: `80:80` (host)

## Configuration

- Heimdall persists its configuration to a volume (`heimdall_data`) so dashboards survive container restarts.
- Use the web UI to add tiles/links and configure icons.

## Security and production notes

- Heimdall is intended for private networks; do not expose it publicly without authentication.
- For corporate deployments, consider integrating a single sign-on solution or protecting the app with a reverse proxy requiring authentication.

## References

- Heimdall project (linuxserver image docs): <https://hub.docker.com/r/linuxserver/heimdall>
- Project upstream: <https://github.com/linuxserver/Heimdall>
