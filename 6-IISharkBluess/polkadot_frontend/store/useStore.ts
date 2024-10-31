import { create, StateCreator } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createUserSlice, UserSlice } from "./user.slice";
import { createPoolSlice, PoolSlice } from "./pool.slice";
import { createPairSlice, PairSlice } from "./pair.slice";
import { createTransactionSlice, TransactionSlice } from "./transaction.slice";

type MyState = UserSlice & PoolSlice & PairSlice & TransactionSlice;

export type ImmerStateCreator<T> = StateCreator<
  T,
  [["zustand/immer", never], never],
  [],
  T
>;

const useStore = create(
  immer<MyState>((...a) => ({
    ...createUserSlice(...a),
    ...createPoolSlice(...a),
    ...createPairSlice(...a),
    ...createTransactionSlice(...a)
  }))
);

export { useStore };
