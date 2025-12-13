docker compose up --build docs

# MkDocs & Material for MkDocs (documentation)

Overview
--------

The documentation site is built with MkDocs (<https://www.mkdocs.org/>) using the Material for MkDocs theme (<https://squidfunk.github.io/mkdocs-material/>). This combination provides:

- Markdown-first authoring and a static site generator.
- A modern, responsive theme with built-in search, icons, and many UX enhancements.
- A containerized dev experience for local editing and preview.

Why this stack? (references)
--------------------------------

- MkDocs is optimized for technical docs: a single YAML config, fast dev server with live reload, and predictable static output.
- Material for MkDocs adds production-grade features (search, code annotations, content tabs, extensive plugin support). See the project's site: <https://squidfunk.github.io/mkdocs-material/>.

How the repo uses MkDocs
docker compose up --build docs

# MkDocs & Material for MkDocs (documentation)

## Overview

The documentation site is built with MkDocs (<https://www.mkdocs.org/>) using the Material for MkDocs theme (<https://squidfunk.github.io/mkdocs-material/>). This combination provides:

- Markdown-first authoring and a static site generator.
- A modern, responsive theme with built-in search, icons, and many UX enhancements.
- A containerized dev experience for local editing and preview.

## Why this stack? (references)

- MkDocs is optimized for technical docs: a single YAML config, fast dev server with live reload, and predictable static output.
- Material for MkDocs adds production-grade features (search, code annotations, content tabs, extensive plugin support). See the project's site: <https://squidfunk.github.io/mkdocs-material/>.

## How the repo uses MkDocs

- Dockerfile: `config/mkdocs/Dockerfile` builds an image with MkDocs and the Material theme. The container runs `mkdocs serve` for live previews on port `8000`.
- Config: `config/mkdocs/mkdocs.yml` controls site metadata, navigation and theme options.
- Content: placed under the `docs/` folder in this repository; assets in `assets/`.

## Local development

Start the docs server (containerized):

```bash
docker compose up --build docs
```

Or build static site locally and serve with any static host:

```bash
# build static site
mkdocs build -f config/mkdocs/mkdocs.yml
# serve the site (simple)
python -m http.server --directory site 8085
```

## Authoring & features

- Live preview: MkDocs dev server watches changes and reloads browser.
- Search: Material provides client-side search; configure search boosting in `mkdocs.yml`.
- Code annotations & tabs: enable annotated code blocks and content tabs for examples and multi-language snippets.
- Mermaid diagrams: supported via Markdown extensions — useful for architecture diagrams included in these docs.

## Production considerations

- Use `mkdocs build` in CI to produce the static `site/` folder, then serve via Nginx or any static hosting (GitHub Pages, S3 + CloudFront).
- Make sure the Docker image used for docs includes the exact theme/plugin versions to avoid visual drift between local and CI builds.

## References

- MkDocs quick start & user guide: <https://www.mkdocs.org/>
- Material for MkDocs: <https://squidfunk.github.io/mkdocs-material/>
- MkDocs configuration reference: <https://www.mkdocs.org/user-guide/configuration/>

## Tips

- If your local `docker compose up docs` fails with permission issues, ensure the `user` mapping in `docker-compose.yaml` matches your UID/GID.
- For reproducible builds in CI, pin versions of `mkdocs` and `mkdocs-material` in your Dockerfile.
