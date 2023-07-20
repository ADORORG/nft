"use client"
import Image from "next/image"
import Link from "next/link"
import { ConnectWalletButton, NetworkChainSelect } from "@/components/ConnectWallet"
import { useState } from "react"
import { Bars3BottomRightIcon, XMarkIcon, MagnifyingGlassIcon as SearchIcon } from "@heroicons/react/24/outline"

type NavigationType = {name: string, href: string}
interface TopNavType {
    name: string,
    logoUrl: string,
    navLink: NavigationType[]
}

export default function Navbar({ topNav }:{ topNav: TopNavType }) {
  const [isOpen, setIsOpen] = useState(false)
  const {name, logoUrl, navLink} = topNav

  return (
    <nav className="relative bg-white shadow dark:bg-gray-950">
        <div className="container px-4 py-4 mx-auto">
            <div className="lg:flex lg:items-center lg:justify-evenly lg:p-2">
                <div className="flex items-center justify-between">
                    <div className="p-4 justify-start items-center inline-flex">
                        <a href="#">
                            <Image 
                                className="w-auto h-20" 
                                src={logoUrl}
                                alt="Logo"
                                width={200}
                                height={200}
                            />
                        </a>
                        <div className="text-center dark:text-white text-gray-900 text-3xl font-semibold tracking-wide">{ name }</div>
                    </div>
                    {/* <!-- Mobile menu button --> */}
                    <div className="flex lg:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} type="button" className="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400" aria-label="toggle menu">
                          {
                            isOpen ? 
                            <XMarkIcon className="w-6 h-6" /> : 
                            <Bars3BottomRightIcon className="w-6 h-6" />
                          }
                        </button>
                    </div>
                </div>
                
                {/* Mobile Menu open: "block", Menu closed: "hidden" */}
                <div className={`${isOpen ? "translate-x-0 opacity-100" : "opacity-0 -translate-x-full"} absolute inset-x-0 z-20 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-white dark:bg-gray-950 lg:mt-0 lg:p-0 lg:top-0 lg:relative lg:bg-transparent lg:w-auto lg:opacity-100 lg:translate-x-0 lg:flex lg:flex-1 lg:items-center lg:justify-end`}>
                    
                  <div className="lg:flex-auto relative lg:ml-10 mt-4 md:mt-0">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <SearchIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                      </span>
                      <input type="text" className="w-full md:w-5/6 lg:2/3 py-2 pl-10 pr-4 text-gray-800 bg-white border rounded dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-none dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300" placeholder="Search items, collections, accounts" />
                  </div>

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
                    <NetworkChainSelect />
                  </div>
                  
                  <div className="lg:ml-4 mt-4 lg:mt-0">
                    <ConnectWalletButton />
                  </div>
                </div>
            </div>
        </div>
    </nav>
  )
}
