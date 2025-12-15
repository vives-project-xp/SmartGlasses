# Uptime Kuma

## Overview

Uptime Kuma provides a lightweight, self-hosted monitoring UI for checking service availability and sending alerts. It is quick to deploy during development to keep an eye on the FastAPI backend, docs server, and other services and supports a variety of integrations for notifications.

Start the service locally with Docker Compose:

```bash
docker compose up uptime-kuma
```

The container exposes port `3001` and stores configuration and history in the `uptime-kuma-data` volume so settings persist across restarts. Create checks for `/health` endpoints and choose sensible intervals and failure thresholds to avoid noisy alerts from transient network issues.

See the project site and repository for advanced configuration and notifier options.
