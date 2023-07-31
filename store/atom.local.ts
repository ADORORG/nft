import { atom } from "jotai"

const customWindow = (typeof window !== "undefined" ? window : {}) as {localStorage: any}
const localStorage = customWindow.localStorage

export function atomWithLocalStorage<T = unknown>(key: string, initialValue: T) {
    const getInitialValue = () => {
        const item = localStorage ? localStorage.getItem(key) : null
        if (item !== null) {
            return JSON.parse(item) as T
        }
        return initialValue;
    }
    const baseAtom = atom<T>(getInitialValue())
    
    const derivedAtom = atom(
        (get) => get(baseAtom),
        (get, set, update) => {
            const nextValue = typeof update === "function" ? update(get(baseAtom)) : update
            set(baseAtom, nextValue)
            localStorage.setItem(key, JSON.stringify(nextValue))
        }
    )
    return derivedAtom
}