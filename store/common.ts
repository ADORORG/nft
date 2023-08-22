import { atomWithLocalStorage } from "./atom.local"

export const appTheme = atomWithLocalStorage("__appTheme", "dark")
export const termsOfServiceAccepted = atomWithLocalStorage<boolean>("__termsOfServiceAccepted__", false)
export const quoteCurrencyIso = atomWithLocalStorage("___quoteCurrencyIso", "usd")