/**
 * Created by shiyunjie on 17/11/21.
 */
import 'babel-polyfill';

import promise from 'glob-promise';
import fs from 'fs-extra';
import path from 'path';
const acorn = require('acorn');

let ignoreFiles = [];
let packages = [];

const countFileRows = async (patternInput, optionsInput, ignoreInput, extensionInput) => {
  return await interate(
    patternInput,
    optionsInput,
    ignoreInput,
    extensionInput,
    getFileRows);
}

const countPackageRequire = async (patternInput, optionsInput, ignoreInput, extensionInput) => {
  packages = [];
  await interate(
    patternInput,
    optionsInput,
    ignoreInput,
    extensionInput,
    getPackageRequire);
  return packages;
}


/**
 * 遍历远文件夹，执行todo函数
 * @param pattern
 * @param options
 * @param todo
 * @returns {Promise.<Array>}
 */
const interate = async (patternInput, optionsInput, ignoreInput, extensionInput, todo) => {
  const extension = extensionInput || '';
  const pattern = patternInput ?
    `${patternInput}/**/*${extension}` : `**/*${extension}`;
  ignoreFiles = ignoreInput || [];
  const options = optionsInput || { nodir: true };

  const files = await promise(
    pattern,
    options,
  );
  const result = [];
  if (files.length > 0) {
    for (let value in files) {
      const info = await todo(files[value]);
      if (info) {
        result.push(info);
      }
    }
  }
  return result;
}

/**
 * 统计文件总行数，返回路径和行数
 * @param file
 * @returns {Promise.<{path: *, rows: Number}>}
 */
const getFileRows = async (file) => {
  const baseName = path.basename(file);

  if (ignoreFiles.includes(baseName)) {
    return null;
  }
  const fileJson = await fs.readFile(file, 'utf8');
  const rows = fileJson.trim().split('\n').length;
  console.log(`${baseName}代码行数:`, rows);
  return {
    path: file,
    rows: rows,
  }
}

/**
 * 统计文件引用了多少包
 * @param file
 */
const getPackageRequire = async (file) => {

  const code = await fs.readFile(file, 'utf8');
  const constast = acorn.parse(code, {
    sourceType: 'module', ecmaVersion: 6,
    locations: true,
  });
  constast.body.forEach((node) => {

    if (node.type === 'ImportDeclaration') {
      if (!node.source.value.startsWith('.')) {
        const packageName = node.source.value;
        const index = packages.findIndex((item) => item.packageName === packageName);
        if (index === -1) {
          packages.push({
            packageName,
            num: 1,
          })
        } else {
          packages[index].num++;
        }
      }
    }
  })
  return packages;
}

export default {
  countFileRows,
  countPackageRequire,
}



