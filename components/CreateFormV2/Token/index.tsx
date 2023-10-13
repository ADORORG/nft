"use client"
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
    const targetContract = accountContracts?.find(c => c._id?.toString() === searchParams.get("contract"))
    // console.log("nftTokenData", nftTokenData)

    return (
        <div className="flex flex-col">
            <h1 className="text-2xl text-center pb-10 md:leading-4">Create a token</h1>
            {
                isConnected ?
                <CreateTokenForm
                    tokenData={{
                        contract: targetContract,
                        royalty: targetContract?.royalty || 0,
                        redeemable: false,
                        redeemableContent: "",
                        quantity: 1,
                        draft: true,
                    }}
                    accountCollections={accountCollections}
                    accountContracts={accountContracts}
                />
                :
                <ConnectWalletButton
                    className="my-10 self-center"
                />
            }
        </div>
    )
}