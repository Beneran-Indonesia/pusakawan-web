/** @type {import('next').NextConfig} */
const nextConfig = {
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
    domains: ["source.unsplash.com"]
  }
};

module.exports = nextConfig;


module.exports = nextConfig
