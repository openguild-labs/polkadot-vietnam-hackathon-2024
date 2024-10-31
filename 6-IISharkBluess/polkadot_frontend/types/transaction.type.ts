export type Transaction = {
  id: string,
  hash: string,
  sender: string,
  receiver: string,
  token: string,
  symbol: string,
  amount: number,
  to_smart_contract: boolean,
  createdAt?: string,
  updatedAt?: string
}

export type TranactionByAddress = {
  send_transaction_list: Transaction[],
  receive_transaction_list: Transaction[]
}