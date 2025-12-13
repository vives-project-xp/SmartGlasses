# MinIO (S3-compatible object storage)

## Overview

MinIO is a high-performance, S3-compatible object storage server suited for cloud-native applications. In this repository it is used primarily as the backing object store for `lakefs` and for local experiments that need an S3 API.

## Official docs & why it matters

- Official docs: <https://docs.min.io/>
- MinIO provides an S3-compatible API (the same semantics as AWS S3) so many tools and SDKs can operate with it unchanged. For local development it is an excellent drop-in replacement for S3 because it can be run as a lightweight container with a web console.

## How the project uses MinIO

- `notebooks/docker-compose.yml` configures `minio` and mounts `./data` for persistence.
- `lakefs` is configured to use MinIO as its blockstore (S3 endpoint) and relies on environment vars `MINIO_ROOT_USER`/`MINIO_ROOT_PASSWORD`.

## Running locally

From the `notebooks` folder or by pointing Compose to the file:

docker compose -f notebooks/docker-compose.yml up minio

Default ports exposed:

- `9000` – S3 API (programmatic access)
- `9001` – MinIO console (web UI)

## Configuration and security

- Access keys: MinIO uses `MINIO_ROOT_USER` and `MINIO_ROOT_PASSWORD` for baseline authentication. For multi-tenant setups or production, use IAM-like policies and service accounts.
- TLS: For production use, MinIO should be set behind a TLS-terminating proxy or configured with certificates so credentials are not sent in cleartext.
- Data durability: By default MinIO in single-server mode stores objects locally; for production use consider distributed MinIO clusters or managed S3 offerings.

## Integration notes

- lakeFS: MinIO acts as the backing S3-compatible blockstore for lakeFS; lakeFS provides versioning + git-like semantics on top of object storage.
- Client SDKs: Use the AWS S3 SDKs (boto3 for Python, AWS SDKs for other languages) pointed at the MinIO endpoint, or MinIO SDKs.

## References

- MinIO documentation: <https://docs.min.io/>
- MinIO quickstart (Docker): <https://docs.min.io/docs/minio-docker-quickstart-guide.html>
- MinIO security and TLS: <https://docs.min.io/docs/how-to-secure-access-to-minio-server.html>

## Notes for k8s

- When deploying to k8s, MinIO can run as a StatefulSet or use managed S3. For lakeFS in k8s, configure lakeFS to talk to your S3 endpoint (MinIO or real S3) and provide credentials via Secrets.
