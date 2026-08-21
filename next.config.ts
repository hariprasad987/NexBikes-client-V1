import path from "node:path";

import type { NextConfig } from "next";

const sassToolsPath = path.join(process.cwd(), "src/styles/tools").replaceAll("\\", "/");

const nextConfig: NextConfig = {
  // Permit the browser-facing workspace addresses so client chunks and HMR
  // use a stable WebSocket connection during remote development.
  allowedDevOrigins: ["127.0.0.1", "172.17.0.120", "172.17.7.120"],
  sassOptions: {
    additionalData: `@use "${sassToolsPath}" as *;`,
  },
  typedRoutes: true,
};

export default nextConfig;
