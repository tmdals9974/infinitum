module.exports = {
  lintOnSave: false,

  transpileDependencies: ["vuetify"],
};

module.exports = {
  css: {
    loaderOptions: {
      scss: {
        additionalData: `
					@import "~@/assets/scss/_variables.scss";
        		`,
      },
    },
  },

  devServer: {
    overlay: {
      warnings: true,
      errors: true,
    },
  },

  transpileDependencies: ["vuetify"],
};
