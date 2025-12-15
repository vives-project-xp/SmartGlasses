## lakeFS — Executive Summary

lakeFS is a data versioning system that provides Git-like operations for object stores. It is used here to manage and version datasets stored in MinIO.

## Technology Deep Dive (The "What")

lakeFS sits on top of an object store and exposes a repository-like interface that supports branching, commits and snapshots of object data. Unlike transactional databases, object stores are eventually-consistent under some scenarios and lack fine-grained version control; lakeFS provides an easy way to create reproducible versions of datasets and to perform safe experiments by working on isolated branches.

Key concepts include repositories (logical collections of objects under version control), branches (independent lines of development for datasets), and commits (atomic snapshot operations). lakeFS uses a relational database (Postgres) for metadata and an object store (MinIO) for the actual data blobs.

lakeFS is popular for reproducible data engineering workflows because it enables safe experimentation on large object datasets while preserving provenance and the ability to roll back changes.

## Service Implementation (The "Why Here")

In this project lakeFS manages model and dataset artifacts stored in MinIO so that training, evaluation and dataset changes are versioned. For instance, a dataset used to train an LSTM can be branched and modified without affecting the canonical dataset until changes are committed and merged.

Example: A data scientist can create a branch to preprocess images differently, run experiments using that branch, and then either merge or discard the results depending on the outcome.

## Usage Guide (The "How")

Start lakeFS alongside Postgres and MinIO and use the web UI or the CLI to create repositories and branches.

```bash
# Start the lakeFS stack
docker compose -f notebooks/docker-compose.yml up -d minio postgres lakefs

# Check lakeFS health
wget -qO- http://localhost:8000/_health

# Open the web UI at http://localhost:8000
```

**Configuration Reference**

| Variable | Default Value | Description |
|---|---:|---|
| LAKEFS_DATABASE_TYPE | postgres | Type of metadata database |
| LAKEFS_DATABASE_CONNECTION_STRING | postgres://lakefs:lakefs@postgres:5432/lakefs?sslmode=disable | Connection string for Postgres |
| LAKEFS_BLOCKSTORE_S3_ENDPOINT | <http://minio:9000> | S3 API endpoint for blockstore |

**Access**

lakeFS exposes a web UI on port 8000 and an S3 gateway for access to repositories. Use <http://localhost:8000> when running locally to inspect repositories and branches.

## Connections (The Ecosystem)

lakeFS depends on Postgres for metadata and MinIO for object storage. Clients (data engineers, scripts) interact with lakeFS to create, branch and commit dataset changes, and then the server or training pipelines read from committed paths.

```mermaid
flowchart LR
  LakeFS[(lakeFS)] --> Postgres[(Postgres)]
  LakeFS --> MinIO[(MinIO)]
  DataUser --> LakeFS
```
