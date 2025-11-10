# Multi-stage Dockerfile for Next.js + custom server (server.js) + Socket.IO
# 1) Build stage
FROM node:18-alpine AS builder

# Install dependencies required for some native packages (e.g., sharp)
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package manifests first for better layer caching
COPY package.json package-lock.json* ./

# Install dependencies (production + dev for build)
RUN npm ci

# Copy the rest of the source
COPY . .

# Build Next.js (this creates the .next folder)
RUN npm run build

# 2) Production runtime stage
FROM node:18-alpine AS runner
RUN apk add --no-cache libc6-compat

WORKDIR /app
ENV NODE_ENV=production

# Ensure Next.js uses the standalone output if available
# Copy only necessary build artifacts and minimal files
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/app ./app

# Expose the port your custom server listens on
EXPOSE 3011

# Default command: start via custom server to include Socket.IO
CMD ["node", "server.js"]
