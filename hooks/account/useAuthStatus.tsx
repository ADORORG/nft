import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react"
import { Session } from "next-auth"
import { SiweMessage } from "siwe"
import { useAccount, useNetwork, useSignMessage } from "wagmi"
import { useEffect } from "react"
import { AppInfo } from "@/lib/app.config"
import AccountType from "@/lib/types/account"

export function useAuthStatus() {
    const { signMessageAsync } = useSignMessage()
    const { chain } = useNetwork()
    const { address, isConnected } = useAccount()
    const { data, status } = useSession()
    const session = data as Session & {user: AccountType} | null

    const handleLogin = async () => {
        try {
          const callbackUrl = window.location.href
          const message = new SiweMessage({
            domain: window.location.host,
            address: address,
            statement: `Confirm your account sign in to ${AppInfo.name}`,
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
        } catch (error) {
          console.log(error)
        }
    }
    
    useEffect(() => {
        // automatically request sign when wallet is connected
        const addressChanged = session && address && session?.user?.address?.toLowerCase() !== address?.toLowerCase()
        if (isConnected && (!session || addressChanged)) {
            handleLogin()
        } else if (!isConnected && session) {
            signOut({callbackUrl: window.location.href})
        }
    
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConnected, address])
    
    return {
        session,
        status,
        authenticated: status === "authenticated",
        loading: status === "loading",
        requestSignIn: handleLogin,
    }
}