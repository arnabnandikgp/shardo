# Cloud App - Solana Transaction Manager

A full-stack web application for managing Solana transactions with secure authentication and transaction signing capabilities.

## Features

- 🔐 Secure Authentication System
  - User registration with username/password
  - JWT-based authentication
  - Protected routes
  - Secure session management

- 💰 Solana Transaction Management
  - Send SOL to any Solana address
  - Real-time transaction status
  - Transaction signing with user's private key
  - Devnet integration for testing

- 🛡️ Security Features
  - Password validation with strong requirements
  - JWT token-based authentication
  - Secure storage of private keys
  - Protected API endpoints

- 🎨 Modern UI/UX
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

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or connection string)
- npm or yarn package manager
- Solana CLI tools (optional, for advanced usage)

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
5. Confirm and sign the transaction

## API Endpoints

### Authentication
- `POST /api/v1/signup` - Register new user
- `POST /api/v1/signin` - User login

### Transactions
- `POST /api/v1/txn/sign` - Sign and send transaction

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
└── README.md
```