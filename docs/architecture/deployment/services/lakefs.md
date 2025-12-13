# lakeFS (data lake versioning & Git-like object store)

## Overview

lakeFS (<https://docs.lakefs.io/>) provides Git-like semantics for object stores: it layers commits, branches and atomic commits on top of S3-compatible storage so you can version, branch and reproduce datasets. In this repository lakeFS is configured to use MinIO (S3 API) as the blockstore and PostgreSQL for its metadata.

## Why lakeFS is useful here

- ML experiments and datasets benefit from immutability and reproducible snapshots — lakeFS provides that for object data (images, extracted landmarks, model artifacts).
- It integrates with S3-compatible endpoints so it pairs naturally with MinIO in local dev and real S3 in production.

## Official docs & references

- lakeFS docs: <https://docs.lakefs.io/>
- Key concepts: repositories, branches, commits, objects, hooks (used for pipelines).

## How the repo uses lakeFS

- `notebooks/docker-compose.yml` launches `lakefs` with environment pointing at the local MinIO endpoint and Postgres database.
- Environment variables required:
  - `LAKEFS_BLOCKSTORE_S3_ENDPOINT` → MinIO URL
  - `LAKEFS_BLOCKSTORE_S3_CREDENTIALS_ACCESS_KEY_ID` / `LAKEFS_BLOCKSTORE_S3_CREDENTIALS_SECRET_ACCESS_KEY`
  - `LAKEFS_AUTH_ENCRYPT_SECRET_KEY` (32+ chars) used to encrypt auth tokens

## Running locally

From the `notebooks` folder:

docker compose -f notebooks/docker-compose.yml up lakefs

Ports: `8000:8000` (lakeFS UI + S3 gateway)

## Related services

- MinIO (S3 blockstore): lakeFS stores object blocks in MinIO; both must be reachable and credentials configured.
- Postgres: lakeFS stores metadata (repositories, commits, branches) in Postgres.
- CI/CD / pipelines: lakeFS hooks can trigger downstream processing when branches/commits are created.

## Production considerations

- In production prefer a robust S3 backend (AWS S3, GCS) and a highly available Postgres cluster.
- Secure credentials: use k8s Secrets or managed secret stores rather than env vars in production.
- Backup strategy: snapshot the Postgres metadata and ensure object store lifecycle/backup is configured for long-term retention.

## References & further reading

- lakeFS docs: <https://docs.lakefs.io/>
- lakeFS concepts: <https://docs.lakefs.io/concepts/>
- Using lakeFS with MinIO: <https://docs.lakefs.io/guides/using-lakefs-with-minio>
