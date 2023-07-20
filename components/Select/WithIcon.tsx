import { useState, useRef, useEffect } from "react"

interface SelectWithIconInterface {
    options: {
        value: string | number, 
        label: string, 
        icon?: React.ReactElement<SVGElement>
    }[]
    defaultValue: string | number
    onChange: (value: string | number) => void
}

export default function SelectWithIcon(props: SelectWithIconInterface) {
    const { options, defaultValue, onChange } = props
    const [ isOpen, setIsOpen ] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const handleDropdown = () => {
        setIsOpen(!isOpen)
    }

    const handleSelect = (value: string | number) => {
        onChange(value)
        setIsOpen(false)
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current &&  !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
    };
    
    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
    
        return () => {
          document.removeEventListener('click', handleClickOutside);
        };
    });

    const defaultSelectedIndex = options.findIndex(({value}) => value === defaultValue)
    const selectedIndex = defaultSelectedIndex !== -1 ? defaultSelectedIndex : 0
    const selectedOptionIcon = options[selectedIndex].icon
    const selectedOptionLabel = options[selectedIndex].label

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                className="w-44 flex-shrink-0 z-10 flex justify-between items-center py-2.5 px-4 text-sm font-semibold text-gray-500 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600" 
                type="button"
                onClick={handleDropdown}
            >
                <span className="flex">
                    {/* Option icon if supplied */}
                    {
                        selectedOptionIcon &&
                        selectedOptionIcon
                    }

                    {/* Option label */}
                    {selectedOptionLabel}
                </span>
                {/* dropdown caret icon */}                
                <svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                </svg>
            </button>

            {
                isOpen &&
                <div className="absolute origin-top-left left-0 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700">
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-list">
                        {
                            options.map(({value, label, icon}, index) =>{
                                
                                return (
                                    <li 
                                        key={value + index.toString()}
                                        className="min-w-fit">
                                        <button
                                            onClick={() => handleSelect(value)} 
                                            type="button" 
                                            className="w-44 inline-flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white">

                                            <span className="inline-flex items-center">
                                                {/* Option icon if supplied */}
                                                {
                                                    icon &&
                                                    icon
                                                }
                                                {/* Option label */}
                                                {label}
                                            </span>
                                        </button>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            }
        </div>
    )
}