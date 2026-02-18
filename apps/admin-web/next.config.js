/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@instituteos/ui", "@instituteos/shared-types"],
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "http://127.0.0.1:3001/api/:path*",
            },
        ];
    },
};

module.exports = nextConfig;
