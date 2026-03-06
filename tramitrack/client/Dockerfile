# Stage 1: Build & Development
# Stage 1: Build & Development
FROM node:lts-alpine as build-stage

# Instalar wget para health checks
RUN apk add --no-cache wget

WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install
COPY . .

# El comando por defecto para desarrollo
CMD ["pnpm", "dev", "--host", "0.0.0.0", "--port", "3000"]
# For development, we just keep the files here.
# For production, we would run 'npm run build'

# Stage 2: Production (NGINX)
#FROM nginx:stable-alpine as production-stage
#COPY --from=build-stage /app/dist /usr/share/nginx/html
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]