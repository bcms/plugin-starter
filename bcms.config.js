const {BCMSConfigBuilder} = require('@becomes/cms-bundler');

module.exports = BCMSConfigBuilder({
  database: {
    fs: 'bcms',
  },
  port: 1280,
  plugins: ['__local__:ember'],
  security: {
    jwt: {
      expireIn: 120000,
      issuer: 'localhost',
      secret: 'secret'
    }
  }
})