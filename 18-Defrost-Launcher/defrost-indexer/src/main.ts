import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { In } from 'typeorm'
import {
	astarDegensAddress,
	astarCatsAddress,
	contractMapping
} from './contracts'
import { Owner, Token, Transfer } from './model'
import * as erc721 from './abi/erc721'
import {
	processor,
	ProcessorContext,
	Event,
	Block
} from './processor'
import { EventRecord } from './abi/abi.support'

var contractsSaved = false

processor.run(new TypeormDatabase(), async (ctx) => {
	const transfersData: TransferData[] = [];

	for (const block of ctx.blocks) {
		for (const event of block.events) {
			if (event.name === 'EVM.Log') {
				const transfer = handleTransfer(block.header, event)
				transfersData.push(transfer)
			}
		}
	}

	if (!contractsSaved) {
		await ctx.store.upsert([...contractMapping.values()])
		contractsSaved = true
	}
	await saveTransfers(ctx, transfersData)
})

type TransferData = {
	id: string
	from: string
	to: string
	token: bigint
	// timestamp: number
	timestamp: number
	block: number
	contractAddress: string
}

function handleTransfer(block: Block, event: Event): TransferData {
	console.debug("DEBUG: block =", block)
	console.debug("DEBUG: event = ", event)
	const eventRec: EventRecord = {
		topics: event.args?.topics,
		data: event.args?.data,
	}
	const { from, to, tokenId } = erc721.events.Transfer.decode(eventRec);
	return {
		id: event.id,
		from,
		to,
		token: tokenId,
		timestamp: block.height,
		block: block.height,
		contractAddress: event.args.address
	}
}

async function saveTransfers(
	ctx: ProcessorContext<Store>,
	transfersData: TransferData[]
) {
	const getTokenId = (transferData: any) => `${contractMapping.get(transferData.contractAddress)?.symbol ?? ""}-${transferData.token.toString()}`

	const tokensIds: Set<string> = new Set()
	const ownersIds: Set<string> = new Set()

	for (const transferData of transfersData) {
		tokensIds.add(getTokenId(transferData))
		ownersIds.add(transferData.from)
		ownersIds.add(transferData.to)
	}

	const tokens: Map<string, Token> = new Map(
		(await ctx.store.findBy(Token, { id: In([...tokensIds]) }))
			.map(token => [token.id, token])
	)

	const owners: Map<string, Owner> = new Map(
		(await ctx.store.findBy(Owner, { id: In([...ownersIds]) }))
			.map(owner => [owner.id, owner])
	)

	const transfers: Set<Transfer> = new Set()

	for (const transferData of transfersData) {
		const contract = new erc721.Contract(
			// temporary workaround for SDK issue 212
			// passing just the ctx as first arg may already work
			{ _chain: { client: ctx._chain.rpc } },
			{ height: transferData.block },
			transferData.contractAddress
		)

		let from = owners.get(transferData.from)
		if (from == null) {
			from = new Owner({ id: transferData.from, balance: 0n })
			owners.set(from.id, from)
		}

		let to = owners.get(transferData.to)
		if (to == null) {
			to = new Owner({ id: transferData.to, balance: 0n })
			owners.set(to.id, to)
		}

		const tokenId = getTokenId(transferData)
		let token = tokens.get(tokenId)
		if (token == null) {
			token = new Token({
				id: tokenId,
				uri: await contract.tokenURI(transferData.token),
				contract: contractMapping.get(transferData.contractAddress)
			})
			tokens.set(token.id, token)
		}

		token.owner = to

		const { id, block, timestamp } = transferData

		const transfer = new Transfer({
			id,
			block,
			timestamp,
			from,
			to,
			token
		})

		transfers.add(transfer)
	}

	await ctx.store.upsert([...owners.values()])
	await ctx.store.upsert([...tokens.values()])
	await ctx.store.insert([...transfers])
}