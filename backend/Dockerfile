# Build stage
FROM rust:latest as builder

WORKDIR /app

COPY Cargo.* ./
COPY src ./src
COPY migrations ./migrations

RUN cargo build --release

# Runtime stage
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y \
    libssl3 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/target/release/contact-management .

EXPOSE 3000

ENV SERVER_HOST=0.0.0.0
ENV SERVER_PORT=3000

CMD ["./contact-management"]