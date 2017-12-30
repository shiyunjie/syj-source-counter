'use strict';

/**
 * Created by shiyunjie on 2017/12/30.
 */
var util = require('../index');

function main() {
  //const result = await util.countFileRows('app', { dot: false }, ['update.ts']);
  util.default.countFileRows('app').then(function (res) {
    console.log(res);
  });
  //util.default.countPackageRequire('app').then(
  //  function (res) {
  //    console.log(res)
  //  }
  //)
}

main();