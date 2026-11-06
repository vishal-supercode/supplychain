import type { NextConfig } from 'next';
// Isolate this workspace from older Next dev processes still using .next.
const nextConfig: NextConfig = { distDir: '.next-supplychain' };
export default nextConfig;
