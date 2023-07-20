
type ButtonVariants = "primary" | "secondary" | "tertiary";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
    className?: string
    variant?: ButtonVariants
    inversed?: boolean
    rounded?: boolean
    disabled?: boolean
}
export default function Button({
    children, 
    variant = "primary", 
    className,
    inversed = false,
    rounded = false, 
    disabled = false,
    ...props}: ButtonProps) {
    const variants: {[key in ButtonVariants]: string} = {
        primary: "bg-rose-700 text-white",
        secondary: "bg-gradient-to-r from-purple-800 to-indigo-900 text-white",
        tertiary: "bg-gradient-to-r from-rose-500 to-rose-600",
    }

    const inverse = {
        primary: "border border-rose-700 text-gray-900 hover:text-gray-100 dark:text-gray-100 bg-transparent transition hover:bg-rose-700",
        secondary: "border border-purple-800 text-gray-900 hover:text-gray-100 dark:text-gray-100 bg-transparent transition hover:bg-purple-900",
        tertiary: "bg-gradient-to-r from-rose-600 to-rose-500",
    }

    const btnClass = inversed ? inverse[variant] : variants[variant]
    return (
        <button className={`p-2 ${btnClass} ${rounded && "rounded"} ${disabled && "bg-opacity-70 opacity-70"} ${className}`} {...props}>
            {children}
        </button>
    )
}