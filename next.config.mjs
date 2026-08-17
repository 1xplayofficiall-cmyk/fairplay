/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [75, 100],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "fair-play.co",
          },
        ],
        destination: "https://www.fair-play.co/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
