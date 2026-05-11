# Stage 1: Build C++ binaries
FROM gcc:13 AS cpp-builder

WORKDIR /build

# Install CMake and build dependencies
RUN apt-get update && apt-get install -y \
    cmake \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy C++ source
COPY cpp /build

# Build C++ binaries
RUN mkdir -p build && cd build && \
    cmake .. && \
    make -j$(nproc)

# Stage 2: Build Node.js backend & frontend
FROM node:18-alpine

WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Copy C++ binaries from builder stage
COPY --from=cpp-builder /build/build/bin /app/cpp/build/bin

# Copy API
COPY api /app/api
WORKDIR /app/api
RUN npm install --production

# Copy frontend
COPY frontend /app/frontend
WORKDIR /app/frontend
RUN npm install && npm run build

# Back to app root
WORKDIR /app

# Expose ports
EXPOSE 3000 3001

# Start both services
CMD ["sh", "-c", "cd /app/api && node server.js & cd /app/frontend && npm start"]
