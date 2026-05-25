# # Build stage
# FROM rust:latest as builder

# WORKDIR /app

# COPY Cargo.* ./contact-management
# COPY src ./src
# COPY migrations ./migrations

# RUN cargo build --release

# # Runtime stage
# FROM debian:bookworm-slim

# RUN apt-get update && apt-get install -y \
#     libssl3 \
#     ca-certificates \
#     && rm -rf /var/lib/apt/lists/*

# WORKDIR /app

# COPY --from=builder /app/target/release/contact-management .

# EXPOSE 3000

# ENV SERVER_HOST=0.0.0.0
# ENV SERVER_PORT=3000

# CMD ["./contact-management"]
 
# مرحله اول: ساخت
FROM rust:1.81 AS builder 
WORKDIR /app
# کپی فایل‌های مربوط به پکیج برای کش شدن لایه‌ها
COPY Cargo.toml Cargo.lock ./
# ایجاد یک فایل خالی برای لود شدن وابستگی‌ها (سرعت بیلد رو بالا می‌بره)
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release

# حالا کپی کد اصلی و بیلد واقعی
COPY src ./src
COPY migrations ./migrations
# استفاده از touch برای مطمئن شدن از بیلد مجدد
RUN touch src/main.rs && cargo build --release

# مرحله دوم: اجرا
FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y \
    libssl3 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/

WORKDIR /app
# نام فایل اجرایی باید دقیقاً با name در Cargo.toml یکی باشد
COPY --from=builder /app/target/release/contact-management .
# کپی پوشه میگریشن‌ها اگر در زمان اجرا بهشون نیاز داری
COPY --from=builder /app/migrations ./migrations

EXPOSE 3000
ENV SERVER_HOST=0.0.0.0
ENV SERVER_PORT=3000
# سطح لاگ در پروڈکشن
ENV LOG_LEVEL=warn 

CMD ["./contact-management"]
