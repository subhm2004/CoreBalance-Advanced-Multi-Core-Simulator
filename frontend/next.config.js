/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /**
   * Dev-only hardening against "Cannot find module './682.js'" and missing vendor-chunks:
   * - disable persistent webpack cache (stale chunk graph)
   * - disable server splitChunks so the server bundle is not split into numbered chunks that can desync
   */
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      config.cache = false
      if (isServer) {
        config.optimization = {
          ...config.optimization,
          splitChunks: false,
          runtimeChunk: undefined,
        }
      }
    }
    return config
  },
}

module.exports = nextConfig
