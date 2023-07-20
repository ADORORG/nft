"use client"
import { useAuthStatus } from "@/hooks/account/useAuthStatus"

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  useAuthStatus() // request sign in when wallet is connected
  return (
    <div>
      {children}
    </div>
  )
}