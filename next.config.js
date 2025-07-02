/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.guns.com'],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/mainpage',
        permanent: true, // set to false if it's temporary
      },
    ];
  },
};

module.exports = nextConfig;
