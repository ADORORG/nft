"use client"
import type { NftContractEditionType } from "@/lib/types/common"
import { useAuthStatus } from "@/hooks/account"
import { useAccountCollection, useAccountContract } from "@/hooks/fetch"
import { ConnectWalletButton } from "@/components/ConnectWallet"
import CreateEventForm from "./CreateEventForm"

export default function CreateToken({nftEdition}: {nftEdition: Exclude<NftContractEditionType, "private">}) {
    const { session } = useAuthStatus()
    const { accountContracts } = useAccountContract(session?.user.address)
    const { accountCollections } = useAccountCollection(session?.user.address)

    return (
        <div className="flex flex-col">
            {
                session?.user ?
                <CreateEventForm
                    eventData={{
                        nftEdition,
                        supply: nftEdition === "one_of_one" ? 1 : nftEdition === "open_edition" ? 0 : undefined,
                        price: 0,
                        start: Date.now(),
                        end: undefined,
                        royalty: 0,
                        royaltyReceiver: session?.user.address,
                        feeRecipient: session?.user.address,
                        maxMintPerWallet: 0,
                        transferrable: true,
                        // token metadata
                        tokenName: "",
                        tokenDescription: "",
                        redeemableContent: "",
                        attributes: [],
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