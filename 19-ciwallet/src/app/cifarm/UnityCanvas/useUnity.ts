import { use } from "react"
import { UnityConfig, useUnityContext } from "react-unity-webgl"
import { UnityContextHook } from "react-unity-webgl/distribution/types/unity-context-hook"
import { HooksContext } from "./provider.hooks"
import { UnityCacheControlMode } from "react-unity-webgl/distribution/types/unity-cache-control-mode"
import { useCifarmDb } from "@/hooks"

export interface UseUnityReturn {
  unity: UnityContextHook;
}

export const _useUnity = (): UseUnityReturn => {

    const handleCacheControl = (url: string): UnityCacheControlMode => {
        if (url.match(/\.data/) || url.match(/\.bundle/)) {
            return "must-revalidate"
        }
        if (url.match(/\.mp4/) || url.match(/\.wav/)) {
            return "immutable"
        }
        return "no-store"
    }

    const { dataSwr, frameworkSwr, loaderSwr, wasmSwr } = useCifarmDb()

    const context: UnityConfig = {
        loaderUrl: loaderSwr.data || "",
        dataUrl: dataSwr.data || "",
        frameworkUrl: frameworkSwr.data || "",
        codeUrl: wasmSwr.data || "",
        cacheControl: handleCacheControl,
    }

    const unity = useUnityContext(context)

    return {
        unity,
    }
}

export const useUnity = () => {
    const { unity } = use(HooksContext)!
    return unity
}
