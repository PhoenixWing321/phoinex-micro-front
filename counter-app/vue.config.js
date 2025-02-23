const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  chainWebpack: config => {
    config.module
      .rule('ts')
      .use('ts-loader')
      .tap(options => {
        return {
          ...options,
          appendTsSuffixTo: [/\.vue$/],
          transpileOnly: true
        }
      })
  }
}) 