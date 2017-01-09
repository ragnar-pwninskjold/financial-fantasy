"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var createFieldArrayProps = function createFieldArrayProps(getIn, size, name, _ref) {
  var arrayInsert = _ref.arrayInsert;
  var arrayMove = _ref.arrayMove;
  var arrayPop = _ref.arrayPop;
  var arrayPush = _ref.arrayPush;
  var arrayRemove = _ref.arrayRemove;
  var arrayRemoveAll = _ref.arrayRemoveAll;
  var arrayShift = _ref.arrayShift;
  var arraySplice = _ref.arraySplice;
  var arraySwap = _ref.arraySwap;
  var arrayUnshift = _ref.arrayUnshift;
  var asyncError = _ref.asyncError;
  var dirty = _ref.dirty;
  var pristine = _ref.pristine;
  var submitError = _ref.submitError;
  var submitFailed = _ref.submitFailed;
  var syncError = _ref.syncError;
  var value = _ref.value;
  var props = _ref.props;

  var rest = _objectWithoutProperties(_ref, ["arrayInsert", "arrayMove", "arrayPop", "arrayPush", "arrayRemove", "arrayRemoveAll", "arrayShift", "arraySplice", "arraySwap", "arrayUnshift", "asyncError", "dirty", "pristine", "submitError", "submitFailed", "syncError", "value", "props"]);

  var error = syncError || asyncError || submitError;
  var length = size(value);
  return _extends({
    fields: {
      dirty: dirty,
      error: error,
      forEach: function forEach(callback) {
        return (value || []).forEach(function (item, index) {
          return callback(name + "[" + index + "]", index);
        });
      },
      insert: arrayInsert,
      invalid: !!error,
      length: length,
      map: function map(callback) {
        return (value || []).map(function (item, index) {
          return callback(name + "[" + index + "]", index);
        });
      },
      move: arrayMove,
      pop: function pop() {
        arrayPop();
        return getIn(value, length - 1);
      },
      pristine: pristine,
      push: arrayPush,
      remove: arrayRemove,
      removeAll: arrayRemoveAll,
      shift: function shift() {
        arrayShift();
        return getIn(value, 0);
      },
      swap: arraySwap,
      unshift: arrayUnshift,
      valid: !error
    }
  }, props, rest);
};

exports.default = createFieldArrayProps;