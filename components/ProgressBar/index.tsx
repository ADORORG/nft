

interface ProgressBarProps {
    variant?: "primary" | "secondary" | "tertiary" | "gradient",
    className?: string,
    progress: number,
    size?: "sm" | "md" | "lg",
}

export default function ProgressBar(props: ProgressBarProps) {
    const {
        variant = "primary",
        className = "",
        progress,
        size = "md",
    } = props

    const sizeMap = {
        "sm": "h-1.5",
        "md": "h-2.5",
        "lg": "h-3.5",
    }

    const variantMap = {
        "primary": "bg-primary-900 dark:bg-primary-500",
        "secondary": "bg-secondary-900 dark:bg-secondary-500",
        "tertiary": "bg-tertiary-900 dark:bg-tertiary-500",
        "gradient": "bg-gradient-to-r from-primary-900 via-secondary-900 to-tertiary-900",
    }

    const sizeClass = sizeMap[size]
    const variantClass = variantMap[variant]
    const progressWidth = `${progress}%`

    return (
        <div className={`w-full bg-gray-200 rounded ${sizeClass} dark:bg-gray-700`}>
            <div className={`${variantClass} ${sizeClass} rounded ${className}`} style={{width: progressWidth}} />
        </div>
    )
}