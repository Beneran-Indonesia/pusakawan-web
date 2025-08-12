/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: () => [
    {
      source: '/program/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-store',
        },
      ],
    },
  ],
  reactStrictMode: true,
  swcMinify: true,
  modularizeImports: {
    "@mui/material": {
      transform: "@mui/material/{{member}}",
    },
    "@mui/icons-material": {
      transform: "@mui/icons-material/{{member}}",
    },
    "@mui/styles": {
      transform: "@mui/styles/{{member}}",
    },
    "@mui/lab": {
      transform: "@mui/lab/{{member}}",
    },
  },
  i18n: {
    locales: ['en', 'id'],
    defaultLocale: 'id'
  },
  images: {
    remotePatterns: [{
      protocol: 'https',
      // Can we use ENV here? split BUCKET_URL https:// [1]
      hostname: 'pusaka-api-bucket-dev.s3.ap-southeast-1.amazonaws.com',
      port: '',
      pathname: '/media/**'
    }, {
      protocol: 'https',
      hostname: 'source.unsplash.com',
      port: '',
      pathname: '/**'
    },
    {
      protocol: 'https',
      // Can we use ENV here? split BUCKET_URL https:// [1]
      hostname: 'pusaka-api-bucket-dev.s3.amazonaws.com',
      port: '',
      pathname: '/media/**'
    }, ],
  },
};

module.exports = nextConfig;
