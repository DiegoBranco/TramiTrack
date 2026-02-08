# Stage 1: Build & Development
FROM node:lts-alpine as build-stage
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install
COPY . .
# For development, we just keep the files here.
# For production, we would run 'npm run build'

# Stage 2: Production (NGINX)
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]