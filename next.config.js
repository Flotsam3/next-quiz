/** @type {import('next').NextConfig} */
const nextConfig = {
   webpack: (config, { isServer }) => {
      // Add a rule to handle MP3 files (mpn i file-loader needed)
      config.module.rules.push({
         test: /\.(mp3)$/,
         use: {
            loader: "file-loader",
            options: {
               publicPath: "/_next/",
               name: "static/media/[name].[hash].[ext]",
            },
         },
      });

      // If you are using server-side rendering (SSR)
      if (isServer) {
         // Fixes npm packages that depend on `fs` module
         config.externals.push({ fs: "empty" });
      }

      return config;
   },
};

module.exports = nextConfig;
