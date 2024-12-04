# Use Node.js base image
FROM node:20 AS base

WORKDIR /app

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

ENV NODE_ENV production

# Ensure the node_modules are available before building
COPY --from=deps /app/node_modules /app/node_modules

COPY . .

RUN npm run build

# Serve the static files
FROM base AS runner

ENV NODE_ENV production

# Install serve to serve static files
RUN npm install -g serve

COPY --from=builder /app/dist /app/dist

USER node

EXPOSE 3001
CMD ["serve", "-s", "dist"]
