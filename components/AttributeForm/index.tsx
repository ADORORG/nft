import type { AttributeType } from "@/lib/types/common"
import { deepClone } from "@/utils/main"
import { XLg } from "react-bootstrap-icons"
import { InputField } from "@/components/Form"
import Button from "@/components/Button"

interface AttributeFormProps {
    attributes: AttributeType[],
    onChange: (data: AttributeType[]) => void
}

export default function AttributeForm(props: AttributeFormProps) {
     /** A placeholder or default attribute */
	const defaultAttributes = {trait_type: "", value: ""}
    /**
     * Remove attribute from the attribute stack
     * @param e Event handler
     */
    const removeAttribute = (e: React.MouseEvent<HTMLButtonElement>) => {
		const index = (e.currentTarget as HTMLButtonElement).getAttribute("data-index") as string
		const newAttributes = props.attributes.filter((_, i) => i !== parseInt(index))
		props.onChange(newAttributes)
	}

    /**
     * Add attribute to the attribute stack
     */
	const addAttribute = () => {
		let newAttributes = deepClone(props.attributes)
		props.onChange(newAttributes.concat([{...defaultAttributes}]))
	}

    /**
     * Update attribute `trait_type` or `value` change
     * @param e Event handler
     */
    const handleAttributeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const target = e.target as HTMLButtonElement
        const { name, value } = target
		const index = target.getAttribute('data-index') as string

		let newAttributes = deepClone(props.attributes)

		if (name === 'trait_type') {
			newAttributes[index]['trait_type'] = value;
		}

		if (name === 'value') {
			newAttributes[index]['value'] = value
		}

		props.onChange(newAttributes);
	}

    return (
        <div className="flex flex-col gap-4">
            {
                props.attributes.map(({trait_type, value}, i) => (
                    <div className="flex flex-row items-center justify-between" key={i}>
                        <InputField
                            data-index={i}
                            type="text"
                            name="trait_type"
                            placeholder="trait e.g Speed"
                            onChange={handleAttributeChange}
                            value={trait_type}
                            autoComplete="off"
                            className="rounded focus:transition-all duration-400"
                        />

                        <InputField
                            data-index={i}
                            type="text"
                            name="value"
                            placeholder="value e.g 98"
                            onChange={handleAttributeChange}
                            value={value}
                            autoComplete="off"
                            className="rounded focus:transition-all duration-400"
                        />

                        <span 
                            className={`${i === 0 && 'invisible'} rounded text-sm cursor-pointer`} 
                            data-index={i} 
                            onClick={removeAttribute}
                        >
                            <XLg className="h-4 w-4" />
                        </span>
                    </div>
                ))
            }

            <div className="my-2">
                <Button 
                    variant="gradient" 
                    className="rounded text-sm" 
                    onClick={addAttribute}
                >Add attribute</Button>
            </div>   
        </div>
    )
}