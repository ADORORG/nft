import type { CreateEventSubComponentProps } from "../types"
import Link from "next/link"
import toast from "react-hot-toast"
import { useNetwork } from "wagmi"
import { nftEditionChecker } from "@/utils/contract"
import { Select } from "@/components/Select"
import { InputField } from "@/components/Form"
import NavigationButton from "@/components/NavigationButton"
import Button from "@/components/Button"
import appRoutes from "@/config/app.route"

export default function EventContractAndCollection(props: CreateEventSubComponentProps) {
    const { 
        eventData,
        accountContracts,
        accountCollections,
        setEventData,
        previousScreen,
        nextSreen
    } = props
    const { chains } = useNetwork()
    const nftEditionType = nftEditionChecker(eventData.nftEdition)
    const createContractOption = "create"

    const CreateButtonLink = ({href}: {href: string}) => (
        <Button
            variant="gradient"
            className="rounded text-sm py-1"
        >
            <Link href={href}>
                Create new
            </Link>
        </Button>
    )


    return (
        <div>
            <div className="flex flex-col md:flex-row gap-4 justify-center pb-4">
                <div className="w-full">
                    {/*  Show account collections */}
                    <div className="my-4">
                        <label htmlFor="account-contracts" className="block mt-4 mb-2 font-medium text-gray-900 dark:text-white">
                            <span className="">Collection&nbsp;</span>
                            {CreateButtonLink({href: appRoutes.createCollection})}
                        </label>

                        <Select
                            id="account-collections"
                            onChange={e => {
                                const xcollection = accountCollections?.find(c => c._id?.toString() === e.target.value)
                                setEventData({ xcollection })
                            }}
                            name="xcollection"
                            value={eventData?.xcollection?._id?.toString() || ""}
                            className="rounded focus:transition-all duration-700"
                        >
                            <Select.Option value="" disabled>Select collection</Select.Option>
                            {
                                accountCollections &&
                                accountCollections.length &&
                                accountCollections.map((collection) => (
                                    <Select.Option
                                        className="active:bg-purple-300"
                                        key={collection._id?.toString()}
                                        value={collection._id?.toString()}>
                                        {collection.name}
                                    </Select.Option>
                                ))
                            }
                        </Select>
                    </div>

                    {/* Show account nft edition contracts */}
                    <div>
                        <label htmlFor="eventNetwork" className="block">Blockchain Network</label>
                        <span className="opacity-70 text-sm py-1 block">Use test network to test your event before using mainnet</span>
                        <Select
                            id="eventNetwork"
                            name="chainId"
                            value={eventData?.contract?.chainId?.toString() || ""}
                            onChange={e => {
                                setEventData({ contract: {chainId: parseInt(e.target.value)} as any })
                            }}
                            className="w-full rounded focus:transition-all duration-700"
                        >
                            <Select.Option value="" disabled>Select Network</Select.Option>
                            {
                                chains.map(chain => (
                                    <Select.Option key={chain.id} value={chain.id}>
                                        {chain.name} {chain.testnet ? "(Testnet)" : ""}
                                    </Select.Option>
                                ))
                            }
                        </Select>
                    </div>

                    {/* Show account nft edition contracts */}
                    <div className="my-3">
                        <h5>Event Contract</h5>
                        <Select
                            value={eventData?.contract?._id?.toString() || createContractOption}
                            onChange={e => {
                                if (e.target.value !== createContractOption) {
                                    const contract = accountContracts?.find(c => c._id?.toString() === e.target.value)
                                    setEventData({ contract })
                                } else {
                                    setEventData({ 
                                        contract: eventData?.contract?.chainId ? { chainId: eventData?.contract?.chainId } as any : undefined
                                    })
                                }
                            }}
                            className="w-full rounded focus:transition-all duration-700"
                        >
                            <Select.Option value={createContractOption}>Create new contract</Select.Option>
                            {   
                                // Only show contracts if nftEdition is either 'one_of_one' or 'limited_edition'.
                                // Open edition & generative series requires new contract creation
                                (nftEditionType.isOneOfOne || nftEditionType.isLimitedEdition) &&
                                eventData?.contract?.chainId &&
                                accountContracts && 
                                accountContracts.length > 0 ? 
                                accountContracts
                                // Only show contracts on the current chainId
                                .filter(contract => contract.chainId === eventData?.contract?.chainId)
                                .filter(contract => (
                                    nftEditionChecker(contract.nftEdition).isOneOfOne 
                                    ||
                                    nftEditionChecker(contract.nftEdition).isLimitedEdition 
                                ))
                                .map(contract => (
                                    <Select.Option 
                                        key={contract._id?.toString()} 
                                        value={contract._id?.toString()}>
                                        {contract.label}
                                    </Select.Option>
                                ))
                                :
                                null
                            }
                        </Select>
                    </div>
                    {
                        !eventData?.contract?._id && 
                        <div>
                            {/* Contract label */}
                            <InputField
                                label="Contract name"
                                type="text"
                                name="label"
                                placeholder="e.g. Metador"
                                onChange={e => {
                                    const contract = eventData?.contract || {} as any
                                    setEventData({ contract: {...contract, label: e.target.value} })
                                }}
                                value={eventData?.contract?.label || ""}
                                autoComplete="off"
                                className="rounded focus:transition-all duration-700"
                                labelClassName="my-3"
                            />

                            {/* Contract Symbol */}
                            <InputField
                                label="Contract Symbol"
                                type="text"
                                name="symbol"
                                placeholder="e.g. MET"
                                onChange={e => {
                                    const contract = eventData?.contract || {} as any
                                    setEventData({ contract: {...contract, symbol: e.target.value} })
                                }}
                                value={eventData?.contract?.symbol || ""}
                                autoComplete="off"
                                className="rounded focus:transition-all duration-700"
                                labelClassName="my-3"
                            />
                        </div>
                    }
                    
                </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between py-6">
                <div>
                    {
                        previousScreen !== undefined &&
                        <NavigationButton
                            direction="left"
                            text="Go back"
                            onClick={() => previousScreen?.()}
                            className="bg-gray-200 dark:bg-gray-800 py-1 px-3"
                        />
                    }
                </div>
                <div>
                    {
                        nextSreen !== undefined &&
                        <NavigationButton
                            direction="right"
                            text="Next"
                            variant="gradient"
                            onClick={() => {
                                if (
                                    !eventData?.contract?.label || 
                                    !eventData?.contract?.symbol || 
                                    !eventData?.xcollection) {
                                    toast.error("Please provide a contract and a collection")
                                    return
                                }
                                nextSreen?.()
                            }}
                            className="py-1 px-3"
                        />
                    }
                </div>
            </div>
        </div>
    )
}