/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.leetcode.com",
      },
      {
        protocol: "https",
        hostname: "images.chess.com",
      },
      {
        protocol: "https",
        hostname: "images.chesscomfiles.com",
      },
    ],
  },
};

module.exports = nextConfig;
