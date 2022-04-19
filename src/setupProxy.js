const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/v3.asmx/',
    createProxyMiddleware({
      target: 'https://brickset.com',
      changeOrigin: true,
    })
  );
};