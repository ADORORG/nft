import AccountType from "@/lib/types/account"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { Check2Circle } from "react-bootstrap-icons"
import { useAccountSearch } from "@/hooks/fetch/search"
import { fetcher, getFetcherErrorMessage } from "@/utils/network"
import { InputField } from "@/components/Form"
import Button from "@/components/Button"
import LoadingSpinner from "@/components/LoadingSpinner"
import apiRoutes from "@/config/api.route"

export default function BanVerifyAccount() {
    const [searchQuery, setSearchQuery] = useState("")
    const { accounts, isLoading } = useAccountSearch(searchQuery)

    return (
        <div className="mb-4 min-w-[250px] md:min-w-[400px]">
            <div className="border-b border-gray-500 mb-4">
                <InputField
                    className="w-full rounded mb-3"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for Ethereum address"
                    autoComplete="off"
                />
            </div>
            <div>
            {
                isLoading
                ?
                <LoadingSpinner />
                :
                accounts && accounts.length > 0 
                ?
                accounts.map((account) => (
                    <ManageAccount
                        key={account.address}
                        account={account}
                    />
                ))
                :
                <p className="text-center py-4">No results found</p>
            }
            </div>
        </div>
    )
}


function ManageAccount({ account }: { account: AccountType }) {
    const [banning, setBanning] = useState(false)
    const [verifying, setVerifying] = useState(false)

    const handleToggleBan = async () => {
        try {
            setBanning(true)
            const response = await fetcher(apiRoutes.banAccount, {
                method: "POST",
                body: JSON.stringify({
                    accountId: account._id,
                })
            })

            if (response.success) {
                toast.success(response.message)
            }

        } catch (error) {
            toast.error(getFetcherErrorMessage(error))
        } finally {
            setBanning(false)
        }
    }
    const handleToggleVerify = async () => {
        try {
            setVerifying(true)
            const response = await fetcher(apiRoutes.verifyAccount, {
                method: "POST",
                body: JSON.stringify({
                    accountId: account._id,
                })
            })

            if (response.success) {
                toast.success(response.message)
            }

        } catch (error) {
            toast.error(getFetcherErrorMessage(error))
        } finally {
            setVerifying(false)
        }
    }

    return (
        <div className="flex flex-col gap-4 bg-gray-100 dark:bg-gray-800 p-4 rounded">
            <p className="">{account.address}</p>
            <div className="flex flex-row flex-wrap gap-1">
                {
                    account.email && 
                    <span className="flex gap-1 items-center">
                        <span>{account.email}</span>
                        {
                            account.emailVerified &&
                            <Check2Circle title="Email Verified" className="text-green-500" />
                        }
                    </span>
                }
                {
                    account.twitter && 
                    <span>{account.twitter}</span>
                }

                {
                    account.discord && 
                    <span>{account.discord}</span>
                }
            </div>
            <div className="flex flex-row gap-4">
                <Button
                    variant="tertiary"
                    className="px-6 py-1"
                    disabled={verifying || banning}
                    loading={verifying}
                    onClick={handleToggleVerify}
                    rounded
                >
                    {account.verified ? "Unverify" : "Verify"}
                </Button>
                <Button
                    variant="primary"
                    className="px-6 py-1"
                    disabled={banning || verifying}
                    loading={banning}
                    onClick={handleToggleBan}
                    rounded
                >
                    {account.banned ? "Unban" : "Ban"}
                </Button>
            </div>
        </div>
    )
}