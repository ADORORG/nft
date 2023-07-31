import { useId } from "react"
import type { InputExtendedProps } from "./types"

export default function InputField(props: InputExtendedProps) {
    const inputId = useId()
    const {label, labelClassName, className, ...inputProps} = props

    return (
        <div>
            <label 
                htmlFor={inputId} 
                className={`block mb-2 text-sm font-medium text-gray-900 dark:text-white ${labelClassName}`}
            >
                    {label}
            </label>
            <input 
                id={inputId} 
                className={`w-full md:w-5/6 lg:2/3 py-2 px-2 text-gray-800 bg-white border dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 dark:focus:border-purple-300 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-purple-900 transition border ${className}`} 
                {...inputProps} 
            />
        </div>
    )
}