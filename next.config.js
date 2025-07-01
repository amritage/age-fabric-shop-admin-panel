/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: false,
      },
    ];
  },
  images: {
    domains: [
      "i.ibb.co",
      "res.cloudinary.com",
      "lh3.googleusercontent.com",
      "fabric-shop-backend-production.up.railway.app"
    ],
    remotePatterns: [
      {
        protocol: 'https',
        // hostname: 'newshopy-production.up.railway.app',
        hostname: process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/^https?:\/\//, ''),
        pathname: '/uploadimage/**',
      },
      // You can add more remotePatterns here if needed
    ],
  },
};

module.exports = nextConfig;
