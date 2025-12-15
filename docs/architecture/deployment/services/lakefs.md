# LakeFS

## Overview

lakeFS provides Git-like semantics for object stores, adding commits, branches and atomic operations on top of an S3-compatible backend so datasets can be versioned and reproduced. In this repository lakeFS is configured to use MinIO as the blockstore and PostgreSQL for metadata storage.

## Why lakeFS is useful here

For machine learning experiments and data pipelines the ability to take reproducible, immutable snapshots of datasets and model artifacts is valuable. lakeFS gives those capabilities on object stores, and because it speaks the S3 API it maps directly to MinIO locally and AWS S3 or other providers in production.

## References

See the lakeFS documentation for concepts and operational guidance: <https://docs.lakefs.io/>. Key concepts include repositories, branches, commits, objects and hooks for pipeline integrations.

## How the repo uses lakeFS

The Notebooks compose file brings up lakeFS alongside MinIO and Postgres and configures lakeFS to use the MinIO endpoint as its blockstore. The service expects environment variables for the S3 endpoint and credentials, and an encryption key for authenticating tokens.

## Running locally

Run lakeFS with the Notebooks compose configuration:

```bash
docker compose -f notebooks/docker-compose.yml up lakefs
```

By default the lakeFS UI and API are exposed on `8000`.

## Related services

lakeFS depends on MinIO (or another S3 backend) for object storage and PostgreSQL for metadata. The project uses lakeFS hooks to integrate dataset events with CI/CD or data pipelines when branches or commits are created.

## Production considerations

In production use a managed S3 backend or a highly available MinIO cluster and ensure PostgreSQL metadata is deployed in a resilient, backed-up configuration. Store credentials in secrets rather than plain environment variables and adopt a backup strategy that covers both metadata and object storage.

## References & further reading

- lakeFS docs: <https://docs.lakefs.io/>
- lakeFS concepts: <https://docs.lakefs.io/concepts/>
- Using lakeFS with MinIO: <https://docs.lakefs.io/guides/using-lakefs-with-minio>
