/**
 * Created by shiyunjie on 17/12/1.
 */

import "babel-polyfill";
import fs from 'fs-extra';
import semver from 'semver';
import packageJS from "../package.json";   // 获取package.json
import execa from 'execa';
import inquirer from 'inquirer';

/*
 Alpha：内测版，内部交流或者专业测试人员测试用；
 Beta：公测版，专业爱好者大规模测试用，存在一些缺陷，该版本也不适合一般用户安装；
 Gamma：比较成熟的测试版，与即将发行的正式版相差无几；
 RC：是 Release Candidate 的缩写，意思是发布倒计时，候选版本，处于Gamma阶段，该版本已经完成全部功能并清除大部分的BUG。
 到了这个阶段只会除BUG，不会对软件做任何大的更改。从Alpha到Beta再到Gamma是改进的先后关系，但RC1、RC2往往是取舍关系。
 */
const main = async () => {

  let msg = '';
  const result = await execa.shell('git symbolic-ref --short -q HEAD');
  if (!result.failed) {
    msg = result.stdout
  }

  const status = await execa.shell('git status -uno -s');

  if (status.stdout) {
    console.error('还有未处理文件，请处理后再发布');
    process.exit(0);
  }
  console.log('执行shell检测分支');

  if (msg && msg !== 'master' &&
    (semver.valid(packageJS.version) || semver.satisfies(packageJS.version, '*'))) {
    let choice = await inquirer.prompt([
      {
        type: 'list',
        name: 'version',
        message: '不是主分支，只能提交测试版本,请选择',
        choices: ['Beta', 'Alpha', 'Gamma', 'Rc'],
        default: 'Beta',
        filter: (val) => {
          return val.toLowerCase();
        }
      }
    ]);

    let version = '';
    switch (choice.version) {
      case 'alpha':
        version = semver.inc(packageJS.version, 'prerelease', 'alpha');
        break;
      case 'gamma':
        version = semver.inc(packageJS.version, 'prerelease', 'gamma');
        break;
      case 'rc':
        version = semver.inc(packageJS.version, 'prerelease', 'rc');
        break;
      default :
        version = semver.inc(packageJS.version, 'prerelease', 'beta');
        break;
    }
    editPackageJSON('package.json', version);
    editPackageJSON('package-lock.json', version);
    const addResult = await execa.shell('git add .');
    validate(addResult);
    const commitResult = await execa.shell('git commit -m "chore：修改版本号"');
    validate(commitResult);
    const execaResult = await execa.shell(`git push origin ${msg}`);
    validate(execaResult);
    console.log('已修改版本号为:', version);
    const publishResult = await execa.shell('npm publish');
    validate(publishResult);
    console.log(version, '已发布');
  } else if (msg && msg === 'master') {
    /**
     *
     1.15.2对应就是MAJOR,MINOR.PATCH：1是marjor version；15是minor version；2是patch version
     MAJOR：有一个不可以和上个版本兼容的大更改。

     MINOR：增加了新的功能，并且可以向后兼容。

     PATCH：修复了bug，并且可以向后兼容。
     */
    const MAJOR = '有一个不可以和上个版本兼容的大更改';
    const MINOR = '增加了新的功能，并且可以向后兼容';
    const PATCH = '修复了bug，并且可以向后兼容';
    let choice = await inquirer.prompt([
      {
        type: 'list',
        name: 'version',
        message: '当前分支是主分支，请选择修改方式',
        choices: [
          MAJOR,
          MINOR,
          PATCH
        ],
        default: 'Beta',
        filter: (val) => {
          return val.toLowerCase();
        }
      }
    ]);
    let version = '';
    switch (choice.version) {
      case MAJOR:
        version = semver.inc(packageJS.version, 'major');
        break;
      case MINOR:
        version = semver.inc(packageJS.version, 'minor');
        break;
      case PATCH:
        version = semver.inc(packageJS.version, 'patch');
        break;
      default:
        break;
    }
    const versionResult = await execa.shell(`npm version ${version}`);
    validate(versionResult);
    const pushResult = await execa.shell('git push --follow-tags');
    validate(pushResult);
    const result = await execa.shell('npm publish');
    validate(result);
    console.log(version, '已发布');
  } else {
    console.log('请修改版本号');
  }
}

const editPackageJSON = (fileName, version) => {
  console.log('copyFile');
  const packageObj = fs.readJsonSync(fileName)
  packageObj.version = version;
  fs.writeFileSync(fileName, JSON.stringify(packageObj, null, '\t'));
}

const validate = (result) => {
  if (result.failed) {
    console.error(result.stdout);
    process.exit(0);
  }
}

main();