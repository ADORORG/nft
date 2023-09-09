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
    experimental: {
        appDir: true,
    },
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
                permanent: true,
            },
            {
                source: '/events',
                destination: '/events/minting_now',
                permanent: true
            }
        ]
    },
}

module.exports = nextConfig
