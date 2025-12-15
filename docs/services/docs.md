## Docs (MkDocs) — Executive Summary

The `docs` service hosts the project's documentation site using MkDocs. It provides a lightweight static site that serves developer documentation and architecture explanations.

## Technology Deep Dive (The "What")

MkDocs is a static site generator designed for technical documentation. It uses Markdown files as the source and the Jinja2 templating engine to render an HTML site. The toolchain focuses on ease of authoring and simple deployment, which makes it a common choice for project documentation.

Key concepts include source Markdown files, a site configuration file (`mkdocs.yml`) that defines navigation and plugins, and a build step that generates static HTML files. Serving can be done locally via `mkdocs serve` for preview or by deploying generated files to any static web host.

MkDocs is widely used because it reduces friction for writers and integrates well with CI/CD pipelines to publish documentation automatically.

## Service Implementation (The "Why Here")

In Signapse the docs service builds and serves the documentation for contributors. During development the container mounts the repository so it serves the latest Markdown; in production the built static files are the deliverable artifact.

Example: When you update a page under `docs/`, rerunning the container or running `mkdocs serve` reflects content changes for review.

## Usage Guide (The "How")

You can run the documentation preview locally or rebuild the static site for publication.

```bash
# Start the docs container
docker compose up -d docs

# Live preview (local machine)
cd docs
pip install -r config/mkdocs/requirements.txt
mkdocs serve -a 0.0.0.0:8000
```

The `mkdocs serve` command launches a local server and rebuilds on file changes, making it ideal for editing documentation.

**Configuration Reference**

| Variable | Default Value | Description |
|---|---:|---|
| USER | ${UID}:${GID} | File owner mapping used in the container |
| PORT | 8000 | Internal MkDocs server port |

**Access**

When started via the repository root Compose file, the documentation site is available at <http://localhost:8085>.

## Connections (The Ecosystem)

The docs site is read-only content and does not depend on runtime services, but it documents and links to endpoints provided by the server, client, and other services.

```mermaid
flowchart LR
  Docs -->|Docs pages| Repository[Repo (Markdown)]
```
