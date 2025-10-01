# Use an official Node.js runtime as a parent image
FROM node:18

# Install wget for healthcheck and other dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    libusb-dev \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /usr/src/app

# Install node-gyp-build
RUN npm install -g node-gyp-build

# Copy package files for better caching
COPY server/package*.json ./

# Install app dependencies
RUN npm install

# Copy the server source code
COPY server/ ./

# The utilities folder will be mounted as a volume at runtime
# So we create a placeholder directory
RUN mkdir -p /usr/src/utilities

# Expose the port
EXPOSE 3000

# Define the command to run your app
CMD [ "npm", "run", "dev" ]