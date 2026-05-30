/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cms.vidatrucks.com",
                pathname: "/**",
            },
        ],
        unoptimized: true,
    },
};

module.exports = nextConfig;
