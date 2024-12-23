# Use Node.js base image
FROM node:18 AS base

WORKDIR /app

# Define build arguments
ARG REACT_APP_PORT
ARG API_BASE_URL
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_OAUTH_CLIENT_ID
ARG VITE_GOOGLE_AUTHORIZED_REDIRECT_URI
ARG VITE_URL_API
ARG VITE_WEB_URL
ARG TMDB_API_KEY
ARG TMDB_ACCESS_TOKEN
ARG TMDB_URL_API

# Set environment variables
ENV REACT_APP_PORT=$REACT_APP_PORT
ENV API_BASE_URL=$API_BASE_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_OAUTH_CLIENT_ID=$VITE_OAUTH_CLIENT_ID
ENV VITE_GOOGLE_AUTHORIZED_REDIRECT_URI=$VITE_GOOGLE_AUTHORIZED_REDIRECT_URI
ENV VITE_URL_API=$VITE_URL_API
ENV VITE_WEB_URL=$VITE_WEB_URL
ENV TMDB_API_KEY=$TMDB_API_KEY
ENV TMDB_ACCESS_TOKEN=$TMDB_ACCESS_TOKEN
ENV TMDB_URL_API=$TMDB_URL_API

# Install dependencies
FROM base AS deps

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./

RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
    else echo "Lockfile not found." && exit 1; \
    fi

# Build the app
FROM base AS builder

COPY --from=deps /app/node_modules /app/node_modules
COPY . .

RUN npm run build

# Serve the static files
FROM base AS runner

# Ensure node can access dist folder
COPY --from=builder /app/dist /app/dist
RUN chown -R node:node /app/dist

USER node

EXPOSE 3001

# Use npx to run serve without installing it globally
CMD ["npx", "serve", "-s", "dist", "-l", "3001"]
