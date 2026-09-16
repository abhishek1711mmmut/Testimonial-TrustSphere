/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  reactStrictMode: true,
  async rewrites() {
    const backend = process.env.NEXT_PUBLIC_FLASK_API_URL ||
      (process.env.NODE_ENV === "development" ? "http://127.0.0.1:5000" : "");
    if (!backend) {
      throw new Error("Set NEXT_PUBLIC_FLASK_API_URL to the Flask backend origin before building or starting Next.js.");
    }
    const url = new URL(backend);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password ||
        url.pathname !== '/' || url.search || url.hash) {
      throw new Error("NEXT_PUBLIC_FLASK_API_URL must be an HTTP(S) origin without credentials, a path, or a query.");
    }
    return [{ source: "/api/:path*", destination: `${url.origin}/api/:path*` }];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        // pathname: '/account123/**',
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
       {
        protocol: "https",
        hostname: "ui-avatars.com",
        port: "",
    },
    ],
  },
};

export default nextConfig;
