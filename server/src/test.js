import {
    generateShares,
    aggregateKeys,
    airdrop,
    // aggSendStepOne,
    // recentBlockHash,
    // aggSendStepTwo,
    // aggregateSignaturesAndBroadcast
  } from '/Users/arnabnandi/bonkbot_clone/utilities/dist/services/tss-service.js'; // Adjust the import path as needed
  
  async function demo() {
    // 1. Generate shares
    const { secretShare, publicShare } = await generateShares();
    console.log('Secret:', secretShare, 'Public:', publicShare);

    // const { secretShare1, publicShare1 } = await generateShares();
    // console.log('Secret:', secretShare1, 'Public:', publicShare1);
  
    // 2. Aggregate keys
    const { aggregatedPublicKey } = await aggregateKeys(publicShare, "Hoamid9gD8dEgLrirgt3gNnAWhmxYe5LSKrJJUGGd4DA");
    console.log('Aggregated Key:', aggregatedPublicKey);
  
    // 3. Airdrop
    const airdropResult = await airdrop(aggregatedPublicKey, 0.2);
    console.log('Airdrop:', airdropResult);
  
    // ...and so on for the other functions
  }
  
  demo().catch(console.error);