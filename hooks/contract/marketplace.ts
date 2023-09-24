import type { PopulatedMarketOrderType } from "@/lib/types/market"
import { useCallback } from "react"
import { usePublicClient, useWalletClient } from "wagmi"
import { parseUnits, getAddress } from "viem"
import { useERC20Approval } from "@/hooks/contract"
import { useAuthStatus } from "@/hooks/account"
import { isAddressZero } from "@/utils/main"
// ABI
import erc721ABI from "@/abi/erc721"
import { default as marketplaceAbi, marketplaceAbiVersionMap } from "@/abi/marketplace"
import { getMarketplaceContract, defaultMarketplaceVersion } from "@/config/marketplace.contract"
import { IERC721PermitInterface } from "@/config/interface.id"

/** 
* We are not using contract instance in order to reduce code bundle 
* Contract instance bundles all methods. Thus, we are using
* individual contract calls
* @see - [View documentation](https://viem.sh/docs/contract/getContract.html)
*/


/**
 * Request order or approval signature
 */
export function useSignatures() {
    const {data: walletClient} = useWalletClient()
    const publicClient = usePublicClient()


    const orderSignature = useCallback(async ({
        marketplaceContractAddress,
        marketplaceContractName,
        marketplaceContractVersion,
        tokenContractChainId,
        tokenContractAddress,
        tokenId,
        paymentToken,
        bigOrderPrice,
        signatureDeadline
    }: {
        marketplaceContractAddress: string,
        marketplaceContractName: string,
        marketplaceContractVersion: string,
        tokenContractChainId: number,
        tokenContractAddress: string,
        tokenId: number,
        paymentToken: string,
        bigOrderPrice: bigint,
        signatureDeadline: number | string
    }) => {

        return walletClient?.signTypedData({
            types: {
                EIP712Domain: [
                    { name: "name", type: "string" },
                    { name: "version", type: "string" },
                    { name: "chainId", type: "uint256" },
                    { name: "verifyingContract", type: "address" },
                ],
                Order: [
                    { name: "token", type: "address" },
                    { name: "tokenId", type: "uint256" },
                    { name: "paymentToken", type: "address" },
                    { name: "buyNowPrice", type: "uint256" },
                    { name: "deadline", type: "uint256" },
                ],
            },
            primaryType: "Order",
            domain: {
                name: marketplaceContractName,
                version: marketplaceContractVersion,
                chainId: BigInt(tokenContractChainId),
                verifyingContract: getAddress(marketplaceContractAddress),
            },
            message: {
                token: getAddress(tokenContractAddress),
                tokenId: BigInt(tokenId),
                paymentToken: getAddress(paymentToken),
                buyNowPrice: bigOrderPrice,
                deadline: BigInt(signatureDeadline)
            }
        })
    }, [walletClient])

    const approvalSignature = useCallback(({
        tokenContractName,
        tokenContractChainId,
        tokenContractAddress,
        tokenContractNonce,
        tokenId,
        marketplaceContractAddress,
        signatureDeadline,
        version = "1"
    }:{
        tokenContractName: string,
        tokenContractChainId: number,
        tokenContractAddress: string,
        tokenContractNonce: bigint,
        tokenId: number,
        marketplaceContractAddress: string,
        signatureDeadline: number,
        version?: string

    }) => {
        /** Request approval signature */
        return walletClient?.signTypedData({
            types: {
                EIP712Domain: [
                    { name: "name", type: "string" },
                    { name: "version", type: "string" },
                    { name: "chainId", type: "uint256" },
                    { name: "verifyingContract", type: "address" },
                ],
                Permit: [
                    { name: "spender", type: "address" },
                    { name: "tokenId", type: "uint256" },
                    { name: "nonce", type: "uint256" },
                    { name: "deadline", type: "uint256" },
                ],
            },
            primaryType: "Permit",
            domain: {
                name: tokenContractName,
                version,
                chainId: BigInt(tokenContractChainId),
                verifyingContract: getAddress(tokenContractAddress),
            },
            message: {
                spender: getAddress(marketplaceContractAddress),
                tokenId: BigInt(tokenId),
                nonce: BigInt(tokenContractNonce),
                deadline: BigInt(signatureDeadline)
            }
        })
    }, [walletClient])

    const hasOffchainSigning = useCallback(async ({ contractAddress }: {contractAddress: string}) => {
        try {
            const supportOffchainSigning = await publicClient.readContract({
                address: getAddress(contractAddress),
                abi: erc721ABI,
                functionName: "supportsInterface",
                args: [IERC721PermitInterface]
            })

            if (supportOffchainSigning) {
                return true
            }

        } catch (error: any) {
            // supportsInterface may not be available/present on the contract
            console.log(error)
        }

        return false
    }, [publicClient])

    /**
     * If NFT contract supports offchain signing,
     * We'll need to contract 'name' and 'nonces'.
     * Likewise, the marketplace too, we'll need the
     * marketplace 'version' and 'name'. 
     * Hence, we are creating a function to fetch them here
    */

    const getContractStaticParams = useCallback(async ({
        contractAddress,
        tokenId
    }: {
        contractAddress: string,
        tokenId: number
    }) => {
        const [tokenContractName, tokenContractNonce] = await Promise.all([
            publicClient.readContract({
                address: getAddress(contractAddress),
                abi: erc721ABI,
                functionName: "name",
            }),
            publicClient.readContract({
                address: getAddress(contractAddress),
                abi: erc721ABI,
                functionName: "nonces",
                args: [BigInt(tokenId)]
            })
        ])

        return {
            tokenContractName, 
            tokenContractNonce
        }
    }, [publicClient])

    const getMarketplaceStaticParams = useCallback(async ({
        marketplaceContractAddress
    }: {
        marketplaceContractAddress: string
    }) => {
        const [marketplaceName, marketplaceVersion] = await Promise.all([
            publicClient.readContract({
                address: getAddress(marketplaceContractAddress),
                abi: marketplaceAbi,
                functionName: "name",
            }),
            publicClient.readContract({
                address: getAddress(marketplaceContractAddress),
                abi: marketplaceAbi,
                functionName: "version",
            }),
        ])

        return {
            marketplaceName, 
            marketplaceVersion
        }
    }, [publicClient])

    return {
        orderSignature,
        approvalSignature,
        hasOffchainSigning,
        getContractStaticParams,
        getMarketplaceStaticParams
    }
}

export function useAuctionOrder() {
    const {data: walletClient} = useWalletClient()
    const publicClient = usePublicClient()
    const erc20Approval = useERC20Approval()
    const { session } = useAuthStatus()

    /**
     * Create a bid onchain
     * @param price - A price string. Highest bid price or buyNowPrice for auction
     */
    const createBid = useCallback(async (order: PopulatedMarketOrderType, price: string) => {
        /** Destruct order data */
        const {
            token,
            version,
            currency,
        } = order

        /** True if the payment currency is ETH or BNB or Blockchain default Coin. Otherwise it's a token with contract address  */
        const isETHPayment = isAddressZero(currency.address)
        /** The marketplace contract address in which this order was listed */
        const marketplaceContractAddress = getMarketplaceContract(token.contract.chainId, version)
        type MarketplaceVersionsKey = keyof typeof marketplaceAbiVersionMap
        /** The marketplace abi for the marketplaceContractAddress */
        const marketplaceAbi = marketplaceAbiVersionMap[version as MarketplaceVersionsKey]
        /** Big number buy now price */
        const bigOrderPrice = parseUnits(price as string, currency.decimals)
        /** Simulate write contract result */
        let writeContractRequest: any

        if (isETHPayment) {
            writeContractRequest = await publicClient.simulateContract({
                account: getAddress(session?.user.address as string),
                address: marketplaceContractAddress,
                abi: marketplaceAbi,
                functionName: "createBidETH",
                value: bigOrderPrice,
                args: [
                    getAddress(token.contract.contractAddress),
                    BigInt(token.tokenId),
                ]
            })
        } else {
            // Request token approval
            await erc20Approval.requestERC20ApprovalAsync({
                requireEnoughBalance: true,
                contractAddress: currency.address,
                bigAmount: bigOrderPrice,
                owner: session?.user.address as string,
                spender: marketplaceContractAddress,
            })

            writeContractRequest = await publicClient.simulateContract({
                account: getAddress(session?.user.address as string),
                address: marketplaceContractAddress,
                abi: marketplaceAbi,
                functionName: "createBidERC20",
                args: [
                    getAddress(token.contract.contractAddress),
                    BigInt(token.tokenId),
                    bigOrderPrice
                ]
            })
        }

        const saleTxHash = await walletClient?.writeContract(writeContractRequest?.request)
        await publicClient.waitForTransactionReceipt({hash: saleTxHash as any})
        return {
            saleTxHash,
            soldPrice: price,
            buyerId: session?.user.address,
        }

    }, [publicClient, session, walletClient, erc20Approval])

    /**
     * Claim auction when it has ended
     */
    const finaliseAuction = useCallback(async (order: PopulatedMarketOrderType) => {
        /** Destruct order data */
        const {
            token,
            version
        } = order

        const marketplaceContractAddress = getMarketplaceContract(token.contract.chainId, version)
        type MarketplaceVersionsKey = keyof typeof marketplaceAbiVersionMap
        /** The marketplace abi for the marketplaceContractAddress */
        const marketplaceAbi = marketplaceAbiVersionMap[version as MarketplaceVersionsKey]

        const writeContractRequest = await publicClient.simulateContract({
            account: getAddress(session?.user.address as string),
            address: marketplaceContractAddress,
            abi: marketplaceAbi,
            functionName: "finaliseAuction",
            args: [
                getAddress(token.contract.contractAddress),
                BigInt(token.tokenId),
            ]
        })

        const saleTxHash = await walletClient?.writeContract(writeContractRequest?.request)
        await publicClient.waitForTransactionReceipt({hash: saleTxHash as any})
        return {
            saleTxHash,
            buyerId: session?.user.address,
        }

    }, [publicClient, session, walletClient])

    return {
        createBid,
        finaliseAuction
    }
}

export function useFixedPriceOrder(order: PopulatedMarketOrderType) {
    const {data: walletClient} = useWalletClient()
    const publicClient = usePublicClient()
    const erc20Approval = useERC20Approval()
    const { session } = useAuthStatus()

    /** The marketplace contract address in which this order was listed */
    const marketplaceContractAddress = getMarketplaceContract(order.token.contract.chainId, order.version)
    type MarketplaceVersionsKey = keyof typeof marketplaceAbiVersionMap
    /** The marketplace abi for the marketplaceContractAddress */
    const marketplaceAbi = marketplaceAbiVersionMap[order.version as MarketplaceVersionsKey]

    const atomicBuy = useCallback(() => {
        /** Big order price */
        const bigOrderPrice = parseUnits(order.price, order.currency.decimals)
        /** Order data to send onchain */
        const onchainOrderData = {
            side: 0, // 0 for buy, 1 for sell
            seller: getAddress(order.seller.address),
            buyer: getAddress(session?.user.address as string),
            paymentToken: getAddress(order.currency.address),
            buyNowPrice: bigOrderPrice,
            startPrice: BigInt(0),
            deadline: BigInt(order.orderDeadline || 0),
            duration: BigInt(0)
        }

        const buyWithETH = async () => {
            const {request} = await publicClient.simulateContract({
                account: getAddress(session?.user.address as string),
                address: marketplaceContractAddress,
                abi: marketplaceAbi,
                functionName: "atomicBuyETH",
                value: bigOrderPrice,
                args: [
                    getAddress(order.token.contract.contractAddress),
                    BigInt(order.token.tokenId),
                    onchainOrderData,
                    order.orderSignature as any,
                    order.approvalSignature as any
                ]
            })
    
            return walletClient?.writeContract(request)
        }

        const buyWithERC20Token = async () => {
            // Request token approval
            await erc20Approval.requestERC20ApprovalAsync({
                contractAddress: order.currency.address,
                bigAmount: bigOrderPrice,
                owner: session?.user.address as string,
                spender: marketplaceContractAddress,
            })

            const {request} = await publicClient.simulateContract({
                account: getAddress(session?.user.address as string),
                address: marketplaceContractAddress,
                abi: marketplaceAbi,
                functionName: "atomicBuyERC20",
                args: [
                    getAddress(order.token.contract.contractAddress),
                    BigInt(order.token.tokenId),
                    onchainOrderData,
                    order.orderSignature as any,
                    order.approvalSignature as any
                ]
            })

            return walletClient?.writeContract(request)
        }

        return {
            buyWithETH,
            buyWithERC20Token
        }

    }, [walletClient, publicClient, session, erc20Approval, order, marketplaceAbi, marketplaceContractAddress])


    const nonAtomicBuy = useCallback(() => {
        /** Big order price */
        const bigOrderPrice = parseUnits(order.price, order.currency.decimals)

        const buyWithERC20Token = async () => {
            // Request token approval
            await erc20Approval.requestERC20ApprovalAsync({
                contractAddress: order.currency.address,
                bigAmount: bigOrderPrice,
                owner: session?.user.address as string,
                spender: marketplaceContractAddress,
                requireEnoughBalance: true,
            })

            const {request} = await publicClient.simulateContract({
                account: getAddress(session?.user.address as string),
                address: marketplaceContractAddress,
                abi: marketplaceAbi,
                functionName: "buyWithERC20",
                args: [
                    getAddress(order.token.contract.contractAddress),
                    BigInt(order.token.tokenId),
                ]
            })

            return walletClient?.writeContract(request)
        }

        const buyWithETH = async () => {
            const {request} = await publicClient.simulateContract({
                account: getAddress(session?.user.address as string),
                address: marketplaceContractAddress,
                abi: marketplaceAbi,
                functionName: "buyWithETH",
                value: bigOrderPrice,
                args: [
                    getAddress(order.token.contract.contractAddress),
                    BigInt(order.token.tokenId),
                ]
            })

            return walletClient?.writeContract(request)
        }

        return {
            buyWithETH,
            buyWithERC20Token
        }
        
    }, [walletClient, publicClient, erc20Approval, session, order, marketplaceAbi, marketplaceContractAddress])

    const sellForERC20 = useCallback(() => {
        /** Big order price */
        const bigOrderPrice = parseUnits(order.price, order.currency.decimals)
        /** Order data to send onchain */
        const onchainOrderData = {
            side: 1, // 0 for buy, 1 for sell
            seller: getAddress(session?.user.address as string),
            buyer: getAddress(order.buyer?.address as string),
            paymentToken: getAddress(order.currency.address),
            buyNowPrice: bigOrderPrice,
            startPrice: BigInt(0),
            deadline: BigInt(order.orderDeadline || 0),
            duration: BigInt(0)
        } as const

        /**
         * To execute atomicSell,
         * approvalSignature to transfer nft must be requested
         * from the seller (session.user.address).
         * orderSignature has been signed by the buyer (the account that made the offer)
         * @returns 
         */
        const atomicSell = async ({approvalSignature}: {approvalSignature: string}) => {

            const {request} = await publicClient.simulateContract({
                account: getAddress(session?.user.address as string),
                address: marketplaceContractAddress,
                abi: marketplaceAbi,
                functionName: "executeOfferWithPermitERC20",
                args: [
                    getAddress(order.token.contract.contractAddress),
                    BigInt(order.token.tokenId),
                    onchainOrderData,
                    order.orderSignature as any,
                    approvalSignature as any,
                    BigInt(order.orderDeadline as number)
                ]
            })

            return walletClient?.writeContract(request)
        }

        const nonAtomicSell = async () => {

            const {request} = await publicClient.simulateContract({
                account: getAddress(session?.user.address as string),
                address: marketplaceContractAddress,
                abi: marketplaceAbi,
                functionName: "executeOfferERC20",
                args: [
                    getAddress(order.token.contract.contractAddress),
                    BigInt(order.token.tokenId),
                    onchainOrderData,
                    order.orderSignature as any,
                ]
            })

            return walletClient?.writeContract(request)
        }

        return {
            atomicSell,
            nonAtomicSell
        }

    }, [walletClient, publicClient, session, order, marketplaceAbi, marketplaceContractAddress])

    return {
        atomicBuy,
        nonAtomicBuy,
        sellForERC20
    }
}

export function useMarketOffer() {
    const erc20Approval = useERC20Approval()
    const { session } = useAuthStatus()
    const signatures = useSignatures()
    
    const requestOfferData = useCallback(async (order: PopulatedMarketOrderType) => {
        /** Big number of offer price */
        const bigOrderPrice = parseUnits(order.price, order.currency.decimals)
        /** Get the default marketplace contract address */
        const marketplaceContractAddress = getMarketplaceContract(order.token.contract.chainId, defaultMarketplaceVersion)

        const {marketplaceName, marketplaceVersion} = await signatures.getMarketplaceStaticParams({marketplaceContractAddress})

        const orderSignature = await signatures.orderSignature({
            marketplaceContractAddress,
            marketplaceContractName: marketplaceName,
            marketplaceContractVersion: marketplaceVersion,
            tokenContractChainId: order.token.contract.chainId,
            tokenContractAddress: order.token.contract.contractAddress,
            tokenId: order.token.tokenId,
            paymentToken: order.currency.address,
            bigOrderPrice,
            signatureDeadline: order.orderDeadline as number
        })

        /** Check payment currency allowance / request approval */
        await erc20Approval.requestERC20ApprovalAsync({
            contractAddress: order.currency.address,
            bigAmount: bigOrderPrice,
            owner: session?.user.address as string,
            spender: marketplaceContractAddress,
        })

        return orderSignature

    }, [erc20Approval, session, signatures])

    return {
        requestOfferData
    }
}