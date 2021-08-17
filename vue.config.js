const pluginName = process.env.VUE_APP_PLUGIN_NAME;

module.exports = {
  lintOnSave: false,
  publicPath: `/plugin/${pluginName}/`,
};
