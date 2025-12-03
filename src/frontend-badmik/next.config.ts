


/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';


const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },


  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
   turbopack: { rules: { "*.svg": { loaders: ["@svgr/webpack"], as: "*.js" } } },
  webpack: (config: any) => {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },

  
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
