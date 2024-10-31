import { createSlice } from "@reduxjs/toolkit"

export interface RefreshState {
  refreshBalanceKey: number
}

const initialState: RefreshState = {
    refreshBalanceKey: 0
}

export const refreshSlice = createSlice({
    name: "refreshReducer",
    initialState,
    reducers: {
        triggerRefreshBalance: (state) => {
            state.refreshBalanceKey++
        }
    }
})

export const { triggerRefreshBalance } = refreshSlice.actions
export const refreshReducer = refreshSlice.reducer