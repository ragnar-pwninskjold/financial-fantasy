'use strict';

var _hasErrors = require('../hasErrors');

var _hasErrors2 = _interopRequireDefault(_hasErrors);

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

var describeHasErrors = function describeHasErrors(name, structure, expect) {
  var fromJS = structure.fromJS;
  var getIn = structure.getIn;
  var setIn = structure.setIn;

  var hasErrors = (0, _hasErrors2.default)(structure);

  describe(name, function () {
    it('should return false for falsy values', function () {
      expect(hasErrors(undefined)).toBe(false);
      expect(hasErrors(null)).toBe(false);
      expect(hasErrors('')).toBe(false);
      expect(hasErrors(0)).toBe(false);
      expect(hasErrors(false)).toBe(false);
    });

    it('should return false for empty structures', function () {
      expect(hasErrors(fromJS({}))).toBe(false);
      expect(hasErrors(fromJS([]))).toBe(false);
    });

    it('should return structures filled with undefined values', function () {
      expect(hasErrors(fromJS({
        foo: undefined,
        bar: undefined
      }))).toBe(false);
      expect(hasErrors(fromJS([undefined, undefined]))).toBe(false);
    });

    it('should return false for deeply nested structures with undefined values', function () {
      expect(hasErrors(fromJS({
        nested: {
          myArrayField: [undefined, undefined]
        }
      }))).toBe(false);
      expect(hasErrors(fromJS({
        nested: {
          deeper: {
            foo: undefined,
            bar: undefined
          }
        }
      }))).toBe(false);
    });

    it('should return true for non-empty strings', function () {
      expect(hasErrors('dog')).toBe(true);
      expect(hasErrors(true)).toBe(false);
      expect(hasErrors(42)).toBe(false);
    });

    it('should return true for an empty array with a string error under _error key', function () {
      var errors = setIn(fromJS([]), '_error', 'oh no!');
      if (getIn(errors, '_error') === 'oh no!') {
        // cannot work for Immutable Lists because you can not set a value under a string key
        expect(hasErrors(errors)).toBe(true);
      }
    });

    it('should return true for an empty array with an object error under _error key', function () {
      var errors = setIn(fromJS([]), '_error', { complex: 'error' });
      if (getIn(errors, '_error')) {
        // cannot work for Immutable Lists because you can not set a value under a string key
        expect(hasErrors(errors)).toBe(true);
      }
    });
  });
};

describeHasErrors('hasErrors.plain', _plain2.default, (0, _addExpectations2.default)(_expectations2.default));
describeHasErrors('hasErrors.immutable', _immutable2.default, (0, _addExpectations2.default)(_expectations4.default));