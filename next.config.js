/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Ignore optional Socket.IO dependencies
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'bufferutil': false,
        'utf-8-validate': false,
      };
    }
    return config;
  },
  
}

module.exports = nextConfig
