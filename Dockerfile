# Base image
FROM node:18-alpine AS base
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy project files
COPY . .

# Copy production env file
COPY .env.production .env.production

# Build Next.js app with env
RUN npm run build

# Final image
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=base /app/public ./public
COPY --from=base /app/.next ./.next
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/src ./src
COPY --from=base /app/next.config.js ./next.config.js
COPY --from=base /app/.env.production .env.production

EXPOSE 3000
CMD ["npm", "start"]
