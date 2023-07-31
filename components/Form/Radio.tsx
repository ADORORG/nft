import { useId } from "react"
import type { InputExtendedProps } from "./types"

export default function Radio(props: InputExtendedProps) {
    const radioId = useId()
    const {label, labelClassName, className} = props

    return (
        <div className="flex items-center mb-4">
            <input 
                id={radioId} 
                type="radio" 
                className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 ${className}`} 
            />
            
            <label 
                htmlFor={radioId} 
                className={`ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 ${labelClassName}`}
            >
                {label}    
            </label>
        </div>
    )
}