/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        port: "",
        pathname: "/**",
      },
    ],
    domains: ["cdn.coin68.com", "encrypted-tbn0.gstatic.com"],
  },
};

export default nextConfig;
