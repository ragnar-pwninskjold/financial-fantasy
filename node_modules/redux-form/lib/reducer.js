'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _actionTypes = require('./actionTypes');

var _deleteInWithCleanUp = require('./deleteInWithCleanUp');

var _deleteInWithCleanUp2 = _interopRequireDefault(_deleteInWithCleanUp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var createReducer = function createReducer(structure) {
  var _behaviors;

  var splice = structure.splice;
  var empty = structure.empty;
  var getIn = structure.getIn;
  var setIn = structure.setIn;
  var deleteIn = structure.deleteIn;
  var fromJS = structure.fromJS;
  var size = structure.size;
  var some = structure.some;

  var deleteInWithCleanUp = (0, _deleteInWithCleanUp2.default)(structure);
  var doSplice = function doSplice(state, key, field, index, removeNum, value, force) {
    var existing = getIn(state, key + '.' + field);
    return existing || force ? setIn(state, key + '.' + field, splice(existing, index, removeNum, value)) : state;
  };
  var rootKeys = ['values', 'fields', 'submitErrors', 'asyncErrors'];
  var arraySplice = function arraySplice(state, field, index, removeNum, value) {
    var result = state;
    result = doSplice(result, 'values', field, index, removeNum, value, true);
    result = doSplice(result, 'fields', field, index, removeNum, empty);
    result = doSplice(result, 'submitErrors', field, index, removeNum, empty);
    result = doSplice(result, 'asyncErrors', field, index, removeNum, empty);
    return result;
  };

  var behaviors = (_behaviors = {}, _defineProperty(_behaviors, _actionTypes.ARRAY_INSERT, function (state, _ref) {
    var _ref$meta = _ref.meta;
    var field = _ref$meta.field;
    var index = _ref$meta.index;
    var payload = _ref.payload;

    return arraySplice(state, field, index, 0, payload);
  }), _defineProperty(_behaviors, _actionTypes.ARRAY_MOVE, function (state, _ref2) {
    var _ref2$meta = _ref2.meta;
    var field = _ref2$meta.field;
    var from = _ref2$meta.from;
    var to = _ref2$meta.to;

    var array = getIn(state, 'values.' + field);
    var length = array ? size(array) : 0;
    var result = state;
    if (length) {
      rootKeys.forEach(function (key) {
        var path = key + '.' + field;
        if (getIn(result, path)) {
          var value = getIn(result, path + '[' + from + ']');
          result = setIn(result, path, splice(getIn(result, path), from, 1)); // remove
          result = setIn(result, path, splice(getIn(result, path), to, 0, value)); // insert
        }
      });
    }
    return result;
  }), _defineProperty(_behaviors, _actionTypes.ARRAY_POP, function (state, _ref3) {
    var field = _ref3.meta.field;

    var array = getIn(state, 'values.' + field);
    var length = array ? size(array) : 0;
    return length ? arraySplice(state, field, length - 1, 1) : state;
  }), _defineProperty(_behaviors, _actionTypes.ARRAY_PUSH, function (state, _ref4) {
    var field = _ref4.meta.field;
    var payload = _ref4.payload;

    var array = getIn(state, 'values.' + field);
    var length = array ? size(array) : 0;
    return arraySplice(state, field, length, 0, payload);
  }), _defineProperty(_behaviors, _actionTypes.ARRAY_REMOVE, function (state, _ref5) {
    var _ref5$meta = _ref5.meta;
    var field = _ref5$meta.field;
    var index = _ref5$meta.index;

    return arraySplice(state, field, index, 1);
  }), _defineProperty(_behaviors, _actionTypes.ARRAY_REMOVE_ALL, function (state, _ref6) {
    var field = _ref6.meta.field;

    var array = getIn(state, 'values.' + field);
    var length = array ? size(array) : 0;
    return length ? arraySplice(state, field, 0, length) : state;
  }), _defineProperty(_behaviors, _actionTypes.ARRAY_SHIFT, function (state, _ref7) {
    var field = _ref7.meta.field;

    return arraySplice(state, field, 0, 1);
  }), _defineProperty(_behaviors, _actionTypes.ARRAY_SPLICE, function (state, _ref8) {
    var _ref8$meta = _ref8.meta;
    var field = _ref8$meta.field;
    var index = _ref8$meta.index;
    var removeNum = _ref8$meta.removeNum;
    var payload = _ref8.payload;

    return arraySplice(state, field, index, removeNum, payload);
  }), _defineProperty(_behaviors, _actionTypes.ARRAY_SWAP, function (state, _ref9) {
    var _ref9$meta = _ref9.meta;
    var field = _ref9$meta.field;
    var indexA = _ref9$meta.indexA;
    var indexB = _ref9$meta.indexB;

    var result = state;
    rootKeys.forEach(function (key) {
      var valueA = getIn(result, key + '.' + field + '[' + indexA + ']');
      var valueB = getIn(result, key + '.' + field + '[' + indexB + ']');
      if (valueA !== undefined || valueB !== undefined) {
        result = setIn(result, key + '.' + field + '[' + indexA + ']', valueB);
        result = setIn(result, key + '.' + field + '[' + indexB + ']', valueA);
      }
    });
    return result;
  }), _defineProperty(_behaviors, _actionTypes.ARRAY_UNSHIFT, function (state, _ref10) {
    var field = _ref10.meta.field;
    var payload = _ref10.payload;

    return arraySplice(state, field, 0, 0, payload);
  }), _defineProperty(_behaviors, _actionTypes.BLUR, function (state, _ref11) {
    var _ref11$meta = _ref11.meta;
    var field = _ref11$meta.field;
    var touch = _ref11$meta.touch;
    var payload = _ref11.payload;

    var result = state;
    var initial = getIn(result, 'initial.' + field);
    if (initial === undefined && payload === '') {
      result = deleteInWithCleanUp(result, 'values.' + field);
    } else if (payload !== undefined) {
      result = setIn(result, 'values.' + field, payload);
    }
    if (field === getIn(result, 'active')) {
      result = deleteIn(result, 'active');
    }
    result = deleteIn(result, 'fields.' + field + '.active');
    if (touch) {
      result = setIn(result, 'fields.' + field + '.touched', true);
      result = setIn(result, 'anyTouched', true);
    }
    return result;
  }), _defineProperty(_behaviors, _actionTypes.CHANGE, function (state, _ref12) {
    var _ref12$meta = _ref12.meta;
    var field = _ref12$meta.field;
    var touch = _ref12$meta.touch;
    var payload = _ref12.payload;

    var result = state;
    var initial = getIn(result, 'initial.' + field);
    if (initial === undefined && payload === '') {
      result = deleteInWithCleanUp(result, 'values.' + field);
    } else if (payload !== undefined) {
      result = setIn(result, 'values.' + field, payload);
    }
    result = deleteInWithCleanUp(result, 'asyncErrors.' + field);
    result = deleteInWithCleanUp(result, 'submitErrors.' + field);
    if (touch) {
      result = setIn(result, 'fields.' + field + '.touched', true);
      result = setIn(result, 'anyTouched', true);
    }
    return result;
  }), _defineProperty(_behaviors, _actionTypes.FOCUS, function (state, _ref13) {
    var field = _ref13.meta.field;

    var result = state;
    var previouslyActive = getIn(state, 'active');
    result = deleteIn(result, 'fields.' + previouslyActive + '.active');
    result = setIn(result, 'fields.' + field + '.visited', true);
    result = setIn(result, 'fields.' + field + '.active', true);
    result = setIn(result, 'active', field);
    return result;
  }), _defineProperty(_behaviors, _actionTypes.INITIALIZE, function (state, _ref14) {
    var payload = _ref14.payload;

    var mapData = fromJS(payload);
    var result = empty; // clean all field state
    var registeredFields = getIn(state, 'registeredFields');
    if (registeredFields) {
      result = setIn(result, 'registeredFields', registeredFields);
    }
    result = setIn(result, 'values', mapData);
    result = setIn(result, 'initial', mapData);
    return result;
  }), _defineProperty(_behaviors, _actionTypes.REGISTER_FIELD, function (state, _ref15) {
    var _ref15$payload = _ref15.payload;
    var name = _ref15$payload.name;
    var type = _ref15$payload.type;

    var result = state;
    var registeredFields = getIn(result, 'registeredFields');
    if (some(registeredFields, function (field) {
      return getIn(field, 'name') === name;
    })) {
      return state;
    }

    var mapData = fromJS({ name: name, type: type });
    result = setIn(state, 'registeredFields', splice(registeredFields, size(registeredFields), 0, mapData));
    return result;
  }), _defineProperty(_behaviors, _actionTypes.RESET, function (state) {
    var result = empty;
    var registeredFields = getIn(state, 'registeredFields');
    if (registeredFields) {
      result = setIn(result, 'registeredFields', registeredFields);
    }
    var values = getIn(state, 'initial');
    if (values) {
      result = setIn(result, 'values', values);
      result = setIn(result, 'initial', values);
    }
    return result;
  }), _defineProperty(_behaviors, _actionTypes.START_ASYNC_VALIDATION, function (state, _ref16) {
    var field = _ref16.meta.field;

    return setIn(state, 'asyncValidating', field || true);
  }), _defineProperty(_behaviors, _actionTypes.START_SUBMIT, function (state) {
    return setIn(state, 'submitting', true);
  }), _defineProperty(_behaviors, _actionTypes.STOP_ASYNC_VALIDATION, function (state, _ref17) {
    var payload = _ref17.payload;

    var result = state;
    result = deleteIn(result, 'asyncValidating');
    if (payload && Object.keys(payload).length) {
      var _error = payload._error;

      var fieldErrors = _objectWithoutProperties(payload, ['_error']);

      if (_error) {
        result = setIn(result, 'error', _error);
      }
      if (Object.keys(fieldErrors).length) {
        result = setIn(result, 'asyncErrors', fromJS(fieldErrors));
      } else {
        result = deleteIn(result, 'asyncErrors');
      }
    } else {
      result = deleteIn(result, 'error');
      result = deleteIn(result, 'asyncErrors');
    }
    return result;
  }), _defineProperty(_behaviors, _actionTypes.STOP_SUBMIT, function (state, _ref18) {
    var payload = _ref18.payload;

    var result = state;
    result = deleteIn(result, 'submitting');
    result = deleteIn(result, 'submitFailed');
    if (payload && Object.keys(payload).length) {
      var _error = payload._error;

      var fieldErrors = _objectWithoutProperties(payload, ['_error']);

      if (_error) {
        result = setIn(result, 'error', _error);
      }
      if (Object.keys(fieldErrors).length) {
        result = setIn(result, 'submitErrors', fromJS(fieldErrors));
      } else {
        result = deleteIn(result, 'submitErrors');
      }
      result = setIn(result, 'submitFailed', true);
    } else {
      result = deleteIn(result, 'error');
      result = deleteIn(result, 'submitErrors');
    }
    return result;
  }), _defineProperty(_behaviors, _actionTypes.SET_SUBMIT_FAILED, function (state, _ref19) {
    var fields = _ref19.meta.fields;

    var result = state;
    result = setIn(result, 'submitFailed', true);
    result = deleteIn(result, 'submitting');
    fields.forEach(function (field) {
      return result = setIn(result, 'fields.' + field + '.touched', true);
    });
    if (fields.length) {
      result = setIn(result, 'anyTouched', true);
    }
    return result;
  }), _defineProperty(_behaviors, _actionTypes.TOUCH, function (state, _ref20) {
    var fields = _ref20.meta.fields;

    var result = state;
    fields.forEach(function (field) {
      return result = setIn(result, 'fields.' + field + '.touched', true);
    });
    result = setIn(result, 'anyTouched', true);
    return result;
  }), _defineProperty(_behaviors, _actionTypes.UNREGISTER_FIELD, function (state, _ref21) {
    var name = _ref21.payload.name;

    var registeredFields = getIn(state, 'registeredFields');

    // in case the form was destroyed and registeredFields no longer exists
    if (!registeredFields) {
      return state;
    }

    var fieldIndex = registeredFields.findIndex(function (value) {
      return getIn(value, 'name') === name;
    });
    if (size(registeredFields) <= 1 && fieldIndex >= 0) {
      return deleteInWithCleanUp(state, 'registeredFields');
    }
    return setIn(state, 'registeredFields', splice(registeredFields, fieldIndex, 1));
  }), _defineProperty(_behaviors, _actionTypes.UNTOUCH, function (state, _ref22) {
    var fields = _ref22.meta.fields;

    var result = state;
    fields.forEach(function (field) {
      return result = deleteIn(result, 'fields.' + field + '.touched');
    });
    return result;
  }), _defineProperty(_behaviors, _actionTypes.UPDATE_SYNC_ERRORS, function (state, _ref23) {
    var payload = _ref23.payload;

    return Object.keys(payload).length ? setIn(state, 'syncErrors', payload) : deleteIn(state, 'syncErrors');
  }), _behaviors);

  var reducer = function reducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? empty : arguments[0];
    var action = arguments[1];

    var behavior = behaviors[action.type];
    return behavior ? behavior(state, action) : state;
  };

  var byForm = function byForm(reducer) {
    return function () {
      var state = arguments.length <= 0 || arguments[0] === undefined ? empty : arguments[0];
      var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var form = action && action.meta && action.meta.form;
      if (!form) {
        return state;
      }
      if (action.type === _actionTypes.DESTROY) {
        return deleteInWithCleanUp(state, action.meta.form);
      }
      var formState = getIn(state, form);
      var result = reducer(formState, action);
      return result === formState ? state : setIn(state, form, result);
    };
  };

  /**
   * Adds additional functionality to the reducer
   */
  function decorate(target) {
    target.plugin = function plugin(reducers) {
      var _this = this;

      // use 'function' keyword to enable 'this'
      return decorate(function () {
        var state = arguments.length <= 0 || arguments[0] === undefined ? empty : arguments[0];
        var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
        return Object.keys(reducers).reduce(function (accumulator, key) {
          var previousState = getIn(accumulator, key);
          var nextState = reducers[key](previousState, action);
          return nextState === previousState ? accumulator : setIn(accumulator, key, nextState);
        }, _this(state, action));
      });
    };

    return target;
  }

  return decorate(byForm(reducer));
};

exports.default = createReducer;