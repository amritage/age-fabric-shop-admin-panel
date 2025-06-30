# Install dependencies only when needed
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

COPY . .

RUN npm run build

# Production image, copy only necessary files
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Only copy .env if you actually need it in the container
# COPY --from=builder /app/.env ./.env

EXPOSE 3000

CMD ["npm", "start"]