FROM python:3.11-alpine

# Install dependencies
RUN pip install --no-cache-dir mkdocs-material

# Set working directory
WORKDIR /docs

# Copy MkDocs configuration file
COPY config/mkdocs /config

# Copy assets
COPY /assets /docs/assets

# Copy documentation files
COPY /README.md /docs/README.md
COPY /docs /docs

# Expose port for MkDocs
EXPOSE 8000

# Start MkDocs server with specific command line options for better debugging
# Using the config file from the new location
CMD ["sh", "-c", "mkdocs serve --config-file /config/mkdocs.yml --verbose --dirtyreload -a 0.0.0.0:8000"]
