/** @type {import('next').NextConfig} */
const nextConfig = {
    logging: {
        fetches: {
            fullUrl: true
        }
    },
    images: {
        remotePatterns: [
            { hostname: 'files.stripe.com' }
        ]
    }
};

export default nextConfig;
