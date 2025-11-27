#!/bin/sh

# Generate runtime config and start the server
/app/scripts/generate-config.sh

# Start serving the app
exec npm run serve -- --port 3000
