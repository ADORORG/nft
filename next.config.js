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
}

module.exports = nextConfig
