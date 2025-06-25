/** @type {import('next').NextConfig} */
const nextConfig = {
      images: {
    remotePatterns: [new URL('https://demo.dentzobd.com/backendAssets/teeth/**')],
  },
};

export default nextConfig;
