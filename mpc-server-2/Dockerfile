# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    libusb-dev


RUN npm install node-gyp-build
# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Your app binds to port 3000, 4000, or 6000
# Replace 3000 with the correct port for each specific server
EXPOSE 6000 

# Define the command to run your app
CMD [ "npm", "run", "dev" ]