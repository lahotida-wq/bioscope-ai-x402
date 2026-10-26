FROM node:20-alpine AS builder

WORKDIR /app

# Copy root workspace and server manifests
COPY package.json package-lock.json ./
COPY server/package.json ./server/

# Install dependencies
RUN npm ci --workspace=server

# Copy server code
COPY server/ ./server/

# Build TypeScript server
RUN npm run build --workspace=server

# Production image
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY server/package.json ./server/

# Install production dependencies only
RUN npm ci --workspace=server --omit=dev

# Copy compiled JavaScript from builder
COPY --from=builder /app/server/dist ./server/dist

EXPOSE 4000

CMD ["node", "server/dist/index.js"]
