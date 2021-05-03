module.exports = {
  outputDir: process.env.VUE_APP_OUTPUT || './dist',
  transpileDependencies: ['vuetify'],
  devServer: {
    proxy: {
      '/api': {
        target: process.env.PROXY
          ? `${process.env.PROXY}/api`
          : 'http://localhost:3000/api',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/image': {
        target: process.env.PROXY
          ? `${process.env.PROXY}/image`
          : 'http://localhost:3000/image',
        changeOrigin: true,
        pathRewrite: {
          '^/image': ''
        }
      }
    }
  },
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = "CTC - Calidad Turismo Comunitario";
        return args;
      })
  }
}
