import { GenerateSharesResult, AggregateKeysResult, AirdropResult, AggSendStepOneResult, RecentBlockHashResult, AggSendStepTwoResult, AggregateSignaturesAndBroadcastResult } from '../types/cli';
export declare function generateShares(): Promise<GenerateSharesResult>;
export declare function aggregateKeys(pubkey1: string, pubkey2: string): Promise<AggregateKeysResult>;
export declare function airdrop(to: string, amount: number, net?: string): Promise<AirdropResult>;
export declare function aggSendStepOne(secretKey: string): Promise<AggSendStepOneResult>;
export declare function recentBlockHash(net?: string): Promise<RecentBlockHashResult>;
export declare function aggSendStepTwo({ keypair, to, amount, keys, recentBlockHash, firstMessages, secretState }: {
    keypair: string;
    to: string;
    amount: number;
    keys: [string, string];
    recentBlockHash: string;
    firstMessages: string;
    secretState: string;
}): Promise<AggSendStepTwoResult>;
export declare function aggregateSignaturesAndBroadcast({ to, amount, keys, recentBlockHash, signatures, net, }: {
    to: string;
    amount: number;
    keys: [string, string];
    recentBlockHash: string;
    signatures: [string, string];
    net?: string;
}): Promise<AggregateSignaturesAndBroadcastResult>;
//# sourceMappingURL=tss-service.d.ts.map