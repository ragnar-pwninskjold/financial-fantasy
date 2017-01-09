'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _splice = require('../splice');

var _splice2 = _interopRequireDefault(_splice);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('structure.plain.splice', function () {
  it('should insert even when initial array is undefined', function () {
    (0, _expect2.default)((0, _splice2.default)(undefined, 2, 0, 'foo')) // really goes to index 0
    .toBeA('array').toEqual([,, 'foo']); // eslint-disable-line no-sparse-arrays
  });

  it('should insert at start', function () {
    (0, _expect2.default)((0, _splice2.default)(['b', 'c', 'd'], 0, 0, 'a')).toBeA('array').toEqual(['a', 'b', 'c', 'd']);
  });

  it('should insert at end', function () {
    (0, _expect2.default)((0, _splice2.default)(['a', 'b', 'c'], 3, 0, 'd')).toBeA('array').toEqual(['a', 'b', 'c', 'd']);
  });

  it('should insert in middle', function () {
    (0, _expect2.default)((0, _splice2.default)(['a', 'b', 'd'], 2, 0, 'c')).toBeA('array').toEqual(['a', 'b', 'c', 'd']);
  });

  it('should insert in out of range', function () {
    (0, _expect2.default)((0, _splice2.default)(['a', 'b', 'c'], 5, 0, 'f')).toBeA('array').toEqual(['a', 'b', 'c',,, 'f']); // eslint-disable-line no-sparse-arrays
  });

  it('should return empty array when removing and initial array is undefined', function () {
    (0, _expect2.default)((0, _splice2.default)(undefined, 2, 1)).toBeA('array').toEqual([]);
  });

  it('should remove at start', function () {
    (0, _expect2.default)((0, _splice2.default)(['a', 'b', 'c', 'd'], 0, 1)).toBeA('array').toEqual(['b', 'c', 'd']);
  });

  it('should remove at end', function () {
    (0, _expect2.default)((0, _splice2.default)(['a', 'b', 'c', 'd'], 3, 1)).toBeA('array').toEqual(['a', 'b', 'c']);
  });

  it('should remove in middle', function () {
    (0, _expect2.default)((0, _splice2.default)(['a', 'b', 'c', 'd'], 2, 1)).toBeA('array').toEqual(['a', 'b', 'd']);
  });
});