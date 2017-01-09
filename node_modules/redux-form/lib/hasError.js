'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIn = require('./structure/plain/getIn');

var _getIn2 = _interopRequireDefault(_getIn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getErrorKey = function getErrorKey(name, type) {
  switch (type) {
    case 'Field':
      return name;
    case 'FieldArray':
      return name + '._error';
  }
};

var createHasError = function createHasError(_ref) {
  var getIn = _ref.getIn;

  var hasError = function hasError(field, syncErrors, asyncErrors, submitErrors) {
    var name = getIn(field, 'name');
    var type = getIn(field, 'type');
    if (!syncErrors && !asyncErrors && !submitErrors) {
      return false;
    }
    var errorKey = getErrorKey(name, type);
    var syncError = (0, _getIn2.default)(syncErrors, errorKey);
    if (syncError && typeof syncError === 'string') {
      return true;
    }
    var asyncError = getIn(asyncErrors, errorKey);
    if (asyncError && typeof asyncError === 'string') {
      return true;
    }
    var submitError = getIn(submitErrors, errorKey);
    if (submitError && typeof submitError === 'string') {
      return true;
    }

    return false;
  };
  return hasError;
};

exports.default = createHasError;