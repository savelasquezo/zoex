/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'zoexbet.com',
        port: '',
        pathname: '/media/**',
      },
    ],
  },
  //async rewrites() {
  //  if (process.env.NEXT_PUBLIC_DEBUG === 'False') {
  //    return [
  //      {
  //        source: '/api/auth/:path*',
  //        destination: '/src/app/api/auth/[...nextauth]/route.js',
  //      },
  //    ];
  //  }
  //  return [];
  //},
};

module.exports = nextConfig;

