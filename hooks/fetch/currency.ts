import type { CryptocurrencyType } from "@/lib/types/currency"
import type { AppRouterApiResponseType } from "@/lib/types/common"
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
    const { data, error, isLoading } = useSWR<AppRouterApiResponseType<CryptocurrencyType[]>>(chainId ? apiRoutes.getCurrenciesByChain.replace(":chainId", chainId) : null)

    return {
        currencies: data ? data.data : undefined,
        isLoading,
        isError: !!error
    }
}