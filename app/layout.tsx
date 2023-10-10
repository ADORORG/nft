import "@/globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import WalletAuthWrapper from "@/components/AuthWrapper"
import NextAuthSessionProvider from "@/components/NextAuthSession"
import SWRProvider from "@/components/SWRProvider"
import WagmiProvider from "@/components/WagmiProvider"
import AdminWrapper from "@/components/AdminWrapper"
import TermsOfServiceWrapper from "@/components/TermsOfServiceWrapper"
import WalletConnectWrapper from "@/components/WalletConnectWrapper"
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
      name: "Geneva",
      href: externalLinks.geneva
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
    github: externalLinks.github,
  }
}

export const topNav = {
  name: AppInfo.name,
  logoUrl: AppInfo.logoUrl,
  navLink: [
    /* {
      name: "Explore",
      href: appRoutes.explore
    }, */
    {
      name: "Events",
      href: appRoutes.events
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
      <body className={`min-h-full text-gray-950 bg-gray-50 dark:text-gray-50 dark:bg-gray-950 ${changa.className}`}>
        <TermsOfServiceWrapper />
        <Toaster 
          toastOptions={{
            duration: 5000,
            className: "bg-neutral-950 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-950",
          }}
        />
        <SWRProvider>
          <WagmiProvider>
          <NextAuthSessionProvider>
            <WalletConnectWrapper>
              <WalletAuthWrapper>
                <AdminWrapper>
                  <Navbar topNav={topNav} />
                  <div className="min-h-[400px] bg-gray-0 dark:bg-gray-950">
                    {children}
                  </div>
                  <Footer footerNav={footerNav} />
                </AdminWrapper>
              </WalletAuthWrapper>
            </WalletConnectWrapper>
          </NextAuthSessionProvider>
        </WagmiProvider>
        </SWRProvider>
      </body>
    </html>
  )
}
