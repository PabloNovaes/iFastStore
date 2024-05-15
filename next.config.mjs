/** @type {import('next').NextConfig} */
const nextConfig = {
    logging: {
        fetches: {
            fullUrl: true
        }
    },
    images: {
        remotePatterns: [
            { hostname: 'files.stripe.com' },
            { hostname: 'firebasestorage.googleapis.com' },
            { hostname: 'img.clerk.com' }
        ]
    }
};

export default nextConfig;
