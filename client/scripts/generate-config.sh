#!/bin/sh

# Generate runtime config from environment variables
# This script runs at container startup, before serving the app

CONFIG_FILE="/app/dist/config.js"

echo "Generating runtime config..."
echo "EXPO_PUBLIC_API_URL: ${EXPO_PUBLIC_API_URL:-http://127.0.0.1:8000/}"

cat > "$CONFIG_FILE" << EOF
// Runtime configuration - generated at container startup
window.__RUNTIME_CONFIG__ = {
  EXPO_PUBLIC_API_URL: "${EXPO_PUBLIC_API_URL:-http://127.0.0.1:8000/}"
};
EOF

echo "Runtime config generated at $CONFIG_FILE"
