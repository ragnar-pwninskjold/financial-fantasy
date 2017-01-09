'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var createHasErrors = function createHasErrors(_ref) {
  var getIn = _ref.getIn;

  var hasErrors = function hasErrors(errors) {
    if (!errors) {
      return false;
    }
    var globalError = getIn(errors, '_error');
    if (globalError) {
      return true;
    }
    if (typeof errors === 'string') {
      return !!errors;
    }
    return false;
  };
  return hasErrors;
};

exports.default = createHasErrors;