import path from 'node:path';
import type { NextConfig } from 'next';

const isStatic = process.env.NEXT_BUILD_TARGET === 'static';
const basePath = isStatic ? '/a-real-estate-law' : '';

const nextConfig: NextConfig = {
  ...(isStatic
    ? {
        output: 'export' as const,
        basePath,
        assetPrefix: basePath,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
  serverExternalPackages: ['pdf-parse'],
};

export default nextConfig;
