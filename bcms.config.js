const pluginName = 'hello---world';
process.env.VUE_APP_PLUGIN_NAME = pluginName;

module.exports = {
  port: parseInt(process.env.PORT, 10),
  jwt: {
    expireIn: parseInt(process.env.JWT_EXP_AFTER, 10),
    scope: process.env.JWT_SCOPE,
    secret: process.env.JWT_SECRET,
  },
  database: {
    prefix: process.env.DB_PRFX,
    fs: true,
  },
  plugins: [pluginName],
};
