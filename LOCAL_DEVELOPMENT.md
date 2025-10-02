# Local Development Guide

This guide explains how to run the Shardo project locally without Docker. This is the recommended approach while Docker Compose issues are being resolved.

## Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- MongoDB (running locally on port 27017)

## Architecture

The project consists of 4 main components:

1. **Main Server** (./server) - Main backend API (port 3000)
2. **MPC Server 1** (./mpc-server-1) - First MPC server (port 4000)
3. **MPC Server 2** (./mpc-server-2) - Second MPC server (port 6000)
4. **Client** (./client) - React frontend (port 5173)

## Quick Start

### 1. Install Dependencies

Install dependencies for all services:

```bash
# From the project root
cd server && npm install && cd ..
cd mpc-server-1 && npm install && cd ..
cd mpc-server-2 && npm install && cd ..
cd client && npm install && cd ..
```

### 2. Start MongoDB

Make sure MongoDB is running locally:

```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Ubuntu/Debian
sudo systemctl start mongod

# On Windows
net start MongoDB

# Or run MongoDB directly
mongod
```

### 3. Start All Services

Open 4 separate terminal windows/tabs and run each service:

**Terminal 1 - Main Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - MPC Server 1:**
```bash
cd mpc-server-1
npm run dev
```

**Terminal 3 - MPC Server 2:**
```bash
cd mpc-server-2
npm run dev
```

**Terminal 4 - Client:**
```bash
cd client
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Main Server API**: http://localhost:3000
- **MPC Server 1**: http://localhost:4000
- **MPC Server 2**: http://localhost:6000

## Environment Variables

Each service uses default environment variables, but you can override them if needed:

### Main Server (./server)
```bash
PORT=3000
MPC_SERVER_1_URL=http://localhost:4000
MPC_SERVER_2_URL=http://localhost:6000
MONGODB_URI=mongodb://localhost:27017/cloudapp
JWT_SECRET=123456
```

### MPC Server 1 (./mpc-server-1)
```bash
PORT=4000
MONGODB_URI=mongodb://localhost:27017/mpc1
JWT_SECRET=123456
```

### MPC Server 2 (./mpc-server-2)
```bash
PORT=6000
MONGODB_URI=mongodb://localhost:27017/mpc2
JWT_SECRET=123456
```

## Database Setup

The application will automatically create the following databases in your local MongoDB:

- `cloudapp` - Used by the main server
- `mpc1` - Used by MPC Server 1
- `mpc2` - Used by MPC Server 2

No manual database setup is required - the services will create collections as needed.

## Development Scripts

Each service has the following npm scripts:

### Main Server (./server)
- `npm run dev` - Start with hot reload (using bun)
- `npm start` - Start production server

### MPC Servers (./mpc-server-1, ./mpc-server-2)
- `npm run dev` - Start with hot reload (using nodemon)

### Client (./client)
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Troubleshooting

### Port Already in Use
If you get "port already in use" errors:

```bash
# Find processes using specific ports
lsof -i :3000  # Main server
lsof -i :4000  # MPC Server 1
lsof -i :6000  # MPC Server 2
lsof -i :5173  # Client

# Kill processes if needed
kill -9 <PID>
```

### MongoDB Connection Issues
1. Ensure MongoDB is running: `brew services list | grep mongo` (macOS)
2. Check MongoDB logs for errors
3. Verify connection string format
4. Try connecting with MongoDB Compass: `mongodb://localhost:27017`

### Service Communication Issues
1. Verify all services are running on correct ports
2. Check that MPC server URLs in main server match actual ports
3. Ensure no firewall blocking localhost connections
4. Check browser console for CORS errors

### Hot Reload Not Working
1. Ensure you're using `npm run dev` (not `npm start`)
2. Check that file watchers are working (nodemon/bun watch)
3. Restart the service if changes aren't detected

## Health Checks

You can verify services are running by checking these endpoints:

- Main Server: http://localhost:3000/health
- MPC Server 1: http://localhost:4000/health
- MPC Server 2: http://localhost:6000/health

## Development Tips

1. **Hot Reload**: All services support hot reload - changes will automatically restart the server
2. **Logs**: Check terminal output for each service to see logs and errors
3. **Database**: Use MongoDB Compass to inspect databases and collections
4. **API Testing**: Use tools like Postman or curl to test API endpoints
5. **Frontend**: The React app supports hot module replacement for instant updates

## Production Build

To build the client for production:

```bash
cd client
npm run build
```

The built files will be in `client/dist/` and can be served by any static file server.

## Stopping Services

To stop all services:
1. Press `Ctrl+C` in each terminal window
2. Or close the terminal windows

To stop MongoDB:
```bash
# On macOS with Homebrew
brew services stop mongodb-community

# On Ubuntu/Debian
sudo systemctl stop mongod

# On Windows
net stop MongoDB
```

## Next Steps

Once all services are running:
1. Open http://localhost:5173 in your browser
2. Register a new account
3. Sign in and access the dashboard
4. Try sending a SOL transaction

For more information about the application features, see the main [README.md](./README.md).
