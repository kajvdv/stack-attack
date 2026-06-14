FROM node:26 AS base
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

FROM base AS build
RUN npm run build

# note: never use the :latest tag in a production site
FROM caddy:2.11.4

COPY --from=build /app/dist /srv
COPY Caddyfile /etc/caddy/Caddyfile
