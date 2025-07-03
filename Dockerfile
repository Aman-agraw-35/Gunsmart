# Base image
FROM node:18-alpine AS base
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

# Copy project files
COPY . .

# Copy production env file
COPY .env.production .env.production

# Install dev dependencies for build
RUN npm ci

# Build Next.js app
RUN npm run build

# Final image
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=base /app/public ./public
COPY --from=base /app/.next ./.next
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/.env.production ./.env.production

# Only copy src if you're using custom server or API routes outside pages/app
# COPY --from=base /app/src ./src

# Only copy next.config.js if it exists
COPY --from=base /app/next.config.js* ./

# Set permissions
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["npm", "start"]