require('module-alias/register');
const { createBcmsConfig } = require('@becomes/cms-backend');

const pluginName = 'hello---world';
process.env.VUE_APP_PLUGIN_NAME = pluginName;

module.exports = createBcmsConfig({
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 1280,
  jwt: {
    expireIn: process.env.JWT_EXP_AFTER
      ? parseInt(process.env.JWT_EXP_AFTER, 10)
      : 60000,
    scope: process.env.JWT_SCOPE || 'localhost',
    secret: process.env.JWT_SECRET || 'secret',
  },
  database: {
    prefix: process.env.DB_PRFX || 'bcms',
    fs: true,
  },
  plugins: [pluginName],
});
