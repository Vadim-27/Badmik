import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   reactStrictMode: true,
  swcMinify: true,
  //  output: "export",
  trailingSlash: true, 
  images: {
    unoptimized: true, 
  },
};

export default nextConfig;
