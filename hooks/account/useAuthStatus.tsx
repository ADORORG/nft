import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react"
import { Session } from "next-auth"
import { SiweMessage } from "siwe"
import { useAccount, useNetwork, useSignMessage, useDisconnect } from "wagmi"
import { AppInfo } from "@/lib/app.config"
import AccountType from "@/lib/types/account"

export default function useAuthStatus() {
    const { signMessageAsync } = useSignMessage()
    const { chain } = useNetwork()
    const { address, isConnected } = useAccount()
    const { disconnect } = useDisconnect()
    const { data, status } = useSession()
    /**
     * We could have a valid session while wallet is not Connected
     * This could happen if session have not expired and user close 
     * the website.
     * Thus, we want to ensure that the session returns `null` if wallet is not connected even if there's an active session
     */
    const session = (isConnected ? data : null) as Session & {user: AccountType} | null

    const handleLogin = async () => {
      const callbackUrl = window.location.href
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: `Authenticate your account on ${AppInfo.name}`,
        uri: window.location.origin,
        version: "1",
        chainId: chain?.id,
        nonce: await getCsrfToken(),
      })

      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      })
      
      signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature,
        callbackUrl,
      })
    }

    const handleLogout = async () => {
        disconnect()
        await signOut()
    }

    return {
        session,
        isConnected,
        address,
        addressChanged: isConnected && session?.user?.address.toLowerCase() !== address?.toLowerCase(),
        authenticated: status === "authenticated",
        unauthenticated: status === "unauthenticated",
        loading: status === "loading",
        requestSignIn: handleLogin,
        requestSignOut: handleLogout,
    }
}