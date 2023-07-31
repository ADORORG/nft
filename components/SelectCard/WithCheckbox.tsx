import { HtmlHTMLAttributes, useId } from "react";

interface SelectCardProps extends HtmlHTMLAttributes<HTMLInputElement> {
    Icon?: React.ReactElement
    heading?: React.ReactNode
    textContent?: React.ReactNode
}

export default function SelectCard(props: SelectCardProps) {
    const {Icon, heading, textContent, ...attr} = props
    const elementId = useId()
    
    return (
        <div>
            <input type="checkbox" id={elementId} className="hidden peer" {...attr} />
            <label htmlFor={elementId} className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                
                <span className="block">
                    {Icon}    
                    <span className="block w-full text-lg font-semibold">{heading}</span>
                    <span className="block w-full text-sm">{textContent}</span>
                </span>
            </label>
        </div>
    )
}