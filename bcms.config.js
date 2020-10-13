const { BCMSConfigBuilder } = require('@becomes/cms-bundler');

module.exports = BCMSConfigBuilder({
  backend: {
    port: 1282,
    security: {
      jwt: {
        issuer: 'localhost',
        secret: 'secret',
      },
    },
    database: {
      // fs: 'bcms',
      mongodb: {
        selfHosted: {
          host: 'localhost',
          port: 27017,
          name: 'test',
          user: 'test',
          password: 'test1234',
          prefix: 'bcms',
        },
      },
    },
  },
  plugins: [
    {
      name: 'my-awesome-plugin',
      frontend: {
        displayName: 'My Awesome Plugin',
      },
    },
  ],
});
