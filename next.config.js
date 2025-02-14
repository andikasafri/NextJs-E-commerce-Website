/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    // Add fallback for browser-specific globals
    config.resolve.fallback = {
      ...config.resolve.fallback,
      self: false,
      window: false,
      global: false,
    };

    // Optimize chunk splitting for static export
    config.optimization.splitChunks = {
      chunks: "async",
      minSize: 20000,
      maxSize: 244000,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
      },
    };

    return config;
  },
};

module.exports = nextConfig;
