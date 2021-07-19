module.exports = {
  lintOnSave: false,

  transpileDependencies: ["vuetify"],
};

module.exports = {
  // css: {
  //   loaderOptions: {
  //     scss: {
  //       additionalData: `
  // 				@import "~@/scss/variables.scss";
  //       		`,
  //     },
  //   },
  // },

  devServer: {
    overlay: {
      warnings: true,
      errors: true,
    },
  },

  transpileDependencies: ["vuetify"],
};
