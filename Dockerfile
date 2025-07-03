# Dependencies stage - minimal production deps
FROM node:18-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package.json package-lock.json* ./

# Install production dependencies only
RUN npm ci --only=production --no-audit --no-fund \
    && npm cache clean --force \
    && rm -rf ~/.npm /tmp/*

# Builder stage - for building the app
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json* ./

# Install all dependencies for build
RUN npm ci --no-audit --no-fund

# Copy source code and build files
COPY . .
COPY .env.production .env.production

# Build the application
RUN npm run build \
    && npm prune --production \
    && npm cache clean --force \
    && rm -rf ~/.npm /tmp/* /var/cache/apk/*

# Production runner stage - ultra minimal
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install dumb-init for proper signal handling (tiny overhead)
RUN apk add --no-cache dumb-init \
    && rm -rf /var/cache/apk/*

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy only essential files from builder
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/.env.production ./.env.production

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]