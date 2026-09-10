import path from "node:path";

import type { NextConfig } from "next";

const sassToolsPath = path.join(process.cwd(), "src/styles/tools").replaceAll("\\", "/");

const nextConfig: NextConfig = {
  // Comma-separated hostnames only, without a protocol or port.
  allowedDevOrigins: (process.env.ALLOWED_DEV_ORIGINS ?? "")
    .split(",")
    .map((hostname) => hostname.trim())
    .filter(Boolean),
  sassOptions: {
    additionalData: `@use "${sassToolsPath}" as *;`,
  },
  experimental: {
    useTypeScriptCli: false,
  },
  typedRoutes: true,
};

export default nextConfig;
