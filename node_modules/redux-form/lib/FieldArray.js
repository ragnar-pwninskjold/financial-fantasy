'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _ConnectedFieldArray = require('./ConnectedFieldArray');

var _ConnectedFieldArray2 = _interopRequireDefault(_ConnectedFieldArray);

var _reactAddonsShallowCompare = require('react-addons-shallow-compare');

var _reactAddonsShallowCompare2 = _interopRequireDefault(_reactAddonsShallowCompare);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var createFieldArray = function createFieldArray(_ref) {
  var deepEqual = _ref.deepEqual;
  var getIn = _ref.getIn;
  var size = _ref.size;

  var FieldArray = function (_Component) {
    _inherits(FieldArray, _Component);

    function FieldArray(props, context) {
      _classCallCheck(this, FieldArray);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FieldArray).call(this, props, context));

      if (!context._reduxForm) {
        throw new Error('FieldArray must be inside a component decorated with reduxForm()');
      }
      _this.ConnectedFieldArray = (0, _ConnectedFieldArray2.default)(context._reduxForm, { deepEqual: deepEqual, getIn: getIn, size: size }, props.name);
      return _this;
    }

    _createClass(FieldArray, [{
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate(nextProps, nextState) {
        return (0, _reactAddonsShallowCompare2.default)(this, nextProps, nextState);
      }
    }, {
      key: 'componentWillMount',
      value: function componentWillMount() {
        this.context._reduxForm.register(this.name, 'FieldArray');
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        if (this.props.name !== nextProps.name) {
          // name changed, regenerate connected field
          this.ConnectedFieldArray = (0, _ConnectedFieldArray2.default)(this.context._reduxForm, {
            deepEqual: deepEqual,
            getIn: getIn,
            size: size
          }, nextProps.name);
        }
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this.context._reduxForm.unregister(this.name);
      }
    }, {
      key: 'getRenderedComponent',
      value: function getRenderedComponent() {
        (0, _invariant2.default)(this.props.withRef, 'If you want to access getRenderedComponent(), ' + 'you must specify a withRef prop to FieldArray');
        return this.refs.connected.getWrappedInstance().getRenderedComponent();
      }
    }, {
      key: 'render',
      value: function render() {
        return (0, _react.createElement)(this.ConnectedFieldArray, _extends({}, this.props, {
          syncError: this.syncError,
          ref: 'connected'
        }));
      }
    }, {
      key: 'name',
      get: function get() {
        return this.props.name;
      }
    }, {
      key: 'dirty',
      get: function get() {
        return this.refs.connected.getWrappedInstance().dirty;
      }
    }, {
      key: 'pristine',
      get: function get() {
        return this.refs.connected.getWrappedInstance().pristine;
      }
    }, {
      key: 'value',
      get: function get() {
        return this.refs.connected.getWrappedInstance().value;
      }
    }]);

    return FieldArray;
  }(_react.Component);

  FieldArray.propTypes = {
    name: _react.PropTypes.string.isRequired,
    component: _react.PropTypes.func.isRequired,
    props: _react.PropTypes.object
  };
  FieldArray.contextTypes = {
    _reduxForm: _react.PropTypes.object
  };

  return FieldArray;
};

exports.default = createFieldArray;