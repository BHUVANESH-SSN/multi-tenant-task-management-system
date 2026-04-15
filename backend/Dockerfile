# Build stage
FROM node:18-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY prisma ./prisma
RUN npx prisma generate
COPY . .

# Production stage
FROM node:18-alpine
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.env* ./

EXPOSE 3000

# Run migrations and start
CMD ["sh", "-c", "npx prisma migrate deploy && node src/server.js"]
