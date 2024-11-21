/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        optimizeFonts: false,
        optimizeImages: false,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    // Add CORS headers
    async headers() {
        return [
            {
                // matching all API routes
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: "*" }, // Replace with your domain in production
                    { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
                    { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" },
                ]
            }
        ];
    },
    // Add API proxy for development
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${process.env.NEXT_PUBLIC_BASE_URL}/:path*`
            }
        ];
    },
    // Optional: Add image domains if you're using next/image
    images: {
        domains: ['https://ondcpreprod.nazarasdk.com'], // Add domains you want to load images from
    },
    // Optional: Add webpack config if needed
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        // Add your custom webpack config here
        return config;
    },
}

export default nextConfig;