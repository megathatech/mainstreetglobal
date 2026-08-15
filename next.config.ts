import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // WP URLs pakai trailing slash (mis. /mainstreet-global/)
  // ini WAJIB biar URL sama persis, nggak dianggap konten baru sama Google
  trailingSlash: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  // Tempat nambahin redirect 301 kalau ada slug lama yang beda dari slug baru
  async redirects() {
    return [
      // contoh:
      // { source: "/old-slug", destination: "/new-slug", permanent: true },
    ];
  },
};

export default nextConfig;
