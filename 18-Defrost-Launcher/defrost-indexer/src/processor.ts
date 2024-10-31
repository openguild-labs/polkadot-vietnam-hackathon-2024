import { assertNotNull } from '@subsquid/util-internal'
import {
    BlockHeader,
    DataHandlerContext,
    SubstrateBatchProcessor,
    SubstrateBatchProcessorFields,
    Event as _Event,
    Call as _Call,
    Extrinsic as _Extrinsic
} from '@subsquid/substrate-processor'
import * as erc721 from './abi/erc721'

import { astarDegensAddress, astarCatsAddress } from './contracts'

export const processor = new SubstrateBatchProcessor()
    .setBlockRange({ from: 442693 })
    .setGateway('https://v2.archive.subsquid.io/network/astar-substrate')
    .setRpcEndpoint({
		url: assertNotNull("https://astar.api.onfinality.io/public"),
        // url: assertNotNull(process.env.RPC_ENDPOINT),
        rateLimit: 10,
    })
    .addEvmLog({
        address: [astarDegensAddress],
        range: { from: 442693 },
        topic0: [erc721.events.Transfer.topic]
    })
    .addEvmLog({
        address: [astarCatsAddress],
        range: { from: 800854 },
        topic0: [erc721.events.Transfer.topic]
    })

export type Fields = SubstrateBatchProcessorFields<typeof processor>
export type Block = BlockHeader<Fields>
export type Event = _Event<Fields>
export type Call = _Call<Fields>
export type Extrinsic = _Extrinsic<Fields>
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>