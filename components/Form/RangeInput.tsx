import type { InputExtendedProps } from "./types"

export default function RangeInput(props: InputExtendedProps) {
    const {className, value, onChange, ...inputProps} = props

    return (
        <input 
            type="range"
            min={0}
            className={`h-4 bg-gray-300 rounded appearance-none focus:outline-none outline-none transition-all duration-700 ${className}`}
            onChange={e => {
                onChange?.(e)
            }}
            style={{
                background: `linear-gradient(to right, #f43f5e 0%, #a855f7 ${value}%, #06b6d4 ${value}%, #06b6d4 100%)`
            }}
            value={value}
            {...inputProps} 
        />
    )
}