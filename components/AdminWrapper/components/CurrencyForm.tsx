import type { CryptocurrencyType } from "@/lib/types/currency"
import { InputField, SwitchCheckbox } from "@/components/Form"
import { Select } from "@/components/Select"
import { useNetwork } from "wagmi"

interface CurrencyFormProps {
    currency: Partial<CryptocurrencyType>,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void,
    containerClassName?: string
}

export default function CurrencyForm(props: CurrencyFormProps) {
    const { containerClassName, onChange, currency } = props
    const { chains } = useNetwork()

    return (
        <div className={`my-3 ${containerClassName}`}>
            <div className="flex flex-col md:flex-row">
                <InputField
                    label="Name"
                    labelClassName="my-2"
                    name="name"
                    value={currency.name || ""}
                    type="text"
                    placeholder="e.g Binance Coin"
                    onChange={onChange}
                    className="rounded"
                    autoComplete="off"
                />
                <InputField
                    label="Currency Id"
                    labelClassName="my-2"
                    name="cid"
                    value={currency.cid || ""}
                    type="text"
                    placeholder="e.g binancecoin"
                    onChange={onChange}
                    className="rounded"
                    autoComplete="off"
                />
            </div>
            <div className="flex flex-col md:flex-row">
                <InputField
                    label="Symbol"
                    labelClassName="my-2"
                    name="symbol"
                    value={currency.symbol || ""}
                    type="text"
                    placeholder="e.g BNB"
                    onChange={onChange}
                    className="rounded"
                    autoComplete="off"
                />
                <InputField
                    label="Decimals"
                    labelClassName="my-2"
                    name="decimals"
                    value={currency.decimals || ""}
                    placeholder="e.g 18"
                    type="number"
                    onChange={onChange}
                    className="rounded"
                    autoComplete="off"
                />
            </div>
            <div className="flex flex-col md:flex-row">
                <InputField
                    label="Logo URI (Absolute or relative link)"
                    labelClassName="my-2"
                    name="logoURI"
                    value={currency.logoURI || ""}
                    placeholder="/coins/bnb.png"
                    type="text"
                    onChange={onChange}
                    className="rounded"
                    autoComplete="off"
                />
                <InputField
                    label="Market Id (use Coingecko Market Id)"
                    labelClassName="my-2"
                    name="marketId"
                    value={currency.marketId || ""}
                    placeholder="bnb for Binancecoin on Coingecko"
                    type="text"
                    onChange={onChange}
                    className="rounded"
                    autoComplete="off"
                />
            </div>
            <InputField
                label="Contract Address (Use zero address for coin)"
                labelClassName="my-2"
                name="address"
                value={currency.address || ""}
                placeholder={"0x".padEnd(32, "0")}
                type="text"
                onChange={onChange}
                className="rounded"
                autoComplete="off"
            />

            <Select
                onChange={onChange}
                value={currency.chainId || ""}
                name="chainId"
                className="my-2 rounded"
            >
                <Select.Option value="" disabled>Select chain</Select.Option>
                {
                    chains && chains.length ?
                    chains.map(chain => (
                        <Select.Option
                            value={chain.id}
                            key={chain.id}
                        >
                            {chain.id}-{chain.name}
                        </Select.Option>
                    ))
                    :
                    null
                }
            </Select>

            <div className="my-3">
                <SwitchCheckbox
                    label="Disabled Currency"
                    name="disabled"
                    checked={currency.disabled || false}
                    onChange={onChange}
                />
            </div>
        </div>
    )
}