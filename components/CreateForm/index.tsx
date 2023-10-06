"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { CodeSlash, FileEarmarkPlus, FolderPlus, UiRadiosGrid } from "react-bootstrap-icons"
import { useAccount } from "wagmi"
import { useAccountContract } from "@/hooks/fetch"
import { WithoutCheckbox } from "@/components/SelectCard"
import { Select } from "@/components/Select"
import Button from "@/components/Button"
import appRoute from "@/config/app.route"

export default function RenderCreateOption() {
    const [selectedContract, setSelectedContract] = useState("")
    const router = useRouter()
    const { isConnected, address } = useAccount()
    const { accountContracts } = useAccountContract(address)

    const defaultCreateOption = [
        {
            title: "Mint a token",
            subtitle: "Create a new token",
            icon: <FileEarmarkPlus className="h-6 w-6 my-2" />,
            link: appRoute.createToken,
        },
        {
            title: "Create Collection",
            subtitle: "Organize your NFTs",
            icon: <FolderPlus className="h-6 w-6 my-2" />,
            link: appRoute.createCollection,
        },
        {
            title: "Create Event",
            subtitle: "Primary Minting Event",
            icon: <UiRadiosGrid className="h-6 w-6 my-2" />,
            link: appRoute.createEvent,
        },
    ]

    const deployOption = [
        {
            title: "Create ERC1155",
            subtitle: "Multi NFT Contract",
            icon: <CodeSlash className="h-6 w-6 my-2" />,
            link: appRoute.createErc1155,
        },
        {
            title: "Create ERC721",
            subtitle: "Single NFT Contract",
            icon: <CodeSlash className="h-6 w-6 my-2" />,
            link: appRoute.createErc721,
        },
    ]

    const gotoRoute = (link: string) => {
        router.push(link)
    }

    return (
        <div>
            <h1 className="text-3xl text-center py-8 md:leading-4">Select an option</h1>

            <div className="flex flex-col justify-center items-center gap-4 my-4">
                <div className="flex flex-col md:flex-row gap-4 my-6">
                    <Select
                        className="rounded"
                        value={selectedContract}
                        onChange={e => setSelectedContract(e.target.value)}
                    >
                        <Select.Option value="" disabled>Choose existing Contract</Select.Option>
                        {
                            isConnected &&
                            accountContracts &&
                            accountContracts.length &&
                            // Only show contracts that are private edition or not edition and has contract address (not draft)
                            accountContracts.filter(contract => contract.contractAddress &&  (!contract.nftEdition || contract.nftEdition === "private"))
                            .map(contract => (
                                <Select.Option 
                                    key={contract._id?.toString()}
                                    value={contract._id?.toString()}>{contract.label}-{contract.nftSchema}</Select.Option>
                            ))
                        }
                    </Select>
                    <Button
                        className=""
                        variant="gradient"
                        disabled={!selectedContract}
                        onClick={() => gotoRoute(appRoute.createToken + "?contract=" + selectedContract)}
                        rounded
                    >
                        Mint on Contract
                    </Button>
                </div>
                <div className="flex flex-col md:flex-row gap-8 justify-center items-center my-4">
                    {
                        defaultCreateOption.map((create, index) => {
                            return (
                                <WithoutCheckbox
                                    key={create.link + index}
                                    className="p-4"
                                    icon={create.icon}
                                    heading={create.title}
                                    textContent={create.subtitle}
                                    onClick={() => gotoRoute(create.link)}
                                />
                            )
                        })
                    }
                </div>

                <div className="flex flex-col md:flex-row gap-8 justify-center align-center my-4">
                    {
                        deployOption.map((create, index) => {
                            return (
                                <WithoutCheckbox
                                    key={create.link + index}
                                    icon={create.icon}
                                    heading={create.title}
                                    textContent={create.subtitle}
                                    onClick={() => gotoRoute(create.link)}
                                />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}