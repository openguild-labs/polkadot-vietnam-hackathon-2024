import API, { ApiResponse } from "@/config/api.config";
import { TranactionByAddress, Transaction } from "@/types";

interface createNewTransaction {
    hash: string,
    sender: string,
    receiver: string,
    token: string,
    symbol: string,
    amount: number,
    to_smart_contract: boolean
}

class CreateTransactionService {
    createTransaction = async (data: createNewTransaction) => {
      return await API.POST<ApiResponse<Transaction>>("/transaction", data);
    };
  
    getTransaction = async (transactionId: string) => {
      return await API.GET<ApiResponse<TranactionByAddress>>(`/transaction/${transactionId}`);
    };

    getAllTransaction = async () => {
      return await API.GET<ApiResponse<Transaction[]>>("/transaction");
    }
  }
  
  const TransactionService = new CreateTransactionService();
  export { TransactionService };
  