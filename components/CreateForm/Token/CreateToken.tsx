"use client"
import type { PopulatedNftTokenType } from "@/lib/types/token"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
// import { useAtom } from "jotai"
// import { nftTokenDataStore } from "@/store/form"
import { useAuthStatus } from "@/hooks/account"
import { useAccountCollection, useAccountContract } from "@/hooks/fetch"
import { ConnectWalletButton } from "@/components/ConnectWallet"
import CreateTokenForm from "./CreateTokenForm"

export default function CreateToken() {
    const searchParams = useSearchParams()
    const { session, isConnected } = useAuthStatus()
    const { accountContracts } = useAccountContract(session?.user.address)
    const { accountCollections } = useAccountCollection(session?.user.address)
    /** Use atom store of token data */
    // const [nftTokenMedia, setNftTokenMedia] = useAtom(nftTokenMediaStore)
    // const [nftTokenData, setNftTokenData] = useAtom(nftTokenDataStore)
    const [nftTokenData, setNftTokenData] = useState<Partial<PopulatedNftTokenType>>({})
    const targetContract = accountContracts?.find(c => c._id?.toString() === searchParams?.get("contract"))
    // console.log("nftTokenData", nftTokenData)

    const updateTokenData = (tokenData: Partial<PopulatedNftTokenType>) => {
        setNftTokenData((prev) => ({
            ...prev,
            ...tokenData
        }))
    }

    /**
     * Reset all the form field. This must be done before creating a new token
    */
    const resetForm = () => {
        setNftTokenData({})
    }

    return (
        <div className="flex flex-col">
            <h1 className="text-2xl text-center pb-10 md:leading-4">Create a token</h1>
            {
                isConnected ?
                <CreateTokenForm
                    tokenData={{
                        ...nftTokenData,
                        contract: nftTokenData.contract || targetContract,
                        royalty: nftTokenData.royalty || targetContract?.royalty || 0,
                        redeemable: nftTokenData.redeemable || false,
                        redeemableContent: nftTokenData.redeemableContent || "",
                        quantity: nftTokenData.quantity || 1,
                        draft: nftTokenData.draft === undefined ? true : nftTokenData.draft,
                    }}
                    setTokenData={updateTokenData}
                    accountCollections={accountCollections}
                    accountContracts={accountContracts}
                    resetForm={resetForm}
                />
                :
                <ConnectWalletButton
                    className="my-10 self-center"
                />
            }
        </div>
    )
}