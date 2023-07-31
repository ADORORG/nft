"use client"
import { useEffect, useState } from "react"
import { useAuthStatus } from "@/hooks/account"
import AuthenticateModal from "./AuthenticateModal"

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [hasPendingAction, setHasPendingAction] = useState<boolean>(false)
  const {
    requestSignIn,
    requestSignOut,
    authenticated,
    unauthenticated,
    loading,
    addressChanged,
    isConnected
  } = useAuthStatus() // request sign in when wallet is connected
  
  useEffect(() => {
    if (!isConnected || loading) {
      return
    }

    if (
      unauthenticated || 
      (
        authenticated &&
        addressChanged
      )
    )  {
      setShowModal(true)
      // requestSignIn()
      return
    }

    // In other cases
    setShowModal(false)

    // eslint-disable-next-line
  }, [isConnected, loading, unauthenticated, authenticated, addressChanged])

  const handleModalClose = () => {
    return false
  }

  const handleSignIn = async () => {
    try {
      setHasPendingAction(true)
      await requestSignIn()
      setShowModal(false)
    } catch(error) {
      console.log(error)
    } finally{
      setHasPendingAction(false)
    }
  }

  const handleSignOut = async () => {
    try {
      setHasPendingAction(true)
      await requestSignOut()
      setShowModal(false)
    } catch(error) {
      console.log(error)
    } finally {
      setHasPendingAction(false)
    }
  }

  return (
    <div>
      {children}

      <AuthenticateModal
        show={showModal}
        onHide={handleModalClose}
        authenticate={handleSignIn}
        disconnect={handleSignOut}
        hasPendingAction={hasPendingAction}
        backdrop={false}
      />
    </div>
  )
}