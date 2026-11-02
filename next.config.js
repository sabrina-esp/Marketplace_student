/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [{
      source: '/api/:path*',
      headers: [{ key: 'Cache-Control', value: 'private, no-store, max-age=0' }],
    }, ...['/manifest.json', '/sw.js'].map((source) => ({
      source,
      headers: [{ key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' }],
    }))];
  },
}

module.exports = nextConfig
