'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getValue = require('./getValue');

var _getValue2 = _interopRequireDefault(_getValue);

var _isReactNative = require('../isReactNative');

var _isReactNative2 = _interopRequireDefault(_isReactNative);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createOnBlur = function createOnBlur(blur, normalize, afterBlur) {
  return function (event) {
    var value = normalize((0, _getValue2.default)(event, _isReactNative2.default));
    blur(value);
    if (afterBlur) {
      afterBlur(value);
    }
  };
};
exports.default = createOnBlur;