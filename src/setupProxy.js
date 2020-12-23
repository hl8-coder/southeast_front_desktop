const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    "/api",
    proxy({
      target: "http://127.0.0.1:8000",
      changeOrigin: true
    })
  );
  app.use(
    "/iojs",
    proxy({
      target: "https://ci-first.iovation.com",
      changeOrigin: true,
      pathRewrite: {
        "^/iojs": "/"
      }
    })
  );
};