/**
 * Created by shiyunjie on 17/12/8.
 */

require('babel-register')({
  presets: [
    ["env",{
    targets: {
      node: "current"
    }
  }]
  ],
  plugins: [
    "transform-runtime"
  ]
});
require('./babelTra.js');