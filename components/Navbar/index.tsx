"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { TextRight as BarsLeft, X as XIcon } from "react-bootstrap-icons"
import { useAuthStatus } from "@/hooks/account"
import { replaceUrlParams } from "@/utils/main"
import { ConnectWalletButton, NetworkChainSelect, ConnectedWalletButton } from "@/components/ConnectWallet"
import ThemeSwitcher from "@/components/ThemeSwitcher"
import SearchForm from "@/components/SearchForm"
import Dropdown from "@/components/Dropdown"
import appRoutes from "@/config/app.route"

type NavigationType = {name: string, href: string}
interface TopNavProps {
    name: string,
    logoUrl: string,
    navLink: NavigationType[]
}

export default function Navbar({ topNav }:{ topNav: TopNavProps }) {
  const { isConnected, address, requestSignOut } = useAuthStatus()
  const [isOpen, setIsOpen] = useState(false)
  const {name, logoUrl, navLink} = topNav

  const getHref = (route: string) => replaceUrlParams(route, {address: address?.toLowerCase() as string})

  const accountLinks = [
    {
      name: "My Token", 
      href: getHref(appRoutes.viewAccountToken)
    },
    {
      name: "My Collection", 
      href: getHref(appRoutes.viewAccountCollection)
    },
    {
      name: "My Orders", 
      href: getHref(appRoutes.viewAccountMarketOrders)
    },
    {
      name: "My Event",
      href: getHref(appRoutes.viewAccountSaleEvent)
    },
    {
      name: "My Contract",
      href: getHref(appRoutes.viewAccountContract)
    },
    {
      name: "Set Profile", 
      href: appRoutes.setProfile
    },  
    {
      name: "View Draft", 
      href: appRoutes.viewDraft
    },  
  ]


  return (
    <nav className="relative bg-white shadow dark:bg-gray-950">
        <div className="container px-4 py-4 mx-auto">
            <div className="lg:flex lg:items-center lg:justify-evenly lg:p-2">
                <div className="flex items-center justify-between">
                    <div className="p-4 justify-start items-center inline-flex">
                        <Link href="/">
                            <Image 
                                className="w-auto h-20" 
                                src={logoUrl}
                                alt="Logo"
                                width={200}
                                height={200}
                            />
                        </Link>
                        <div className="text-center dark:text-white text-gray-900 text-3xl font-semibold tracking-wide">{ name }</div>
                    </div>
                    {/* <!-- Mobile menu button --> */}
                    <div className="flex lg:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} type="button" className="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400" aria-label="toggle menu">
                          {
                            isOpen ? 
                            <XIcon className="w-6 h-6" /> : 
                            <BarsLeft className="w-6 h-6" />
                          }
                        </button>
                    </div>
                </div>
                
                {/* Mobile Menu open: "block", Menu closed: "hidden" */}
                <div className={`${isOpen ? "translate-x-0 opacity-100" : "opacity-0 -translate-x-full"} absolute inset-x-0 z-20 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-white dark:bg-gray-950 lg:mt-0 lg:p-0 lg:top-0 lg:relative lg:bg-transparent lg:w-auto lg:opacity-100 lg:translate-x-0 lg:flex lg:flex-1 lg:items-center lg:justify-end`}>
                  <SearchForm />
                  <div className="justify-start lg:items-center gap-8 flex flex-col lg:flex-row my-8 lg:mx-8">
                      {
                        navLink.map(({name, href}, i) => (
                          <Link 
                            key={i}
                            href={href}
                            className="dark:text-white text-gray-900 text-xl font-medium leading-3 tracking-wide">{name}
                          </Link>
                        ))
                      }
                  </div>
              
                  <div className="lg:ml-4 mt-4 lg:mt-0">
                    <NetworkChainSelect 
                      switchOnChange
                    />
                  </div>
                  
                  {
                    !isConnected ?
                    <div className="flex gap-2">
                        <div className="lg:ml-4 mt-4 lg:mt-0">
                          {/* Theme switch needs to be display to show/trigger theme selection */}
                          <ThemeSwitcher view="dropdown" />
                        </div>
                        <div className="lg:ml-4 mt-4 lg:mt-0">
                          <ConnectWalletButton />
                        </div>
                    </div>
                    :
                    <Dropdown
                      dropdownTrigger={<ConnectedWalletButton />}
                      className="w-48 lg:ml-4"
                      dropsClassName="w-full"
                    >
                      {
                        accountLinks.map(({name, href}, i) => (
                          <Dropdown.Item
                            key={href}
                            className="px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            <Link href={href}>
                                {name}
                            </Link>
                          </Dropdown.Item>
                        ))
                      }
                      <Dropdown.Item 
                        className="cursor-pointer px-2 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white border-t border-gray-200 dark:border-gray-700"
                        onClick={() => requestSignOut()}
                      >
                        <span>Disconnect</span>
                      </Dropdown.Item>

                      <Dropdown.Item className="mt-2 p-2 border-t border-gray-200 dark:border-gray-700">
                        <ThemeSwitcher view="inline" />
                      </Dropdown.Item>
                      
                    </Dropdown>
                  }
                </div>
            </div>
        </div>
    </nav>
  )
}
