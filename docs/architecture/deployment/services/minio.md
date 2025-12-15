# MinIO

## Overview

MinIO is an S3-compatible object storage server used here as the backing store for `lakeFS` and for local experiments that need an S3 API. Its lightweight container deployment makes it a convenient, drop-in local replacement for AWS S3 during development.

## Why it matters

Because MinIO implements the S3 API, existing SDKs and tools that speak S3 (boto3, AWS SDKs, etc.) can interact with it without modification. This makes MinIO particularly useful for local development where running a full S3 service is impractical.

## How the project uses MinIO

The `notebooks/docker-compose.yml` file configures a MinIO service with `./data` mounted for persistence. lakeFS is pointed at that MinIO endpoint as its blockstore, using the standard S3-compatible environment variables for credentials and endpoint configuration.

## Running locally

Start MinIO using the Notebooks compose file:

```bash
docker compose -f notebooks/docker-compose.yml up minio
```

By default MinIO exposes the S3 API on port `9000` and the web console on `9001`.

## Configuration and security

MinIO authenticates using `MINIO_ROOT_USER` and `MINIO_ROOT_PASSWORD` by default; for production environments prefer IAM-like policies or service accounts and store credentials in secrets. Ensure TLS termination is configured in front of MinIO in production so credentials and payloads are encrypted in transit, and consider a distributed MinIO deployment or managed S3 service for durability and high availability.

## Integration notes

In this project lakeFS stores object blocks in MinIO so that dataset versioning and branch semantics sit on top of an S3-compatible API. To access MinIO programmatically use the standard AWS S3 SDKs or MinIO SDKs pointed at the local endpoint.

## References

- MinIO documentation: <https://docs.min.io/>
- MinIO quickstart (Docker): <https://docs.min.io/docs/minio-docker-quickstart-guide.html>
- MinIO security and TLS: <https://docs.min.io/docs/how-to-secure-access-to-minio-server.html>

## Notes for Kubernetes

On Kubernetes, MinIO may be deployed as a StatefulSet backed by persistent volumes; for production consider using managed S3 instead. When integrating with lakeFS provide credentials through Kubernetes Secrets and configure the lakeFS blockstore settings to point at the cluster's object store endpoint.
