import { Network } from "@/config"
import { GetBalanceParams, _getBalance } from "./get-balance.token"
import { _getTokenMetadata } from "./get-token-metadata"
import { TransferParams, transferToken } from "./transfer.token"

export interface BlockchainTokenServiceConstructorParams {
  chainKey: string;
  network?: Network;
  tokenAddress: string;
}

export class BlockchainTokenService {
    constructor(
    private readonly params: BlockchainTokenServiceConstructorParams
    ) {
        params.network = params.network || Network.Testnet
    }

    public async getBalance({
        accountAddress,
    }: Pick<GetBalanceParams, "accountAddress">) {
        if (this.params.chainKey) {
            return await _getBalance({
                accountAddress,
                chainKey: this.params.chainKey,
                tokenAddress: this.params.tokenAddress,
                network: this.params.network,
            })
        }
    }

    public async getTokenMetadata() {
        return _getTokenMetadata({
            chainKey: this.params.chainKey,
            tokenAddress: this.params.tokenAddress,
            network: this.params.network,
        })
    }

    public async transferToken(
        params: Pick<
      TransferParams,
      "amount" | "privateKey" | "fromAddress" | "recipientAddress"
    >
    ) {
        return transferToken({
            amount: params.amount,
            chainKey: this.params.chainKey,
            privateKey: params.privateKey,
            recipientAddress: params.recipientAddress,
            tokenAddress: this.params.tokenAddress,
            fromAddress: params.fromAddress,
            network: this.params.network,
        })
    }
}

export * from "./get-balance.token"
export * from "./get-token-metadata"
