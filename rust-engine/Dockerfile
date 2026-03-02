# ── Build stage ───────────────────────────────────────────
FROM rust:1.82-slim AS builder

RUN apt-get update && apt-get install -y pkg-config libssl-dev && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY Cargo.toml Cargo.lock* ./
# Create dummy main to cache dependencies
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release 2>/dev/null || true

# Copy real source and rebuild
COPY src/ src/
COPY migrations/ migrations/
RUN touch src/main.rs && cargo build --release

# ── Runtime stage ────────────────────────────────────────
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y ca-certificates libssl3 && rm -rf /var/lib/apt/lists/*

RUN groupadd -r ucengine && useradd -r -g ucengine ucengine
WORKDIR /app

COPY --from=builder /app/target/release/uc-engine .
COPY migrations/ migrations/

RUN mkdir -p keys && chown -R ucengine:ucengine /app
USER ucengine

ENV HOST=0.0.0.0
ENV PORT=8080
ENV RUST_LOG=uc_engine=info

EXPOSE 8080
CMD ["./uc-engine"]
