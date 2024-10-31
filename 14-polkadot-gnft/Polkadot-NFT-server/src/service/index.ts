import { UniqueChain }  from "@unique-nft/sdk";
import { Sr25519Account } from "@unique-nft/sr25519";
import * as dotenv from "dotenv";
dotenv.config();
  const account = Sr25519Account.fromUri(process.env.MNEMONIC);
  // set "account" as a default signer
  const sdk = UniqueChain({
    baseUrl: "https://rest.unique.network/v2/opal", 
    account,
  });



export async function getBalance(address: string): Promise<any> {
    const balanceQuery = await sdk.balance.get({address});
    console.log("Account's total balance:", balanceQuery.available);
    return balanceQuery;  // balance.amount is the user's balance
  }

export async function createCollection(address: string) {
  const collectionName = `${address.slice(0, 6)} Collection`;
  const description = 'Automatically generated collection by GNFT';
  
  const collectionTx = await sdk.collection.create({  
    name: collectionName,
    description: description,
    symbol: 'GNFT',
    mode: 'Nft',
    admins: [account.address],
    permissions: { mintMode: true },
    tokenPropertyPermissions: [
      {key: 'Description', permission: {mutable: true, collectionAdmin: true, tokenOwner: true}},
      {key: 'Type', permission: {mutable: true, collectionAdmin: true, tokenOwner: true}}
    ],
    info: { cover_image: { url: 'https://ipfs.unique.network/ipfs/QmaaBgpTiW1fkBTpchPJM5v79xJTt4PkNYs2WLgZ39YQBW' } },
  });

  await sdk.collection.transferCollection({to: address, collectionId:collectionTx.result.collectionId })
  return sdk.collection.get({ collectionId: collectionTx.result.collectionId });
}

export async function getCollection(address: string, collectionId?:number) {
  if (collectionId){
    return sdk.collection.get({collectionId, withAdmins: address})
  }
  return null;
}

export async function mintToken(name: string, description: string, ipfsUrl: string, type: string, address: string, collectionId?: number) {
  if (isNaN(collectionId) || collectionId === 0) {
    // Minting process
    const newCollection = await createCollection(address);
    console.log(newCollection);
    const result = await sdk.token.mintNFTs({
      collectionId: newCollection.collectionId,
      tokens: [
        { data: { name, image: ipfsUrl,
          description: description,
          attributes:[{trait_type: "Type", value:type }, {trait_type: "Description", value: description}] },
         properties: [{ key: "Description", value: description }, { key: "Type", value: type }], },
      ]
    });
    const [nft1] = result.result;
    const tokenId = nft1.tokenId;

    await sdk.token.transfer({
      collectionId: newCollection.collectionId,
      tokenId,
      to: address
    });
    console.log(`Minted token ID ${tokenId}, address in collection ID ${nft1.collectionId}`);
    console.log(`View this minted token at https://uniquescan.io/opal/tokens/${nft1.collectionId}/${tokenId}`);
    return nft1;
  } else {
    // Minting process
    const result = await sdk.token.mintNFTs({
      collectionId,
      tokens: [
        { data: { name, image: ipfsUrl,
          description: description,
          attributes:[{trait_type: "Type", value:type }, {trait_type: "Description", value: description}] },
         properties: [{ key: "Description", value: description }, { key: "Type", value: type }], },
      ]
    });
    const [nft1] = result.result;
    const tokenId = nft1.tokenId;

    await sdk.token.transfer({
      collectionId,
      tokenId,
      to: address
    });
    console.log(`Minted token ID ${tokenId}, address in collection ID ${nft1.collectionId}`);
    console.log(`View this minted token at https://uniquescan.io/opal/tokens/${nft1.collectionId}/${tokenId}`);
    return nft1;
  }
}

export async function getTokens (collectionId: number) {
  const nft = [];
  let index = 1;
  let isNFTExist = await checkNFTExist(index, collectionId);
  while (isNFTExist) {
    const result = await sdk.token.get({collectionId, tokenId: index});
    nft.push(result);
    index++;
    isNFTExist = await checkNFTExist(index, collectionId);
  }

  return nft;
}

async function checkNFTExist(tokenId:number, collectionId: number) {
  try {
    // Use fetch to call the API
    const response = await fetch(`https://rest.unique.network/opal/v1/tokens/exists?collectionId=${collectionId}&tokenId=${tokenId}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json'
      }
    });

    // Check if the response is ok (status code 200-299)
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    // Parse the response as JSON
    const result = await response.json();

    // Assuming you want to return this result
    return result.isExists

  } catch (error) {
    console.error("Error fetching tokens:", error);
    return null;
  }
}

export async function burnNFT(tokenId: number) {
   const res = await sdk.token.burn({collectionId: 4122, tokenId,});
   return res;
}