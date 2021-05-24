const bcmsConfig = require('./bcms.config.js');

module.exports = {
  lintOnSave: false,
  publicPath: `/plugin/${process.env.VUE_APP_PLUGIN_NAME}/`,
};
