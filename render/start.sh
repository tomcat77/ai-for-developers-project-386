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
SPRING_PID=$!

# Wait for Spring Boot to be ready
echo "Waiting for Spring Boot health check..."
for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20; do
    if wget --no-verbose --tries=1 --spider http://localhost:${INTERNAL_PORT}/actuator/health 2>/dev/null; then
        echo "Spring Boot is ready!"
        break
    fi
    if [ $i -eq 20 ]; then
        echo "ERROR: Spring Boot failed to start after 40 seconds"
        kill $SPRING_PID 2>/dev/null || true
        exit 1
    fi
    sleep 2
done

# Start Nginx on external port
echo "Starting Nginx on external port ${PORT}..."
exec nginx -g 'daemon off;'