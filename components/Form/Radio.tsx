import type { InputExtendedProps } from "./types"
import { useId } from "react"

export default function Radio(props: InputExtendedProps) {
    const {label, labelClassName, className, ...otherProps} = props
    const radioId = useId()

    return (
        <div className="flex items-center mb-4">
            <input 
                id={radioId}
                type="radio" 
                className={`w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600 ${className}`} 
                {...otherProps}
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