import type ContractType from "@/lib/types/contract"
import type { AppRouterApiResponseType } from "@/lib/types/common"
import { replaceUrlParams } from "@/utils/main"
import useSWR from "swr"
import apiRoutes from "@/config/api.route"

export function useAccountContract(address?: string) {
    const { data, error, isLoading } = useSWR<AppRouterApiResponseType<ContractType[]>>(
        address ? 
        replaceUrlParams(apiRoutes.getContractByAddress, {address})
        : null
    )

    return {
        accountContracts: data ? data.data : undefined,
        isLoading,
        isError: !!error
    }
}