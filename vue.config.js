const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: [
        /node_modules[/\\\\](axios|compression-webpack-plugin|core-js|echarts|electron|element-ui|extend|jquery|js-base64|qs|terser-webpack-plugin|vue|vue-drag-resize|vue-router|vue-seamless-scroll|sockjs-client)[/\\\\]/,
    ],
    devServer: {
        port: 8071,
        open: true, //配置自动启动浏览器
        proxy: {
            "/proxyServer1": {
                // target: "http://zwfw.sd.gov.cn/", //代理服务server1
                target: "https://tftb.sczwfw.gov.cn:8085/", //代理服务server1
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    "^/proxyServer1": ""
                }
            },
            "/proxyServer2": {
                target: "http://192.168.85.14:9001/jmas-api-gateway-server/", //代理服务server2
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    "^/proxyServer2": ""
                }
            }
        }
    },
    publicPath: "./"
})