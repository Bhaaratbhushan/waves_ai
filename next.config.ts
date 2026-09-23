import path from "node:path";
import type { NextConfig } from "next";

// Both settings carried over from the registration-page app, which hit the same problems.
const nextConfig: NextConfig = {
  // Root detection walks up looking for a lockfile and finds a stray
  // package-lock.json in the home directory, which it then warns about on
  // every dev start and build. Pin the root to this app instead.
  turbopack: {
    root: path.join(__dirname),
  },
  experimental: {
    /*
     * This project lives under OneDrive. Turbopack memory-maps its persistent
     * cache (the .sst files under .next), OneDrive dehydrates and re-validates
     * them underneath it, and the mmap then fails with os error 383 -- "the
     * cloud sync provider failed to validate the downloaded data" -- aborting
     * the dev server. Turning the disk cache off trades slower cold starts
     * for a server that stays up.
     */
    turbopackFileSystemCacheForDev: false,
    turbopackFileSystemCacheForBuild: false,
  },
};

export default nextConfig;
