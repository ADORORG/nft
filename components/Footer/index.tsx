import Image from "next/image"
import Link from "next/link"

type NavigationType = {name: string, href: string}
interface FooterType {
    name: string,
    logoUrl: string,
    resources: NavigationType[],
    legal: NavigationType[],
    followUs: NavigationType[],
    social: {[key:string]: string}
}

export default function Footer({footerNav}: {footerNav: FooterType}) {
    const {name, logoUrl, resources, legal, followUs, social} = footerNav

    /**
     * Construct links to other resource
     * @todo - How would I annotate LinkComponent to take 'a' tag and Link (next/link)?
     * @param items 
     * @param LinkComponent 
     * @returns 
     */
    const navItems = (items: NavigationType[], LinkComponent?: any) => items.map(({name, href}, i) => (
        <li className="mb-4" key={href+i}>
            <LinkComponent href={href} className="hover:underline text-lg lg:text-xl">{ name }</LinkComponent>
        </li>
    ))

    return (
        <footer className="bg-white dark:bg-gray-950 pt-20">
            <div className="container mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
                <div className="md:flex md:justify-between">
                    <div className="mb-6 md:mb-0">
                        <Link href="/" className="flex items-center">
                            <Image
                                className="h-10 lg:h-18 mr-1" 
                                src={logoUrl}
                                alt="Logo"
                                width={100}
                                height={100}
                            />
                            <span className="text-3xl font-semibold text-gray-950 dark:text-white">
                                { name }
                            </span>
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                        <div>
                            <h2 className="mb-6 text-sm lg:text-lg font-semibold text-gray-900 uppercase dark:text-white">Resources</h2>
                            <ul className="text-gray-600 dark:text-gray-400 font-medium">
                                { navItems(resources, Link) }
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm lg:text-lg font-semibold text-gray-900 uppercase dark:text-white">Follow us</h2>
                            <ul className="text-gray-600 dark:text-gray-400 font-medium">
                                { navItems(followUs, 'a') }
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm lg:text-lg font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
                            <ul className="text-gray-600 dark:text-gray-400 font-medium">
                                { navItems(legal, 'a') }
                            </ul>
                        </div>
                    </div>
                </div>
            <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
            <div className="sm:flex sm:items-center sm:justify-between">
                <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="/" className="hover:underline">{ name }™</a>. All Rights Reserved.
                </span>
                <div className="flex mt-4 space-x-6 sm:justify-center sm:mt-0">
                    <a href={social.twitter} className="dark:bg-gray-500">
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" version="1.1">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                        </svg>
                        <span className="sr-only">Twitter page</span>
                    </a>
                    <a href={social.github} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                        <span className="sr-only">GitHub account</span>
                    </a>
                </div>
            </div>
            </div>
        </footer>
    )
}