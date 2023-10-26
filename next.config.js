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

    async rewrites() {
        return [
            {
                source: '/marketplace',
                destination: '/marketplace/1',
            },
            {
                source: '/collection/:slug',
                destination: '/collection/:slug/1',
            },
            {
                source: '/account/:address',
                destination: '/account/:address/token/1',
            },
            {
                source: '/account/:address/token',
                destination: '/account/:address/token/1',
            },
            {
                source: '/account/:address/collection',
                destination: '/account/:address/collection/1',
            },
            {
                source: '/account/:address/marketplace',
                destination: '/account/:address/marketplace/1',
            },
            {
                source: '/account/:address/contract',
                destination: '/account/:address/contract/1',
            },
            {
                source: '/account/:address/event',
                destination: '/account/:address/event/1',
            }, 
        ]
    },

    async redirects() {
        return [
            {
                source: '/events',
                destination: '/events/minting_now',
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
