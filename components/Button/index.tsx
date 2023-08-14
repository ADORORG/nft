
type ButtonVariants = "primary" | "secondary" | "tertiary" | "gradient"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
    className?: string
    variant?: ButtonVariants
    inversed?: boolean
    rounded?: boolean
    disabled?: boolean
    loading?: boolean
}
export default function Button({
    children, 
    variant = "primary", 
    className,
    inversed = false,
    rounded = false, 
    disabled = false,
    loading = false,
    ...props}: ButtonProps) {
    
    const variants: {[key in ButtonVariants]: string} = {
        primary: "bg-primary-900 hover:bg-opacity-90 text-white",
        secondary: "bg-secondary-900 hover:bg-opacity-90 text-white",
        tertiary: "bg-tertiary-900 hover:bg-opacity-90 text-white",
        gradient: "bg-gradient-to-r from-primary-900 via-secondary-900 to-tertiary-900 text-white"
    }

    const inverse = {
        primary: "border border-primary-900 text-gray-900 dark:text-gray-100 bg-transparent hover:text-white hover:bg-primary-900 transition",
        secondary: "border border-secondary-900 text-gray-900 dark:text-gray-100 bg-transparent hover:text-white hover:bg-secondary-900 transition",
        tertiary: "border border-tertiary-900 text-gray-900 dark:text-gray-100 bg-transparent hover:text-white hover:bg-tertiary-900 transition",
        gradient: "border-r border-r-secondary-900 border-l border-l-primary-900 border-b border-b-tertiary-900 border-t border-t-primary-900 text-gray-900 dark:text-gray-100 bg-transparent hover:bg-gradient-to-r hover:from-primary-900 hover:via-secondary-900 hover:to-tertiary-900 hover:text-white"
    }

    const btnClass = inversed ? inverse[variant] : variants[variant]
    return (
        <button 
            className={`p-2 ${btnClass} ${rounded && "rounded"} ${disabled && "bg-opacity-60 opacity-60"} ${className}`}
            disabled={disabled}
            {...props}
        >
            {
                loading && 
                <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                </svg>
            }
            {children}
        </button>
    )
}