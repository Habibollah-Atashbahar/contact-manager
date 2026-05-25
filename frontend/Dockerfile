# # Build stage
# FROM node:18-alpine as builder

# WORKDIR /app

# COPY package*.json ./
# RUN npm ci

# COPY . .
# RUN npm run build

# # Runtime stage
# FROM node:18-alpine

# WORKDIR /app

# ENV NODE_ENV=production
# ENV NEXT_PUBLIC_API_URL=http://api:3000/api

# COPY --from=builder /app/public ./public
# COPY --from=builder /app/.next/standalone ./
# COPY --from=builder /app/.next/static ./.next/static

# EXPOSE 3001

# CMD ["node", "server.js"]

# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app

# نصب وابستگی‌ها
COPY package*.json ./
RUN npm ci

COPY . .

# مقدار متغیر را اینجا می‌گیریم تا در کدهای کلاینت جایگذاری شود
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

# Stage 2: Runtime
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# پورت پیش‌فرض برای اجرای سرور نکست
ENV PORT=3001

# کپی فایل‌های مورد نیاز از مرحله قبل
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3001

# اجرای سرور
CMD ["node", "server.js"]