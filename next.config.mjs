/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
    serverComponentsExternalPackages: ['pdf-parse', '@langchain/community'],
  },

  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
