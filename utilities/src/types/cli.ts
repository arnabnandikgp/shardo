/**
 * TypeScript interfaces for Rust CLI commands and responses
 */

// Base CLI command interface
export interface CLICommand {
  command: string;
  args: string[];
  options?: Record<string, string | boolean>;
}

// CLI execution result
export interface CLIResult {
  success: boolean;
  stdout: string;
  stderr: string;
  exitCode: number;
  error?: Error;
}

// TSS-specific command types
export interface GenerateKeyCommand extends CLICommand {
  command: 'generate-key';
  args: [string]; // userId
  options?: {
    output?: string; // output file path
    format?: 'json' | 'hex' | 'base64';
  };
}

export interface SignCommand extends CLICommand {
  command: 'sign';
  args: [string, string]; // [userId, transactionData]
  options?: {
    output?: string;
    format?: 'json' | 'hex' | 'base64';
  };
}

export interface VerifyCommand extends CLICommand {
  command: 'verify';
  args: [string, string, string]; // [publicKey, signature, message]
  options?: {
    format?: 'json' | 'hex' | 'base64';
  };
}

export interface KeyShareCommand extends CLICommand {
  command: 'key-share';
  args: [string]; // userId
  options?: {
    output?: string;
    format?: 'json' | 'hex' | 'base64';
  };
}

// Response types for different commands
export interface GenerateKeyResponse {
  publicKey: string;
  keyId: string;
  timestamp: string;
  success: boolean;
}

export interface SignResponse {
  signature: string;
  publicKey: string;
  keyId: string;
  timestamp: string;
  success: boolean;
}

export interface VerifyResponse {
  isValid: boolean;
  message: string;
  success: boolean;
}

export interface KeyShareResponse {
  keyShare: string;
  keyId: string;
  partyId: string;
  timestamp: string;
  success: boolean;
}

// Error types
export interface CLIError extends Error {
  exitCode: number;
  stderr: string;
  command: string;
}

// Configuration interface
export interface CLIConfig {
  binaryPath: string;
  timeout: number;
  workingDirectory?: string;
  env?: Record<string, string>;
}

// Command builder interface
export interface CommandBuilder {
  generateKey(userId: string, options?: GenerateKeyCommand['options']): GenerateKeyCommand;
  sign(userId: string, transactionData: string, options?: SignCommand['options']): SignCommand;
  verify(publicKey: string, signature: string, message: string, options?: VerifyCommand['options']): VerifyCommand;
  keyShare(userId: string, options?: KeyShareCommand['options']): KeyShareCommand;
}

// Types for solana-tss CLI wrappers

export interface GenerateSharesResult {
  secretShare: string;
  publicShare: string;
}

export interface AggregateKeysResult {
  aggregatedPublicKey: string;
}

export interface AirdropResult {
  success: boolean;
  output: string;
}

export interface AggSendStepOneResult {
  message_1: string;
  secret_state: string;
}

export interface RecentBlockHashResult {
  blockHash: string;
}

export interface AggSendStepTwoResult {
  partialSignature: string;
}

export interface AggregateSignaturesAndBroadcastResult {
  output: string;
} 