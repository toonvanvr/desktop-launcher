// vue.config.js
module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      externals: ['ffi-napi', 'ref-napi'],
    },
  },
}
