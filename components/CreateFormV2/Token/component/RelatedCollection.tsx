import type { CreateTokenSubComponentProps } from "../types"
import Link from "next/link"
import toast from "react-hot-toast"
import { Select } from "@/components/Select"
import Button from "@/components/Button"
import NavigationButton from "@/components/NavigationButton"
import appRoutes from "@/config/app.route"

export default function SelectTokenCollection(props: CreateTokenSubComponentProps) {
    const { 
        tokenData, 
        setTokenData, 
        accountContracts, 
        accountCollections,
        previousScreen,
        nextSreen
    } = props


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
                    {/* Show account nft contracts */}
                    <div className="mb-6">
                        <label htmlFor="account-contracts" className="block mb-2 font-medium text-gray-900 dark:text-white">
                            <span>Contract &nbsp;</span>
                            {CreateButtonLink({href: appRoutes.createErc721})}
                        </label>

                        <Select
                            id="account-contracts"
                            onChange={e => {
                                const contract = accountContracts?.find(c => c._id?.toString() === e.target.value)
                                setTokenData({ contract })
                            }}
                            name="contract"
                            value={tokenData?.contract?._id?.toString() || ""}
                            className="rounded focus:transition-all duration-700"
                        >
                            <Select.Option value="" disabled>Select contract</Select.Option>
                            {
                                accountContracts &&
                                accountContracts.length &&
                                accountContracts
                                    // We do not have to filter, we request user to switch to the selected contract chain on deploy
                                    // .filter(contract => chain && chain.id === +contract.chainId)
                                    .filter(contract => contract.contractAddress && (!contract.nftEdition || contract.nftEdition === "private"))
                                    .map((contract) => (
                                        <Select.Option
                                            className="active:bg-gradient-300"
                                            key={contract._id?.toString()}
                                            value={contract._id?.toString()}>
                                            {contract.label || contract.contractAddress} - {contract.nftSchema}
                                        </Select.Option>
                                    ))
                            }
                        </Select>
                    </div>

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
                                setTokenData({ xcollection })
                            }}
                            name="xcollection"
                            value={tokenData?.xcollection?._id?.toString() || ""}
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
                </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between py-6">
                <div>
                    {
                        previousScreen !== undefined &&
                        <NavigationButton
                            direction="left"
                            text="Previous"
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
                                if (!tokenData?.contract || !tokenData?.xcollection) {
                                    toast.error("Please select a contract and a collection")
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