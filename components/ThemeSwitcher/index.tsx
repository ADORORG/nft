import { useEffect } from "react"
import { Moon, Sun, Laptop } from "react-bootstrap-icons"
import { SelectWithIcon } from "@/components/Select"
import { useAtom } from "jotai"
import { appTheme } from "@/store/common"

export default function ThemeSwitcher({view}: {view?: "inline" | "dropdown"}) {
    const [themeValue, setThemeValue] = useAtom(appTheme)

    const themeOptions = [
        {
            value: "dark",
            label: "Dark",
            icon: <Moon className="h-4 w-4 mr-1" />
        },
        {
            value: "light",
            label: "Light",
            icon: <Sun className="h-4 w-4 mr-1" />
        },
        {
            value: "system",
            label: "System",
            icon: <Laptop className="h-4 w-4 mr-1" />
        }
    ]
    
    const handleThemeChange = (darkModeWatch: MediaQueryList, _?: MediaQueryListEvent) => {
        if (
            themeValue === "dark" || 
            (
                themeValue === "system" &&
                darkModeWatch.matches
            )
        ) {
            document.documentElement.classList.add("dark")
        } else {
            document.documentElement.classList.remove("dark")
        }
    }

    useEffect(() => {
        const preferDarkMode = window.matchMedia("(prefers-color-scheme: dark)")
        handleThemeChange(preferDarkMode)
        preferDarkMode.addEventListener("change", handleThemeChange as any)

        return () => {
            return preferDarkMode.removeEventListener("change", handleThemeChange as any)
        }
    })

    if (view === "inline") {
        return (
            <div className="flex flex-row justify-between items-center">
                {
                    themeOptions.map(({icon, value, label}) => (
                        <span 
                            key={value} 
                            title={label}
                            className={`flex justify-center cursor-pointer transition-all p-3 rounded ${value === themeValue ? "bg-gray-200 dark:bg-gray-600" : ""}`}
                            onClick={() => setThemeValue(value)}
                        >
                            {icon}
                        </span>
                    ))
                }
            </div>
        )
    }



    return (
        <SelectWithIcon
            options={themeOptions}
            defaultValue={themeValue}
            onChange={setThemeValue}
            buttonClassName="w-28"
        />
    )
}