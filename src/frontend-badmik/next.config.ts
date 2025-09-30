


/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },


  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,

  
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
