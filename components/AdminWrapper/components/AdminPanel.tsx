import { useState, useEffect, useRef } from "react"
import { PersonGear } from "react-bootstrap-icons"
import Button from "@/components/Button"
import QuickModal from "@/components/QuickModal"
import AddCurrency from "./AddCurrency"
import ViewCurrencies from "./ViewCurrencies"

export default function AdminPanel() {
    const [showPanelAction, setShowPanelAction] = useState(false)
    const [showAddCurrencyModal, setShowAddCurrencyModal] = useState(false)
    const [showViewCurrencyModal, setShowViewCurrencyModal] = useState(false)
    const panelActionRef = useRef<HTMLDivElement>(null)

    const handleClickOutsidePanel = (event: MouseEvent) => {
        if (panelActionRef.current && !panelActionRef.current.contains(event.target as Node)) {
            setShowPanelAction(false);
        }
    }
    
    useEffect(() => {
        document.addEventListener("click", handleClickOutsidePanel);
    
        return () => {
          document.removeEventListener("click", handleClickOutsidePanel);
        }
    })

    return (
        <div className="text-gray-950 dark:text-gray-100">
            <div className="relative">
                <div ref={panelActionRef} className={`${!showPanelAction && 'invisible'} fixed bottom-16 right-4 flex flex-col gap-1 transition my-2`}>
                    <Button 
                        onClick={() => setShowAddCurrencyModal(!showAddCurrencyModal)}
                        className="cursor-pointer"
                        variant="secondary">Add currency</Button>
                    <Button 
                        onClick={() => setShowViewCurrencyModal(!showViewCurrencyModal)}
                        className="cursor-pointer"
                        variant="secondary">View Currency</Button>
                </div>
                <div className="fixed bottom-4 right-4">
                    <div 
                        onClick={() => setShowPanelAction(!showPanelAction)}
                        className="flex justify-center w-12 h-12 p-2 rounded bg-secondary-950 dark:bg-secondary-200 text-white dark:text-secondary-950 cursor-pointer">
                        <PersonGear className="w-8 h-8"/>
                    </div>
                </div>
            </div>

            <QuickModal
                show={showAddCurrencyModal}
                onHide={setShowAddCurrencyModal}
                modalTitle="Add Currency"
                modalBody={AddCurrency}
            />

            <QuickModal
                show={showViewCurrencyModal}
                onHide={setShowViewCurrencyModal}
                modalTitle="View Currencies"
                modalBody={ViewCurrencies}
            />
        </div>
    )
}