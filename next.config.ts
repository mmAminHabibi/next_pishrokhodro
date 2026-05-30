import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    // turbopack: { root: __dirname }, // << غیرفعال شد
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cms.vidatrucks.com",
                pathname: "/**",
            },
        ],
        unoptimized: true, // جلوگیری از نوشتن cache تصاویر
    },
    webpack: (config, { isServer }) => {
        if (isServer) {
            config.externals = config.externals || [];
            config.externals.push({
                canvas: 'commonjs canvas'
            });
        }
        return config;
    },
};

export default nextConfig;
