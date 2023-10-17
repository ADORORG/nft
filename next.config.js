/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            // development
            {
                protocol: "http",
                hostname: "localhost",
                port: "3000",
            },

            // stage or production
            {
                protocol: "https",
                hostname: "ipfs.io",
                port: "",
                pathname: "/ipfs"
            }
        ]
    },
    reactStrictMode: true,
    webpack: config => {
        config.resolve.fallback = { fs: false, net: false, tls: false };
        config.externals.push('pino-pretty', 'lokijs', 'encoding');
        return config;
    },

    async redirects() {
        return [
            {
                /*
                * Marketplace is paginated, like 
                * /marketplace/1, /marketplace/2
                * An attempt to visit /marketplace will result in an arrow.
                * Hence, we redirect /marketplace to /marketplace/1 default page
                */
                source: '/marketplace',
                destination: '/marketplace/1',
                permanent: false,
            },
            {
                source: '/events',
                destination: '/events/minting_now',
                permanent: true
            },
            {
                source: '/collection/:slug',
                destination: '/collection/:slug/1',
                permanent: false
            },
            {
                source: '/account/:address',
                destination: '/account/:address/token/1',
                permanent: false
            },
            {
                source: '/account/:address/token',
                destination: '/account/:address/token/1',
                permanent: false
            },
            {
                source: '/account/:address/collection',
                destination: '/account/:address/collection/1',
                permanent: false
            },
            {
                source: '/account/:address/marketplace',
                destination: '/account/:address/marketplace/1',
                permanent: false
            },
            {
                source: '/account/:address/contract',
                destination: '/account/:address/contract/1',
                permanent: false
            },
            {
                source: '/account/:address/event',
                destination: '/account/:address/event/1',
                permanent: false
            },
            {
                source: '/profile',
                destination: '/profile/view',
                permanent: false
            },
        ]
    },

    /* 
    * Reference env variables here.
    * This is required if running on AWS Amplify
    */
    env: {
        DB_HOST: process.env.DB_HOST,
        
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        
        PINATA_API_KEY: process.env.PINATA_API_KEY,
        PINATA_API_SECRET: process.env.PINATA_API_SECRET,
        PINATA_JWT: process.env.PINATA_JWT,
        
        EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD,
        EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER,
        EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST,
        EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT,
        EMAIL_FROM: process.env.EMAIL_FROM,
        
        NEXT_PUBLIC_PINATA_GATEWAY: process.env.NEXT_PUBLIC_PINATA_GATEWAY,
        NEXT_PUBLIC_CONTRACT_BASE_URI: process.env.NEXT_PUBLIC_CONTRACT_BASE_URI,
        NEXT_PUBLIC_ALCHEMY_ID: process.env.NEXT_PUBLIC_ALCHEMY_ID,
        NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
        
    }
}

module.exports = nextConfig
