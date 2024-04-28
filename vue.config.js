const { defineConfig } = require('@vue/cli-service');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const cdn = {
  css: [
    '//unpkg.com/element-plus@2.6.3/theme-chalk/dark/css-vars.css',
    '//unpkg.com/element-plus@2.6.3/dist/index.css'
  ],
  js: [
    '//unpkg.com/vue@3.2.13/dist/vue.global.prod.js',
    '//unpkg.com/element-plus@2.6.3/dist/index.full.min.js',
    // '//unpkg.com/three@0.163.0/build/three.module.min.js'
  ]
};

const isProduction = process.env.NODE_ENV === 'production'

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  configureWebpack: {
    // externals: {
    //   vue: 'Vue',
    //   'element-plus': 'ElementPlus'
    //   // three: '* as THREE'
    // },
    plugins: [
      // 按需引入
      // AutoImport({
      //   resolvers: [ElementPlusResolver()]
      // }),
      // Components({
      //   resolvers: [ElementPlusResolver()]
      // }),
      // 打包体积分析
      // new BundleAnalyzerPlugin({
      //   analyzerMode: 'server',
      //   analyzerHost: '127.0.0.1',
      //   analyzerPort: 8889,
      //   reportFilename: 'report.html',
      //   defaultSizes: 'parsed',
      //   openAnalyzer: true,
      //   generateStatsFile: false,
      //   statsFilename: 'stats.json',
      //   statsOptions: null,
      //   logLevel: 'info'
      // })
    ]
  },
  // pages: {
  //   index: {
  //     entry: 'src/main.js',
  //     template: 'public/index.html',
  //     filename: 'index.html',
  //     cdn: cdn
  //   }
  // }
  // chainWebpack: (config) => {
  //   if (isProduction) {
  //     config.plugin('html').tap((args) => {
  //       args[0].cdn = cdn;
  //       return args;
  //     });
  //   }
  // }
});
