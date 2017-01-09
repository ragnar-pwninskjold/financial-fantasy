'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isEqualWith2 = require('lodash/isEqualWith');

var _isEqualWith3 = _interopRequireDefault(_isEqualWith2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var customizer = function customizer(obj, other) {
  if (obj == other) return true;
  if (obj == null && other === '') return true;
  if (obj === '' && other == null) return true;
  if (obj && other && obj._error !== other._error) return false;
};

var deepEqual = function deepEqual(a, b) {
  return (0, _isEqualWith3.default)(a, b, customizer);
};

exports.default = deepEqual;