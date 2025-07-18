/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // ✅ Required for Docker production deployment

  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/otplogin",
        permanent: false,
      },
    ];
  },

  images: {
    domains: [
      "i.ibb.co",
      "res.cloudinary.com",
      "lh3.googleusercontent.com",
      "adorable-gentleness-production.up.railway.app"
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/^https?:\/\//, ''),
        pathname: '/uploadimage/**',
      },
    ],
  },
};

module.exports = nextConfig;
