import type { InputProps } from './types'

export default function Input(props: InputProps) {
    const { className, ...inputProps } = props
    return (
        <input 
            className={`w-full md:w-5/6 lg:2/3 py-2 px-2 text-gray-800 bg-white border dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600  dark:focus:border-purple-300 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-purple-900 ${className}`} 
            {...inputProps} 
        />
    )
}