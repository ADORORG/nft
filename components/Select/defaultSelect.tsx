
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    children?: React.ReactNode
}

interface SelectOptionProps extends React.OptionHTMLAttributes<HTMLOptionElement> {
    children?: React.ReactNode
    value?: string | number
}

export default function Select(props: SelectProps) {
    const { className, children, ...selectProps } = props

    return (
        <select 
            className={`block w-full md:w-5/6 lg:2/3 p-2.5 text-sm bg-white border dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 dark:focus:border-purple-300 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-purple-900 ${className}`}

            {...selectProps}
            
        >
            {children}
        </select>
    )
}


function SelectOption(props: SelectOptionProps) {
    const { children, ...otherProps } = props
    
    return (
        <option 
            {...otherProps}>
                {children}
        </option>
    )
}

Select.Option = SelectOption