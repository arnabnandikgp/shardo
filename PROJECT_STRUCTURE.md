# Recommended Professional Project Structure

This document outlines a professional and scalable project structure for your application, incorporating a main backend, a client, and two Multi-Party Computation (MPC) servers for implementing a Threshold Signature Scheme (TSS).

## High-Level Architecture

The architecture consists of four main, independently-run services:
1.  **`server`**: The main Node.js backend handling user authentication, business logic, and orchestrating the signing process with the MPC servers.
2.  **`client`**: The frontend application for user interaction.
3.  **`mpc-server-1`**: The first MPC server, which holds one share of the user's private key.
4.  **`mpc-server-2`**: The second MPC server, holding the other key share.

## Proposed Directory Structure
```
bonkbot_clone/
├── .git/
├── server/                     # Main backend (Node.js/Express)
│   ├── src/
│   │   ├── config/             # Environment, database config
│   │   ├── controllers/        # Route controllers (auth, user, etc.)
│   │   ├── middleware/         # Express middleware
│   │   ├── models/             # Database models (User, etc.)
│   │   ├── routes/             # API routes
│   │   ├── services/           # Business logic
│   │   │   ├── authService.js
│   │   │   └── mpcService.js     #<-- Service to communicate with MPC servers
│   │   └── app.js              # Express app setup
│   ├── .env.example
│   └── package.json
│
├── mpc-server-1/               # First MPC server (Node.js)
│   ├── bin/
│   │   └── tss-cli             #<-- Compiled Rust TSS binary goes here
│   ├── src/
│   │   ├── index.js            # Express server entry point
│   │   ├── controller.js       # Handles MPC API requests
│   │   ├── service.js          # Wrapper around the Rust `tss-cli`
│   │   └── routes.js           # API routes (e.g., /generate-key, /sign)
│   ├── .env
│   └── package.json
│
├── mpc-server-2/               # Second MPC server (identical structure to the first)
│   ├── bin/
│   │   └── tss-cli
│   ├── src/
│   │   ├── index.js
│   │   ├── controller.js
│   │   ├── service.js
│   │   └── routes.js
│   ├── .env
│   └── package.json
│
├── client/                     # Frontend (React/Vite)
│   ├── ... (standard React structure) ...
│
├── scripts/                    # Build/deployment scripts
│   ├── build.sh
│   └── deploy.sh
│
├── .gitignore
├── package.json                # Root package.json for managing workspaces (e.g., with Lerna or Yarn)
└── README.md
```

## Key Architectural Concepts

### 1. **Main Backend (`server`)**
-   **Role**: Acts as the orchestrator. It handles all user-facing interactions, such as signup and login.
-   **`mpcService.js`**: This new service will be responsible for making HTTP requests to both `mpc-server-1` and `mpc-server-2`. For key generation, it will call the `/generate-key` endpoint on both MPC servers. For signing, it will call the `/sign` endpoint.
-   **Security**: It does **not** store any part of the private key. It only stores the final combined public key associated with a user.

### 2. **MPC Servers (`mpc-server-1`, `mpc-server-2`)**
-   **Role**: These are simple, specialized Node.js/Express servers with a primary job: execute the Rust TSS CLI and manage key shares.
-   **`tss-cli`**: The compiled binary from your Rust TSS implementation. The `service.js` in each MPC server will execute this binary using Node.js's `child_process.spawn`.
-   **Communication**: The two MPC servers will need to communicate directly with each other during the TSS protocol (both for key generation and signing). The Rust CLI should handle this peer-to-peer communication. You will need to configure the network addresses (e.g., `http://mpc-server-1:4001`) in their respective `.env` files.
-   **State**: Each MPC server stores its own secret key share for each user, likely in a local file or a secure database, identified by a `userId`.

### 3. **Service Communication**
-   The `server` communicates with the `mpc-server-*` instances via a REST API.
-   **Security**: Instead of passing the user's JWT to the MPC servers, it's more secure for your `server` to use a pre-shared secret (API Key) to authenticate itself with the MPC servers. This prevents the MPC servers from needing to know about user sessions.

## Workflow Integration (as per your diagram)

1.  **Signup**:
    -   User signs up on the `client`.
    -   Request hits the `server`.
    -   The `server` calls the `mpcService.js`.
    -   `mpcService.js` makes API calls to `/generate-key` on both `mpc-server-1` and `mpc-server-2`, passing a unique `userId`.
    -   Each MPC server generates its key share and stores it. The combined public key is returned to the `server`, which then stores it in the user's database record.

2.  **Signing**:
    -   User creates a transaction on the `client`.
    -   The `client` sends the unsigned transaction to the `server`.
    -   The `server` authenticates the user and then calls `mpcService.js`.
    -   `mpcService.js` sends sign requests (with the `userId` and transaction data) to both MPC servers.
    -   The MPC servers use the Rust CLI to perform the distributed signing protocol.
    -   The final signature is returned to the `server`, which can then broadcast the transaction to the Solana network.

This structure provides a clear separation of concerns, enhances security by isolating key shares, and is scalable for future development.

## Key Improvements

### 1. **Backend Organization**
- **Separation of Concerns**: Controllers, services, models, middleware
- **Modular Structure**: Each feature has its own directory
- **Configuration Management**: Centralized config files
- **Error Handling**: Dedicated error handling middleware

### 2. **Frontend Organization**
- **Feature-based Components**: Group components by feature
- **Common Components**: Reusable UI components
- **Service Layer**: API calls and business logic
- **Custom Hooks**: Reusable logic

### 3. **Development Experience**
- **Root Configuration**: ESLint, Prettier at root level
- **Workspace Setup**: Root package.json for managing multiple packages
- **Documentation**: Dedicated docs folder
- **Testing**: Proper test structure

### 4. **Production Ready**
- **Docker Support**: Containerization setup
- **CI/CD**: GitHub workflows
- **Environment Management**: Proper .env handling
- **Scripts**: Build and deployment automation

## Migration Steps

1. **Create new directory structure**
2. **Move and refactor backend code**
3. **Reorganize frontend components**
4. **Set up root workspace configuration**
5. **Add proper documentation**
6. **Implement testing structure**
7. **Add Docker support**

## Benefits

- **Scalability**: Easy to add new features
- **Maintainability**: Clear separation of concerns
- **Team Collaboration**: Logical file organization
- **Testing**: Proper test structure
- **Deployment**: Production-ready setup
- **Documentation**: Clear project structure 