import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { useAuthStatus } from "@/hooks/account"
import { fetcher, getFetcherErrorMessage } from "@/utils/network"
import { isValidEmail } from "@/utils/main"
import { InputField } from "@/components/Form"
import Button from "@/components/Button"
import apiRoutes from "@/config/api.route"
import appRoutes from "@/config/app.route"

export default function VerifyEmail() {
    const router = useRouter()
    const { session } = useAuthStatus()
    const [sendingOtp, setSendingOtp] = useState(false)
    const [verifyingOtp, setVerifyingOtp] = useState(false)
    const [email, setEmail] = useState(session?.user?.email || "")
    const [otp, setOtp] = useState("")
    // Authenication will be sent from the server after requestEmailOtp
    const [authentication , setAuthentication] = useState("")
    const sameVerifiedEmail = session?.user.emailVerified && session?.user?.email?.toLowerCase() === email.toLowerCase()

    const requestEmailOtp = async () => {
        try {
            if (!isValidEmail(email)) {
                return toast.error("Invalid email address")
            }

            if (sameVerifiedEmail) {
                return toast.success("No need to verify same email address")
            }

            setSendingOtp(true)
            const res = await fetcher(apiRoutes.requestEmailOtp, {
                method: "POST",
                body: JSON.stringify({email})
            })

            if (res.success) {
                setAuthentication(res.data.authentication)
                toast.success(res.message)
            }

        } catch (error) {
            toast.error(getFetcherErrorMessage(error))
        } finally {
            setSendingOtp(false)
        }
    }

    const handleSubmit = async () => {
        try {
            setVerifyingOtp(true)
            const res = await fetcher(apiRoutes.verifyAccountEmail, {
                method: "POST",
                body: JSON.stringify({otp, authentication, email})
            })

            if (res.success) {
                toast.success(res.message)
                router.push(appRoutes.setProfile)
            }

        } catch (error) {
            toast.error(getFetcherErrorMessage(error))
        } finally {
            setVerifyingOtp(false)
        }
    }

    return (
        <div>
            <div>
                <InputField
                    type="email"
                    label="Email Address"
                    placeholder="Your Email Address"
                    value={email}
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded mb-2"
                />
                <p className="text-gray-500">{sameVerifiedEmail ? "This email is already verified" : ""}</p>
            </div>
            
            <div className="flex flex-row items-center gap-2 my-4">
                <InputField
                    type="otp"
                    label="Email OTP"
                    placeholder={authentication ? "OTP Code" : "Get OTP first"}
                    value={otp}
                    name="otp"
                    onChange={(e) => setOtp(e.target.value)}
                    className="rounded"
                    labelClassName="basis-1/2"
                    disabled={!authentication}
                />
                <div className="basis-1/2">
                    <Button
                        onClick={requestEmailOtp}
                        className="rounded"
                        variant="gradient"
                        loading={sendingOtp}
                        disabled={sendingOtp || sameVerifiedEmail} 
                    > Get OTP </Button>
                </div>
            </div>

            <Button
                onClick={handleSubmit}
                className="mt-4 rounded"
                variant="gradient"
                loading={verifyingOtp}
                disabled={verifyingOtp || !otp || sameVerifiedEmail}
            >Submit</Button>
        </div>
    )
}