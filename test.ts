import {
    generateShares,
    aggregateKeys,
    airdrop,
    // aggSendStepOne,
    // recentBlockHash,
    // aggSendStepTwo,
    // aggregateSignaturesAndBroadcast
  } from './utilities/src/services/tss-service'; // Adjust the import path as needed
  
  async function demo() {
    // 1. Generate shares
    const { secretShare, publicShare } = await generateShares();
    console.log('Secret:', secretShare, 'Public:', publicShare);
  
    // 2. Aggregate keys
    const { aggregatedPublicKey } = await aggregateKeys(publicShare, 'anotherPublicKey');
    console.log('Aggregated Key:', aggregatedPublicKey);
  
    // 3. Airdrop
    const airdropResult = await airdrop(aggregatedPublicKey, 0.2);
    console.log('Airdrop:', airdropResult);
  
    // ...and so on for the other functions
  }
  
  demo().catch(console.error);