import "@/globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import AuthWrapper from "@/components/AuthWrapper"
import NextAuthSessionProvider from "@/components/NextAuthSession"
import myWagmiConfig from "@/web3.config"
import { Toaster } from "react-hot-toast"
import { Changa/* , Inconsolata */ } from "next/font/google"
import { AppInfo } from "@/lib/app.config"
import { WagmiConfig } from "wagmi"
import { ConnectWalletContextWrapper } from "@/components/ConnectWallet"

const changa = Changa(
  { subsets: ["latin"],
    display: "swap",
    variable: "--font-changa"
})

/* const inconsolata = Inconsolata(
  { subsets: ["latin"],
    display: "swap",
    variable: "--font-inconsolata"
}) */

export const metadata = {
  title: AppInfo.name,
  description: AppInfo.description,
}

export const footerNav = {
  name: AppInfo.name,
  logoUrl: AppInfo.logoUrl,
  resources: [
    {
      name: "Marketplace",
      href: "/marketplace",
    },
    {
      name: "Explore",
      href: "/explore",
    },
    {
      name: "Create",
      href: "/create",
    },
    {
      name: "Import",
      href: "/import",
    },
  ],
  followUs: [
    {
      name: "Twitter",
      href: "#"
    },
    {
      name: "Discord Server",
      href: "#"
    },
    {
      name: "Telegram",
      href: "#"
    }
  ],
  legal: [
    {
      name: "Privacy Policy",
      href: "#"
    },
    {
      name: "Terms & Conditions",
      href: "#"
    }
  ],
  social: {
    twitter: "#",
    facebook: "#",
    instagram: "#",
    github: "#",
    dribbble: "#",
  }
}

export const topNav = {
  name: AppInfo.name,
  logoUrl: AppInfo.logoUrl,
  navLink: [
    {
      name: "Explore",
      href: "#"
    },
    {
      name: "Marketplace",
      href: "#"
    },
    {
      name: "Create",
      href: "#"
    },
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (    
    <html lang="en">
      <body className={`min-h-full ${changa.className}`}>
        <Toaster 
          toastOptions={{
            duration: 5000,
            className: "bg-gray-900 text-gray-100 dark:bg-gray-100 dark:text-gray-900",
          }}
        />
        <WagmiConfig config={myWagmiConfig}>
          <NextAuthSessionProvider>
            <ConnectWalletContextWrapper>
              <AuthWrapper>
                <Navbar topNav={topNav} />
                {children}
                <Footer footerNav={footerNav} />
              </AuthWrapper>
            </ConnectWalletContextWrapper>
          </NextAuthSessionProvider>
        </WagmiConfig>
      </body>
    </html>
  )
}
