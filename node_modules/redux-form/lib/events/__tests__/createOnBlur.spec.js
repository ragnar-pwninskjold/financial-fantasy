'use strict';

var _noop2 = require('lodash/noop');

var _noop3 = _interopRequireDefault(_noop2);

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _createOnBlur = require('../createOnBlur');

var _createOnBlur2 = _interopRequireDefault(_createOnBlur);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var prepend = function prepend(value) {
  return 'normalized-' + value;
};

describe('createOnBlur', function () {
  it('should return a function', function () {
    (0, _expect2.default)((0, _createOnBlur2.default)()).toExist().toBeA('function');
  });

  it('should return a function that calls blur with name and value', function () {
    var blur = (0, _expect.createSpy)();
    var normalize = (0, _expect.createSpy)(prepend).andCallThrough();
    (0, _createOnBlur2.default)(blur, normalize)('bar');
    (0, _expect2.default)(normalize).toHaveBeenCalled().toHaveBeenCalledWith('bar');
    (0, _expect2.default)(blur).toHaveBeenCalled().toHaveBeenCalledWith('normalized-bar');
  });

  it('should return a function that calls blur with name and value from event', function () {
    var blur = (0, _expect.createSpy)();
    var normalize = (0, _expect.createSpy)(prepend).andCallThrough();
    (0, _createOnBlur2.default)(blur, normalize)({
      target: {
        value: 'bar'
      },
      preventDefault: _noop3.default,
      stopPropagation: _noop3.default
    });
    (0, _expect2.default)(normalize).toHaveBeenCalled().toHaveBeenCalledWith('bar');
    (0, _expect2.default)(blur).toHaveBeenCalled().toHaveBeenCalledWith('normalized-bar');
  });

  it('should return a function that calls blur and then afterBlur with name and value', function () {
    var blur = (0, _expect.createSpy)();
    var normalize = (0, _expect.createSpy)(prepend).andCallThrough();
    var afterBlur = (0, _expect.createSpy)();
    (0, _createOnBlur2.default)(blur, normalize, afterBlur)('bar');
    (0, _expect2.default)(blur).toHaveBeenCalled();
    (0, _expect2.default)(normalize).toHaveBeenCalled();
    (0, _expect2.default)(afterBlur).toHaveBeenCalled().toHaveBeenCalledWith('normalized-bar');
  });
});