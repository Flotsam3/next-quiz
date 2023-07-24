/** @type {import('next').NextConfig} */
const nextConfig = {
   webpack: (config, { isServer }) => {
      // Add a rule to handle MP3 files
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

      // For server-side rendering of the audio file
      if (!isServer) {
         config.node = {
            fs: "empty",
         };
      }

      return config;
   },
};

module.exports = nextConfig;
