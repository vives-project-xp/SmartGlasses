docker compose up uptime-kuma

# Uptime Kuma (service uptime monitoring)

Overview
--------

Uptime Kuma is an open-source self-hosted monitoring tool for checking service availability and responding to outages. It provides an easy UI to create checks (HTTP, TCP, ping, DNS, etc.) and notifies via multiple integrations.

Why it's useful
---------------

- Quick to deploy for local development to track whether services (FastAPI, docs, client) are reachable.
- Supports alerting channels (email, Telegram, Discord, Slack) so teams can be notified when a service fails.

docker compose up uptime-kuma

# Uptime Kuma (service uptime monitoring)

## Overview

Uptime Kuma is an open-source self-hosted monitoring tool for checking service availability and responding to outages. It provides an easy UI to create checks (HTTP, TCP, ping, DNS, etc.) and notifies via multiple integrations.

## Why it's useful

- Quick to deploy for local development to track whether services (FastAPI, docs, client) are reachable.
- Supports alerting channels (email, Telegram, Discord, Slack) so teams can be notified when a service fails.

## Running locally

```bash
docker compose up uptime-kuma
```

Ports: `3001:3001`

## Configuration & persistence

- Data is stored in the `uptime-kuma-data` volume so checks and history persist across restarts.
- Use the web UI to add monitored endpoints and configure alerting channels.

## Useful tips

- Create health checks for `/health` endpoints of the `server` and `docs` services.
- Configure reasonable intervals and failure thresholds to avoid noisy alerts during short network hickups.

## References

- Uptime Kuma project: <https://uptime.kuma.pet/> (and <https://github.com/louislam/uptime-kuma>)
