import { Transaction } from "@/types";
import { ImmerStateCreator } from "./useStore";
import { TransactionService } from "@/service";

export interface TransactionSlice {
  transactionList: Transaction[];
  fetchTransaction: () => Promise<void>
};

export const createTransactionSlice: ImmerStateCreator<TransactionSlice> = (set) => ({
    transactionList: [],

    fetchTransaction: async () => {
    const res = await TransactionService.getAllTransaction();
    
    if (res.success) {
      set((state) => {
        state.transactionList = res.metadata;
      });
    } else {
      set((state) => {
        state.transactionList = [];
      });
    }
  },
});
