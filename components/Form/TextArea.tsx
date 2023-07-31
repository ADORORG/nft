
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
 // other props
}

export default function TextArea(props: TextAreaProps) {
    const { className, ...otherProps } = props
    return (

        <textarea 
            rows={4}
            className={`block w-full md:w-5/6 lg:2/3 p-2.5 text-gray-800 bg-white bg-gray-500 border dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 dark:focus:border-purple-300 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-purple-900 transition border ${className}`}  
            {...otherProps}    
        />
    )
}

