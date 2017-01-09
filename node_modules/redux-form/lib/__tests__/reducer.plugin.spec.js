'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var describePlugin = function describePlugin(vanillaReducer, expect, _ref) {
  var fromJS = _ref.fromJS;
  var deleteIn = _ref.deleteIn;
  return function () {
    it('should initialize state when a plugin is given', function () {
      var reducer = vanillaReducer.plugin({
        foo: function foo(state) {
          return state;
        }
      });
      var state = reducer();
      expect(state).toExist().toBeAMap().toBeSize(0);
    });

    it('should let plugin reducer respond to another action type', function () {
      var state1 = fromJS({
        foo: {
          values: {
            cat: 'dog',
            rat: 'hog'
          },
          fields: {
            cat: { touched: true },
            rat: { touched: true }
          }
        }
      });

      var plugin = function plugin(state, action) {
        if (action.type === 'RAT_POISON') {
          var result = state;
          result = deleteIn(result, 'values.rat');
          result = deleteIn(result, 'fields.rat');
          return result;
        }
        return state;
      };

      var reducer = vanillaReducer.plugin({ foo: plugin });

      var state2 = reducer(state1, { type: 'MILK', form: 'foo' });
      expect(state2).toBe(state1); // no change

      var state3 = reducer(state2, { type: 'RAT_POISON', form: 'foo' });
      expect(state3).toEqualMap({
        foo: {
          values: {
            cat: 'dog'
          },
          fields: {
            cat: { touched: true }
          }
        }
      });
    });

    it('should only respond to form specified', function () {
      var state1 = fromJS({
        foo: {
          values: {
            cat: 'dog',
            rat: 'hog'
          },
          fields: {
            cat: { touched: true },
            rat: { touched: true }
          }
        },
        bar: {
          values: {
            cat: 'dog',
            rat: 'hog'
          },
          fields: {
            cat: { touched: true },
            rat: { touched: true }
          }
        }
      });

      var plugin = function plugin(state, action) {
        if (action.type === 'RAT_POISON') {
          var result = state;
          result = deleteIn(result, 'values.rat');
          result = deleteIn(result, 'fields.rat');
          return result;
        }
        return state;
      };

      var reducer = vanillaReducer.plugin({ foo: plugin });

      var state2 = reducer(state1, { type: 'MILK', form: 'foo' });
      expect(state2).toBe(state1); // no change

      var state3 = reducer(state2, { type: 'RAT_POISON', form: 'foo' });
      expect(state3).toEqualMap({
        foo: {
          values: {
            cat: 'dog'
          },
          fields: {
            cat: { touched: true }
          }
        },
        bar: {
          values: {
            cat: 'dog',
            rat: 'hog'
          },
          fields: {
            cat: { touched: true },
            rat: { touched: true }
          }
        }
      });
    });
  };
};

exports.default = describePlugin;