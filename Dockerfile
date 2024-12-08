# Use Node.js base image
FROM node:18 AS base

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
