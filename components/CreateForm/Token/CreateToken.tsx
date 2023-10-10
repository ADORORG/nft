"use client"
import { useSearchParams } from "next/navigation"
import { useAtom } from "jotai"
import { nftTokenDataStore } from "@/store/form"
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
    const [nftTokenData, setNftTokenData] = useAtom(nftTokenDataStore)
    const targetContract = accountContracts?.find(c => c._id?.toString() === searchParams.get("contract"))

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
                        draft: true,
                    }}
                    setTokenData={setNftTokenData}
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