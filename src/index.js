/**
 * Created by shiyunjie on 17/11/21.
 */
import 'babel-polyfill';

import promise from 'glob-promise';
import fs from 'fs-extra';
import path from 'path';
import execa from 'execa';
const acorn = require('acorn');

let ignoreFiles = [];
let packages = [];

const countFileRows = async ({
                               patternInput,
                               optionsInput,
                               ignoreInput,
                               extensionInput,
                             }) => {
  return await interate(
    {
      patternInput,
      optionsInput,
      ignoreInput,
      extensionInput,
    },
    getFileRows);
}

const countPackageRequire = async ({
                                     patternInput,
                                     optionsInput,
                                     ignoreInput,
                                     extensionInput,
                                   }) => {
  packages = [];
  await interate(
    {
      patternInput,
      optionsInput,
      ignoreInput,
      extensionInput,
    },
    getRequirePackageNumber);
  return packages;
}


/**
 * 遍历远文件夹，执行todo函数
 * @param pattern
 * @param options
 * @param todo
 * @returns {Promise.<Array>}
 */
const interate = async ({
                          patternInput,
                          optionsInput,
                          ignoreInput,
                          extensionInput,
                        } = {}, todo) => {
  const extension = extensionInput || '';
  const pattern = patternInput ?
    `${patternInput}/**/*${extension}` : `**/*${extension}`;
  ignoreFiles = ignoreInput || [];
  let options = { nodir: true };
  if (optionsInput) {
    options = { ...options, ...optionsInput };
  }
  if (ignoreInput) {
    options = { ...options, ignore: ignoreInput };
  }


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
  const info = await execa.shell(`wc -l ${file}`);
  console.log(`${baseName}代码行数:`, info);
  return {
    rows: info.stdout.trim(),
  }
}

/**
 * 统计目录中文件引用包次数
 * @param file
 */
const getRequirePackageNumber = async (file) => {

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



