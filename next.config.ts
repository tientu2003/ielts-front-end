import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental:{
    optimizePackageImports: ["@chakra-ui/react"],
    ppr: 'incremental',
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's4-media1.study4.com',
        port: '',
        pathname: '/**',
        search: '',
      },
    ],
  },

};

export default nextConfig;
