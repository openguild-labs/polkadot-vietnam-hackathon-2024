import { configureStore } from "@reduxjs/toolkit"
import {
    miscellaneousReducer,
    authReducer,
    blockchainReducer,
    tabReducer,
    resultReducer,
    vaaReducer,
    refreshReducer,
    gameReducer
} from "./slices"

export const store = configureStore({
    reducer: {
        miscellaneousReducer,
        authReducer,
        blockchainReducer,
        tabReducer,
        resultReducer,
        vaaReducer,
        refreshReducer,
        gameReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
