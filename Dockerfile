# Stage 1: Build Backend
FROM maven:3.9-eclipse-temurin-21-alpine AS backend-build

WORKDIR /app/backend

COPY backend/pom.xml .
RUN mvn dependency:go-offline -B

COPY backend/src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Build Frontend
FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# Stage 3: Production image with Nginx and Java
FROM eclipse-temurin:21-jre-alpine

RUN apk add --no-cache nginx gettext

WORKDIR /app

COPY --from=backend-build /app/backend/target/*.jar app.jar

COPY --from=frontend-build /app/frontend/dist/frontend/browser /usr/share/nginx/html

COPY render/nginx.conf.template /app/nginx.conf.template

COPY render/start.sh /app/start.sh
RUN chmod +x /app/start.sh

RUN mkdir -p /var/tmp/nginx /var/run/nginx && chmod 755 /etc/nginx

EXPOSE ${PORT}

CMD ["/app/start.sh"]