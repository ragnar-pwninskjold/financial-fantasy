'use strict';

var _noop2 = require('lodash/noop');

var _noop3 = _interopRequireDefault(_noop2);

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _handleSubmit = require('../handleSubmit');

var _handleSubmit2 = _interopRequireDefault(_handleSubmit);

var _SubmissionError = require('../SubmissionError');

var _SubmissionError2 = _interopRequireDefault(_SubmissionError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('handleSubmit', function () {
  it('should stop if sync validation fails', function () {
    var values = { foo: 'bar', baz: 42 };
    var submit = (0, _expect.createSpy)().andReturn(69);
    var startSubmit = (0, _expect.createSpy)();
    var stopSubmit = (0, _expect.createSpy)();
    var touch = (0, _expect.createSpy)();
    var setSubmitFailed = (0, _expect.createSpy)();
    var asyncValidate = (0, _expect.createSpy)();
    var props = { startSubmit: startSubmit, stopSubmit: stopSubmit, touch: touch, setSubmitFailed: setSubmitFailed, values: values };

    (0, _handleSubmit2.default)(submit, props, false, asyncValidate, ['foo', 'baz']);

    (0, _expect2.default)(submit).toNotHaveBeenCalled();
    (0, _expect2.default)(startSubmit).toNotHaveBeenCalled();
    (0, _expect2.default)(stopSubmit).toNotHaveBeenCalled();
    (0, _expect2.default)(touch).toHaveBeenCalled().toHaveBeenCalledWith('foo', 'baz');
    (0, _expect2.default)(asyncValidate).toNotHaveBeenCalled();
    (0, _expect2.default)(setSubmitFailed).toHaveBeenCalled().toHaveBeenCalledWith('foo', 'baz');
  });

  it('should stop and return errors if sync validation fails', function () {
    var values = { foo: 'bar', baz: 42 };
    var submit = (0, _expect.createSpy)().andReturn(69);
    var syncErrors = { foo: 'error' };
    var startSubmit = (0, _expect.createSpy)();
    var stopSubmit = (0, _expect.createSpy)();
    var touch = (0, _expect.createSpy)();
    var setSubmitFailed = (0, _expect.createSpy)();
    var asyncValidate = (0, _expect.createSpy)();
    var props = {
      startSubmit: startSubmit,
      stopSubmit: stopSubmit,
      touch: touch,
      setSubmitFailed: setSubmitFailed,
      syncErrors: syncErrors,
      values: values
    };

    var result = (0, _handleSubmit2.default)(submit, props, false, asyncValidate, ['foo', 'baz']);

    (0, _expect2.default)(asyncValidate).toNotHaveBeenCalled();
    (0, _expect2.default)(submit).toNotHaveBeenCalled();
    (0, _expect2.default)(startSubmit).toNotHaveBeenCalled();
    (0, _expect2.default)(stopSubmit).toNotHaveBeenCalled();
    (0, _expect2.default)(touch).toHaveBeenCalled().toHaveBeenCalledWith('foo', 'baz');
    (0, _expect2.default)(setSubmitFailed).toHaveBeenCalled().toHaveBeenCalledWith('foo', 'baz');
    (0, _expect2.default)(result).toBe(syncErrors);
  });

  it('should return result of sync submit', function () {
    var values = { foo: 'bar', baz: 42 };
    var submit = (0, _expect.createSpy)().andReturn(69);
    var dispatch = _noop3.default;
    var startSubmit = (0, _expect.createSpy)();
    var stopSubmit = (0, _expect.createSpy)();
    var touch = (0, _expect.createSpy)();
    var setSubmitFailed = (0, _expect.createSpy)();
    var asyncValidate = undefined;
    var props = { dispatch: dispatch, startSubmit: startSubmit, stopSubmit: stopSubmit, touch: touch, setSubmitFailed: setSubmitFailed, values: values };

    (0, _expect2.default)((0, _handleSubmit2.default)(submit, props, true, asyncValidate, ['foo', 'baz'])).toBe(69);

    (0, _expect2.default)(submit).toHaveBeenCalled().toHaveBeenCalledWith(values, dispatch);
    (0, _expect2.default)(startSubmit).toNotHaveBeenCalled();
    (0, _expect2.default)(stopSubmit).toNotHaveBeenCalled();
    (0, _expect2.default)(touch).toHaveBeenCalled().toHaveBeenCalledWith('foo', 'baz');
    (0, _expect2.default)(setSubmitFailed).toNotHaveBeenCalled();
  });

  it('should not submit if async validation fails', function (done) {
    var values = { foo: 'bar', baz: 42 };
    var submit = (0, _expect.createSpy)().andReturn(69);
    var dispatch = _noop3.default;
    var startSubmit = (0, _expect.createSpy)();
    var stopSubmit = (0, _expect.createSpy)();
    var touch = (0, _expect.createSpy)();
    var setSubmitFailed = (0, _expect.createSpy)();
    var asyncValidate = (0, _expect.createSpy)().andReturn(Promise.reject());
    var props = { dispatch: dispatch, startSubmit: startSubmit, stopSubmit: stopSubmit, touch: touch, setSubmitFailed: setSubmitFailed, values: values };

    return (0, _handleSubmit2.default)(submit, props, true, asyncValidate, ['foo', 'baz']).catch(function (result) {
      (0, _expect2.default)(result).toBe(undefined);
      (0, _expect2.default)(asyncValidate).toHaveBeenCalled().toHaveBeenCalledWith();
      (0, _expect2.default)(submit).toNotHaveBeenCalled();
      (0, _expect2.default)(startSubmit).toNotHaveBeenCalled();
      (0, _expect2.default)(stopSubmit).toNotHaveBeenCalled();
      (0, _expect2.default)(touch).toHaveBeenCalled().toHaveBeenCalledWith('foo', 'baz');
      (0, _expect2.default)(setSubmitFailed).toHaveBeenCalled().toHaveBeenCalledWith('foo', 'baz');
      done();
    });
  });

  it('should not submit if async validation fails and return rejected promise', function (done) {
    var values = { foo: 'bar', baz: 42 };
    var submit = (0, _expect.createSpy)().andReturn(69);
    var dispatch = _noop3.default;
    var startSubmit = (0, _expect.createSpy)();
    var stopSubmit = (0, _expect.createSpy)();
    var touch = (0, _expect.createSpy)();
    var setSubmitFailed = (0, _expect.createSpy)();
    var asyncErrors = { foo: 'async error' };
    var asyncValidate = (0, _expect.createSpy)().andReturn(Promise.reject(asyncErrors));
    var props = {
      dispatch: dispatch, startSubmit: startSubmit, stopSubmit: stopSubmit, touch: touch, setSubmitFailed: setSubmitFailed, values: values
    };

    return (0, _handleSubmit2.default)(submit, props, true, asyncValidate, ['foo', 'baz']).catch(function (result) {
      (0, _expect2.default)(result).toBe(asyncErrors);
      (0, _expect2.default)(asyncValidate).toHaveBeenCalled().toHaveBeenCalledWith();
      (0, _expect2.default)(submit).toNotHaveBeenCalled();
      (0, _expect2.default)(startSubmit).toNotHaveBeenCalled();
      (0, _expect2.default)(stopSubmit).toNotHaveBeenCalled();
      (0, _expect2.default)(touch).toHaveBeenCalled().toHaveBeenCalledWith('foo', 'baz');
      (0, _expect2.default)(setSubmitFailed).toHaveBeenCalled().toHaveBeenCalledWith('foo', 'baz');
      done();
    });
  });

  it('should sync submit if async validation passes', function () {
    var values = { foo: 'bar', baz: 42 };
    var submit = (0, _expect.createSpy)().andReturn(69);
    var dispatch = _noop3.default;
    var startSubmit = (0, _expect.createSpy)();
    var stopSubmit = (0, _expect.createSpy)();
    var touch = (0, _expect.createSpy)();
    var setSubmitFailed = (0, _expect.createSpy)();
    var asyncValidate = (0, _expect.createSpy)().andReturn(Promise.resolve());
    var props = { dispatch: dispatch, startSubmit: startSubmit, stopSubmit: stopSubmit, touch: touch, setSubmitFailed: setSubmitFailed, values: values };

    return (0, _handleSubmit2.default)(submit, props, true, asyncValidate, ['foo', 'baz']).then(function (result) {
      (0, _expect2.default)(result).toBe(69);
      (0, _expect2.default)(asyncValidate).toHaveBeenCalled().toHaveBeenCalledWith();
      (0, _expect2.default)(submit).toHaveBeenCalled().toHaveBeenCalledWith(values, dispatch);
      (0, _expect2.default)(startSubmit).toNotHaveBeenCalled();
      (0, _expect2.default)(stopSubmit).toNotHaveBeenCalled();
      (0, _expect2.default)(touch).toHaveBeenCalled().toHaveBeenCalledWith('foo', 'baz');
      (0, _expect2.default)(setSubmitFailed).toNotHaveBeenCalled();
    });
  });

  it('should async submit if async validation passes', function () {
    var values = { foo: 'bar', baz: 42 };
    var submit = (0, _expect.createSpy)().andReturn(Promise.resolve(69));
    var dispatch = _noop3.default;
    var startSubmit = (0, _expect.createSpy)();
    var stopSubmit = (0, _expect.createSpy)();
    var touch = (0, _expect.createSpy)();
    var setSubmitFailed = (0, _expect.createSpy)();
    var asyncValidate = (0, _expect.createSpy)().andReturn(Promise.resolve());
    var props = { dispatch: dispatch, startSubmit: startSubmit, stopSubmit: stopSubmit, touch: touch, setSubmitFailed: setSubmitFailed, values: values };

    return (0, _handleSubmit2.default)(submit, props, true, asyncValidate, ['foo', 'baz']).then(function (result) {
      (0, _expect2.default)(result).toBe(69);
      (0, _expect2.default)(asyncValidate).toHaveBeenCalled().toHaveBeenCalledWith();
      (0, _expect2.default)(submit).toHaveBeenCalled().toHaveBeenCalledWith(values, dispatch);
      (0, _expect2.default)(startSubmit).toHaveBeenCalled();
      (0, _expect2.default)(stopSubmit).toHaveBeenCalled().toHaveBeenCalledWith();
      (0, _expect2.default)(touch).toHaveBeenCalled().toHaveBeenCalledWith('foo', 'baz');
      (0, _expect2.default)(setSubmitFailed).toNotHaveBeenCalled();
    });
  });

  it('should set submit errors if async submit fails', function (done) {
    var values = { foo: 'bar', baz: 42 };
    var submitErrors = { foo: 'submit error' };
    var submit = (0, _expect.createSpy)().andReturn(Promise.reject(new _SubmissionError2.default(submitErrors)));
    var dispatch = _noop3.default;
    var startSubmit = (0, _expect.createSpy)();
    var stopSubmit = (0, _expect.createSpy)();
    var touch = (0, _expect.createSpy)();
    var setSubmitFailed = (0, _expect.createSpy)();
    var asyncValidate = (0, _expect.createSpy)().andReturn(Promise.resolve());
    var props = { dispatch: dispatch, startSubmit: startSubmit, stopSubmit: stopSubmit, touch: touch, setSubmitFailed: setSubmitFailed, values: values };

    return (0, _handleSubmit2.default)(submit, props, true, asyncValidate, ['foo', 'baz']).then(function (error) {
      (0, _expect2.default)(error).toBe(submitErrors);
      (0, _expect2.default)(asyncValidate).toHaveBeenCalled().toHaveBeenCalledWith();
      (0, _expect2.default)(submit).toHaveBeenCalled().toHaveBeenCalledWith(values, dispatch);
      (0, _expect2.default)(startSubmit).toHaveBeenCalled();
      (0, _expect2.default)(stopSubmit).toHaveBeenCalled().toHaveBeenCalledWith(submitErrors);
      (0, _expect2.default)(touch).toHaveBeenCalled().toHaveBeenCalledWith('foo', 'baz');
      (0, _expect2.default)(setSubmitFailed).toNotHaveBeenCalled();
      done();
    });
  });

  it('should not set errors if rejected value not a SubmissionError', function (done) {
    var values = { foo: 'bar', baz: 42 };
    var submitErrors = { foo: 'submit error' };
    var submit = (0, _expect.createSpy)().andReturn(Promise.reject(submitErrors));
    var dispatch = _noop3.default;
    var startSubmit = (0, _expect.createSpy)();
    var stopSubmit = (0, _expect.createSpy)();
    var touch = (0, _expect.createSpy)();
    var setSubmitFailed = (0, _expect.createSpy)();
    var asyncValidate = (0, _expect.createSpy)().andReturn(Promise.resolve());
    var props = { dispatch: dispatch, startSubmit: startSubmit, stopSubmit: stopSubmit, touch: touch, setSubmitFailed: setSubmitFailed, values: values };

    return (0, _handleSubmit2.default)(submit, props, true, asyncValidate, ['foo', 'baz']).then(function (result) {
      (0, _expect2.default)(result).toBe(undefined);
      (0, _expect2.default)(asyncValidate).toHaveBeenCalled().toHaveBeenCalledWith();
      (0, _expect2.default)(submit).toHaveBeenCalled().toHaveBeenCalledWith(values, dispatch);
      (0, _expect2.default)(startSubmit).toHaveBeenCalled();
      (0, _expect2.default)(stopSubmit).toHaveBeenCalled().toHaveBeenCalledWith(undefined); // not wrapped in SubmissionError
      (0, _expect2.default)(touch).toHaveBeenCalled().toHaveBeenCalledWith('foo', 'baz');
      (0, _expect2.default)(setSubmitFailed).toNotHaveBeenCalled();
      done();
    });
  });

  it('should set submit errors if async submit fails and return rejected promise', function (done) {
    var values = { foo: 'bar', baz: 42 };
    var submitErrors = { foo: 'submit error' };
    var submit = (0, _expect.createSpy)().andReturn(Promise.reject(new _SubmissionError2.default(submitErrors)));
    var dispatch = _noop3.default;
    var startSubmit = (0, _expect.createSpy)();
    var stopSubmit = (0, _expect.createSpy)();
    var touch = (0, _expect.createSpy)();
    var setSubmitFailed = (0, _expect.createSpy)();
    var asyncValidate = (0, _expect.createSpy)().andReturn(Promise.resolve());
    var props = {
      dispatch: dispatch, startSubmit: startSubmit, stopSubmit: stopSubmit, touch: touch, setSubmitFailed: setSubmitFailed, values: values
    };

    return (0, _handleSubmit2.default)(submit, props, true, asyncValidate, ['foo', 'baz']).then(function (error) {
      (0, _expect2.default)(error).toBe(submitErrors);
      (0, _expect2.default)(asyncValidate).toHaveBeenCalled().toHaveBeenCalledWith();
      (0, _expect2.default)(submit).toHaveBeenCalled().toHaveBeenCalledWith(values, dispatch);
      (0, _expect2.default)(startSubmit).toHaveBeenCalled();
      (0, _expect2.default)(stopSubmit).toHaveBeenCalled().toHaveBeenCalledWith(submitErrors);
      (0, _expect2.default)(touch).toHaveBeenCalled().toHaveBeenCalledWith('foo', 'baz');
      (0, _expect2.default)(setSubmitFailed).toNotHaveBeenCalled();
      done();
    });
  });
});