import { TokenInfo } from "@/config"
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { ReactNode } from "react"

export interface MiscellaneousState {
  warning: Warning;
  confirm: Confirm;
  error: ErrorState;
  polkadotSelectedToken?: TokenInfo;
}

export interface Warning {
  warningMessage: string;
  processFn: (() => void) | (() => Promise<void>);
}

export interface ErrorState {
  errorMessage: string;
}

export enum TransactionType {
  Transfer = "Transfer",
  Approve = "Approve",
  BridgeTransfer = "Bridge Transfer",
  BridgeRedeem = "Bridge Redeem",
}

export interface Confirm {
  confirmMessage: ReactNode;
  processFn: (() => void) | (() => Promise<void>);
  id: string;
  type?: TransactionType;
}

const initialState: MiscellaneousState = {
    warning: {
        warningMessage: "Are you sure you want to proceed?",
        processFn: () => {
            console.log("Warning process function not set")
        },
    },
    confirm: {
        confirmMessage: "Are you sure you want to proceed?",
        processFn: () => {
            console.log("Confirm process function not set")
        },
        id: "",
        type: TransactionType.Transfer,
    },
    error: {
        errorMessage: "An unexpected error occurred. Please try again.",
    },
}

export const miscellaneousSlice = createSlice({
    name: "miscellaneousSlice",
    initialState,
    reducers: {
        setWarning: (state, { payload }: PayloadAction<Warning>) => {
            state.warning = payload
        },
        setConfirm: (state, { payload }: PayloadAction<Confirm>) => {
            state.confirm = payload
        },
        setError: (state, { payload }: PayloadAction<ErrorState>) => {
            state.error = payload
        },
        setPolkadotSelectedToken: (
            state,
            { payload }: PayloadAction<TokenInfo>
        ) => {
            state.polkadotSelectedToken = payload
        },
    },
})

export const { setWarning, setConfirm, setError, setPolkadotSelectedToken } =
  miscellaneousSlice.actions
export const miscellaneousReducer = miscellaneousSlice.reducer
