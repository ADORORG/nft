import "@/globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import WalletAuthWrapper from "@/components/AuthWrapper"
import NextAuthSessionProvider from "@/components/NextAuthSession"
import SWRProvider from "@/components/SWRProvider"
import WagmiProvider from "@/components/WagmiProvider"
import AdminWrapper from "@/components/AdminWrapper"
import TermsOfServiceWrapper from "@/components/TermsOfServiceWrapper"
import { ConnectWalletContextWrapper } from "@/components/ConnectWallet"
import { AppInfo } from "@/lib/app.config"
import { Toaster } from "react-hot-toast"
import { Changa/* , Inconsolata */ } from "next/font/google"
import appRoutes from "@/config/app.route"
import externalLinks from "@/config/social.link"

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
      href: appRoutes.marketplace,
    },
    {
      name: "Explore",
      href: appRoutes.explore,
    },
    {
      name: "Create",
      href: appRoutes.create,
    },
    {
      name: "Import",
      href: appRoutes.import
    },
  ],
  followUs: [
    {
      name: "Twitter",
      href: externalLinks.twitter
    },
    {
      name: "Discord Server",
      href: externalLinks.discord
    },
    {
      name: "Telegram",
      href: externalLinks.telegram
    }
  ],
  legal: [
    {
      name: "Privacy Policy",
      href: appRoutes.privacyPolicy,
    },
    {
      name: "Terms & Conditions",
      href: appRoutes.termsOfService
    }
  ],
  social: {
    twitter: externalLinks.twitter,
    facebook: externalLinks.facebook,
    github: externalLinks.github,
    instagram: externalLinks.instagram
  }
}

export const topNav = {
  name: AppInfo.name,
  logoUrl: AppInfo.logoUrl,
  navLink: [
    {
      name: "Explore",
      href: appRoutes.explore
    },
    {
      name: "Marketplace",
      href: appRoutes.marketplace
    },
    {
      name: "Create",
      href: appRoutes.create
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
        <TermsOfServiceWrapper />
        <Toaster 
          toastOptions={{
            duration: 5000,
            className: "bg-gray-900 text-gray-100 dark:bg-gray-100 dark:text-gray-900",
          }}
        />
        <SWRProvider>
          <WagmiProvider>
          <NextAuthSessionProvider>
            <ConnectWalletContextWrapper>
              <WalletAuthWrapper>
                <AdminWrapper>
                  <Navbar topNav={topNav} />
                  {children}
                  <Footer footerNav={footerNav} />
                </AdminWrapper>
              </WalletAuthWrapper>
            </ConnectWalletContextWrapper>
          </NextAuthSessionProvider>
        </WagmiProvider>
        </SWRProvider>
      </body>
    </html>
  )
}
