'use strict';

var _expect = require('expect');

var _createFieldProps = require('../createFieldProps');

var _createFieldProps2 = _interopRequireDefault(_createFieldProps);

var _plain = require('../structure/plain');

var _plain2 = _interopRequireDefault(_plain);

var _expectations = require('../structure/plain/expectations');

var _expectations2 = _interopRequireDefault(_expectations);

var _immutable = require('../structure/immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _expectations3 = require('../structure/immutable/expectations');

var _expectations4 = _interopRequireDefault(_expectations3);

var _addExpectations = require('./addExpectations');

var _addExpectations2 = _interopRequireDefault(_addExpectations);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var describeCreateFieldProps = function describeCreateFieldProps(name, structure, expect) {
  var empty = structure.empty;
  var getIn = structure.getIn;
  var fromJS = structure.fromJS;


  describe(name, function () {
    it('should pass value through', function () {
      expect((0, _createFieldProps2.default)(getIn, 'foo', { value: 'hello' }).input.value).toBe('hello');
    });

    it('should pass dirty/pristine through', function () {
      expect((0, _createFieldProps2.default)(getIn, 'foo', { dirty: false, pristine: true }).dirty).toBe(false);
      expect((0, _createFieldProps2.default)(getIn, 'foo', { dirty: false, pristine: true }).pristine).toBe(true);
      expect((0, _createFieldProps2.default)(getIn, 'foo', { dirty: true, pristine: false }).dirty).toBe(true);
      expect((0, _createFieldProps2.default)(getIn, 'foo', { dirty: true, pristine: false }).pristine).toBe(false);
    });

    it('should provide onBlur', function () {
      var blur = (0, _expect.createSpy)();
      var normalize = (0, _expect.createSpy)(function (value) {
        return value;
      }).andCallThrough();
      expect(blur).toNotHaveBeenCalled();
      var result = (0, _createFieldProps2.default)(getIn, 'foo', { value: 'bar', blur: blur, normalize: normalize });
      expect(result.input.onBlur).toBeA('function');
      expect(blur).toNotHaveBeenCalled();
      result.input.onBlur('rabbit');
      expect(normalize).toHaveBeenCalled();
      expect(blur).toHaveBeenCalled().toHaveBeenCalledWith('rabbit');
    });

    it('should provide onChange', function () {
      var change = (0, _expect.createSpy)();
      var normalize = (0, _expect.createSpy)(function (value) {
        return value;
      }).andCallThrough();
      expect(change).toNotHaveBeenCalled();
      var result = (0, _createFieldProps2.default)(getIn, 'foo', { value: 'bar', change: change, normalize: normalize });
      expect(result.input.onChange).toBeA('function');
      expect(change).toNotHaveBeenCalled();
      result.input.onChange('rabbit');
      expect(normalize).toHaveBeenCalled();
      expect(change).toHaveBeenCalled().toHaveBeenCalledWith('rabbit');
    });

    it('should provide onFocus', function () {
      var focus = (0, _expect.createSpy)();
      expect(focus).toNotHaveBeenCalled();
      var result = (0, _createFieldProps2.default)(getIn, 'foo', { value: 'bar', focus: focus });
      expect(result.input.onFocus).toBeA('function');
      expect(focus).toNotHaveBeenCalled();
      result.input.onFocus('rabbit');
      expect(focus).toHaveBeenCalled().toHaveBeenCalledWith('foo');
    });

    it('should provide onDragStart', function () {
      var result = (0, _createFieldProps2.default)(getIn, 'foo', { value: 'bar' });
      expect(result.input.onDragStart).toBeA('function');
    });

    it('should provide onDrop', function () {
      var result = (0, _createFieldProps2.default)(getIn, 'foo', { value: 'bar' });
      expect(result.input.onDrop).toBeA('function');
    });

    it('should read active from state', function () {
      var inactiveResult = (0, _createFieldProps2.default)(getIn, 'foo', {
        value: 'bar',
        state: empty
      });
      expect(inactiveResult.active).toBe(false);
      var activeResult = (0, _createFieldProps2.default)(getIn, 'foo', {
        value: 'bar',
        state: fromJS({
          active: true
        })
      });
      expect(activeResult.active).toBe(true);
    });

    it('should read touched from state', function () {
      var untouchedResult = (0, _createFieldProps2.default)(getIn, 'foo', {
        value: 'bar',
        state: empty
      });
      expect(untouchedResult.touched).toBe(false);
      var touchedResult = (0, _createFieldProps2.default)(getIn, 'foo', {
        value: 'bar',
        state: fromJS({
          touched: true
        })
      });
      expect(touchedResult.touched).toBe(true);
    });

    it('should read visited from state', function () {
      var notVisitedResult = (0, _createFieldProps2.default)(getIn, 'foo', {
        value: 'bar',
        state: empty
      });
      expect(notVisitedResult.visited).toBe(false);
      var visitedResult = (0, _createFieldProps2.default)(getIn, 'foo', {
        value: 'bar',
        state: fromJS({
          visited: true
        })
      });
      expect(visitedResult.visited).toBe(true);
    });

    it('should read sync errors from prop', function () {
      var noErrorResult = (0, _createFieldProps2.default)(getIn, 'foo', {
        value: 'bar',
        state: empty
      });
      expect(noErrorResult.error).toNotExist();
      expect(noErrorResult.valid).toBe(true);
      expect(noErrorResult.invalid).toBe(false);
      var errorResult = (0, _createFieldProps2.default)(getIn, 'foo', {
        value: 'bar',
        state: empty,
        syncError: 'This is an error'
      });
      expect(errorResult.error).toBe('This is an error');
      expect(errorResult.valid).toBe(false);
      expect(errorResult.invalid).toBe(true);
    });

    it('should read async errors from state', function () {
      var noErrorResult = (0, _createFieldProps2.default)(getIn, 'foo', {
        value: 'bar',
        state: empty
      });
      expect(noErrorResult.error).toNotExist();
      expect(noErrorResult.valid).toBe(true);
      expect(noErrorResult.invalid).toBe(false);
      var errorResult = (0, _createFieldProps2.default)(getIn, 'foo', {
        value: 'bar',
        state: empty,
        syncError: 'This is an error'
      });
      expect(errorResult.error).toBe('This is an error');
      expect(errorResult.valid).toBe(false);
      expect(errorResult.invalid).toBe(true);
    });

    it('should read submit errors from state', function () {
      var noErrorResult = (0, _createFieldProps2.default)(getIn, 'foo', {
        value: 'bar',
        state: empty
      });
      expect(noErrorResult.error).toNotExist();
      expect(noErrorResult.valid).toBe(true);
      expect(noErrorResult.invalid).toBe(false);
      var errorResult = (0, _createFieldProps2.default)(getIn, 'foo', {
        value: 'bar',
        state: empty,
        submitError: 'This is an error'
      });
      expect(errorResult.error).toBe('This is an error');
      expect(errorResult.valid).toBe(false);
      expect(errorResult.invalid).toBe(true);
    });

    it('should prioritize sync errors over async or submit errors', function () {
      var noErrorResult = (0, _createFieldProps2.default)(getIn, 'foo', {
        value: 'bar',
        state: empty
      });
      expect(noErrorResult.error).toNotExist();
      expect(noErrorResult.valid).toBe(true);
      expect(noErrorResult.invalid).toBe(false);
      var errorResult = (0, _createFieldProps2.default)(getIn, 'foo', {
        value: 'bar',
        asyncError: 'async error',
        submitError: 'submit error',
        syncError: 'sync error'
      });
      expect(errorResult.error).toBe('sync error');
      expect(errorResult.valid).toBe(false);
      expect(errorResult.invalid).toBe(true);
    });

    it('should pass through other props', function () {
      var result = (0, _createFieldProps2.default)(getIn, 'foo', {
        value: 'bar',
        state: empty,
        someOtherProp: 'dog',
        className: 'my-class'
      });
      expect(result.initial).toNotExist();
      expect(result.state).toNotExist();
      expect(result.input.someOtherProp).toBe('dog');
      expect(result.input.className).toBe('my-class');
    });

    it('should pass through other props using props prop', function () {
      var result = (0, _createFieldProps2.default)(getIn, 'foo', {
        value: 'bar',
        state: empty,
        props: {
          someOtherProp: 'dog',
          className: 'my-class'
        }
      });
      expect(result.initial).toNotExist();
      expect(result.state).toNotExist();
      expect(result.input.someOtherProp).toBe('dog');
      expect(result.input.className).toBe('my-class');
    });

    it('should set checked for checkboxes', function () {
      expect((0, _createFieldProps2.default)(getIn, 'foo', {
        state: empty,
        type: 'checkbox'
      }).input.checked).toBe(false);
      expect((0, _createFieldProps2.default)(getIn, 'foo', {
        value: true,
        state: empty,
        type: 'checkbox'
      }).input.checked).toBe(true);
      expect((0, _createFieldProps2.default)(getIn, 'foo', {
        value: false,
        state: empty,
        type: 'checkbox'
      }).input.checked).toBe(false);
    });

    it('should set checked for radio buttons', function () {
      expect((0, _createFieldProps2.default)(getIn, 'foo', {
        state: empty,
        type: 'radio',
        _value: 'bar'
      }).input.checked).toBe(false);
      expect((0, _createFieldProps2.default)(getIn, 'foo', {
        value: 'bar',
        state: empty,
        type: 'radio',
        _value: 'bar'
      }).input.checked).toBe(true);
      expect((0, _createFieldProps2.default)(getIn, 'foo', {
        value: 'baz',
        state: empty,
        type: 'radio',
        _value: 'bar'
      }).input.checked).toBe(false);
    });

    it('should default value to [] for multi-selects', function () {
      expect((0, _createFieldProps2.default)(getIn, 'foo', {
        state: empty,
        type: 'select-multiple'
      }).input.value).toBeA('array').toEqual([]);
    });

    it('should default value to undefined for file inputs', function () {
      expect((0, _createFieldProps2.default)(getIn, 'foo', {
        state: empty,
        type: 'file'
      }).input.value).toEqual(undefined);
    });

    it('should replace undefined value with empty string', function () {
      var result = (0, _createFieldProps2.default)(getIn, 'foo', {
        state: empty
      });
      expect(result.input.value).toBe('');
    });

    it('should replace undefined value with default value provided', function () {
      var defaultValue = {
        foo: 'some complex value'
      };
      var result = (0, _createFieldProps2.default)(getIn, 'foo', {
        state: empty,
        defaultValue: defaultValue
      });
      expect(result.input.value).toBe(defaultValue);
    });
  });
};

describeCreateFieldProps('createFieldProps.plain', _plain2.default, (0, _addExpectations2.default)(_expectations2.default));
describeCreateFieldProps('createFieldProps.immutable', _immutable2.default, (0, _addExpectations2.default)(_expectations4.default));