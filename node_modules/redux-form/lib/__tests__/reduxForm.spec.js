'use strict';

var _noop2 = require('lodash/noop');

var _noop3 = _interopRequireDefault(_noop2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

var _expect = require('expect');

var _redux = require('redux');

var _reduxImmutablejs = require('redux-immutablejs');

var _reactRedux = require('react-redux');

var _reducer = require('../reducer');

var _reducer2 = _interopRequireDefault(_reducer);

var _reduxForm = require('../reduxForm');

var _reduxForm2 = _interopRequireDefault(_reduxForm);

var _Field = require('../Field');

var _Field2 = _interopRequireDefault(_Field);

var _FieldArray = require('../FieldArray');

var _FieldArray2 = _interopRequireDefault(_FieldArray);

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

var _SubmissionError = require('../SubmissionError');

var _SubmissionError2 = _interopRequireDefault(_SubmissionError);

var _actions = require('../actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint react/no-multi-comp:0 */


var describeReduxForm = function describeReduxForm(name, structure, combineReducers, expect) {
  var fromJS = structure.fromJS;
  var getIn = structure.getIn;

  var reduxForm = (0, _reduxForm2.default)(structure);
  var Field = (0, _Field2.default)(structure);
  var FieldArray = (0, _FieldArray2.default)(structure);
  var reducer = (0, _reducer2.default)(structure);

  describe(name, function () {
    var makeStore = function makeStore() {
      var initial = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      return (0, _redux.createStore)(combineReducers({ form: reducer }), fromJS({ form: initial }));
    };

    var propChecker = function propChecker(formState) {
      var renderSpy = arguments.length <= 1 || arguments[1] === undefined ? _noop3.default : arguments[1];
      var config = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var store = makeStore({ testForm: formState });

      var Form = function (_Component) {
        _inherits(Form, _Component);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, Object.getPrototypeOf(Form).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            renderSpy(this.props);
            return _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement(Field, { name: 'foo', component: 'input' })
            );
          }
        }]);

        return Form;
      }(_react.Component);

      var Decorated = reduxForm(_extends({ form: 'testForm' }, config))(Form);
      var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(Decorated, null)
      ));
      return _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Form).props;
    };

    it('should return a decorator function', function () {
      expect(reduxForm).toBeA('function');
    });

    it('should render without error', function () {
      var store = makeStore();

      var Form = function (_Component2) {
        _inherits(Form, _Component2);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, Object.getPrototypeOf(Form).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return _react2.default.createElement('div', null);
          }
        }]);

        return Form;
      }(_react.Component);

      expect(function () {
        var Decorated = reduxForm({ form: 'testForm' })(Form);
        _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(Decorated, null)
        ));
      }).toNotThrow();
    });

    it('should provide dispatch prop', function () {
      expect(propChecker({}).dispatch).toExist().toBeA('function');
    });

    it('should provide dirty prop', function () {
      expect(propChecker({}).dirty).toBe(false);
      expect(propChecker({
        // no initial values
        values: {
          foo: 'bar'
        }
      }).dirty).toBe(true);
      expect(propChecker({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'bar'
        }
      }).dirty).toBe(false);
      expect(propChecker({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'baz'
        }
      }).dirty).toBe(true);
    });

    it('should provide pristine prop', function () {
      expect(propChecker({}).pristine).toBe(true);
      expect(propChecker({
        // no initial values
        values: {
          foo: 'bar'
        }
      }).pristine).toBe(false);
      expect(propChecker({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'bar'
        }
      }).pristine).toBe(true);
      expect(propChecker({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'baz'
        }
      }).pristine).toBe(false);
    });

    it('should provide valid prop', function () {
      expect(propChecker({}).valid).toBe(true);
      expect(propChecker({}, undefined, {
        validate: function validate() {
          return { foo: 'sync error' };
        }
      }).valid).toBe(false);
      expect(propChecker({
        asyncErrors: {
          foo: 'bar'
        }
      }).valid).toBe(false);
      expect(propChecker({
        asyncErrors: {
          nested: {
            myArrayField: [undefined, undefined]
          }
        }
      }).valid).toBe(true);
    });

    it('should provide invalid prop', function () {
      expect(propChecker({}).invalid).toBe(false);
      expect(propChecker({}, undefined, {
        validate: function validate() {
          return { foo: 'sync error' };
        }
      }).invalid).toBe(true);
      expect(propChecker({
        asyncErrors: {
          foo: 'bar'
        }
      }).invalid).toBe(true);
    });

    it('should provide submitting prop', function () {
      expect(propChecker({}).submitting).toBe(false);
      expect(propChecker({ submitting: true }).submitting).toBe(true);
      expect(propChecker({ submitting: false }).submitting).toBe(false);
    });

    it('should put props under prop namespace if specified', function () {
      var props = propChecker({}, _noop3.default, {
        propNamespace: 'fooProps',
        someOtherProp: 'whatever'
      });
      expect(props.fooProps).toExist().toBeA('object');
      expect(props.dispatch).toNotExist();
      expect(props.dirty).toNotExist();
      expect(props.pristine).toNotExist();
      expect(props.submitting).toNotExist();
      expect(props.someOtherProp).toExist();
      expect(props.fooProps.dispatch).toBeA('function');
      expect(props.fooProps.dirty).toBeA('boolean');
      expect(props.fooProps.pristine).toBeA('boolean');
      expect(props.fooProps.submitting).toBeA('boolean');
      expect(props.fooProps.someOtherProp).toNotExist();
    });

    it('should provide bound array action creators', function () {
      var arrayProp = propChecker({}).array;
      expect(arrayProp).toExist();
      expect(arrayProp.insert).toExist().toBeA('function');
      expect(arrayProp.pop).toExist().toBeA('function');
      expect(arrayProp.push).toExist().toBeA('function');
      expect(arrayProp.remove).toExist().toBeA('function');
      expect(arrayProp.shift).toExist().toBeA('function');
      expect(arrayProp.splice).toExist().toBeA('function');
      expect(arrayProp.swap).toExist().toBeA('function');
      expect(arrayProp.unshift).toExist().toBeA('function');
    });

    it('should not rerender unless form-wide props (except value!) change', function () {
      var spy = (0, _expect.createSpy)();

      var _propChecker = propChecker({}, spy, {
        validate: function validate(values) {
          var foo = getIn(values, 'foo');
          return foo && foo.length > 5 ? { foo: 'Too long' } : {};
        }
      });

      var dispatch = _propChecker.dispatch; // render 0

      expect(spy.calls.length).toBe(1);

      // simulate typing the word "giraffe"
      dispatch((0, _actions.change)('testForm', 'foo', 'g')); // render 1 (now dirty)
      expect(spy.calls.length).toBe(2);

      dispatch((0, _actions.change)('testForm', 'foo', 'gi')); // no render
      dispatch((0, _actions.change)('testForm', 'foo', 'gir')); // no render
      dispatch((0, _actions.change)('testForm', 'foo', 'gira')); // no render
      dispatch((0, _actions.change)('testForm', 'foo', 'giraf')); // no render
      dispatch((0, _actions.change)('testForm', 'foo', 'giraff')); // render 2 (invalid)
      expect(spy.calls.length).toBe(3);
      dispatch((0, _actions.change)('testForm', 'foo', 'giraffe')); // no render

      dispatch((0, _actions.change)('testForm', 'foo', '')); // render 3 (clean/valid)
      expect(spy.calls.length).toBe(5); // two renders, one to change value, and other to revalidate

      expect(spy.calls[0].arguments[0].dirty).toBe(false);
      expect(spy.calls[0].arguments[0].invalid).toBe(false);
      expect(spy.calls[0].arguments[0].pristine).toBe(true);
      expect(spy.calls[0].arguments[0].valid).toBe(true);

      expect(spy.calls[1].arguments[0].dirty).toBe(true);
      expect(spy.calls[1].arguments[0].invalid).toBe(false);
      expect(spy.calls[1].arguments[0].pristine).toBe(false);
      expect(spy.calls[1].arguments[0].valid).toBe(true);

      expect(spy.calls[2].arguments[0].dirty).toBe(true);
      expect(spy.calls[2].arguments[0].invalid).toBe(true);
      expect(spy.calls[2].arguments[0].pristine).toBe(false);
      expect(spy.calls[2].arguments[0].valid).toBe(false);

      expect(spy.calls[4].arguments[0].dirty).toBe(false);
      expect(spy.calls[4].arguments[0].invalid).toBe(false);
      expect(spy.calls[4].arguments[0].pristine).toBe(true);
      expect(spy.calls[4].arguments[0].valid).toBe(true);
    });

    it('should initialize values with initialValues on first render', function () {
      var store = makeStore({});
      var inputRender = (0, _expect.createSpy)(function (props) {
        return _react2.default.createElement('input', props.input);
      }).andCallThrough();
      var formRender = (0, _expect.createSpy)();
      var initialValues = {
        deep: {
          foo: 'bar'
        }
      };

      var Form = function (_Component3) {
        _inherits(Form, _Component3);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, Object.getPrototypeOf(Form).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            formRender(this.props);
            return _react2.default.createElement(
              'form',
              null,
              _react2.default.createElement(Field, { name: 'deep.foo', component: inputRender, type: 'text' })
            );
          }
        }]);

        return Form;
      }(_react.Component);

      var Decorated = reduxForm({ form: 'testForm' })(Form);
      _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(Decorated, { initialValues: initialValues })
      ));
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            initial: initialValues,
            values: initialValues,
            registeredFields: [{ name: 'deep.foo', type: 'Field' }]
          }
        }
      });
      expect(formRender).toHaveBeenCalled();
      expect(formRender.calls.length).toBe(1);
      var checkProps = function checkProps(props) {
        expect(props.pristine).toBe(true);
        expect(props.dirty).toBe(false);
        expect(props.initialized).toBe(false); // will be true on second render
      };
      checkProps(formRender.calls[0].arguments[0]);

      expect(inputRender).toHaveBeenCalled();
      expect(inputRender.calls.length).toBe(1);
      expect(inputRender.calls[0].arguments[0].pristine).toBe(true);
      expect(inputRender.calls[0].arguments[0].dirty).toBe(false);
      expect(inputRender.calls[0].arguments[0].input.value).toBe('bar');
    });

    it('should initialize with initialValues on later render if not already initialized', function () {
      var store = makeStore({});
      var inputRender = (0, _expect.createSpy)(function (props) {
        return _react2.default.createElement('input', props.input);
      }).andCallThrough();
      var formRender = (0, _expect.createSpy)();
      var initialValues = {
        deep: {
          foo: 'bar'
        }
      };

      var Form = function (_Component4) {
        _inherits(Form, _Component4);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, Object.getPrototypeOf(Form).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            formRender(this.props);
            return _react2.default.createElement(
              'form',
              null,
              _react2.default.createElement(Field, { name: 'deep.foo', component: inputRender, type: 'text' })
            );
          }
        }]);

        return Form;
      }(_react.Component);

      var Decorated = reduxForm({ form: 'testForm' })(Form);

      var Container = function (_Component5) {
        _inherits(Container, _Component5);

        function Container(props) {
          _classCallCheck(this, Container);

          var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(Container).call(this, props));

          _this5.state = {};
          return _this5;
        }

        _createClass(Container, [{
          key: 'render',
          value: function render() {
            var _this6 = this;

            return _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement(
                _reactRedux.Provider,
                { store: store },
                _react2.default.createElement(Decorated, this.state)
              ),
              _react2.default.createElement(
                'button',
                { onClick: function onClick() {
                    return _this6.setState({ initialValues: initialValues });
                  } },
                'Init'
              )
            );
          }
        }]);

        return Container;
      }(_react.Component);

      var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(Container, null));
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [{ name: 'deep.foo', type: 'Field' }]
          }
        }
      });
      expect(formRender).toHaveBeenCalled();
      expect(formRender.calls.length).toBe(1);

      expect(inputRender).toHaveBeenCalled();
      expect(inputRender.calls.length).toBe(1);
      var checkInputProps = function checkInputProps(props, value) {
        expect(props.pristine).toBe(true);
        expect(props.dirty).toBe(false);
        expect(props.input.value).toBe(value);
      };
      checkInputProps(inputRender.calls[0].arguments[0], '');

      // initialize
      var initButton = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(dom, 'button');
      _reactAddonsTestUtils2.default.Simulate.click(initButton);

      // check initialized state
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [{
              name: 'deep.foo',
              type: 'Field'
            }],
            initial: initialValues,
            values: initialValues
          }
        }
      });

      // no need to rerender form on initialize
      expect(formRender.calls.length).toBe(1);

      // check rerendered input
      expect(inputRender.calls.length).toBe(2);
      checkInputProps(inputRender.calls[1].arguments[0], 'bar');
    });

    it('should NOT reinitialize with initialValues', function () {
      var store = makeStore({});
      var inputRender = (0, _expect.createSpy)(function (props) {
        return _react2.default.createElement('input', props.input);
      }).andCallThrough();
      var formRender = (0, _expect.createSpy)();
      var initialValues1 = {
        deep: {
          foo: 'bar'
        }
      };
      var initialValues2 = {
        deep: {
          foo: 'baz'
        }
      };

      var Form = function (_Component6) {
        _inherits(Form, _Component6);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, Object.getPrototypeOf(Form).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            formRender(this.props);
            return _react2.default.createElement(
              'form',
              null,
              _react2.default.createElement(Field, { name: 'deep.foo', component: inputRender, type: 'text' })
            );
          }
        }]);

        return Form;
      }(_react.Component);

      var Decorated = reduxForm({ form: 'testForm' })(Form);

      var Container = function (_Component7) {
        _inherits(Container, _Component7);

        function Container(props) {
          _classCallCheck(this, Container);

          var _this8 = _possibleConstructorReturn(this, Object.getPrototypeOf(Container).call(this, props));

          _this8.state = { initialValues: initialValues1 };
          return _this8;
        }

        _createClass(Container, [{
          key: 'render',
          value: function render() {
            var _this9 = this;

            return _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement(
                _reactRedux.Provider,
                { store: store },
                _react2.default.createElement(Decorated, this.state)
              ),
              _react2.default.createElement(
                'button',
                { onClick: function onClick() {
                    return _this9.setState({ initialValues: initialValues2 });
                  } },
                'Init'
              )
            );
          }
        }]);

        return Container;
      }(_react.Component);

      var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(Container, null));
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [{ name: 'deep.foo', type: 'Field' }],
            initial: initialValues1,
            values: initialValues1
          }
        }
      });
      expect(formRender).toHaveBeenCalled();
      expect(formRender.calls.length).toBe(1);

      expect(inputRender).toHaveBeenCalled();
      expect(inputRender.calls.length).toBe(1);
      var checkInputProps = function checkInputProps(props, value) {
        expect(props.pristine).toBe(true);
        expect(props.dirty).toBe(false);
        expect(props.input.value).toBe(value);
      };
      checkInputProps(inputRender.calls[0].arguments[0], 'bar');

      // initialize
      var initButton = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(dom, 'button');
      _reactAddonsTestUtils2.default.Simulate.click(initButton);

      // check initialized state
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [{
              name: 'deep.foo',
              type: 'Field'
            }],
            initial: initialValues1,
            values: initialValues1
          }
        }
      });

      // rerender just because prop changed
      expect(formRender.calls.length).toBe(2);

      // no need to rerender input since nothing changed
      expect(inputRender.calls.length).toBe(1);
    });

    it('should reinitialize with initialValues if enableReinitialize', function () {
      var store = makeStore({});
      var inputRender = (0, _expect.createSpy)(function (props) {
        return _react2.default.createElement('input', props.input);
      }).andCallThrough();
      var formRender = (0, _expect.createSpy)();
      var initialValues1 = {
        deep: {
          foo: 'bar'
        }
      };
      var initialValues2 = {
        deep: {
          foo: 'baz'
        }
      };

      var Form = function (_Component8) {
        _inherits(Form, _Component8);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, Object.getPrototypeOf(Form).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            formRender(this.props);
            return _react2.default.createElement(
              'form',
              null,
              _react2.default.createElement(Field, { name: 'deep.foo', component: inputRender, type: 'text' })
            );
          }
        }]);

        return Form;
      }(_react.Component);

      var Decorated = reduxForm({
        form: 'testForm',
        enableReinitialize: true
      })(Form);

      var Container = function (_Component9) {
        _inherits(Container, _Component9);

        function Container(props) {
          _classCallCheck(this, Container);

          var _this11 = _possibleConstructorReturn(this, Object.getPrototypeOf(Container).call(this, props));

          _this11.state = { initialValues: initialValues1 };
          return _this11;
        }

        _createClass(Container, [{
          key: 'render',
          value: function render() {
            var _this12 = this;

            return _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement(
                _reactRedux.Provider,
                { store: store },
                _react2.default.createElement(Decorated, this.state)
              ),
              _react2.default.createElement(
                'button',
                { onClick: function onClick() {
                    return _this12.setState({ initialValues: initialValues2 });
                  } },
                'Init'
              )
            );
          }
        }]);

        return Container;
      }(_react.Component);

      var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(Container, null));
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [{ name: 'deep.foo', type: 'Field' }],
            initial: initialValues1,
            values: initialValues1
          }
        }
      });
      expect(formRender).toHaveBeenCalled();
      expect(formRender.calls.length).toBe(1);

      expect(inputRender).toHaveBeenCalled();
      expect(inputRender.calls.length).toBe(1);
      var checkInputProps = function checkInputProps(props, value) {
        expect(props.pristine).toBe(true);
        expect(props.dirty).toBe(false);
        expect(props.input.value).toBe(value);
      };
      checkInputProps(inputRender.calls[0].arguments[0], 'bar');

      // initialize
      var initButton = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(dom, 'button');
      _reactAddonsTestUtils2.default.Simulate.click(initButton);

      // check initialized state
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [{
              name: 'deep.foo',
              type: 'Field'
            }],
            initial: initialValues2,
            values: initialValues2
          }
        }
      });

      // rerendered twice because prop changed and values initialized
      expect(formRender.calls.length).toBe(3);

      // should rerender input with new value
      expect(inputRender.calls.length).toBe(2);
      checkInputProps(inputRender.calls[1].arguments[0], 'baz');
    });

    it('should destroy on unmount by default', function () {
      var store = makeStore({});
      var inputRender = (0, _expect.createSpy)(function (props) {
        return _react2.default.createElement('input', props.input);
      }).andCallThrough();
      var formRender = (0, _expect.createSpy)();

      var Form = function (_Component10) {
        _inherits(Form, _Component10);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, Object.getPrototypeOf(Form).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            formRender(this.props);
            return _react2.default.createElement(
              'form',
              null,
              _react2.default.createElement(Field, { name: 'deep.foo', component: inputRender, type: 'text' })
            );
          }
        }]);

        return Form;
      }(_react.Component);

      var Decorated = reduxForm({
        form: 'testForm'
      })(Form);

      var Container = function (_Component11) {
        _inherits(Container, _Component11);

        function Container(props) {
          _classCallCheck(this, Container);

          var _this14 = _possibleConstructorReturn(this, Object.getPrototypeOf(Container).call(this, props));

          _this14.state = { showForm: true };
          return _this14;
        }

        _createClass(Container, [{
          key: 'render',
          value: function render() {
            var _this15 = this;

            var showForm = this.state.showForm;

            return _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement(
                _reactRedux.Provider,
                { store: store },
                _react2.default.createElement(
                  'div',
                  null,
                  showForm && _react2.default.createElement(Decorated, this.state)
                )
              ),
              _react2.default.createElement(
                'button',
                { onClick: function onClick() {
                    return _this15.setState({ showForm: !showForm });
                  } },
                'Toggle'
              )
            );
          }
        }]);

        return Container;
      }(_react.Component);

      var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(Container, null));
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [{ name: 'deep.foo', type: 'Field' }]
          }
        }
      }, 'Form data in Redux did not get destroyed');
      expect(formRender).toHaveBeenCalled();
      expect(formRender.calls.length).toBe(1);

      expect(inputRender).toHaveBeenCalled();
      expect(inputRender.calls.length).toBe(1);
      expect(inputRender.calls[0].arguments[0].input.value).toBe('');

      // change field
      inputRender.calls[0].arguments[0].input.onChange('bob');

      // form rerenders because now dirty
      expect(formRender.calls.length).toBe(2);

      // input now has value
      expect(inputRender.calls.length).toBe(2);
      expect(inputRender.calls[1].arguments[0].input.value).toBe('bob');

      // check state
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            values: {
              deep: {
                foo: 'bob'
              }
            },
            registeredFields: [{ name: 'deep.foo', type: 'Field' }]
          }
        }
      });

      // unmount form
      var toggle = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(dom, 'button');
      _reactAddonsTestUtils2.default.Simulate.click(toggle);

      // check clean state
      expect(store.getState()).toEqualMap({
        form: {}
      });

      // form still not rendered again
      expect(formRender.calls.length).toBe(2);

      // toggle form back into existence
      _reactAddonsTestUtils2.default.Simulate.click(toggle);

      // form is back
      expect(formRender.calls.length).toBe(3);

      // input is back, but without value
      expect(inputRender.calls.length).toBe(3);
      expect(inputRender.calls[2].arguments[0].input.value).toBe('');
    });

    it('should not destroy on unmount if told not to', function () {
      var store = makeStore({});
      var inputRender = (0, _expect.createSpy)(function (props) {
        return _react2.default.createElement('input', props.input);
      }).andCallThrough();
      var formRender = (0, _expect.createSpy)();

      var Form = function (_Component12) {
        _inherits(Form, _Component12);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, Object.getPrototypeOf(Form).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            formRender(this.props);
            return _react2.default.createElement(
              'form',
              null,
              _react2.default.createElement(Field, { name: 'deep.foo', component: inputRender, type: 'text' })
            );
          }
        }]);

        return Form;
      }(_react.Component);

      var Decorated = reduxForm({
        form: 'testForm',
        destroyOnUnmount: false
      })(Form);

      var Container = function (_Component13) {
        _inherits(Container, _Component13);

        function Container(props) {
          _classCallCheck(this, Container);

          var _this17 = _possibleConstructorReturn(this, Object.getPrototypeOf(Container).call(this, props));

          _this17.state = { showForm: true };
          return _this17;
        }

        _createClass(Container, [{
          key: 'render',
          value: function render() {
            var _this18 = this;

            var showForm = this.state.showForm;

            return _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement(
                _reactRedux.Provider,
                { store: store },
                _react2.default.createElement(
                  'div',
                  null,
                  showForm && _react2.default.createElement(Decorated, this.state)
                )
              ),
              _react2.default.createElement(
                'button',
                { onClick: function onClick() {
                    return _this18.setState({ showForm: !showForm });
                  } },
                'Toggle'
              )
            );
          }
        }]);

        return Container;
      }(_react.Component);

      var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(Container, null));
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [{ name: 'deep.foo', type: 'Field' }]
          }
        }
      }, 'Form data in Redux did not get destroyed');
      expect(formRender).toHaveBeenCalled();
      expect(formRender.calls.length).toBe(1);

      expect(inputRender).toHaveBeenCalled();
      expect(inputRender.calls.length).toBe(1);
      expect(inputRender.calls[0].arguments[0].input.value).toBe('');

      // change field
      inputRender.calls[0].arguments[0].input.onChange('bob');

      // form rerenders because now dirty
      expect(formRender.calls.length).toBe(2);

      // input now has value
      expect(inputRender.calls.length).toBe(2);
      expect(inputRender.calls[1].arguments[0].input.value).toBe('bob');

      // check state
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            values: {
              deep: {
                foo: 'bob'
              }
            },
            registeredFields: [{ name: 'deep.foo', type: 'Field' }]
          }
        }
      });

      // unmount form
      var toggle = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(dom, 'button');
      _reactAddonsTestUtils2.default.Simulate.click(toggle);

      // check state not destroyed
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            values: {
              deep: {
                foo: 'bob'
              }
            }
          }
        }
      });

      // form still not rendered again
      expect(formRender.calls.length).toBe(2);

      // toggle form back into existence
      _reactAddonsTestUtils2.default.Simulate.click(toggle);

      // form is back
      expect(formRender.calls.length).toBe(3);

      // input is back, with its old value
      expect(inputRender.calls.length).toBe(3);
      expect(inputRender.calls[2].arguments[0].input.value).toBe('bob');
    });

    it('should keep a list of registered fields', function () {
      var store = makeStore({});
      var noopRender = function noopRender() {
        return _react2.default.createElement('div', null);
      };

      var Form = function (_Component14) {
        _inherits(Form, _Component14);

        function Form() {
          _classCallCheck(this, Form);

          var _this19 = _possibleConstructorReturn(this, Object.getPrototypeOf(Form).call(this));

          _this19.state = { showBar: false };
          return _this19;
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            var _this20 = this;

            var showBar = this.state.showBar;

            return _react2.default.createElement(
              'form',
              null,
              !showBar && _react2.default.createElement(Field, { name: 'foo', component: 'input', type: 'text' }),
              !showBar && _react2.default.createElement(FieldArray, { name: 'fooArray', component: noopRender, type: 'text' }),
              showBar && _react2.default.createElement(Field, { name: 'bar', component: 'input', type: 'text' }),
              showBar && _react2.default.createElement(FieldArray, { name: 'barArray', component: noopRender, type: 'text' }),
              _react2.default.createElement(
                'button',
                { onClick: function onClick() {
                    return _this20.setState({ showBar: true });
                  } },
                'Show Bar'
              )
            );
          }
        }]);

        return Form;
      }(_react.Component);

      var Decorated = reduxForm({ form: 'testForm' })(Form);

      var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(Decorated, null)
      ));

      var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Decorated);
      expect(stub.fieldList).toEqual(fromJS(['foo', 'fooArray']));

      // switch fields
      var button = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(dom, 'button');
      _reactAddonsTestUtils2.default.Simulate.click(button);

      expect(stub.fieldList).toEqual(fromJS(['bar', 'barArray']));
    });

    it('should provide valid/invalid/values/dirty/pristine getters', function () {
      var store = makeStore({});
      var input = (0, _expect.createSpy)(function (props) {
        return _react2.default.createElement('input', props.input);
      }).andCallThrough();

      var Form = function Form() {
        return _react2.default.createElement(
          'form',
          null,
          _react2.default.createElement(Field, { name: 'bar', component: input, type: 'text' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm',
        validate: function validate(values) {
          return getIn(values, 'bar') ? {} : { bar: 'Required' };
        }
      })(Form);

      var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(Decorated, null)
      ));

      var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Decorated);

      // invalid because no value for 'bar' field
      expect(stub.dirty).toBe(false);
      expect(stub.pristine).toBe(true);
      expect(stub.valid).toBe(false);
      expect(stub.invalid).toBe(true);
      expect(stub.values).toEqualMap({});

      // set value for 'bar' field
      input.calls[0].arguments[0].input.onChange('foo');

      // valid because we have a value for 'bar' field
      expect(stub.dirty).toBe(true);
      expect(stub.pristine).toBe(false);
      expect(stub.valid).toBe(true);
      expect(stub.invalid).toBe(false);
      expect(stub.values).toEqualMap({ bar: 'foo' });
    });

    it('should mark all fields as touched on submit', function () {
      var store = makeStore({
        testForm: {}
      });
      var username = (0, _expect.createSpy)(function (props) {
        return _react2.default.createElement('input', _extends({}, props.input, { type: 'text' }));
      }).andCallThrough();
      var password = (0, _expect.createSpy)(function (props) {
        return _react2.default.createElement('input', _extends({}, props.input, { type: 'password' }));
      }).andCallThrough();

      var Form = function Form() {
        return _react2.default.createElement(
          'form',
          null,
          _react2.default.createElement(Field, { name: 'username', component: username, type: 'text' }),
          _react2.default.createElement(Field, { name: 'password', component: password, type: 'text' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm',
        onSubmit: function onSubmit() {
          return { _error: 'Login Failed' };
        }
      })(Form);

      var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(Decorated, null)
      ));

      var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Decorated);

      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [{ name: 'username', type: 'Field' }, { name: 'password', type: 'Field' }]
          }
        }
      });

      expect(username).toHaveBeenCalled();
      expect(username.calls[0].arguments[0].touched).toBe(false);

      expect(password).toHaveBeenCalled();
      expect(password.calls[0].arguments[0].touched).toBe(false);

      expect(stub.submit).toBeA('function');
      stub.submit();

      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [{ name: 'username', type: 'Field' }, { name: 'password', type: 'Field' }],
            anyTouched: true,
            fields: {
              username: {
                touched: true
              },
              password: {
                touched: true
              }
            }
          }
        }
      });

      expect(username.calls.length).toBe(2);
      expect(username.calls[1].arguments[0].touched).toBe(true);

      expect(password.calls.length).toBe(2);
      expect(password.calls[1].arguments[0].touched).toBe(true);
    });

    it('should call onSubmitFail with errors if sync submit fails by throwing SubmissionError', function () {
      var store = makeStore({
        testForm: {}
      });
      var errors = { username: 'Required' };
      var onSubmitFail = (0, _expect.createSpy)();

      var Form = function Form() {
        return _react2.default.createElement(
          'form',
          null,
          _react2.default.createElement(Field, { name: 'username', component: 'input', type: 'text' }),
          _react2.default.createElement(Field, { name: 'password', component: 'input', type: 'text' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm',
        onSubmit: function onSubmit() {
          throw new _SubmissionError2.default(errors);
        },
        onSubmitFail: onSubmitFail
      })(Form);

      var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(Decorated, null)
      ));

      var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Decorated);

      expect(stub.submit).toBeA('function');

      expect(onSubmitFail).toNotHaveBeenCalled();

      var caught = stub.submit();

      expect(onSubmitFail).toHaveBeenCalled().toHaveBeenCalledWith(errors, store.dispatch);
      expect(caught).toBe(errors);
    });

    it('should call onSubmitFail with undefined if sync submit fails by throwing other error', function () {
      var store = makeStore({
        testForm: {}
      });
      var onSubmitFail = (0, _expect.createSpy)();

      var Form = function Form() {
        return _react2.default.createElement(
          'form',
          null,
          _react2.default.createElement(Field, { name: 'username', component: 'input', type: 'text' }),
          _react2.default.createElement(Field, { name: 'password', component: 'input', type: 'text' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm',
        onSubmit: function onSubmit() {
          throw new Error('Some other error');
        },
        onSubmitFail: onSubmitFail
      })(Form);

      var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(Decorated, null)
      ));

      var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Decorated);

      expect(stub.submit).toBeA('function');

      expect(onSubmitFail).toNotHaveBeenCalled();

      var caught = stub.submit();

      expect(onSubmitFail).toHaveBeenCalled().toHaveBeenCalledWith(undefined, store.dispatch);
      expect(caught).toNotExist();
    });

    it('should call onSubmitFail if async submit fails', function (done) {
      var store = makeStore({
        testForm: {}
      });
      var errors = { username: 'Required' };
      var onSubmitFail = (0, _expect.createSpy)();

      var Form = function Form() {
        return _react2.default.createElement(
          'form',
          null,
          _react2.default.createElement(Field, { name: 'username', component: 'input', type: 'text' }),
          _react2.default.createElement(Field, { name: 'password', component: 'input', type: 'text' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm',
        onSubmit: function onSubmit() {
          return Promise.reject(new _SubmissionError2.default(errors));
        },
        onSubmitFail: onSubmitFail
      })(Form);

      var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(Decorated, null)
      ));

      var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Decorated);

      expect(stub.submit).toBeA('function');

      expect(onSubmitFail).toNotHaveBeenCalled();

      return stub.submit().then(function (caught) {
        expect(onSubmitFail).toHaveBeenCalled().toHaveBeenCalledWith(errors, store.dispatch);
        expect(caught).toBe(errors);
        done();
      });
    });

    it('should call onSubmitFail if sync validation prevents submit', function () {
      var store = makeStore({
        testForm: {}
      });
      var errors = { username: 'Required' };
      var onSubmit = (0, _expect.createSpy)();
      var onSubmitFail = (0, _expect.createSpy)();

      var Form = function Form() {
        return _react2.default.createElement(
          'form',
          null,
          _react2.default.createElement(Field, { name: 'username', component: 'input', type: 'text' }),
          _react2.default.createElement(Field, { name: 'password', component: 'input', type: 'text' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm',
        onSubmit: onSubmit,
        onSubmitFail: onSubmitFail,
        validate: function validate() {
          return errors;
        }
      })(Form);

      var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(Decorated, null)
      ));

      var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Decorated);

      expect(stub.submit).toBeA('function');

      expect(onSubmitFail).toNotHaveBeenCalled();
      expect(onSubmit).toNotHaveBeenCalled();

      var result = stub.submit();
      expect(onSubmit).toNotHaveBeenCalled();
      expect(onSubmitFail).toHaveBeenCalled().toHaveBeenCalledWith(errors, store.dispatch);
      expect(result).toBe(errors);
    });

    it('should call onSubmitFail if async validation prevents submit', function (done) {
      var store = makeStore({
        testForm: {}
      });
      var errors = { username: 'Required' };
      var onSubmit = (0, _expect.createSpy)();
      var onSubmitFail = (0, _expect.createSpy)();

      var Form = function Form() {
        return _react2.default.createElement(
          'form',
          null,
          _react2.default.createElement(Field, { name: 'username', component: 'input', type: 'text' }),
          _react2.default.createElement(Field, { name: 'password', component: 'input', type: 'text' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm',
        asyncValidate: function asyncValidate() {
          return Promise.reject(errors);
        },
        onSubmit: onSubmit,
        onSubmitFail: onSubmitFail
      })(Form);

      var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(Decorated, null)
      ));

      var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Decorated);

      expect(stub.submit).toBeA('function');

      expect(onSubmit).toNotHaveBeenCalled();
      expect(onSubmitFail).toNotHaveBeenCalled();

      return stub.submit().catch(function (error) {
        expect(onSubmit).toNotHaveBeenCalled();
        expect(onSubmitFail).toHaveBeenCalled().toHaveBeenCalledWith(errors, store.dispatch);
        expect(error).toBe(errors);
        done();
      });
    });

    it('should call onSubmitSuccess if sync submit succeeds', function () {
      var store = makeStore({
        testForm: {}
      });
      var result = { message: 'Good job!' };
      var onSubmitSuccess = (0, _expect.createSpy)();

      var Form = function Form() {
        return _react2.default.createElement(
          'form',
          null,
          _react2.default.createElement(Field, { name: 'username', component: 'input', type: 'text' }),
          _react2.default.createElement(Field, { name: 'password', component: 'input', type: 'text' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm',
        onSubmit: function onSubmit() {
          return result;
        },
        onSubmitSuccess: onSubmitSuccess
      })(Form);

      var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(Decorated, null)
      ));

      var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Decorated);

      expect(stub.submit).toBeA('function');

      expect(onSubmitSuccess).toNotHaveBeenCalled();

      var returned = stub.submit();

      expect(onSubmitSuccess).toHaveBeenCalled().toHaveBeenCalledWith(result, store.dispatch);
      expect(returned).toBe(result);
    });

    it('should call onSubmitSuccess if async submit succeeds', function () {
      var store = makeStore({
        testForm: {}
      });
      var result = { message: 'Good job!' };
      var onSubmitSuccess = (0, _expect.createSpy)();

      var Form = function Form() {
        return _react2.default.createElement(
          'form',
          null,
          _react2.default.createElement(Field, { name: 'username', component: 'input', type: 'text' }),
          _react2.default.createElement(Field, { name: 'password', component: 'input', type: 'text' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm',
        onSubmit: function onSubmit() {
          return Promise.resolve(result);
        },
        onSubmitSuccess: onSubmitSuccess
      })(Form);

      var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(Decorated, null)
      ));

      var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Decorated);

      expect(stub.submit).toBeA('function');

      expect(onSubmitSuccess).toNotHaveBeenCalled();

      return stub.submit().then(function (returned) {
        expect(onSubmitSuccess).toHaveBeenCalled().toHaveBeenCalledWith(result, store.dispatch);
        expect(returned).toBe(result);
      });
    });

    it('should return error thrown by sync onSubmit', function () {
      var store = makeStore({
        testForm: {}
      });
      var errors = { username: 'Required' };

      var Form = function Form() {
        return _react2.default.createElement(
          'form',
          null,
          _react2.default.createElement(Field, { name: 'username', component: 'input', type: 'text' }),
          _react2.default.createElement(Field, { name: 'password', component: 'input', type: 'text' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm',
        onSubmit: function onSubmit() {
          throw new _SubmissionError2.default(errors);
        }
      })(Form);

      var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(Decorated, null)
      ));

      var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Decorated);

      expect(stub.submit).toBeA('function');

      var caught = stub.submit();

      expect(caught).toBe(errors);
    });

    it('should submit when submit() called and onSubmit provided as config param', function () {
      var store = makeStore({
        testForm: {
          values: {
            bar: 'foo'
          }
        }
      });
      var input = (0, _expect.createSpy)(function (props) {
        return _react2.default.createElement('input', props.input);
      }).andCallThrough();

      var Form = function Form() {
        return _react2.default.createElement(
          'form',
          null,
          _react2.default.createElement(Field, { name: 'bar', component: input, type: 'text' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm',
        onSubmit: function onSubmit(values) {
          expect(values).toEqualMap({ bar: 'foo' });
        }
      })(Form);

      var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(Decorated, null)
      ));

      var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Decorated);

      expect(input).toHaveBeenCalled();
      expect(input.calls[0].arguments[0].input.value).toBe('foo');

      expect(stub.submit).toBeA('function');
      stub.submit();
    });

    it('should submit when "submit" button is clicked and handleSubmit provided function', function () {
      var store = makeStore({
        testForm: {
          values: {
            bar: 'foo'
          }
        }
      });
      var submit = (0, _expect.createSpy)();

      var Form = function Form(_ref) {
        var handleSubmit = _ref.handleSubmit;
        return _react2.default.createElement(
          'form',
          { onSubmit: handleSubmit(submit) },
          _react2.default.createElement(Field, { name: 'bar', component: 'textarea' }),
          _react2.default.createElement('input', { type: 'submit', value: 'Submit' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm'
      })(Form);

      var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(Decorated, null)
      ));

      var form = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(dom, 'form');

      expect(submit).toNotHaveBeenCalled();

      _reactAddonsTestUtils2.default.Simulate.submit(form);

      expect(submit).toHaveBeenCalled();
    });

    it('should be fine if form is not yet in Redux store', function () {
      var store = makeStore({
        anotherForm: {
          values: {
            bar: 'foo'
          }
        }
      });
      var input = (0, _expect.createSpy)(function (props) {
        return _react2.default.createElement('input', props.input);
      }).andCallThrough();

      var Form = function Form() {
        return _react2.default.createElement(
          'form',
          null,
          _react2.default.createElement(Field, { name: 'foo', component: input, type: 'text' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm'
      })(Form);

      _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(Decorated, null)
      ));

      expect(input).toHaveBeenCalled();
      expect(input.calls[0].arguments[0].input.value).toBe('');
    });

    it('should be fine if getFormState returns nothing', function () {
      var store = makeStore({});
      var input = (0, _expect.createSpy)(function (props) {
        return _react2.default.createElement('input', props.input);
      }).andCallThrough();

      var Form = function Form() {
        return _react2.default.createElement(
          'form',
          null,
          _react2.default.createElement(Field, { name: 'foo', component: input, type: 'text' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm',
        getFormState: function getFormState() {
          return undefined;
        }
      })(Form);

      _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(Decorated, null)
      ));

      expect(input).toHaveBeenCalled();
      expect(input.calls[0].arguments[0].input.value).toBe('');
    });

    it('should throw an error when no onSubmit is specified', function () {
      var store = makeStore({
        testForm: {
          values: {
            bar: 'foo'
          }
        }
      });

      var Form = function Form() {
        return _react2.default.createElement(
          'form',
          null,
          _react2.default.createElement(Field, { name: 'bar', component: 'input', type: 'text' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm'
      })(Form);

      var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(Decorated, null)
      ));

      var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Decorated);
      expect(function () {
        return stub.submit();
      }).toThrow(/onSubmit function or pass onSubmit as a prop/);
    });

    it('should submit (with async validation) when submit() called', function () {
      var store = makeStore({
        testForm: {
          values: {
            bar: 'foo'
          }
        }
      });
      var input = (0, _expect.createSpy)(function (props) {
        return _react2.default.createElement('input', props.input);
      }).andCallThrough();
      var asyncValidate = (0, _expect.createSpy)(function () {
        return Promise.resolve();
      }).andCallThrough();

      var Form = function Form() {
        return _react2.default.createElement(
          'form',
          null,
          _react2.default.createElement(Field, { name: 'bar', component: input, type: 'text' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm',
        asyncValidate: asyncValidate,
        onSubmit: function onSubmit(values) {
          expect(values).toEqualMap({ bar: 'foo' });
        }
      })(Form);

      var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(Decorated, null)
      ));

      var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Decorated);

      expect(input).toHaveBeenCalled();
      expect(input.calls[0].arguments[0].input.value).toBe('foo');

      expect(asyncValidate).toNotHaveBeenCalled();

      expect(stub.submit).toBeA('function');
      stub.submit();

      expect(asyncValidate).toHaveBeenCalled();
      expect(asyncValidate.calls[0].arguments[0]).toEqualMap({ bar: 'foo' });
    });

    it('should not call async validation more than once if submit is clicked fast when handleSubmit receives an event', function (done) {
      var store = makeStore({
        testForm: {
          values: {
            bar: 'foo'
          }
        }
      });
      var input = (0, _expect.createSpy)(function (props) {
        return _react2.default.createElement('input', props.input);
      }).andCallThrough();
      var asyncValidate = (0, _expect.createSpy)(function () {
        return new Promise(function (resolve) {
          return setTimeout(resolve, 100);
        });
      }).andCallThrough();
      var onSubmit = function onSubmit(values) {
        expect(values).toEqualMap({ bar: 'foo' });
        done();
      };

      var Form = function Form(_ref2) {
        var handleSubmit = _ref2.handleSubmit;
        return _react2.default.createElement(
          'form',
          { onSubmit: handleSubmit },
          _react2.default.createElement(Field, { name: 'bar', component: input, type: 'text' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm',
        asyncValidate: asyncValidate,
        onSubmit: onSubmit
      })(Form);

      var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(Decorated, null)
      ));

      var form = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(dom, 'form');

      expect(input).toHaveBeenCalled();
      expect(input.calls[0].arguments[0].input.value).toBe('foo');

      expect(asyncValidate).toNotHaveBeenCalled();

      _reactAddonsTestUtils2.default.Simulate.submit(form);
      _reactAddonsTestUtils2.default.Simulate.submit(form);
      _reactAddonsTestUtils2.default.Simulate.submit(form);
      _reactAddonsTestUtils2.default.Simulate.submit(form);
      _reactAddonsTestUtils2.default.Simulate.submit(form);

      expect(asyncValidate).toHaveBeenCalled();
      expect(asyncValidate.calls.length).toBe(1);
      expect(asyncValidate.calls[0].arguments[0]).toEqualMap({ bar: 'foo' });
    });

    it('should return rejected promise when submit is rejected', function (done) {
      var store = makeStore({
        testForm: {
          values: {
            bar: 'foo'
          }
        }
      });

      var Form = function Form() {
        return _react2.default.createElement(
          'form',
          null,
          _react2.default.createElement(Field, { name: 'bar', component: 'input', type: 'text' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm',
        onSubmit: function onSubmit() {
          return Promise.reject(new _SubmissionError2.default('Rejection'));
        }
      })(Form);

      var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(Decorated, null)
      ));

      var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Decorated);
      return stub.submit().then(function (err) {
        expect(err).toBe('Rejection');
        done();
      });
    });

    it('should not call async validation more than once if submit is clicked fast when handleSubmit receives a function', function (done) {
      var store = makeStore({
        testForm: {
          values: {
            bar: 'foo'
          }
        }
      });
      var input = (0, _expect.createSpy)(function (props) {
        return _react2.default.createElement('input', props.input);
      }).andCallThrough();
      var asyncValidate = (0, _expect.createSpy)(function () {
        return new Promise(function (resolve) {
          return setTimeout(resolve, 100);
        });
      }).andCallThrough();
      var onSubmit = function onSubmit(values) {
        expect(values).toEqualMap({ bar: 'foo' });
        done();
      };

      var Form = function Form(_ref3) {
        var handleSubmit = _ref3.handleSubmit;
        return _react2.default.createElement(
          'form',
          { onSubmit: handleSubmit(onSubmit) },
          _react2.default.createElement(Field, { name: 'bar', component: input, type: 'text' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm',
        asyncValidate: asyncValidate
      })(Form);

      var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(Decorated, null)
      ));

      var form = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(dom, 'form');

      expect(input).toHaveBeenCalled();
      expect(input.calls[0].arguments[0].input.value).toBe('foo');

      expect(asyncValidate).toNotHaveBeenCalled();

      _reactAddonsTestUtils2.default.Simulate.submit(form);
      _reactAddonsTestUtils2.default.Simulate.submit(form);
      _reactAddonsTestUtils2.default.Simulate.submit(form);
      _reactAddonsTestUtils2.default.Simulate.submit(form);
      _reactAddonsTestUtils2.default.Simulate.submit(form);

      expect(asyncValidate).toHaveBeenCalled();
      expect(asyncValidate.calls.length).toBe(1);
      expect(asyncValidate.calls[0].arguments[0]).toEqualMap({ bar: 'foo' });
    });

    it('should reset when reset() called', function () {
      var store = makeStore({});
      var input = (0, _expect.createSpy)(function (props) {
        return _react2.default.createElement('input', props.input);
      }).andCallThrough();

      var Form = function Form() {
        return _react2.default.createElement(
          'form',
          null,
          _react2.default.createElement(Field, { name: 'bar', component: input, type: 'text' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm',
        initialValues: { bar: 'initialBar' }
      })(Form);

      var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(Decorated, null)
      ));

      var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Decorated);

      expect(input).toHaveBeenCalled();

      expect(input.calls[0].arguments[0].input.value).toBe('initialBar');

      input.calls[0].arguments[0].input.onChange('newBar');

      expect(input.calls[1].arguments[0].input.value).toBe('newBar');

      expect(stub.reset).toBeA('function');
      stub.reset();

      expect(input.calls[2].arguments[0].input.value).toBe('initialBar');
    });

    it('should rerender form, but not fields, when non-redux-form props change', function () {
      var store = makeStore({});
      var inputRender = (0, _expect.createSpy)(function (props) {
        return _react2.default.createElement('input', props.input);
      }).andCallThrough();
      var formRender = (0, _expect.createSpy)();

      var Form = function (_Component15) {
        _inherits(Form, _Component15);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, Object.getPrototypeOf(Form).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            formRender(this.props);
            return _react2.default.createElement(
              'form',
              null,
              _react2.default.createElement(Field, { name: 'deep.foo', component: inputRender, type: 'text' })
            );
          }
        }]);

        return Form;
      }(_react.Component);

      var Decorated = reduxForm({ form: 'testForm' })(Form);

      var Container = function (_Component16) {
        _inherits(Container, _Component16);

        function Container(props) {
          _classCallCheck(this, Container);

          var _this22 = _possibleConstructorReturn(this, Object.getPrototypeOf(Container).call(this, props));

          _this22.state = {};
          return _this22;
        }

        _createClass(Container, [{
          key: 'render',
          value: function render() {
            var _this23 = this;

            return _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement(
                _reactRedux.Provider,
                { store: store },
                _react2.default.createElement(Decorated, this.state)
              ),
              _react2.default.createElement(
                'button',
                { onClick: function onClick() {
                    return _this23.setState({ someOtherProp: 42 });
                  } },
                'Init'
              )
            );
          }
        }]);

        return Container;
      }(_react.Component);

      var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(Container, null));
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [{ name: 'deep.foo', type: 'Field' }]
          }
        }
      });
      expect(formRender).toHaveBeenCalled();
      expect(formRender.calls.length).toBe(1);
      expect(formRender.calls[0].arguments[0].someOtherProp).toNotExist();

      expect(inputRender).toHaveBeenCalled();
      expect(inputRender.calls.length).toBe(1);

      // initialize
      var initButton = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(dom, 'button');
      _reactAddonsTestUtils2.default.Simulate.click(initButton);

      // rerender form on prop change
      expect(formRender.calls.length).toBe(2);
      expect(formRender.calls[1].arguments[0].someOtherProp).toExist().toBe(42);

      // no need to rerender input
      expect(inputRender.calls.length).toBe(1);
    });

    it('should call async on blur of async blur field', function (done) {
      var store = makeStore({});
      var inputRender = (0, _expect.createSpy)(function (props) {
        return _react2.default.createElement('input', props.input);
      }).andCallThrough();
      var formRender = (0, _expect.createSpy)();
      var asyncErrors = {
        deep: {
          foo: 'async error'
        }
      };
      var asyncValidate = (0, _expect.createSpy)().andReturn(Promise.reject(asyncErrors));

      var Form = function (_Component17) {
        _inherits(Form, _Component17);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, Object.getPrototypeOf(Form).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            formRender(this.props);
            return _react2.default.createElement(
              'form',
              null,
              _react2.default.createElement(Field, { name: 'deep.foo', component: inputRender, type: 'text' })
            );
          }
        }]);

        return Form;
      }(_react.Component);

      var Decorated = reduxForm({
        form: 'testForm',
        asyncValidate: asyncValidate,
        asyncBlurFields: ['deep.foo']
      })(Form);

      var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(Decorated, null)
      ));
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [{ name: 'deep.foo', type: 'Field' }]
          }
        }
      });
      expect(formRender).toHaveBeenCalled();
      expect(formRender.calls.length).toBe(1);

      expect(asyncValidate).toNotHaveBeenCalled();

      expect(inputRender).toHaveBeenCalled();
      expect(inputRender.calls.length).toBe(1);
      expect(inputRender.calls[0].arguments[0].pristine).toBe(true);
      expect(inputRender.calls[0].arguments[0].input.value).toBe('');
      expect(inputRender.calls[0].arguments[0].valid).toBe(true);
      expect(inputRender.calls[0].arguments[0].error).toBe(undefined);

      var inputElement = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(dom, 'input');
      _reactAddonsTestUtils2.default.Simulate.change(inputElement, { target: { value: 'bar' } });

      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            values: {
              deep: {
                foo: 'bar'
              }
            },
            registeredFields: [{ name: 'deep.foo', type: 'Field' }]
          }
        }
      });
      expect(formRender.calls.length).toBe(2); // rerendered because pristine -> dirty

      expect(asyncValidate).toNotHaveBeenCalled(); // not yet

      expect(inputRender.calls.length).toBe(2); // input rerendered
      expect(inputRender.calls[1].arguments[0].pristine).toBe(false);
      expect(inputRender.calls[1].arguments[0].input.value).toBe('bar');
      expect(inputRender.calls[1].arguments[0].valid).toBe(true);
      expect(inputRender.calls[1].arguments[0].error).toBe(undefined);

      _reactAddonsTestUtils2.default.Simulate.blur(inputElement, { target: { value: 'bar' } });

      setTimeout(function () {
        expect(store.getState()).toEqualMap({
          form: {
            testForm: {
              anyTouched: true,
              values: {
                deep: {
                  foo: 'bar'
                }
              },
              fields: {
                deep: {
                  foo: {
                    touched: true
                  }
                }
              },
              registeredFields: [{ name: 'deep.foo', type: 'Field' }],
              asyncErrors: asyncErrors
            }
          }
        });
        // rerender form twice because of async validation start and again for valid -> invalid
        expect(formRender.calls.length).toBe(4);

        expect(asyncValidate).toHaveBeenCalled();
        expect(asyncValidate.calls[0].arguments[0]).toEqualMap({ deep: { foo: 'bar' } });

        // input rerendered twice, at start and end of async validation
        expect(inputRender.calls.length).toBe(4);
        expect(inputRender.calls[3].arguments[0].pristine).toBe(false);
        expect(inputRender.calls[3].arguments[0].input.value).toBe('bar');
        expect(inputRender.calls[3].arguments[0].valid).toBe(false);
        expect(inputRender.calls[3].arguments[0].error).toBe('async error');
        done();
      });
    });

    it('should not call async validate if shouldAsyncValidate returns false', function () {
      var store = makeStore({});
      var inputRender = (0, _expect.createSpy)(function (props) {
        return _react2.default.createElement('input', props.input);
      }).andCallThrough();
      var asyncValidate = (0, _expect.createSpy)().andReturn(Promise.reject({ foo: 'bad user!' }));
      var shouldAsyncValidate = (0, _expect.createSpy)().andReturn(false);

      var Form = function Form() {
        return _react2.default.createElement(
          'form',
          null,
          _react2.default.createElement(Field, { name: 'foo', component: inputRender, type: 'text' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm',
        asyncValidate: asyncValidate,
        asyncBlurFields: ['foo'],
        shouldAsyncValidate: shouldAsyncValidate
      })(Form);

      var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(Decorated, null)
      ));
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [{ name: 'foo', type: 'Field' }]
          }
        }
      });

      expect(asyncValidate).toNotHaveBeenCalled();

      var inputElement = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(dom, 'input');
      _reactAddonsTestUtils2.default.Simulate.change(inputElement, { target: { value: 'bar' } });

      expect(shouldAsyncValidate).toNotHaveBeenCalled();

      _reactAddonsTestUtils2.default.Simulate.blur(inputElement, { target: { value: 'bar' } });

      expect(shouldAsyncValidate).toHaveBeenCalled();

      expect(asyncValidate).toNotHaveBeenCalled();
    });

    it('should expose wrapped instance', function () {
      var store = makeStore({});

      var Form = function (_Component18) {
        _inherits(Form, _Component18);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, Object.getPrototypeOf(Form).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return _react2.default.createElement(
              'form',
              null,
              _react2.default.createElement(Field, { name: 'foo', component: 'input', type: 'text' })
            );
          }
        }]);

        return Form;
      }(_react.Component);

      var Decorated = reduxForm({
        form: 'testForm'
      })(Form);

      var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(Decorated, null)
      ));

      var wrapped = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Form);
      var decorated = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Decorated);

      expect(decorated.wrappedInstance.props).toEqual(wrapped.props);
    });

    it('should return an empty list if there are no registered fields', function () {
      var store = makeStore({});

      var Form = function (_Component19) {
        _inherits(Form, _Component19);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, Object.getPrototypeOf(Form).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return _react2.default.createElement('form', null);
          }
        }]);

        return Form;
      }(_react.Component);

      var Decorated = reduxForm({
        form: 'testForm'
      })(Form);

      var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(Decorated, null)
      ));

      var decorated = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Decorated);

      expect(decorated.refs.wrapped.getWrappedInstance().getFieldList()).toEqual([]);
    });
  });
};

describeReduxForm('reduxForm.plain', _plain2.default, _redux.combineReducers, (0, _addExpectations2.default)(_expectations2.default));
describeReduxForm('reduxForm.immutable', _immutable2.default, _reduxImmutablejs.combineReducers, (0, _addExpectations2.default)(_expectations4.default));