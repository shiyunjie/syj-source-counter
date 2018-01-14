'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _execa = require('execa');

var _execa2 = _interopRequireDefault(_execa);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var acorn = require('acorn'); /**
                               * Created by shiyunjie on 17/11/21.
                               */


var ignoreFiles = [];
var packages = [];

var countFileRows = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref2) {
    var patternInput = _ref2.patternInput,
        optionsInput = _ref2.optionsInput,
        ignoreInput = _ref2.ignoreInput,
        extensionInput = _ref2.extensionInput;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return interate({
              patternInput: patternInput,
              optionsInput: optionsInput,
              ignoreInput: ignoreInput,
              extensionInput: extensionInput
            }, getFileRows);

          case 2:
            return _context.abrupt('return', _context.sent);

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function countFileRows(_x) {
    return _ref.apply(this, arguments);
  };
}();

var countPackageRequire = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(_ref4) {
    var patternInput = _ref4.patternInput,
        optionsInput = _ref4.optionsInput,
        ignoreInput = _ref4.ignoreInput,
        extensionInput = _ref4.extensionInput;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            packages = [];
            _context2.next = 3;
            return interate({
              patternInput: patternInput,
              optionsInput: optionsInput,
              ignoreInput: ignoreInput,
              extensionInput: extensionInput
            }, getRequirePackageNumber);

          case 3:
            return _context2.abrupt('return', packages);

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function countPackageRequire(_x2) {
    return _ref3.apply(this, arguments);
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
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
    var _ref6 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        patternInput = _ref6.patternInput,
        optionsInput = _ref6.optionsInput,
        ignoreInput = _ref6.ignoreInput,
        extensionInput = _ref6.extensionInput;

    var todo = arguments[1];
    var extension, pattern, options, files, result, value, info;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            extension = extensionInput || '';
            pattern = patternInput ? patternInput + '/**/*' + extension : '**/*' + extension;

            ignoreFiles = ignoreInput || [];
            options = { nodir: true };

            if (optionsInput) {
              options = (0, _extends3.default)({}, options, optionsInput);
            }
            if (ignoreInput) {
              options = (0, _extends3.default)({}, options, { ignore: ignoreInput });
            }

            _context3.next = 8;
            return (0, _globPromise2.default)(pattern, options);

          case 8:
            files = _context3.sent;
            result = [];

            if (!(files.length > 0)) {
              _context3.next = 20;
              break;
            }

            _context3.t0 = _regenerator2.default.keys(files);

          case 12:
            if ((_context3.t1 = _context3.t0()).done) {
              _context3.next = 20;
              break;
            }

            value = _context3.t1.value;
            _context3.next = 16;
            return todo(files[value]);

          case 16:
            info = _context3.sent;

            if (info) {
              result.push(info);
            }
            _context3.next = 12;
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

  return function interate() {
    return _ref5.apply(this, arguments);
  };
}();

/**
 * 统计文件总行数，返回路径和行数
 * @param file
 * @returns {Promise.<{path: *, rows: Number}>}
 */
var getFileRows = function () {
  var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(file) {
    var baseName, info;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            baseName = _path2.default.basename(file);
            _context4.next = 3;
            return _execa2.default.shell('wc -l ' + file);

          case 3:
            info = _context4.sent;

            //const fileJson = await fs.readFile(file, 'utf8');
            //const rows = fileJson.trim().split('\n').length;
            console.log(baseName + '\u4EE3\u7801\u884C\u6570:', info);
            return _context4.abrupt('return', {
              rows: info.stdout.trim()
            });

          case 6:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function getFileRows(_x4) {
    return _ref7.apply(this, arguments);
  };
}();

/**
 * 统计目录中文件引用包次数
 * @param file
 */
var getRequirePackageNumber = function () {
  var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(file) {
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
              sourceType: 'module', ecmaVersion: 6,
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

  return function getRequirePackageNumber(_x5) {
    return _ref8.apply(this, arguments);
  };
}();

exports.default = {
  countFileRows: countFileRows,
  countPackageRequire: countPackageRequire
};