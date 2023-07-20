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
}

module.exports = nextConfig
