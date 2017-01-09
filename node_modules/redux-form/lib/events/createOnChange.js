'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getValue = require('./getValue');

var _getValue2 = _interopRequireDefault(_getValue);

var _isReactNative = require('../isReactNative');

var _isReactNative2 = _interopRequireDefault(_isReactNative);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createOnChange = function createOnChange(change, normalize) {
  return function (event) {
    return change(normalize((0, _getValue2.default)(event, _isReactNative2.default)));
  };
};

exports.default = createOnChange;