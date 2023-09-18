import type { InputExtendedProps } from "./types"

export default function RangeInput(props: InputExtendedProps) {
    const {className, min, max = 100, value = 0, onChange, ...inputProps} = props

    const percentFilled = (Number(value) / Number(max)) * 100

    return (
        <input 
            type="range"
            min={min}
            max={max}
            className={`h-4 bg-gray-300 rounded appearance-none focus:outline-none outline-none transition-all duration-700 ${className}`}
            onChange={e => {
                onChange?.(e)
            }}
            style={{
                background: `linear-gradient(to right, #f43f5e 0%, #a855f7 ${percentFilled}%, #06b6d4 ${percentFilled}%, #06b6d4 100%)`
            }}
            value={value}
            {...inputProps} 
        />
    )
}