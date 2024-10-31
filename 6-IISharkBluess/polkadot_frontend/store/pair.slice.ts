import { Pair, Pool } from "@/types";
import { ImmerStateCreator } from "./useStore";
import { PairService, PoolService } from "@/service";

export interface PairSlice {
  pairList: Pair[];
  selectedPair: Pair | null;
  fetchPair: () => Promise<void>
  setPair: (item: Pair) => void;
  setPairList: (item: Pair[]) => void;
};

export const createPairSlice: ImmerStateCreator<PairSlice> = (set) => ({
  pairList: [],
  selectedPair: null,

  fetchPair: async () => {
    const res = await PairService.getAllPair();
    
    if (res.success) {
      set((state) => {
        state.pairList = res.metadata;
      });
    } else {
      set((state) => {
        state.pairList = [];
      });
    }
  },

  setPair: (item: Pair) => {
    set((state) => {
      state.selectedPair = item
    })
  },

  setPairList: (item: Pair[]) => {
    set((state) => {
      state.pairList = item
    })
  }
});
