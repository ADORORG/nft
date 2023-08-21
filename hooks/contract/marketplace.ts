import type { PopulatedMarketOrderType } from "@/lib/types/market"
import { useCallback } from "react"
import { usePublicClient, useWalletClient } from "wagmi"
import { parseUnits, getAddress } from "viem"
import { useERC20Approval } from "@/hooks/contract"
import { useAuthStatus } from "@/hooks/account"
import { isAddressZero } from "@/utils/main"
// ABI
import { default as marketplaceAbi, marketplaceAbiVersionMap } from "@/abi/marketplace"
import { getMarketplaceContract, defaultMarketplaceVersion } from "@/config/marketplace.contract"

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

    const orderSignature = useCallback(async ({
        marketplaceContractAddress,
        marketplaceContractName,
        marketplaceContractVersion,
        tokenContractChainId,
        tokenContractAddress,
        tokenId,
        paymentToken,
        bigOfferPrice,
        offerDeadline
    }: {
        marketplaceContractAddress: string,
        marketplaceContractName: string,
        marketplaceContractVersion: string,
        tokenContractChainId: number,
        tokenContractAddress: string,
        tokenId: number,
        paymentToken: string,
        bigOfferPrice: bigint,
        offerDeadline: number | string
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
                buyNowPrice: bigOfferPrice,
                deadline: BigInt(offerDeadline)
            }
        })
    }, [walletClient])

    return {
        orderSignature
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
        const marketplaceContractAddress = getMarketplaceContract(token, version)
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
     * Claim auction when it ended
     */
    const finaliseAuction = useCallback(async (order: PopulatedMarketOrderType) => {
        /** Destruct order data */
        const {
            token,
            version
        } = order

        const marketplaceContractAddress = getMarketplaceContract(token, version)
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
    const marketplaceContractAddress = getMarketplaceContract(order.token, order.version)
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

    return {
        atomicBuy,
        nonAtomicBuy
    }
}

export function useMarketOffer() {
    const publicClient = usePublicClient()
    const erc20Approval = useERC20Approval()
    const { session } = useAuthStatus()
    const signatures = useSignatures()
    
    const requestOfferData = useCallback(async (order: PopulatedMarketOrderType) => {
        /** Big number of offer price */
        const bigOfferPrice = parseUnits(order.price, order.currency.decimals)
        /** Get the default marketplace contract address */
        const marketplaceContractAddress = getMarketplaceContract(order.token, defaultMarketplaceVersion)

        const [marketplaceContractName, marketplaceContractVersion] = await Promise.all([
            publicClient.readContract({
                address: marketplaceContractAddress,
                abi: marketplaceAbi,
                functionName: "name",
            }),
            publicClient.readContract({
                address: marketplaceContractAddress,
                abi: marketplaceAbi,
                functionName: "version",
            })
        ])  

        const orderSignature = await signatures.orderSignature({
            marketplaceContractAddress,
            marketplaceContractName,
            marketplaceContractVersion,
            tokenContractChainId: order.token.contract.chainId,
            tokenContractAddress: order.token.contract.contractAddress,
            tokenId: order.token.tokenId,
            paymentToken: order.currency.address,
            bigOfferPrice,
            offerDeadline: order.orderDeadline as string
        })

        /** Check payment currency allowance / request approval */
        await erc20Approval.requestERC20ApprovalAsync({
            contractAddress: order.currency.address,
            bigAmount: bigOfferPrice,
            owner: session?.user.address as string,
            spender: marketplaceContractAddress,
        })

        return orderSignature

    }, [erc20Approval, session, publicClient, signatures])

    return {
        requestOfferData
    }
}