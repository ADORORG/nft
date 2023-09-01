import type { EventDataFormProps } from "../types"
import { useState } from "react"
import { useNetwork } from "wagmi"
import { useAccountContract, useAccountCollection } from "@/hooks/fetch"
import { useAuthStatus } from "@/hooks/account"
import { Select } from "@/components/Select"
import { InputField } from "@/components/Form"

export default function EventContracDataForm(props: EventDataFormProps) {
    const [selectedContractOption, setSelectedContractOption] = useState<string>("create")
    const { chains } = useNetwork()
    const { session } = useAuthStatus()
    const { accountContracts } = useAccountContract(session?.user.address)
    const { accountCollections } = useAccountCollection(session?.user.address)
    const {contractData, eventData} = props

    const handleContractChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        let {name, value} = e.target

        if (name === "chainId") {
            value = parseInt(value) as any
            // reset the selected contract option when the chainId changes
            setSelectedContractOption("create")
        }
        props?.updateContractData?.({...contractData, [name]: value})
    }

    const handleEventDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target
        props?.updateEventData?.({...eventData, [name]: value})
    }

    return (
        <div className={`${props.className}`}>
            <div>
                <label htmlFor="eventNetwork" className="block">Blockchain Network</label>
                <span className="opacity-70 text-sm py-2 block">Use test network to test your event before using mainnet</span>
                <Select
                    id="eventNetwork"
                    name="chainId"
                    value={contractData?.chainId?.toString() || ""}
                    onChange={handleContractChange}
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

            <div className="flex flex-col">
                <div className="flex flex-col">
                    <div>
                        <h5>Event Contract</h5>
                        <Select
                            value={selectedContractOption}
                            onChange={e => {
                                setSelectedContractOption(e.target.value)
                                if (e.target.value !== "create") {
                                    props?.updateContractData?.({...contractData, _id: e.target.value as any})
                                } else {
                                    props?.updateContractData?.({...contractData, _id: undefined})
                                }
                            }}
                            className="w-full rounded focus:transition-all duration-700"
                        >
                            <Select.Option value="create">Create new contract</Select.Option>
                            {   
                                // Only show contracts if nftEdition is either 'one_of_one' or 'limited_edition'
                                // Open edition & generative series requires new contract creation
                                ["one_of_one", "limited_edition"].includes(props.eventData.nftEdition || "") &&
                                accountContracts && 
                                accountContracts.length > 0 ? 
                                accountContracts
                                // Only show contracts on the current chainId
                                .filter(contract => contract.chainId === contractData.chainId)
                                .filter(contract => ["one_of_one", "limited_edition"].includes(contract.nftEdition))
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
                        selectedContractOption === "create" && 
                        <div>
                            {/* Contract label */}
                            <InputField
                                label="Contract name"
                                type="text"
                                name="label"
                                placeholder="e.g. Metador"
                                onChange={handleContractChange}
                                value={contractData?.label || ""}
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
                                onChange={handleContractChange}
                                value={contractData?.symbol || ""}
                                autoComplete="off"
                                className="rounded focus:transition-all duration-700"
                                labelClassName="my-3"
                            />
                        </div>
                    }
                    
                </div>
                
                {/* Supply (Edition size) */}
                {
                    // open_edition is unlimited supply, one-of-one is always a single supply
                    ["limited_edition", "generative_series"].includes(eventData?.nftEdition || "") && (
                        <InputField
                            label="Supply (Edition size)"
                            type="number"
                            name="supply"
                            onChange={handleEventDataChange}                    
                            value={eventData?.supply || "100"}
                            autoComplete="off"
                            className="rounded focus:transition-all duration-700"
                            labelClassName="my-3"
                        />
                    )
                }
            </div>
            
            <div>
                <h5>Collection to categorize minted token</h5>
                <Select
                    value={eventData?.xcollection?.toString() || ""}
                    name="xcollection"
                    onChange={handleEventDataChange}
                    className="w-full rounded focus:transition-all duration-700"
                >
                    <Select.Option value="">Select Collection</Select.Option>
                    {
                        accountCollections && accountCollections.length > 0 ? 
                        accountCollections
                        .map(collection => (
                            <Select.Option 
                                key={collection._id?.toString()} 
                                value={collection._id?.toString()}>
                                {collection.name}
                            </Select.Option>
                        ))
                        :
                        null
                    }
                </Select>
            </div>
        </div>
    )
}