/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public'
})

const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'assets.coingecko.com',
            port: '',
            pathname: '/coins/**',
          },
        ],
      },
      async headers() {
        return [
            {
                source: '/(.*)?', // Matches all pages
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: '*',
                    }
                ]
            }
        ]
    }  
}

module.exports = withPWA(nextConfig)
