# Stage 1 — Builder
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

# Stage 2 — Runtime
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

COPY wait-for.sh .
RUN chmod +x wait-for.sh

ENV NODE_ENV=production
EXPOSE 4000

CMD ["sh", "-c", "./wait-for.sh db 5432 && npx prisma migrate deploy && node dist/main"]
