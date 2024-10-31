import { Keypair } from "@solana/web3.js"
import { solanaHttpRpcUrl } from "../../rpcs"
import { Network } from "@/config"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { keypairIdentity, publicKey } from "@metaplex-foundation/umi"
import { createAssociatedToken, findAssociatedTokenPda } from "@metaplex-foundation/mpl-toolbox"

export interface CreateAssociatedTokenAccountParams {
    accountAddress: string,
    signer: Keypair
    mintAddress: string
    chainKey: string
    network: Network    
}

export const createAssociatedTokenAccount = async ({
    signer,
    accountAddress,
    mintAddress,
    chainKey,
    network
}: CreateAssociatedTokenAccountParams) => {
    const rpc = solanaHttpRpcUrl(chainKey, network)
    const umi = createUmi(rpc) 
    const keypair = keypairIdentity({
        publicKey: publicKey(signer.publicKey.toBase58()),
        secretKey: signer.secretKey,
    })
    umi.use(keypair)
    await createAssociatedToken(umi, {
        mint: publicKey(mintAddress),
        owner: publicKey(accountAddress),
    }).sendAndConfirm(umi)
}

export interface ReadAssociatedTokenAccountParams {
    accountAddress: string,
    mintAddress: string
    chainKey: string
    network: Network    
}

export const readAssociatedTokenAccount = async ({
    accountAddress,
    chainKey,
    mintAddress,
    network
}: ReadAssociatedTokenAccountParams) => {
    const rpc = solanaHttpRpcUrl(chainKey, network)
    const umi = createUmi(rpc)
    const [ pk ] = findAssociatedTokenPda(umi, { mint: publicKey(mintAddress), owner: publicKey(accountAddress) })
    const account = await umi.rpc.getAccount(pk)
    if (account === null) {
        console.log("Associated Token Account does not exist.")
        return null
    }
    return pk
}   
