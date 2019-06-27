'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // import dependencies


/**
 * create horizontal line
 *
 * @extends React
 */
var Image = function (_React$PureComponent) {
    _inherits(Image, _React$PureComponent);

    /**
     * construct horizontal line
     *
     * @param  {Object} props
     */
    function Image(props) {
        _classCallCheck(this, Image);

        // state
        var _this = _possibleConstructorReturn(this, (Image.__proto__ || Object.getPrototypeOf(Image)).call(this, props));
        // run super


        _this.onLoad = function () {
            // check if we need to update the loaded state
            if (_this.props.loader && !_this.state.loaded) {
                // set state to loaded
                _this.setState({ loaded: true });
            }

            // check props onload
            if (_this.props.onLoad) {
                _this.props.onLoad();
            }
        };

        _this.onError = function () {
            // check fallback options
            if (_this.props.fallback && _this.state.src !== _this.props.fallback) {
                // update src to fallback option
                _this.setState({ src: _this.props.fallback });
            }

            // check props onerror
            if (_this.props.onError) {
                _this.props.onError();
            }
        };

        _this.state = {
            src: props.src,
            loaded: false,
            timestamp: new Date().getTime()
        };
        return _this;
    }

    /**
     * on component will receive props
     * @param prevProps
     * @param prevState
     */


    _createClass(Image, [{
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps, prevState) {
            // check if src changed
            if (this.props.src !== prevProps.src) {
                // update timestamp
                this.setState({
                    src: this.props.src,
                    loaded: false,
                    timestamp: new Date().getTime()
                });
            }
        }

        /**
         * on image load
         */


        /**
         * on image load fail
         */

    }, {
        key: 'render',


        /**
         * return JSX
         *
         * @return {JSX}
         */
        value: function render() {
            // loader component
            var loader = '';

            // check if loader element exists and if not yet loaded
            if (this.props.loader && !this.state.loaded) {
                // render loader element
                loader = _react2.default.createElement(
                    'div',
                    { style: Object.assign({}, { width: '100%', height: 'auto' }, this.props.style ? this.props.style : {}) },
                    this.props.loader
                );
            }
            return _react2.default.createElement(
                _react2.default.Fragment,
                null,
                loader,
                _react2.default.createElement('img', _extends({}, this.props, {
                    src: this.state.src + '#t=' + this.state.timestamp,
                    style: Object.assign({}, this.props.style ? this.props.style : {}, this.props.loader && !this.state.loaded ? { width: '0', height: '0', opacity: '0' } : {}),
                    onLoad: this.onLoad,
                    onError: this.onError
                }))
            );
        }
    }]);

    return Image;
}(_react2.default.PureComponent);

// prop types


Image.propTypes = {
    src: _propTypes2.default.string.isRequired,
    fallback: _propTypes2.default.string,
    style: _propTypes2.default.object,
    onLoad: _propTypes2.default.func,
    onError: _propTypes2.default.func,
    loader: _propTypes2.default.object
};

/**
 * export default
 */
exports.default = Image;