import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { StoredVaa } from "./vaa.slice"

export interface BridgeTransferResult {
  vaa: StoredVaa;
  txHash: string;
}

export interface WrappedToken {
  key: string;
  tokenAddress: string;
}

export interface BridgeRedeemResult {
  vaa: StoredVaa;
  txHash: string;
}


export interface ResultState {
  bridge: {
    transfer?: BridgeTransferResult;
    wrappedTokens: Record<string, WrappedToken>;
    redeem?: BridgeRedeemResult;
  };
}

const initialState: ResultState = {
    bridge: {
        wrappedTokens: {},
    },
}

export const resultSlice = createSlice({
    name: "resultReducer",
    initialState,
    reducers: {
        setBridgeTransferResult: (
            state,
            { payload }: PayloadAction<BridgeTransferResult | undefined>
        ) => {
            state.bridge.transfer = payload
        },
        setBridgeWrappedTokens: (
            state,
            { payload }: PayloadAction<Record<string, WrappedToken>>
        ) => {
            state.bridge.wrappedTokens = payload
        },
        setBridgeRedeemResult: (
            state,
            { payload }: PayloadAction<BridgeRedeemResult | undefined>
        ) => {
            state.bridge.redeem = payload
        },
    },
})

export const {
    setBridgeTransferResult,
    setBridgeRedeemResult,
    setBridgeWrappedTokens,
} = resultSlice.actions
export const resultReducer = resultSlice.reducer
