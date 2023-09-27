"use client"
import React, { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { getAddress } from "viem"
import { useEnsName } from "wagmi"
import { useAuthStatus } from "@/hooks/account"
import { fetcher, getFetcherErrorMessage } from "@/utils/network"
import { isValidEmail } from "@/utils/main"
import { InputField } from "@/components/Form"
import Button from "@/components/Button"
import apiRoutes from "@/config/api.route"


export default function UpdateProfile() {
    const { session } = useAuthStatus()
    const {
        address,
        name,
        email = "",
        twitter = "",
        discord = ""
    } = session?.user || {}
    const { data: ensName } = useEnsName({address: address ? getAddress(address) : undefined})
    const [loading , setLoading] = useState(false)
    const [profileUpdate, setProfileUpdate] = useState({twitter, discord, email, name})

    useEffect(() => {
        if (ensName) {
            setProfileUpdate({...profileUpdate, name: ensName})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ensName])

    const handleUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setProfileUpdate({...profileUpdate, [name]: value})
    }

    const handleSubmit = async () => {
        try {
            const { twitter, discord, email, name } = profileUpdate
            if (!twitter || !discord || !email) {
                return toast.error("Please fill email, twitter and discord")
            }

            if (!isValidEmail(email)) {
                return toast.error("Invalid email address")
            }

            setLoading(true)
            const res = await fetcher(apiRoutes.updateProfile, {
                method: "POST",
                body: JSON.stringify({twitter, discord, email, name})
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
            <p className="flex flex-row justify-between items-start py-2">
                <span>Address</span>
                <span className="break-all text-sm select-all">{address}</span>
            </p>
            <p className="flex flex-row justify-between items-start py-2">
                <span>Ens name</span>
                <span className="break-all text-sm select-all">{profileUpdate.name || '-'}</span>
            </p>

            <InputField
                type="email"
                label="Email Address"
                placeholder="Your Email Address"
                value={profileUpdate.email}
                name="email"
                onChange={handleUpdate}
                className="rounded"
            />

            <InputField
                label="Discord"
                placeholder="Discord"
                value={profileUpdate.discord}
                name="discord"
                onChange={handleUpdate}
                className="rounded"
            />

            <InputField
                label="Twitter"
                placeholder="Twitter"
                value={profileUpdate.twitter}
                name="twitter"
                onChange={handleUpdate}
                className="rounded"
            />

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

