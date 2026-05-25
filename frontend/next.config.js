/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
};

module.exports = nextConfig;

// Environment variables
// env: {
//   NEXT_PUBLIC_API_URL:
//     process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
// },
