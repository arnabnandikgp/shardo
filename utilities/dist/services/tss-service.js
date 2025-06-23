"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateShares = generateShares;
exports.aggregateKeys = aggregateKeys;
exports.airdrop = airdrop;
exports.aggSendStepOne = aggSendStepOne;
exports.recentBlockHash = recentBlockHash;
exports.aggSendStepTwo = aggSendStepTwo;
exports.aggregateSignaturesAndBroadcast = aggregateSignaturesAndBroadcast;
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
const CLI = 'solana-tss';
async function generateShares() {
    const { stdout } = await execAsync(`${CLI} generate`);
    // Expecting: secret share: ...\npublic share: ...
    const secretMatch = stdout.match(/secret share: (.+)/);
    const publicMatch = stdout.match(/public share: (.+)/);
    if (!secretMatch || !publicMatch)
        throw new Error('Failed to parse generateShares output');
    return {
        secretShare: secretMatch[1].trim(),
        publicShare: publicMatch[1].trim(),
    };
}
async function aggregateKeys(pubkey1, pubkey2) {
    const { stdout } = await execAsync(`${CLI} aggregate-keys ${pubkey1} ${pubkey2}`);
    // Output is a single public key (may need to parse if extra text)
    const key = stdout.trim().split(/\s+/).pop();
    if (!key)
        throw new Error('Failed to parse aggregateKeys output');
    return { aggregatedPublicKey: key };
}
async function airdrop(to, amount, net = 'devnet') {
    const { stdout, stderr } = await execAsync(`${CLI} airdrop --net ${net} --to ${to} --amount ${amount}`);
    return {
        success: !stderr,
        output: stdout.trim() || stderr.trim(),
    };
}
async function aggSendStepOne(secretKey) {
    const { stdout } = await execAsync(`${CLI} agg-send-step-one ${secretKey}`);
    // Message 1: ...\nSecret state: ...
    const msgMatch = stdout.match(/Message 1: (.+) \(send to all other parties\)/);
    const stateMatch = stdout.match(/Secret state: (.+) \(keep this a secret/);
    if (!msgMatch || !stateMatch)
        throw new Error('Failed to parse aggSendStepOne output');
    return {
        message_1: msgMatch[1].trim(),
        secret_state: stateMatch[1].trim(),
    };
}
async function recentBlockHash(net = 'devnet') {
    const { stdout } = await execAsync(`${CLI} recent-block-hash --net ${net}`);
    // Output: Recent block hash: ...
    const hash = stdout.trim().split(/\s+/).pop();
    if (!hash)
        throw new Error('Failed to parse recentBlockHash output');
    return { blockHash: hash };
}
async function aggSendStepTwo({ keypair, to, amount, keys, recentBlockHash, firstMessages, secretState }) {
    const cmd = `${CLI} agg-send-step-two --keypair ${keypair} --to ${to} --amount ${amount} --keys ${keys[0]} --keys ${keys[1]} --recent-block-hash ${recentBlockHash} --first-messages ${firstMessages} --secret-state ${secretState}`;
    const { stdout } = await execAsync(cmd);
    // Output: Partial signature: ...
    const sigMatch = stdout.match(/Partial signature: (.+)/);
    if (!sigMatch)
        throw new Error('Failed to parse aggSendStepTwo output');
    return { partialSignature: sigMatch[1].trim() };
}
async function aggregateSignaturesAndBroadcast({ to, amount, keys, recentBlockHash, signatures, net = 'devnet', }) {
    const cmd = `${CLI} aggregate-signatures-and-broadcast --net ${net} --to ${to} --amount ${amount} --keys ${keys[0]} --keys ${keys[1]} --recent-block-hash ${recentBlockHash} --signatures ${signatures[0]} --signatures ${signatures[1]}`;
    const { stdout } = await execAsync(cmd);
    return { output: stdout.trim() };
}
//# sourceMappingURL=tss-service.js.map