import type { NextConfig } from "next";
import packageJson from './package.json';
import {execSync} from 'child_process';

const gitHash = execSync('git rev-parse --short HEAD').toString().trim()

const nextConfig: NextConfig = {
  // output: 'export',
  images: {
    unoptimized: true,
  },
  env: {
    APP_VERSION: `${packageJson.version}-${gitHash}`,
  },
};

export default nextConfig;
