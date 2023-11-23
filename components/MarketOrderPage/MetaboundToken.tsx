"use client"
import { Lock } from "react-bootstrap-icons"

export default function MetaBoundTokenNonTransferrable() {

    return (
        <div className="absolute w-full h-full z-10 bg-gray-200 dark:bg-gray-800 bg-opacity-80">
            <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <span className="py-4 text-center">
                        Non-transferrable token<br/>
                        Metabound
                    </span>
                    <Lock className="h-5 w-5" />
                </div>
            </div>
        </div>
    )
}