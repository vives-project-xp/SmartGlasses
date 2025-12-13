# PostgreSQL (database for lakeFS and metadata)

## Overview

PostgreSQL is the relational database used to store lakeFS metadata in this project. PostgreSQL is a mature, ACID-compliant database with strong community support and extensive documentation (<https://www.postgresql.org/docs/>).

## Why PostgreSQL here

- lakeFS relies on a relational DB for transactional metadata (commits, branches, users) — PostgreSQL provides durability and transactional guarantees.
- Using a standard RDBMS simplifies migrations, backups and compliance requirements.

## Running locally

Start Postgres from the notebooks compose file:

docker compose -f notebooks/docker-compose.yml up postgres

Default example env vars (from compose):

- `POSTGRES_USER=lakefs`
- `POSTGRES_PASSWORD=lakefs`
- `POSTGRES_DB=lakefs`

## Persistence

- The compose file mounts a named volume `pg_data` for `/var/lib/postgresql/data`.
- Ensure appropriate permissions on the underlying host path if using hostPath volumes in k8s.

## Backups & maintenance

- Regularly run `pg_dump` or base backups (WAL shipping) for critical datasets.
- For production, prefer managed PostgreSQL or a high-availability cluster with automated backups and failover.

## References

- PostgreSQL official manual: <https://www.postgresql.org/docs/>
- Backups & restore: <https://www.postgresql.org/docs/current/backup.html>

## Kubernetes notes

- Postgres manifest in `k8s/postgres.*.yaml` includes PVCs. k3s local-path provisioner will usually satisfy PVCs in local testing, but production should use cloud storage or PV-backed solutions.
- Use `initContainers` if you need to initialize the DB schema or restore from a backup on first deploy.
