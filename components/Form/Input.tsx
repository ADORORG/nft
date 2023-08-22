import type { InputProps } from './types'

export default function Input(props: InputProps) {
    const { className, ...inputProps } = props
    return (
        <input 
            className={`w-full md:w-5/6 lg:2/3 ${className}`} 
            {...inputProps} 
        />
    )
}