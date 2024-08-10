/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Ensure static export is enabled
  basePath: '/budget-app', // Set this to the subpath of your GitHub Pages site
  assetPrefix: '/budget-app/', // Prefix for assets to ensure correct loading
}

export default nextConfig
