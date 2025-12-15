# Docker Registry

## Overview

The project includes a local Docker Registry to host images during development and CI runs, avoiding public registries when a private store is more appropriate. The registry implements the Docker Registry HTTP API V2 and is configured for local persistence using a host mount.

By default the compose setup exposes the registry on HTTP port `5000` for convenience in local testing; for any network-exposed or production registry configure TLS termination and authentication (htpasswd, token service, or an identity provider) and follow the upstream deployment guidance.

Operationally ensure adequate disk space for blobs and run the registry garbage collector after deleting images or tags to reclaim space.
