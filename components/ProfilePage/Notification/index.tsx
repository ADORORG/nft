"use client"
import type { AccountNotificationType } from "@/lib/types/account"
import React, { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { useAuthStatus } from "@/hooks/account"
import { camelCaseToSentence } from "@/utils/main"
import { fetcher, getFetcherErrorMessage } from "@/utils/network"
import { Checkbox, SwitchCheckbox } from "@/components/Form"
import Button from "@/components/Button"
import Bordered from "@/components/Bordered"
import apiRoutes from "@/config/api.route"


export default function UpdateProfile() {
    const { session } = useAuthStatus()
    const { notification = {} } = session?.user || {}
    const [loading , setLoading] = useState(false)
    const [emailNotification, setEmailNotification] = useState<Partial<AccountNotificationType>>(notification)
    const [allNotification, setAllNotification] = useState(true)
    const notificationKeys: Array<keyof typeof emailNotification> = [
        "newMintOnEvent",
        "eventMintedOut",
        "marketOrderCreated",
        "marketOrderCancelled",
        "marketOrderSold",
        "marketAuctionEnded",
        "newMarketBid",
        "offerReceivedOnToken",
        "offerAcceptedOnToken",
        "offerRejectedOnToken",
    ]

    const toggleAllNotifications = (status: boolean) => {
        setEmailNotification(
            notificationKeys.reduce((prev, curr) => ({...prev, [curr]: status}), {})
        )
    }

    const handleSubmit = async () => {
        try {
            setLoading(true)
            const res = await fetcher(apiRoutes.setEmailNotification, {
                method: "POST",
                body: JSON.stringify(emailNotification)
            })

            if (res.success) {
                toast.success(res.message)
            }

        } catch (error) {
            toast.error(getFetcherErrorMessage(error))

        } finally {
            setLoading(false)
        }
    }
   
    return (
        <div className="flex flex-col gap-4 my-4">
            <h5 className="text-lg font-semibold py-3">Email Notification</h5>
            <div className="border-b border-gray-500 py-2 mb-4">
                <SwitchCheckbox
                    label="Toggle All"
                    checked={allNotification}
                    onChange={e => {
                        setAllNotification(e.target.checked)
                        toggleAllNotifications(e.target.checked)
                    }}
                />
            </div>

            {
                notificationKeys.map(key => (
                    <SwitchCheckbox
                        key={key}
                        label={camelCaseToSentence(key)}
                        checked={
                            emailNotification[key] === undefined ?
                            true
                            :
                            emailNotification[key]
                        }
                        onChange={e => {
                            setEmailNotification({ ...emailNotification, [key]: e.target.checked })
                            if (e.target.checked === false) {
                                setAllNotification(false)
                            }
                        }}
                    />
                ))
            }
            
            <Button
                onClick={handleSubmit}
                className="mt-4"
                variant="gradient"
                loading={loading}
                disabled={loading}
            >Submit</Button>
        </div>


    )
}

