# MkDocs

## Overview

The documentation site is generated with MkDocs and the Material theme to provide a Markdown-first authoring experience and a responsive, feature-rich static site. This setup gives us live preview during editing, client-side search, and a consistent visual style across the docs while keeping the build process simple and reproducible in a containerized environment.

## Why this stack? (references)

MkDocs is a pragmatic choice for technical documentation because it uses a single YAML configuration, provides a fast development server with live reload and produces predictable static output. The Material theme enhances usability with built-in search, code annotations and rich plugin support that makes it straightforward to author and maintain high-quality docs.

## How the repo uses MkDocs

We build MkDocs in a small container image (`config/mkdocs/Dockerfile`) that is used both for local previews (`mkdocs serve`) and CI builds. The site configuration lives in `config/mkdocs/mkdocs.yml` and content is authored under the repository `docs/` folder; static assets are stored in `assets/`.

## Local development

For local editing, use the containerized preview which automatically rebuilds and reloads the browser:

```bash
docker compose up --build docs
```

To produce a static site for deployment run `mkdocs build` against the project configuration and serve the generated `site/` directory with any static host.

## Authoring & features

Material for MkDocs adds features that are useful for technical content: a live preview during editing, client-side search, code annotations, and content tabs for multi-language snippets. We also enable Mermaid diagrams and other Markdown extensions for architecture diagrams and visualizations.

## Production considerations

Build the site in CI (`mkdocs build`) to produce a deterministic `site/` folder and host it on any static host (S3 + CloudFront, Nginx, GitHub Pages). Pinning MkDocs and theme/plugin versions in the Dockerfile ensures consistent rendering between local development and CI.

## References

- MkDocs quick start & user guide: <https://www.mkdocs.org/>
- Material for MkDocs: <https://squidfunk.github.io/mkdocs-material/>
- MkDocs configuration reference: <https://www.mkdocs.org/user-guide/configuration/>

## Tips

If the containerized preview encounters permission errors, adjust the `user` mapping in `docker-compose.yaml` to match your UID/GID. For predictable rendering in CI, pin the versions of `mkdocs` and the Material theme in the build image.
