import { useAppSelector } from "@/redux"
import { toMB } from "@/utils"
import { LightBulbIcon } from "@heroicons/react/24/outline"
import {
    Avatar,
    Image,
    Progress,
    Spacer,
} from "@nextui-org/react"
import React from "react"

export const Downloading = () => {
    const chains = useAppSelector((state) => state.blockchainReducer.chains)
    const preferenceChainKey = useAppSelector(
        (state) => state.blockchainReducer.preferenceChainKey
    )
    const { data, framework, loader, wasm } = useAppSelector(
        (state) => state.gameReducer.cifarm.packages
    )

    const total =
    data.totalSize + framework.totalSize + loader.totalSize + wasm.totalSize
    const dataDownloaded = data.finishDownloaded
        ? data.totalSize
        : data.progress?.loaded || 0
    const frameworkDownloaded = framework.finishDownloaded
        ? framework.totalSize
        : framework.progress?.loaded || 0
    const loaderDownloaded = loader.finishDownloaded
        ? loader.totalSize
        : loader.progress?.loaded || 0
    const wasmDownloaded = wasm.finishDownloaded
        ? wasm.totalSize
        : wasm.progress?.loaded || 0
    const downloaded =
    dataDownloaded + frameworkDownloaded + loaderDownloaded + wasmDownloaded

    const version = useAppSelector((state) => state.gameReducer.cifarm.version)
    return (
        <div className="absolute w-full h-full place-items-center grid">
            <div className="grid place-items-center gap-4 w-full relative">
                <div className="relative">
                    <Avatar
                        isBordered
                        src={chains[preferenceChainKey]?.imageUrl}
                        classNames={{
                            base: "absolute w-20 h-20 bottom-0 right-0 z-20 ring-0 bg-background",
                        }}
                    />
                    <Image
                        radius="full"
                        removeWrapper
                        src={"/icons/cifarm.png"}
                        className="w-[160px] h-[160px]"
                    />
                </div>
                <div className="px-6">
                    <div className="grid gap-2">
                        <Progress
                            label={`Downloading (${toMB(total)} MB)`}
                            showValueLabel
                            value={(total <= 1 ? 0 : downloaded / data.totalSize) * 100}
                        />
                    </div>
                    <Spacer y={1.5} />
                    <div className="text-foreground-400 text-xs">{version}</div>
                    <Spacer y={6}/>
                    <div className="bg-warning/10 rounded-medium px-3 py-2.5">
                        <div className="flex gap-2 items-center"> 
                            <LightBulbIcon className="w-5 h-5 min-w-5 text-warning"/>
                            <div className="text-sm text-warning text-justify">
                                The game downloads only once; after that, you can play without any downloads.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
