import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  /* config options here */
   reactStrictMode: true,
  // swcMinify: true,
  //  output: "export",
  trailingSlash: true, 
  images: {
    unoptimized: true, 
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);

// export default nextConfig;
