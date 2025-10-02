# Use an official Node.js runtime as a parent image
FROM node:18

# Install wget for healthcheck and other dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    libusb-dev \
    wget \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Rust 1.65 (compatible with old solana-sdk)
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain 1.65.0
ENV PATH="/root/.cargo/bin:${PATH}"

# Install solana-tss CLI with locked dependencies
RUN cargo install --git https://github.com/ZenGo-X/solana-tss.git --locked

# Set the working directory in the container
WORKDIR /usr/src/app

# Install node-gyp-build
RUN npm install -g node-gyp-build

# Copy package files for better caching
COPY mpc-server-1/package*.json ./

# Install app dependencies
RUN npm install

# Copy the mpc-server-1 source code
COPY mpc-server-1/ ./

# The utilities folder will be mounted as a volume at runtime
# So we create a placeholder directory
RUN mkdir -p /usr/src/utilities

# Expose the port
EXPOSE 4000

# Define the command to run your app
CMD [ "node", "index.js" ]