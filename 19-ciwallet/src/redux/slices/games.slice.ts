import { BotType, defaultBotType } from "@/services"
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { AxiosProgressEvent } from "axios"

export interface Credentials {
  message: string;
  publicKey: string;
  signature: string;
  chainKey: string;
  network: string;
  telegramInitDataRaw: string;
  botType: BotType;
}

export interface GameCredentials extends Credentials {
    //put accountAddress directly to credentials
    accountAddress: string;
}

export interface PackageState {
  progress: AxiosProgressEvent | null;
  errorInDownload: boolean;
  finishDownloaded: boolean;
  totalSize: number;
}

export enum CifarmPackageKey {
  Data = "data",
  Framework = "framework",
  Loader = "loader",
  Wasm = "wasm",
}

export type CifarmPackages = Record<CifarmPackageKey, PackageState>;

export interface CifarmState {
  credentials: GameCredentials;
  packages: CifarmPackages;
  version: string;
  loadCifarmGameVersionKey: number;
  finishLoadVersion: boolean;
  finishDownloaded: boolean;
}

export interface GameState {
  cifarm: CifarmState;
}

const initialState: GameState = {
    cifarm: {
        credentials: {
            chainKey: "",
            message: "",
            network: "",
            publicKey: "",
            signature: "",
            telegramInitDataRaw: "",
            botType: defaultBotType,
            accountAddress: "",
        },
        packages: {
            [CifarmPackageKey.Data]: {
                progress: null,
                errorInDownload: false,
                finishDownloaded: false,
                totalSize: 0,
            },
            [CifarmPackageKey.Framework]: {
                progress: null,
                errorInDownload: false,
                finishDownloaded: false,
                totalSize: 0,
            },
            [CifarmPackageKey.Loader]: {
                progress: null,
                errorInDownload: false,
                finishDownloaded: false,
                totalSize: 0,
            },
            [CifarmPackageKey.Wasm]: {
                progress: null,
                errorInDownload: false,
                finishDownloaded: false,
                totalSize: 0,
            },
        },
        version: "",
        loadCifarmGameVersionKey: 0,
        finishLoadVersion: false,
        finishDownloaded: false,
    },
}

export const gameSlice = createSlice({
    name: "gameReducer",
    initialState,
    reducers: {
        setCifarmCredentials: (state, { payload }: PayloadAction<GameCredentials>) => {
            state.cifarm.credentials = payload
        },
        setCifarmPackagePartial: (
            state,
            { payload }: PayloadAction<SetCifarmPackagePartialParams>
        ) => {
            state.cifarm.packages[payload.key] = {
                ...state.cifarm.packages[payload.key],
                ...payload.partial,
            }
        },
        setCifarmGameVersion: (state, { payload }: PayloadAction<string | null>) => {
            state.cifarm.version = payload || ""
            state.cifarm.finishLoadVersion = true
        },
        triggerLoadCifarmGameVersion: (state) => {
            state.cifarm.loadCifarmGameVersionKey++
        },
        setCifarmFinishDownloaded: (state, { payload }: PayloadAction<boolean>) => {
            state.cifarm.finishDownloaded = payload
        },
    },
})

export const {
    setCifarmCredentials,
    setCifarmPackagePartial,
    setCifarmGameVersion,
    triggerLoadCifarmGameVersion,
    setCifarmFinishDownloaded,
} = gameSlice.actions
export const gameReducer = gameSlice.reducer

export interface SetCifarmPackagePartialParams {
  key: CifarmPackageKey;
  partial: Partial<PackageState>;
}
