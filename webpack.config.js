const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
            pure_getters: true,
            unsafe: false,
            unsafe_comps: false,
          },
          mangle: {
            reserved: ['$', 'jQuery'],
            toplevel: true,
          },
          output: {
            comments: false,
            beautify: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: [
              ['@babel/plugin-transform-runtime', { regenerator: true }],
              // Remove console statements during build
              ['transform-remove-console', { exclude: ['error', 'warn'] }],
            ],
          },
        },
      },
    ],
  },
}; 