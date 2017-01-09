'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateSyncErrors = exports.untouch = exports.unregisterField = exports.touch = exports.setSubmitFailed = exports.stopSubmit = exports.stopAsyncValidation = exports.startSubmit = exports.startAsyncValidation = exports.reset = exports.registerField = exports.initialize = exports.focus = exports.destroy = exports.change = exports.blur = exports.arrayUnshift = exports.arraySwap = exports.arraySplice = exports.arrayShift = exports.arrayRemoveAll = exports.arrayRemove = exports.arrayPush = exports.arrayPop = exports.arrayMove = exports.arrayInsert = undefined;

var _actionTypes = require('./actionTypes');

var arrayInsert = exports.arrayInsert = function arrayInsert(form, field, index, value) {
  return { type: _actionTypes.ARRAY_INSERT, meta: { form: form, field: field, index: index }, payload: value };
};

var arrayMove = exports.arrayMove = function arrayMove(form, field, from, to) {
  return { type: _actionTypes.ARRAY_MOVE, meta: { form: form, field: field, from: from, to: to } };
};

var arrayPop = exports.arrayPop = function arrayPop(form, field) {
  return { type: _actionTypes.ARRAY_POP, meta: { form: form, field: field } };
};

var arrayPush = exports.arrayPush = function arrayPush(form, field, value) {
  return { type: _actionTypes.ARRAY_PUSH, meta: { form: form, field: field }, payload: value };
};

var arrayRemove = exports.arrayRemove = function arrayRemove(form, field, index) {
  return { type: _actionTypes.ARRAY_REMOVE, meta: { form: form, field: field, index: index } };
};

var arrayRemoveAll = exports.arrayRemoveAll = function arrayRemoveAll(form, field) {
  return { type: _actionTypes.ARRAY_REMOVE_ALL, meta: { form: form, field: field } };
};

var arrayShift = exports.arrayShift = function arrayShift(form, field) {
  return { type: _actionTypes.ARRAY_SHIFT, meta: { form: form, field: field } };
};

var arraySplice = exports.arraySplice = function arraySplice(form, field, index, removeNum, value) {
  var action = {
    type: _actionTypes.ARRAY_SPLICE,
    meta: { form: form, field: field, index: index, removeNum: removeNum }
  };
  if (value !== undefined) {
    action.payload = value;
  }
  return action;
};

var arraySwap = exports.arraySwap = function arraySwap(form, field, indexA, indexB) {
  if (indexA === indexB) {
    throw new Error('Swap indices cannot be equal');
  }
  if (indexA < 0 || indexB < 0) {
    throw new Error('Swap indices cannot be negative');
  }
  return { type: _actionTypes.ARRAY_SWAP, meta: { form: form, field: field, indexA: indexA, indexB: indexB } };
};

var arrayUnshift = exports.arrayUnshift = function arrayUnshift(form, field, value) {
  return { type: _actionTypes.ARRAY_UNSHIFT, meta: { form: form, field: field }, payload: value };
};

var blur = exports.blur = function blur(form, field, value, touch) {
  return { type: _actionTypes.BLUR, meta: { form: form, field: field, touch: touch }, payload: value };
};

var change = exports.change = function change(form, field, value, touch) {
  return { type: _actionTypes.CHANGE, meta: { form: form, field: field, touch: touch }, payload: value };
};

var destroy = exports.destroy = function destroy(form) {
  return { type: _actionTypes.DESTROY, meta: { form: form } };
};

var focus = exports.focus = function focus(form, field) {
  return { type: _actionTypes.FOCUS, meta: { form: form, field: field } };
};

var initialize = exports.initialize = function initialize(form, values) {
  return { type: _actionTypes.INITIALIZE, meta: { form: form }, payload: values };
};

var registerField = exports.registerField = function registerField(form, name, type) {
  return { type: _actionTypes.REGISTER_FIELD, meta: { form: form }, payload: { name: name, type: type } };
};

var reset = exports.reset = function reset(form) {
  return { type: _actionTypes.RESET, meta: { form: form } };
};

var startAsyncValidation = exports.startAsyncValidation = function startAsyncValidation(form, field) {
  return { type: _actionTypes.START_ASYNC_VALIDATION, meta: { form: form, field: field } };
};

var startSubmit = exports.startSubmit = function startSubmit(form) {
  return { type: _actionTypes.START_SUBMIT, meta: { form: form } };
};

var stopAsyncValidation = exports.stopAsyncValidation = function stopAsyncValidation(form, errors) {
  var action = {
    type: _actionTypes.STOP_ASYNC_VALIDATION,
    meta: { form: form },
    payload: errors
  };
  if (errors && Object.keys(errors).length) {
    action.error = true;
  }
  return action;
};

var stopSubmit = exports.stopSubmit = function stopSubmit(form, errors) {
  var action = {
    type: _actionTypes.STOP_SUBMIT,
    meta: { form: form },
    payload: errors
  };
  if (errors && Object.keys(errors).length) {
    action.error = true;
  }
  return action;
};

var setSubmitFailed = exports.setSubmitFailed = function setSubmitFailed(form) {
  for (var _len = arguments.length, fields = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    fields[_key - 1] = arguments[_key];
  }

  return { type: _actionTypes.SET_SUBMIT_FAILED, meta: { form: form, fields: fields }, error: true };
};

var touch = exports.touch = function touch(form) {
  for (var _len2 = arguments.length, fields = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    fields[_key2 - 1] = arguments[_key2];
  }

  return { type: _actionTypes.TOUCH, meta: { form: form, fields: fields } };
};

var unregisterField = exports.unregisterField = function unregisterField(form, name) {
  return { type: _actionTypes.UNREGISTER_FIELD, meta: { form: form }, payload: { name: name } };
};

var untouch = exports.untouch = function untouch(form) {
  for (var _len3 = arguments.length, fields = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    fields[_key3 - 1] = arguments[_key3];
  }

  return { type: _actionTypes.UNTOUCH, meta: { form: form, fields: fields } };
};

var updateSyncErrors = exports.updateSyncErrors = function updateSyncErrors(form) {
  var syncErrors = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  return { type: _actionTypes.UPDATE_SYNC_ERRORS, meta: { form: form }, payload: syncErrors };
};