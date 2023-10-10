import type TokenPageProps from "./types"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { InputField } from "@/components/Form"
import Button from "@/components/Button"
import { useContractChain } from "@/hooks/contract"
import { useERC1155, useERC721 } from "@/hooks/contract/nft"
import { useAuthStatus } from "@/hooks/account"
import { isEthereumAddress } from "@/utils/main"
import { getFetcherErrorMessage, fetcher } from "@/utils/network"
import apiRoutes from "@/config/api.route"

export default function TransferToken(props: TokenPageProps & { done?: () => void }) {
    const { token } = props
    const [tokenAmount, setTokenAmount] = useState(1) // default to 1 erc721 token
    const [newOwner, setNewOwner] = useState("")
    const [transferring, setTransferring] = useState(false)
    const [transferredOnchain, setTransferredOnchain] = useState(false)
    const [transferredOffchain, setTransferredOffchain] = useState(false)
    const contractChain = useContractChain(token.contract)
    const { session } = useAuthStatus()
    const erc721Methods = useERC721()
    const erc1155Methods = useERC1155()
    const isErc721 = token.contract.nftSchema === "erc721"

    const handleTransferOnchain = async () => {
        if (!isEthereumAddress(newOwner)) {
            throw new Error("Invalid address")
        }

        if (isErc721) {
            await erc721Methods.transferFrom({
                contractAddress: token.contract.contractAddress,
                newOwner,
                tokenId: token.tokenId as number
            })
        } else {
            await erc1155Methods.safeTransferFrom({
                contractAddress: token.contract.contractAddress,
                newOwner,
                tokenId: token.tokenId as number,
                amount: tokenAmount
            })
        }
        setTransferredOnchain(true)

    }

    /**
     * We do not currently have a backend listener to log the transfer event.
     * Thus, we send the transfer request to the backend to log the transfer event.
     * @note - This is not a secure way to log the transfer event.
     * If the owner of the token is different from the current account, we call this
     * function with the new owner address.
     * @param _newOwner 
     */
    const handleTransferOffchain = async (_newOwner: string = newOwner) => {
        const response = await fetcher(
            apiRoutes.transferToken,
            {
                method: "POST",
                body: JSON.stringify({
                    tokenDocId: token._id,
                    newOwner,
                })
            }
        )

        if (response.success) {
            setTransferredOffchain(true)
        }
    }

    const handleTransfer = async () => {
        try {
            setTransferring(true)
            await contractChain.ensureContractChainAsync()
            /**
             * We do not have a backend listener to log the transfer event.
             * Thus, we check if the current account address is the still the owner of the token.
             * If this account is not the owner, we update our record for this token.
             * Otherwise, we proceed to transfer the token.
             */
            let isOwner = true

            if (isErc721) {
                const ownerAddress = await erc721Methods.ownerOf({
                    contractAddress: token.contract.contractAddress,
                    tokenId: token.tokenId as number,
                })
                isOwner = ownerAddress.toLowerCase() === session?.user?.address?.toLowerCase()

                /* 
                * If the owner is not the current account, we use this opportunity update our record for this token.
                * This is not a secure way to log the transfer event.
                */
                if (!isOwner) {
                    await handleTransferOffchain(ownerAddress)
                    /* 
                    * We are done here. We do not need to proceed with the transfer.
                    */
                    props.done?.()
                    return
                }

            } else {
                const ownedAmount = await erc1155Methods.balanceOf({
                    contractAddress: token.contract.contractAddress,
                    tokenId: token.tokenId as number,
                    accountAddress: session?.user?.address
                })
                // Account must be holding equal or more than the token amount to transfer
                isOwner = ownedAmount >= tokenAmount

                /**
                * If the owner is not the current account, we use this opportunity update our record for this token.
                * This is not a secure way to log the transfer event.
                * @todo - How do we get the owner address of an erc1155 token?
                * ERC1155 ownership is based on account balance.
                */
            }

            if (!isOwner) {
                /**
                 * @todo: Update the token record
                 */
                throw new Error("You do not own this token")
            }

            // handle the transfer
            if (!transferredOnchain) {
                await handleTransferOnchain()
                await handleTransferOffchain()

            } else if (!transferredOffchain) {
                await handleTransferOffchain()
            }

            toast.success("Transfer done")
            props.done?.()

        } catch (error: any) {
            toast.error(getFetcherErrorMessage(error))
        } finally {
            setTransferring(false)
        }
    }

    return (
        <div className="flex flex-col gap-4 max-w-md">
            <h2> Transfer <strong>{token.name}#{token.tokenId}</strong></h2>

            <div>
                <InputField
                    label="Token Amount"
                    placeholder="1"
                    max={token.quantity}
                    min={1}
                    value={tokenAmount}
                    onChange={e => setTokenAmount(Number(e.target.value))}
                    className="rounded"
                    disabled={isErc721 || transferring || transferredOnchain}
                />
            </div>
            <div>
                <InputField
                    label="New Owner Address"
                    placeholder="0x0"
                    value={newOwner}
                    onChange={e => setNewOwner(e.target.value)}
                    className="rounded"
                    disabled={transferring || transferredOnchain}
                />
            </div>

            <Button
                variant="gradient"
                className=""
                onClick={handleTransfer}
                disabled={transferring || transferredOffchain}
                loading={transferring}
                rounded
            >
                {
                    transferredOffchain ? 
                    "Transfer done" 
                    : 
                    transferredOnchain ?
                    "Finalize Transfer"
                    :
                    "Transfer"
                }
            </Button>
        </div>
    )
}