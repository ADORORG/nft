"use client"

export { default as CreateCollectionForm } from "./Collection/CreateCollectionForm"
export { default as CreateTokenForm } from "./Token/CreateTokenForm"
export { default as CreateERC721ContractForm } from "./Contract/CreateERC721ContractForm"
export { default as CreateERC1155ContractForm } from "./Contract/CreateERC1155ContractForm"

import { useRouter } from "next/navigation"
import { CodeBracketIcon, FolderPlusIcon, DocumentPlusIcon } from "@heroicons/react/24/outline"
import { WithoutCheckbox } from "@/components/SelectCard"
import appRoute from "@/config/app.route"

export function RenderCreateOption() {
    const router = useRouter()

    const defaultCreateOption = [
        {
            title: "Mint a token",
            subtitle: "Create a new token",
            icon: <DocumentPlusIcon className="h-6 w-6 my-2" />,
            link: appRoute.createToken,
        },
        {
            title: "Create Collection",
            subtitle: "Organize your NFTs",
            icon: <FolderPlusIcon className="h-6 w-6 my-2" />,
            link: appRoute.createCollection,
        },
    ]

    const deployOption = [
        {
            title: "Create ERC1155",
            subtitle: "Multi NFT Contract",
            icon: <CodeBracketIcon className="h-6 w-6 my-2" />,
            link: appRoute.createErc1155,
        },
        {
            title: "Create ERC721",
            subtitle: "Single NFT Contract",
            icon: <CodeBracketIcon className="h-6 w-6 my-2" />,
            link: appRoute.createErc721,
        },
    ]

    const handleSelect = (link: any) => {
        router.push(link)
    }

    return (
        <div>
            <h1 className="text-4xl text-center py-8 md:leading-4">Select an option</h1>

            <div className="flex flex-col gap-4 my-4">
                <div className="flex flex-col md:flex-row gap-8 justify-center align-center my-4">
                    {
                        defaultCreateOption.map((create, index) => {
                            return (
                                <WithoutCheckbox
                                    key={create.link + index}
                                    className="p-4"
                                    icon={create.icon}
                                    heading={create.title}
                                    textContent={create.subtitle}
                                    onClick={() => handleSelect(create.link)}
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
                                    onClick={() => handleSelect(create.link)}
                                />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}