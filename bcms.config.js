const {BCMSConfigBuilder} = require('@becomes/cms-bundler');

module.exports = BCMSConfigBuilder({
  database: {
    fs: 'bcms',
  },
  port: 1280,
  plugins: ['ember'],
  security: {
    jwt: {
      expireIn: 120000,
      issuer: 'localhost',
      secret: 'secret'
    }
  }
})