/** @type {import('next').NextConfig} */
const { withExpo } = require("@expo/next-adapter");
const withImages = require("next-images");
const nextConfig = {};

module.exports = module.exports = withExpo(
  withImages({
    experimental: {
      forceSwcTransforms: true,
    },
    output: "standalone",
    poweredByHeader: false,
    reactStrictMode: false,
    swcMinify: true,
    trailingSlash: false,
    transpilePackages: [
      "react-native",
      "expo",
      // Add more React Native/Expo packages here...
    ],
    async headers() {
      return [
        {
          source: "/:path*",
          headers: [
            {
              key: "Referrer-Policy",
              // ? "no-referrer" deals with 403 err from using google PFP of users.
              value: "no-referrer",
            },
          ],
        },
      ];
    },
    webpack: (config, options) => {
      const { isServer } = options;

      if (!isServer) {
        config.externals = [
          // ! FOR ERR "Module not found: Can't resolve 'utf-8-validate'"
          {
            "utf-8-validate": "commonjs utf-8-validate",
            bufferutil: "commonjs bufferutil",
          },
        ];
        config.resolve.fallback = { fs: false, tls: false, net: false };
      }

      return config;
    },
  })
);
