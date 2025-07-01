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
    domains: ["i.ibb.co", "res.cloudinary.com", "lh3.googleusercontent.com"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname:process.env.NEXT_PUBLIC_API_BASE_URL ,
        // port: '443',
        pathname: '/uploadimage/**',
      },
    ],
  },
};

module.exports = nextConfig;
