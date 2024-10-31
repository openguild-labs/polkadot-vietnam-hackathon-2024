import { Dexie, EntityTable } from "dexie"
import { useCifarm } from "."
import { usePathname } from "next/navigation"
import axios, { AxiosProgressEvent } from "axios"
import { constantConfig, envConfig } from "@/config"
import useSWR, { SWRResponse } from "swr"
import { useEffect, useState } from "react"
import {
    CifarmPeripheryGameApiService,
    saveGameVersion,
} from "@/services"
import {
    CifarmPackageKey,
    setCifarmFinishDownloaded,
    setCifarmPackagePartial,
    triggerLoadCifarmGameVersion,
    useAppDispatch,
    useAppSelector,
} from "@/redux"

type UseCifarmDbSwr = SWRResponse<
  string,
  unknown,
  {
    revalidateOnFocus: false;
    revalidateOnReconnect: false;
    revalidateIfStale: false;
    revalidateOnMount: false;
  }
>;

export interface PackageState {
  progress: AxiosProgressEvent | null;
  //downloaded
  totalChunks: number;
  downloadedChunks: number;
  //total size
  totalSize: number;
  //finish load
  finishDownloaded: boolean;
}

export interface UseCifarmDbReturn {
  //db
  cifarmDb: CifarmDb;
  //data
  dataSwr: UseCifarmDbSwr;
  frameworkSwr: UseCifarmDbSwr;
  loaderSwr: UseCifarmDbSwr;
  wasmSwr: UseCifarmDbSwr;
  //finish download
  finishDownloaded: boolean;
  needUpdate: boolean;
}

const VERSION = 1
const RESOURCE_VERSION = `v.${VERSION}.7.a`

export interface DownloadPackageParams {
  key: CifarmPackageKey;
  resourceUrl: string;
}

export interface SetFinishDownloadedParams {
    key: CifarmPackageKey;
    totalSize: number;
}

const gameUrl = (name: string) => {
    const isDev = envConfig().isDev
    //s3
    return `${envConfig().externals.cifarm.packages.baseUrl}${!isDev ? `${RESOURCE_VERSION}/` : ""}${name}`
}

export const _useCifarmDb = (): UseCifarmDbReturn => {
    const cifarmDb = new CifarmDb()
    const pathname = usePathname()

    const [needUpdate, setNeedUpdate] = useState(false)
    const [finishOpen, setFinishOpen] = useState(false)
    const finishLoadVersion = useAppSelector((state) => state.gameReducer.cifarm.finishLoadVersion)
    const gameVersion = useAppSelector((state) => state.gameReducer.cifarm.version)
    
    useEffect(() => {
        if (!finishLoadVersion) return
        const handleEffect = async () => {
            //check version
            try {
                const api = new CifarmPeripheryGameApiService()
                const { version } = await api.getGameVersion()
                //retrive in local storage
                if (!gameVersion || (gameVersion !== version)) {
                //save in local storage
                    setNeedUpdate(true)
                    saveGameVersion(version)
                    //trigger load cifarm game version
                    dispatch(triggerLoadCifarmGameVersion())
                }
            } catch (ex) {
                //catch mean that the version is not available (or server is down)
                //so that skip
                console.log((ex as Error).message)
            //do nothing, just skip
            } finally {
                await cifarmDb.open()
                setFinishOpen(true)
            }
        }
        handleEffect()
    }, [finishLoadVersion])

    const dispatch = useAppDispatch()

    const downloadPackage = async ({
        key,
        resourceUrl,
    }: DownloadPackageParams): Promise<Blob|null> => {
        try {
            const { data } = await axios.get(resourceUrl, {
                responseType: "blob",
                headers: {
                    "Cache-Control": "no-cache",
                },
                onDownloadProgress: (progressEvent) => {
                    dispatch(
                        setCifarmPackagePartial({
                            key,
                            partial: {
                                progress: progressEvent,
                            },
                        })
                    )
                },
            })
            await cifarmDb.packages.add({
                key,
                data,
            })
            return data
        } catch (ex) {
            console.error(ex)
            //do nothing, just skip
            return null
        }
    }

    //super function, continue download, save in db
    const createPackageBlobUrl = async (key: CifarmPackageKey) => {
        if (pathname !== constantConfig().path.cifarm) return ""
        const { name } = packageMap[key]
        const resourceUrl = gameUrl(envConfig().externals.cifarm.packages[name])

        const _package = await cifarmDb.packages.get(key)
        if (_package) {
            //found in db, mean that is have been downloaded, either fully or partially
            if (needUpdate) {
                //if need update, we need to re-download
                await cifarmDb.packages.where({ key }).delete()
            } else {
                dispatch(
                    setCifarmPackagePartial({
                        key,
                        partial: {
                            totalSize: _package.data.size,
                            finishDownloaded: true,
                        },
                    })
                )
                return URL.createObjectURL(_package.data)
            }
        }

        //re-download everything
        //call header to get the data size
        const { headers } = await axios.head(resourceUrl, {
            headers: {
                "Cache-Control": "no-cache",
            },
        })
        const totalSize = parseInt(headers["content-length"] || "0", 10)
        dispatch(
            setCifarmPackagePartial({
                key,
                partial: {
                    totalSize,
                },
            })
        )

        //download 
        const blob = await downloadPackage({ key, resourceUrl })
        if (blob ==  null) {
            dispatch(setCifarmPackagePartial({ key, partial: { errorInDownload: true } }))
            return ""
        }
        dispatch(
            setCifarmPackagePartial({
                key,
                partial: {
                    finishDownloaded: true,
                },
            })
        )
        return URL.createObjectURL(blob)
    }

    const dataSwr = useSWR(
        finishOpen ? ["CIFARM_DATA", pathname] : null,
        () => createPackageBlobUrl(CifarmPackageKey.Data),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            revalidateIfStale: false,
            revalidateOnMount: false,
        }
    )
    const frameworkSwr = useSWR(
        finishOpen ? ["CIFARM_FRAMEWORK", pathname, ] : null,
        () => createPackageBlobUrl(CifarmPackageKey.Framework),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            revalidateIfStale: false,
            revalidateOnMount: false,
        }
    )
    const loaderSwr = useSWR(
        finishOpen ? ["CIFARM_LOADER", pathname] : null,
        () => createPackageBlobUrl(CifarmPackageKey.Loader),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            revalidateIfStale: false,
            revalidateOnMount: false,
        }
    )
    const wasmSwr = useSWR(
        finishOpen ? ["CIFARM_WASM", pathname] : null,
        () => createPackageBlobUrl(CifarmPackageKey.Wasm),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            revalidateIfStale: false,
            revalidateOnMount: false,
        }
    )

    const finishDownloaded = !!dataSwr.data && !!frameworkSwr.data && !!loaderSwr.data && !!wasmSwr.data

    useEffect(() => {
        if (!finishDownloaded) return
        dispatch(setCifarmFinishDownloaded(true))
        cifarmDb.close()
    }, [finishDownloaded])

    return {
        cifarmDb,
        dataSwr,
        frameworkSwr,
        loaderSwr,
        wasmSwr,
        finishDownloaded,
        needUpdate
    }
}

export const useCifarmDb = () => {
    const { cifarmDb } = useCifarm()
    return cifarmDb
}

export interface PackageEntity {
  key: string;
  data: Blob;
}

export class CifarmDb extends Dexie {
    packages!: EntityTable<PackageEntity, "key">

    constructor() {
        super("cifarmv12")
        this.version(2).stores({
            packages: "key, data",
        })
    }
}

export enum CifarmPackageName {
  Data = "dataName",
  Framework = "frameworkName",
  Loader = "loaderName",
  Wasm = "wasmName",
}

export interface CifarmPackageData {
  name: CifarmPackageName;
  type: string;
}

export const packageMap: Record<CifarmPackageKey, CifarmPackageData> = {
    [CifarmPackageKey.Data]: {
        name: CifarmPackageName.Data,
        type: "text/javascript",
    },
    [CifarmPackageKey.Framework]: {
        name: CifarmPackageName.Framework,
        type: "application/vnd.unity",
    },
    [CifarmPackageKey.Loader]: {
        name: CifarmPackageName.Loader,
        type: "application/vnd.unity",
    },
    [CifarmPackageKey.Wasm]: {
        name: CifarmPackageName.Wasm,
        type: "application/vnd.unity",
    },
}
