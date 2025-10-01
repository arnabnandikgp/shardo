# Shardo - Solana Transaction Manager

A full-stack web application for managing Solana transactions with secure authentication and distributed private key management using Threshold Signature Scheme (TSS).

## Features

- 🔐 Secure authentication with JWT
- 💰 Send SOL transactions on Solana devnet
- 🛡️ Distributed private key management (no single point of compromise)
- 🔗 Threshold Signature Scheme (TSS) integration
- 🎨 Modern React UI with Tailwind CSS

## Quick Start (Local Development)

⚠️ **Note**: Docker Compose is currently experiencing issues. Please use local development setup instead.

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd shardo
   ```

2. **Install dependencies for all services:**
   ```bash
   # Install dependencies for each service
   cd server && npm install && cd ..
   cd mpc-server-1 && npm install && cd ..
   cd mpc-server-2 && npm install && cd ..
   cd client && npm install && cd ..
   ```

3. **Start MongoDB locally:**
   ```bash
   # Make sure MongoDB is running on your system
   # Default connection: mongodb://localhost:27017
   ```

4. **Start all services in separate terminals:**
   
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

5. **Access the application:**
   - Frontend: http://localhost:5173
   - Main Server: http://localhost:3000
   - MPC Server 1: http://localhost:4000
   - MPC Server 2: http://localhost:6000

## Alternative: Docker Setup (Currently Having Issues)

If you prefer to use Docker (when issues are resolved), see [DOCKER_SETUP.md](./DOCKER_SETUP.md) for instructions.

## Usage

1. Register a new account at `/signup`
2. Sign in with your credentials at `/signin`
3. Access the dashboard at `/dashboard`
4. Enter recipient address and amount to send SOL
5. Confirm and sign the transaction using distributed MPC

## Project Structure

```
shardo/
├── client/          # React frontend
├── server/          # Main backend API
├── mpc-server-1/    # First MPC server
├── mpc-server-2/    # Second MPC server
├── utilities/       # TSS utilities and types
└── docker-compose.yml
```

## Environment Variables

For local development, you may need to set these environment variables (or they will use defaults):

### Main Server (./server)
- `PORT`: 3000 (default)
- `MPC_SERVER_1_URL`: http://localhost:4000
- `MPC_SERVER_2_URL`: http://localhost:6000
- `MONGODB_URI`: mongodb://localhost:27017/cloudapp
- `JWT_SECRET`: "123456"

### MPC Server 1 (./mpc-server-1)
- `PORT`: 4000 (default)
- `MONGODB_URI`: mongodb://localhost:27017/mpc1
- `JWT_SECRET`: "123456"

### MPC Server 2 (./mpc-server-2)
- `PORT`: 6000 (default)
- `MONGODB_URI`: mongodb://localhost:27017/mpc3
- `JWT_SECRET`: "123456"

## API Endpoints

- `POST /api/v1/signup` - Register new user
- `POST /api/v1/signin` - User login
- `POST /api/v1/txn/sign` - Sign and send transaction (TSS-based)