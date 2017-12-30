#代码统计工具

##安装

```
npm install syj-source-counter
```

##统计代码行数

```
function main() {
  util.default.countFileRows('app').then(
    function (res) {
      console.log(res)
    }
  )
}

main();
```

##统计代码返回结果

```
[{
 path: 'app/index.js', // 文件相对路径
 rows: 271,            // 代码行数
}]
```


##统计包引用次数


```
function main() {
  util.default.countPackageRequire('app').then(
    function (res) {
      console.log(res)
    }
  )
}

main();
```

##统计包引用返回结果

```
[ {
packageName: 'fs-extra',  // 包名
num: 2                   // 引用次数
}]
```
