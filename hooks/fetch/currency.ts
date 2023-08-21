import type { CryptocurrencyType } from "@/lib/types/currency"
import type { AppRouterApiResponseType } from "@/lib/types/common"
import { replaceUrlParams } from "@/utils/main"
import useSWR from "swr"
import apiRoutes from "@/config/api.route"

export function useAllCurrencies() {
    const { data, error, isLoading } = useSWR<AppRouterApiResponseType<CryptocurrencyType[]>>(apiRoutes.getAllCurrency)

    return {
        currencies: data ? data.data : undefined,
        isLoading,
        isError: !!error
    }
}

export function useChainCurrencies(chainId: string) {
    const { data, error, isLoading } = useSWR<AppRouterApiResponseType<CryptocurrencyType[]>>(
        chainId ? 
        replaceUrlParams(apiRoutes.getCurrenciesByChain, {chainId}) 
        : null
    )

    return {
        currencies: data ? data.data : undefined,
        isLoading,
        isError: !!error
    }
}