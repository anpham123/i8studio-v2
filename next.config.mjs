import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [],
  },
  experimental: {
    serverComponentsExternalPackages: ["sharp"],
    serverActions: {
      bodySizeLimit: "500mb",
    },
  },
  webpack: (config) => {
    // pdfjs-dist tries to require 'canvas' for server-side rendering; alias it
    // to false so webpack doesn't fail when bundling the client component.
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default withNextIntl(nextConfig);
