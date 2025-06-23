/**
 * TypeScript interfaces for Rust CLI commands and responses
 */
export interface CLICommand {
    command: string;
    args: string[];
    options?: Record<string, string | boolean>;
}
export interface CLIResult {
    success: boolean;
    stdout: string;
    stderr: string;
    exitCode: number;
    error?: Error;
}
export interface GenerateKeyCommand extends CLICommand {
    command: 'generate-key';
    args: [string];
    options?: {
        output?: string;
        format?: 'json' | 'hex' | 'base64';
    };
}
export interface SignCommand extends CLICommand {
    command: 'sign';
    args: [string, string];
    options?: {
        output?: string;
        format?: 'json' | 'hex' | 'base64';
    };
}
export interface VerifyCommand extends CLICommand {
    command: 'verify';
    args: [string, string, string];
    options?: {
        format?: 'json' | 'hex' | 'base64';
    };
}
export interface KeyShareCommand extends CLICommand {
    command: 'key-share';
    args: [string];
    options?: {
        output?: string;
        format?: 'json' | 'hex' | 'base64';
    };
}
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
export interface CLIError extends Error {
    exitCode: number;
    stderr: string;
    command: string;
}
export interface CLIConfig {
    binaryPath: string;
    timeout: number;
    workingDirectory?: string;
    env?: Record<string, string>;
}
export interface CommandBuilder {
    generateKey(userId: string, options?: GenerateKeyCommand['options']): GenerateKeyCommand;
    sign(userId: string, transactionData: string, options?: SignCommand['options']): SignCommand;
    verify(publicKey: string, signature: string, message: string, options?: VerifyCommand['options']): VerifyCommand;
    keyShare(userId: string, options?: KeyShareCommand['options']): KeyShareCommand;
}
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
//# sourceMappingURL=cli.d.ts.map