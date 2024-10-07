// webpack.config.js
module.exports = {
    externals: {
      nock: 'commonjs nock'  // Prevents 'nock' from being included in the browser bundle
    },
  };
  