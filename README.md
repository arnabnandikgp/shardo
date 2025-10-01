# Shardo - Solana Transaction Manager

A full-stack web application for managing Solana transactions with secure authentication and distributed private key management using Threshold Signature Scheme (TSS).

## Features

- 🔐 Secure authentication with JWT
- 💰 Send SOL transactions on Solana devnet
- 🛡️ Distributed private key management (no single point of compromise)
- 🔗 Threshold Signature Scheme (TSS) integration
- 🎨 Modern React UI with Tailwind CSS

## Quick Start with Docker

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd shardo
   ```

2. **Start all services:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - MongoDB: localhost:27017

That's it! The application will automatically:
- Set up MongoDB with authentication
- Build and start the React frontend
- Start the main backend server
- Initialize two MPC servers for distributed signing
- Configure all inter-service communication

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

## Development

To run in development mode without Docker:

1. Install dependencies: `npm install` in each directory
2. Start MongoDB locally
3. Set environment variables (see docker-compose.yml for reference)
4. Run each service: `npm run dev`

## API Endpoints

- `POST /api/v1/signup` - Register new user
- `POST /api/v1/signin` - User login
- `POST /api/v1/txn/sign` - Sign and send transaction (TSS-based)