/**
 * Created by shiyunjie on 2017/12/30.
 */
const util = require('../index')

function main() {
  //const result = await util.countFileRows('app', { dot: false }, ['update.ts']);
  util.default.countFileRows({ patternInput: 'app' }).then(
    function (res) {
      console.log(res)
    }
  )
  //util.default.countPackageRequire('app').then(
  //  function (res) {
  //    console.log(res)
  //  }
  //)
}

main();