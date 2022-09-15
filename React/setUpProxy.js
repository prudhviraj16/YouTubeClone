const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = app => {
    app.use(
        createProxyMiddleware("/users/signin",{
            target : "http://localhost:4000/api",
            changeOrigin : true
        })
    )

    app.use(
        createProxyMiddleware("/videos/random",{
            target : "http://localhost:4000/api",
            changeOrigin : true
        })
    )
}