#!/bin/sh

set -e

INTERNAL_PORT=8081

echo "Starting application on port ${PORT}..."

# Substitute PORT in nginx config
envsubst '${PORT}' < /app/nginx.conf.template > /etc/nginx/nginx.conf
echo "Nginx config generated for port ${PORT}"

# Start Spring Boot in background on internal port
echo "Starting Spring Boot on internal port ${INTERNAL_PORT}..."
java -jar /app/app.jar --server.port=${INTERNAL_PORT} &

# Start Nginx on external port
echo "Starting Nginx on external port ${PORT}..."
exec nginx -g 'daemon off;'