### STAGE 1: Build ###
FROM node:18 as build
WORKDIR /app
COPY package*.json ./

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    libusb-dev

RUN npm install
COPY . .
RUN npm run build

### STAGE 2: Serve ###
FROM nginx:stable-alpine
# Copy the built static files from the 'build' stage
COPY --from=build /app/dist /usr/share/nginx/html
# Copy the nginx config file
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]