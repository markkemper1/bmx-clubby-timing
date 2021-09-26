module.exports = {
  webpack: {
    configure: {
      target: "electron-renderer",
      optimization: {
        runtimeChunk: false,
        splitChunks: {
          chunks(chunk) {
            return false;
          },
        },
      },
    },
  },
};
