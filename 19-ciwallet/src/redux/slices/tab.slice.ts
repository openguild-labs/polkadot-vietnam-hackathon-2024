import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export enum BridgeTab {
    Transfer = "transfer",
    Redeem = "redeem",
    Wrap = "wrap",
}

export enum AssetsTab {
    Tokens = "tokens",
    NFTs = "nfts",
}

export enum CreateAccountTab {
    Generate = "generate",
    Import = "import",
}

export interface TabState {
  bridgeTab: BridgeTab
  assetsTab: AssetsTab
  createAccountTab: CreateAccountTab
}

const initialState: TabState = {
    bridgeTab: BridgeTab.Transfer,
    assetsTab: AssetsTab.Tokens,
    createAccountTab: CreateAccountTab.Generate
}

export const tabSlice = createSlice({
    name: "tabReducer",
    initialState,
    reducers: {
        switchBridgeTab: (state, { payload }: PayloadAction<BridgeTab>) => {
            state.bridgeTab = payload
        },
        switchAssetsTab: (state, { payload }: PayloadAction<AssetsTab>) => {
            state.assetsTab = payload
        },
        switchCreateAccountTab: (state, { payload }: PayloadAction<CreateAccountTab>) => {
            state.createAccountTab = payload
        }
    }
})

export const { switchBridgeTab, switchAssetsTab, switchCreateAccountTab } = tabSlice.actions
export const tabReducer = tabSlice.reducer