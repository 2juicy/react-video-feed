'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Button = function (_React$PureComponent) {
	_inherits(Button, _React$PureComponent);

	function Button(props) {
		_classCallCheck(this, Button);

		// set the default states
		var _this = _possibleConstructorReturn(this, (Button.__proto__ || Object.getPrototypeOf(Button)).call(this, props));

		_this.onMouseEnter = function () {
			// set state
			_this.setState({ hovered: true });

			// on hover enter
			if (_this.props.onHoverEnter) {
				_this.props.onHoverEnter();
			}
		};

		_this.onMouseLeave = function () {
			// set state
			_this.setState({ hovered: false });

			// on hover leave
			if (_this.props.onHoverLeave) {
				_this.props.onHoverLeave();
			}
		};

		_this.state = {
			hovered: false
		};
		return _this;
	}

	/**
  * on mouse enter
  */


	/**
  * on mouse leave
  */


	_createClass(Button, [{
		key: 'render',


		/**
   * render the button jsx
   * @returns {*}
   */
		value: function render() {
			return _react2.default.createElement('img', {
				// data-tip={ this.props.tooltip }
				// data-delay-show="750"
				title: this.props.tooltip,
				id: this.props.id,
				src: this.props.srcHovered && this.state.hovered ? this.props.srcHovered : this.props.src,
				onClick: this.props.onClick,
				style: Object.assign({}, style.button, this.props.style || {}, { opacity: this.state.hovered ? '1' : this.props.style && this.props.style.opacity ? this.props.style.opacity : '0.8' }),
				onMouseEnter: this.onMouseEnter,
				onMouseLeave: this.onMouseLeave
			});
		}
	}]);

	return Button;
}(_react2.default.PureComponent);

Button.defaultProps = {
	id: 'controlButton'
};

Button.propTypes = {
	id: _propTypes2.default.string,
	src: _propTypes2.default.string.isRequired,
	hoveredSrc: _propTypes2.default.string,
	onClick: _propTypes2.default.func.isRequired,
	tooltip: _propTypes2.default.string,
	onHoverEnter: _propTypes2.default.func,
	onHoverLeave: _propTypes2.default.func
};

exports.default = Button;


var style = {
	button: {
		height: '100%',
		width: 'auto',
		cursor: 'pointer',
		pointerEvents: 'inherit',
		transition: 'opacity 0.2s ease'
	}
};