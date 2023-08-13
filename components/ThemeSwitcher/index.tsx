import { useEffect } from "react"
import { Moon, Sun, Laptop } from "react-bootstrap-icons"
import { SelectWithIcon } from "@/components/Select"
import { useAtom } from "jotai"
import { appTheme } from "@/store/theme"

export default function ThemeSwitcher() {
    const [themeValue, setThemeValue] = useAtom(appTheme)

    const options = [
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

    return (
        <SelectWithIcon
            options={options}
            defaultValue={themeValue}
            onChange={setThemeValue}
            buttonClassName="w-28"
        />
    )
}