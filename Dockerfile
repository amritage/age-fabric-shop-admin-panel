# Use official Node.js image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy all files (including .env if needed)
COPY . .

# Copy .env if present
COPY .env .env

# Build the Next.js app
RUN npm run build

# Production image, copy only necessary files
FROM node:18-alpine AS runner
WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/.env ./.env

EXPOSE 3000

CMD ["npm", "start"]