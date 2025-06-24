# Cloud App - Solana Transaction Manager

A full-stack web application for managing Solana transactions with secure authentication and advanced private key management using Threshold Signature Scheme (TSS).

## Key Features

- 🔐 **Secure Authentication System**
  - User registration with username/password
  - JWT-based authentication
  - Protected routes
  - Secure session management

- 💰 **Solana Transaction Management**
  - Send SOL to any Solana address
  - Real-time transaction status
  - Transaction signing with TSS (Threshold Signature Scheme)
  - Devnet integration for testing

- 🛡️ **Security Features**
  - Password validation with strong requirements
  - JWT token-based authentication
  - Secure, distributed private key management (no single point of compromise)
  - Protected API endpoints

- 🔗 **Threshold Signature Scheme (TSS) Integration**
  - Utilizes an open-source Rust implementation of TSS for Solana (via the `solana-tss` CLI)
  - Private keys are never fully reconstructed or stored in one place
  - All signing operations are performed using MPC (Multi-Party Computation) flows
  - Node.js utilities wrap the Rust CLI for seamless integration
  - Enables secure, non-custodial, and collaborative signing for transactions

- 🎨 **Modern UI/UX**
  - Clean and responsive design
  - Loading states and error handling
  - Intuitive transaction flow
  - User-friendly forms

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Tailwind CSS for styling
- Axios for API requests
- @solana/web3.js for Solana integration

### Backend
- Node.js with Express
- MongoDB for data storage
- JWT for authentication
- @solana/web3.js for blockchain interaction
- Zod for request validation
- **TSS/MPC via Rust CLI** (see below)

### Utilities (Private Key Management & TSS)
- TypeScript wrappers for the `solana-tss` Rust CLI
- Provides async functions for:
  - Key share generation
  - Key aggregation
  - Distributed signing (agg-send-step-one, agg-send-step-two)
  - Signature aggregation and transaction broadcasting
- CLI binary must be available in your PATH or configured via environment variable

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or connection string)
- npm or yarn package manager
- **Rust toolchain** (for building the TSS CLI)
- **Solana TSS CLI** (`solana-tss` binary, see below)

## Setting Up the Solana TSS CLI

1. Clone the open-source Solana TSS implementation:
   ```bash
   git clone <solana-tss-repo-url>
   cd solana-tss
   cargo build --release
   cp target/release/solana-tss /usr/local/bin/
   # Or set the path in your environment
   export SOLANA_TSS_CLI_PATH=/path/to/solana-tss
   ```
2. Ensure the binary is available in your PATH or configure the path in the utilities package.

## Local Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd cloud-app
```

2. Install dependencies for both frontend and backend:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Set up environment variables:

Create a `.env` file in the backend directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/cloudapp
JWT_SECRET=your_jwt_secret
SOLANA_RPC_URL=https://api.devnet.solana.com
```

4. Start MongoDB:
```bash
# If using local MongoDB
mongod
```

5. Start the backend server:
```bash
cd backend
npm run dev
```

6. Start the frontend development server:
```bash
cd client
npm run dev
```

The application should now be running at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Usage

1. Register a new account at `/signup`
2. Sign in with your credentials at `/signin`
3. Access the dashboard at `/dashboard`
4. Enter recipient address and amount to send SOL
5. Confirm and sign the transaction (using TSS/MPC flows)

## API Endpoints

### Authentication
- `POST /api/v1/signup` - Register new user
- `POST /api/v1/signin` - User login

### Transactions
- `POST /api/v1/txn/sign` - Sign and send transaction (TSS-based)

## Development

### Project Structure
```
cloud-app/
├── backend/
│   ├── index.js
│   ├── models.js
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   └── App.jsx
│   └── package.json
├── utilities/
│   ├── src/
│   │   ├── services/
│   │   │   └── tss-service.ts
│   │   └── types/
│   │       └── cli.ts
│   └── package.json
└── README.md
```

## Why TSS/MPC?
- **No single point of compromise:** Private keys are never fully reconstructed or stored in one place.
- **Collaborative signing:** Multiple parties (or services) can participate in transaction signing.
- **Open-source and auditable:** Uses a community-driven Rust implementation for Solana.
- **Ready for advanced custody and compliance scenarios.**

---

For more details on the TSS flows and CLI usage, see the `utilities/src/services/tss-service.ts` and the upstream Solana TSS CLI documentation.