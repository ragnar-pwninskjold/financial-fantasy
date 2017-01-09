'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toPath2 = require('lodash/toPath');

var _toPath3 = _interopRequireDefault(_toPath2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var getInWithPath = function getInWithPath(state, first) {
  for (var _len = arguments.length, rest = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    rest[_key - 2] = arguments[_key];
  }

  if (!state) {
    return state;
  }
  var next = state[first];
  return rest.length ? getInWithPath.apply(undefined, [next].concat(rest)) : next;
};

var getIn = function getIn(state, field) {
  return getInWithPath.apply(undefined, [state].concat(_toConsumableArray((0, _toPath3.default)(field))));
};

exports.default = getIn;