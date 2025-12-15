# Heimdall

## Overview

Heimdall is a lightweight dashboard that aggregates links to project services such as the docs site, API UIs, registry UI and lakeFS console. It is not required for platform functionality but is useful for local demos and improving developer workflows.

Run it locally with Docker Compose:

```bash
docker compose up heimdall
```

The service persists configuration in the `heimdall_data` volume so dashboards survive restarts, and tiles are managed through the web UI. Heimdall is designed for private networks—do not expose it publicly without authentication; for corporate use protect it behind single sign-on or an authenticated reverse proxy.

References: Heimdall project (linuxserver image docs) and upstream repository.
