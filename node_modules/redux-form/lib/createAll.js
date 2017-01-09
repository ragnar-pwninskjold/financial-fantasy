'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _reducer = require('./reducer');

var _reducer2 = _interopRequireDefault(_reducer);

var _reduxForm = require('./reduxForm');

var _reduxForm2 = _interopRequireDefault(_reduxForm);

var _Field = require('./Field');

var _Field2 = _interopRequireDefault(_Field);

var _FieldArray = require('./FieldArray');

var _FieldArray2 = _interopRequireDefault(_FieldArray);

var _formValueSelector = require('./formValueSelector');

var _formValueSelector2 = _interopRequireDefault(_formValueSelector);

var _values = require('./values');

var _values2 = _interopRequireDefault(_values);

var _SubmissionError = require('./SubmissionError');

var _SubmissionError2 = _interopRequireDefault(_SubmissionError);

var _propTypes = require('./propTypes');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _actions = require('./actions');

var actions = _interopRequireWildcard(_actions);

var _actionTypes = require('./actionTypes');

var actionTypes = _interopRequireWildcard(_actionTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createAll = function createAll(structure) {
  return _extends({
    // separate out field actions
    actionTypes: actionTypes
  }, actions, {
    Field: (0, _Field2.default)(structure),
    FieldArray: (0, _FieldArray2.default)(structure),
    formValueSelector: (0, _formValueSelector2.default)(structure),
    propTypes: _propTypes2.default,
    reduxForm: (0, _reduxForm2.default)(structure),
    reducer: (0, _reducer2.default)(structure),
    SubmissionError: _SubmissionError2.default,
    values: (0, _values2.default)(structure)
  });
};

exports.default = createAll;