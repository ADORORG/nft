import { useEffect, useRef, useState, useId } from "react"

interface DropdownProps {
    children: React.ReactNode,
    className?: string,
    dropsClassName?: string,
    dropdownTrigger?: React.ReactNode
}

interface DropdownItemProps extends React.LiHTMLAttributes<HTMLLIElement> {

}

Dropdown.Item = DropdownItem

export default function Dropdown(props: DropdownProps) {
    const [showDropdown, setShowDropdown] = useState<boolean>(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const dropdownId = useId()

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setShowDropdown(false)
        }
    }

    useEffect(() => {
        document.addEventListener("click", handleClickOutside)
        return () => {
            document.removeEventListener("click", handleClickOutside)
        }
    }, [])

    return (
        <div ref={dropdownRef} className={`relative ${props.className}`}>
            <div
                className="inline cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
            >
               {props.dropdownTrigger ?? <span>Dropdown</span>}
            </div>

            <div id={dropdownId} className={`${!showDropdown && "hidden"} absolute origin-top-right right-0 z-10 bg-white divide-y divide-gray-100 shadow dark:bg-gray-800 ${props.dropsClassName}`}>
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownHoverButton">
                    {props.children}
                </ul>
            </div>
        </div>
    )
}

function DropdownItem(props: DropdownItemProps) {
    const { className, children, ...otherProps } = props
    return (
        <li className={className} {...otherProps}>{children}</li>
    )
}