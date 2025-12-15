# PostgreSQL

## Overview

PostgreSQL provides the relational store for lakeFS metadata in this project. It is a mature, ACID-compliant database, well-suited for transactional workloads such as commit and branch metadata where consistency and durability are important.

## Why PostgreSQL here

lakeFS requires a transactional database to store commits, branches and user metadata; PostgreSQL offers the durability and transactional semantics needed for those operations and simplifies routine tasks such as migrations and backups.

## Running locally

Bring up PostgreSQL using the Notebooks compose file:

```bash
docker compose -f notebooks/docker-compose.yml up postgres
```

The compose configuration uses example environment variables such as `POSTGRES_USER=lakefs`, `POSTGRES_PASSWORD=lakefs` and `POSTGRES_DB=lakefs` for the local test environment.

## Persistence

The compose stack mounts a named volume (`pg_data`) to persist the database directory. When deploying to Kubernetes ensure the persistent volume has the correct permissions and storage class for your environment.

## Backups & maintenance

For local testing `pg_dump` is a simple way to capture backups, while production deployments should use managed PostgreSQL offerings or HA clusters with automated backup and failover (WAL archiving, PITR, or cloud provider snapshots) depending on recovery objectives.

## References

- PostgreSQL official manual: <https://www.postgresql.org/docs/>
- Backups & restore: <https://www.postgresql.org/docs/current/backup.html>

## Kubernetes notes

Kubernetes manifests under `k8s/postgres.*.yaml` provision PVCs for Postgres storage; the k3s local-path provisioner generally satisfies these on local clusters, but production should use cloud-backed PVs. Use `initContainers` to perform schema migrations or restore from backups on initial deployment when necessary.
