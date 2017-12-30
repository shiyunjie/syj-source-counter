'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

require('babel-polyfill');

var _globPromise = require('glob-promise');

var _globPromise2 = _interopRequireDefault(_globPromise);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by shiyunjie on 17/11/21.
 */
var acorn = require('acorn'); // 比较重，支持es6  es7 api

var ignoreFiles = [];
var packages = [];

var countFileRows = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(patternInput, optionsInput, ignoreInput, extensionInput) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return interate(patternInput, optionsInput, ignoreInput, extensionInput, getFileRows);

          case 2:
            return _context.abrupt('return', _context.sent);

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function countFileRows(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

var countPackageRequire = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(patternInput, optionsInput, ignoreInput, extensionInput) {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            packages = [];
            _context2.next = 3;
            return interate(patternInput, optionsInput, ignoreInput, extensionInput, getPackageRequire);

          case 3:
            return _context2.abrupt('return', packages);

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function countPackageRequire(_x5, _x6, _x7, _x8) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * 遍历远文件夹，执行todo函数
 * @param pattern
 * @param options
 * @param todo
 * @returns {Promise.<Array>}
 */
var interate = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(patternInput, optionsInput, ignoreInput, extensionInput, todo) {
    var extension, pattern, options, files, result, value, info;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            extension = extensionInput || '';
            pattern = patternInput ? patternInput + '/**/*' + extension : '**/*' + extension;

            ignoreFiles = ignoreInput || [];
            options = optionsInput || { nodir: true };


            console.log('options:', options);

            _context3.next = 7;
            return (0, _globPromise2.default)(pattern, options);

          case 7:
            files = _context3.sent;
            result = [];

            if (!(files.length > 0)) {
              _context3.next = 20;
              break;
            }

            _context3.t0 = _regenerator2.default.keys(files);

          case 11:
            if ((_context3.t1 = _context3.t0()).done) {
              _context3.next = 20;
              break;
            }

            value = _context3.t1.value;
            _context3.next = 15;
            return todo(files[value]);

          case 15:
            info = _context3.sent;

            console.log('info:', info);
            if (info) {
              result.push(info);
            }
            _context3.next = 11;
            break;

          case 20:
            return _context3.abrupt('return', result);

          case 21:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function interate(_x9, _x10, _x11, _x12, _x13) {
    return _ref3.apply(this, arguments);
  };
}();

/**
 * 统计文件总行数，返回路径和行数
 * @param file
 * @returns {Promise.<{path: *, rows: Number}>}
 */
var getFileRows = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(file) {
    var baseName, fileJson, rows;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            baseName = _path2.default.basename(file);

            if (!ignoreFiles.includes(baseName)) {
              _context4.next = 3;
              break;
            }

            return _context4.abrupt('return', null);

          case 3:
            _context4.next = 5;
            return _fsExtra2.default.readFile(file, 'utf8');

          case 5:
            fileJson = _context4.sent;
            rows = fileJson.trim().split('\n').length;

            console.log(baseName + '\u4EE3\u7801\u884C\u6570:', rows);
            return _context4.abrupt('return', {
              path: file,
              rows: rows
            });

          case 9:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function getFileRows(_x14) {
    return _ref4.apply(this, arguments);
  };
}();

/**
 * 统计文件引用了多少包
 * @param file
 */
var getPackageRequire = function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(file) {
    var code, constast;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _fsExtra2.default.readFile(file, 'utf8');

          case 2:
            code = _context5.sent;
            constast = acorn.parse(code, {
              sourceType: 'module',
              ecmaVersion: 6,
              locations: true
            });


            constast.body.forEach(function (node) {

              if (node.type === 'ImportDeclaration') {
                if (!node.source.value.startsWith('.')) {
                  var packageName = node.source.value;
                  var index = packages.findIndex(function (item) {
                    return item.packageName === packageName;
                  });
                  if (index === -1) {
                    packages.push({
                      packageName: packageName,
                      num: 1
                    });
                  } else {
                    packages[index].num++;
                  }
                }
              }
            });
            return _context5.abrupt('return', packages);

          case 6:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function getPackageRequire(_x15) {
    return _ref5.apply(this, arguments);
  };
}();

exports.default = {
  countFileRows: countFileRows,
  countPackageRequire: countPackageRequire
};