import { exec } from 'child_process';
import { promisify } from 'util';
import {
  GenerateSharesResult,
  AggregateKeysResult,
  AirdropResult,
  AggSendStepOneResult,
  RecentBlockHashResult,
  AggSendStepTwoResult,
  AggregateSignaturesAndBroadcastResult
} from '../types/cli';

const execAsync = promisify(exec);
const CLI = 'solana-tss';

export async function generateShares(): Promise<GenerateSharesResult> {
  const { stdout } = await execAsync(`${CLI} generate`);
  // Expecting: secret share: ...\npublic share: ...
  const secretMatch = stdout.match(/secret share: (.+)/);
  const publicMatch = stdout.match(/public share: (.+)/);
  if (!secretMatch || !publicMatch) throw new Error('Failed to parse generateShares output');
  return {
    secretShare: secretMatch[1].trim(),
    publicShare: publicMatch[1].trim(),
  };
}

export async function aggregateKeys(pubkey1: string, pubkey2: string): Promise<AggregateKeysResult> {
  const { stdout } = await execAsync(`${CLI} aggregate-keys ${pubkey1} ${pubkey2}`);
  // Output is a single public key (may need to parse if extra text)
  const key = stdout.trim().split(/\s+/).pop();
  if (!key) throw new Error('Failed to parse aggregateKeys output');
  return { aggregatedPublicKey: key };
}

export async function airdrop(to: string, amount: number, net: string = 'devnet'): Promise<AirdropResult> {
  const { stdout, stderr } = await execAsync(`${CLI} airdrop --net ${net} --to ${to} --amount ${amount}`);
  return {
    success: !stderr,
    output: stdout.trim() || stderr.trim(),
  };
}

export async function aggSendStepOne(secretKey: string): Promise<AggSendStepOneResult> {
  const { stdout } = await execAsync(`${CLI} agg-send-step-one ${secretKey}`);
  // Message 1: ...\nSecret state: ...
  const msgMatch = stdout.match(/Message 1: (.+) \(send to all other parties\)/);
  const stateMatch = stdout.match(/Secret state: (.+) \(keep this a secret/);
  if (!msgMatch || !stateMatch) throw new Error('Failed to parse aggSendStepOne output');
  return {
    message_1: msgMatch[1].trim(),
    secret_state: stateMatch[1].trim(),
  };
}

export async function recentBlockHash(net: string = 'devnet'): Promise<RecentBlockHashResult> {
  const { stdout } = await execAsync(`${CLI} recent-block-hash --net ${net}`);
  // Output: Recent block hash: ...
  const hash = stdout.trim().split(/\s+/).pop();
  if (!hash) throw new Error('Failed to parse recentBlockHash output');
  return { blockHash: hash };
}

export async function aggSendStepTwo({
  keypair,
  to,
  amount,
  keys,
  recentBlockHash,
  firstMessages,
  secretState
}: {
  keypair: string;
  to: string;
  amount: number;
  keys: [string, string];
  recentBlockHash: string;
  firstMessages: string;
  secretState: string;
}): Promise<AggSendStepTwoResult> {
  const cmd = `${CLI} agg-send-step-two --keypair ${keypair} --to ${to} --amount ${amount} --keys ${keys[0]} --keys ${keys[1]} --recent-block-hash ${recentBlockHash} --first-messages ${firstMessages} --secret-state ${secretState}`;
  const { stdout } = await execAsync(cmd);
  // Output: Partial signature: ...
  const sigMatch = stdout.match(/Partial signature: (.+)/);
  if (!sigMatch) throw new Error('Failed to parse aggSendStepTwo output');
  return { partialSignature: sigMatch[1].trim() };
}

export async function aggregateSignaturesAndBroadcast({
  to,
  amount,
  keys,
  recentBlockHash,
  signatures,
  net = 'devnet',
}: {
  to: string;
  amount: number;
  keys: [string, string];
  recentBlockHash: string;
  signatures: [string, string];
  net?: string;
}): Promise<AggregateSignaturesAndBroadcastResult> {
  const cmd = `${CLI} aggregate-signatures-and-broadcast --net ${net} --to ${to} --amount ${amount} --keys ${keys[0]} --keys ${keys[1]} --recent-block-hash ${recentBlockHash} --signatures ${signatures[0]} --signatures ${signatures[1]}`;
  const { stdout } = await execAsync(cmd);
  return { output: stdout.trim() };
}
