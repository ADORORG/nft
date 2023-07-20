import { atom } from "jotai"

const customWindow = (typeof window !== "undefined" ? window : {}) as {localStorage: any}
const localStorage = customWindow.localStorage

export function atomWithLocalStorage<T=any>(key: string, initialValue: T) {
    const getInitialValue = () => {
        const item = localStorage ? localStorage.getItem(key) : null
        if (item !== null) {
            return JSON.parse(item)
        }
        return initialValue;
    }
    const baseAtom = atom(getInitialValue())
    
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

export const showWalletConnectModal = atom(false)
export const showConnectedWalletModal = atom(false)
export const selectedChainId = atomWithLocalStorage("selectedNetworkChainId", undefined)