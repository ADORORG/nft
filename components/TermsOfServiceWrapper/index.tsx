"use client"
import { useEffect, useState } from "react"
import { useAtom } from "jotai"
import { termsOfServiceAccepted } from "@/store/common"
import { AppInfo } from "@/lib/app.config"
import Link from "next/link"
import QuickModal from "@/components/QuickModal"
import Button from "@/components/Button"
import appRoutes from "@/config/app.route"

export default function TermsOfServiceWrapper() {
    const [tosAccepted, setTosAccepted] = useAtom(termsOfServiceAccepted)
    const [ready, setReady] = useState(false)
   
    useEffect(() => {
        setReady(true)
    }, [])

    const ToSNotify = () => {

        return (
            <div className="text-gray-900 dark:text-gray-50">
                <h2 className="py-2">Welcome to {AppInfo.name}</h2>

                <ul className="pb-4">
                    <li className="py-1">We will <strong>NEVER</strong> request for your private key or seed phrase.</li>
                    <li className="py-1">
                        This platform is in its beta phase, please contact us (<span className="select-all text-secondary-400">{AppInfo.support}</span>) if you need help or encounter any problem.
                    </li>
                    <li className="py-1">
                        By accessing this website we assume you accept these <Link href={appRoutes.termsOfService} className="text-secondary-400">terms and conditions</Link> in full.
                    </li>
                </ul>

                <Button
                    className="w-full"
                    variant="gradient"
                    onClick={() => setTosAccepted(true)}
                    rounded
                >
                    Agree to Terms
                </Button>
            </div>
        )
    }

    return (
        <QuickModal
            show={ready ? !tosAccepted : false}
            /** We can't hide this modal unless the terms is accepted */
            onHide={() => false}
            backdrop={false}
            modalTitle="Terms and Conditions"
            modalBody={ToSNotify}
        />
    )
}