import { useState } from "react"
import { RangeInput } from "@/components/Form"
import { toRoyaltyPercent, fromRoyaltyPercent } from "@/utils/contract"

interface RoyaltySliderProps {
    min?: number,
    max?: number,
    step?: number,
    value?: number,
    setRoyaltyValue: (value: number) => void,
    disabled?: boolean
    labelText?: string
}

export default function RoyaltySlider(props: RoyaltySliderProps) {
    const {
        min = 0,
        max = 50,
        step = 1,
        value = 0,
        setRoyaltyValue,
        disabled = false,
        labelText = "Royalty"
    } = props

    const [royaltyPercent, setRoyaltyPercent] = useState(fromRoyaltyPercent(value))

    return (
        <div>
            <span>{labelText} ({royaltyPercent}%)</span>
                    <RangeInput
                        max={max}
                        min={min}
                        step={step}
                        value={royaltyPercent}
                        onChange={e => {
                            const value = Number(e.target.value)
                            setRoyaltyPercent(value)
                            // set royalty
                            setRoyaltyValue(toRoyaltyPercent(value))
                        }}
                        disabled={disabled}
                    />
        </div>
    )
}