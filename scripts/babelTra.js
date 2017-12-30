/**
 * Created by shiyunjie on 17/11/30.
 */
import "babel-polyfill";

import fs from 'fs-extra';
import * as babel from 'babel-core';
import glob from "glob";
const success = 1

const main = async () => {
  const removeResult = await remove('app');

  if (removeResult === success) {
    const travelResut = await travel('src', 'app', 'app/**/*.js');
    if (travelResut === success) {
      console.log('success!')
    } else {
      console.error(travelResut);
    }
  } else {
    console.error(removeResult);
  }
}

const remove = (fileName) => {
  return new Promise((resolve, reject) => {
    fs.remove(fileName, err => {
      if (err) {
        reject({ err })
      } else {
        resolve(success)
      }
    })
  })
}

const travel = (src, dest, globPath) => {
  return new Promise((resolve, reject) => {
    try {
      fs.copySync(src, dest);
      glob(globPath, {}, (error, files) => {
        if (error) {
          reject(error)
        }
        console.log(files);
        if (files.length > 0) {
          files.forEach(babelTransform);
        }
      })
      resolve(success)
    } catch (e) {
      reject(e)
    }

  })

}

const babelTransform = (fileName) => {
  babel.transformFile(fileName, {
    babelrc: false,
    presets: ['env'],
    plugins: [
      "transform-runtime"
    ]
  }, (error, result) => {
    if(error){
      throw error
    }
    // 覆盖原文件
    if (result && result.code) {
      fs.writeFileSync(fileName, result.code);
      console.log('转码完成')
    }
  });
}

// 执行主函数
main();

