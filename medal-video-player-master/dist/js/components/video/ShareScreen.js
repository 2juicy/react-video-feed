'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _copyToClipboard = require('copy-to-clipboard');

var _copyToClipboard2 = _interopRequireDefault(_copyToClipboard);

var _Utils = require('../../util/Utils');

var _Utils2 = _interopRequireDefault(_Utils);

var _Style = require('../Style');

var _Style2 = _interopRequireDefault(_Style);

var _Icon = require('../Icon');

var _Icon2 = _interopRequireDefault(_Icon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // import global dependencies


// import local dependencies


var ShareScreen = function (_React$PureComponent) {
	_inherits(ShareScreen, _React$PureComponent);

	function ShareScreen(props) {
		_classCallCheck(this, ShareScreen);

		// set the default states
		var _this = _possibleConstructorReturn(this, (ShareScreen.__proto__ || Object.getPrototypeOf(ShareScreen)).call(this, props));

		_this.onCopy = function (e) {
			// stop propagation
			if (e) {
				e.stopPropagation();
			}

			// unselect all elements
			if (window && window !== null) {
				var sel = window.getSelection();
				sel.removeAllRanges();
			}

			// copy obj
			(0, _copyToClipboard2.default)(_this.state.embedding ? _this.state.iframeCode : _this.props.outlink);

			// copy link
			_this.setState({ copied: true });

			// wait
			_this.copyTimeout = setTimeout(function () {
				// copy link
				_this.setState({ copied: false });

				// clear timeout
				clearTimeout(_this.copyTimeout);

				// clear
				_this.copyTimeout = undefined;
			}, 1500);

			// on copy link
			_Utils2.default.sendShareEvent(_this.props.content, _this.props.viewer, _this.state.embedding ? 'copy-embed-code' : 'copy', _this.state.embedded);
		};

		_this.onClose = function (e) {
			// stop propagation
			if (e) {
				e.stopPropagation();
			}

			// close
			_this.props.close();
		};

		_this.onEmbedClip = function (e) {
			// stop propagation
			if (e) {
				e.stopPropagation();
			}

			// embedding
			var embedding = !_this.state.embedding;

			// show embed view
			_this.setState({ embedding: embedding });

			// if embedding
			if (embedding) {
				// on share as embed
				_Utils2.default.sendShareEvent(_this.props.content, _this.props.viewer, "embedClip", _this.state.embedded);
			}
		};

		_this.onShareFacebook = function (e) {
			// stop propagation
			if (e) {
				e.stopPropagation();
			}

			// facebook share url
			var url = 'https://www.facebook.com/sharer/sharer.php?p[url]=' + _this.props.outlink;

			// window params
			var w = 550;
			var h = 600;
			var left = screen.width / 2 - w / 2;
			var top = screen.height / 2 - h / 2;

			// open url
			window.open(url, 'Share clips from Medal', 'top=' + top + ',left=' + left + ',width=' + w + ',height=' + h);

			// on share to facebook
			_Utils2.default.sendShareEvent(_this.props.content, _this.props.viewer, "postToFacebook", _this.state.embedded);
		};

		_this.onShareTwitter = function (e) {
			// stop propagation
			if (e) {
				e.stopPropagation();
			}

			// twitter share url
			var url = 'https://twitter.com/intent/tweet?source=' + _this.props.outlink + '&text=' + encodeURI('Check out ' + _this.props.content.contentTitle + ' by ' + _this.props.user.userName + '! ' + _this.props.outlink);

			// window params
			var w = 550;
			var h = 600;
			var left = screen.width / 2 - w / 2;
			var top = screen.height / 2 - h / 2;

			// open url
			window.open(url, 'Share clips from Medal', 'top=' + top + ',left=' + left + ',width=' + w + ',height=' + h);

			// on share to facebook
			_Utils2.default.sendShareEvent(_this.props.content, _this.props.viewer, "postToTwitter", _this.state.embedded);
		};

		_this.onShareReddit = function (e) {
			// stop propagation
			if (e) {
				e.stopPropagation();
			}

			// twitter share url
			var url = 'http://www.reddit.com/submit?url=' + _this.props.outlink + '&title=' + _this.props.content.contentTitle;

			// window params
			var w = 550;
			var h = 600;
			var left = screen.width / 2 - w / 2;
			var top = screen.height / 2 - h / 2;

			// open url
			window.open(url, 'Share clips from Medal', 'top=' + top + ',left=' + left + ',width=' + w + ',height=' + h);

			// on share to facebook
			_Utils2.default.sendShareEvent(_this.props.content, _this.props.viewer, "postToReddit", _this.state.embedded);
		};

		_this.state = {
			hoveredLink: false,
			copied: false,
			embedding: false,
			iframeCode: '<iframe width="640" height="360" src="' + props.outlink.split('/clips/').join('/clip/') + '" frameborder="0" allow="autoplay" allowfullscreen></iframe>'
		};
		return _this;
	}

	/**
  * on component did mount
  */


	_createClass(ShareScreen, [{
		key: 'componentDidMount',
		value: function componentDidMount() {}

		/**
   * on component will unmount
   */

	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			// check timeout
			if (this.copyTimeout !== undefined) {
				// clear timeout
				clearTimeout(this.copyTimeout);
			}
		}

		// /**
		//  * on component did update
		//  * @param prevProps
		//  * @param prevState
		//  */
		// componentDidUpdate (prevProps, prevState) {
		// 	// check if content id changed
		// 	if (prevProps.content && this.props.content && prevProps.content.contentId !== this.props.content.contentId) {
		// 		this.forceUpdate();
		// 	}
		// }

		/**
   * on copy link
   */


		/**
   * on close
   * @returns {Promise<void>}
   */


		/**
   * on embed clip click
   * @param e
   */


		/**
   * on share facebook click
   * @param e
   */


		/**
   * on share twitter click
   * @param e
   */


		/**
   * on share twitter click
   * @param e
   */

	}, {
		key: 'render',


		/**
   * render the share screen jsx
   * @returns {*}
   */
		value: function render() {
			var _this2 = this;

			// render jsx
			return _react2.default.createElement(
				'div',
				{ style: Object.assign({}, _Style2.default.absoluteContainer, style.container) },
				_react2.default.createElement('img', {
					id: 'videoShareClose',
					style: style.close,
					src: _Icon2.default.close,
					onClick: this.onClose
				}),
				_react2.default.createElement(
					'span',
					{ style: style.title },
					this.props.content.contentTitle,
					' by ',
					this.props.user.userName
				),
				_react2.default.createElement(
					'span',
					{ style: style.description },
					this.state.embedding ? 'Embed this clip on your website using the following code:' : 'Share this clip with the world.'
				),
				this.state.embedding ? _react2.default.createElement(
					'div',
					{ style: style.linkContainer },
					_react2.default.createElement(
						'div',
						{
							style: Object.assign({}, style.iframeCodeContainer, this.state.copied ? style.linkCopied : this.state.hoveredLink ? style.linkHovered : {}),
							onMouseEnter: function onMouseEnter() {
								return _this2.setState({ hoveredLink: true });
							},
							onMouseLeave: function onMouseLeave() {
								return _this2.setState({ hoveredLink: false });
							},
							onClick: this.onCopy
						},
						this.state.iframeCode
					)
				) : _react2.default.createElement(
					'div',
					{ style: style.linkContainer },
					_react2.default.createElement(
						'div',
						{
							style: Object.assign({}, style.link, this.state.copied ? style.linkCopied : this.state.hoveredLink ? style.linkHovered : {}),
							onMouseEnter: function onMouseEnter() {
								return _this2.setState({ hoveredLink: true });
							},
							onMouseLeave: function onMouseLeave() {
								return _this2.setState({ hoveredLink: false });
							},
							onClick: this.onCopy
						},
						this.props.outlink
					),
					_react2.default.createElement(
						'div',
						{
							style: Object.assign({}, style.button, this.state.copied ? style.buttonCopied : this.state.hoveredLink ? style.buttonHovered : {}),
							onMouseEnter: function onMouseEnter() {
								return _this2.setState({ hoveredLink: true });
							},
							onMouseLeave: function onMouseLeave() {
								return _this2.setState({ hoveredLink: false });
							},
							onClick: this.onCopy
						},
						this.state.copied ? 'Copied!' : 'Copy'
					)
				),
				_react2.default.createElement('div', { style: style.separator }),
				_react2.default.createElement(
					'div',
					{ style: style.socialIconContainer },
					_react2.default.createElement('img', { style: Object.assign({}, style.socialIcon, { transition: 'all 0.1s ease' }, this.state.embedding ? { transform: 'scale(1.2)' } : {}), src: _Icon2.default.embed, onClick: this.onEmbedClip }),
					_react2.default.createElement('div', { style: style.spacer }),
					_react2.default.createElement('img', { style: Object.assign({}, style.socialIcon, { opacity: this.state.embedding ? '0.75' : '1', transition: 'opacity 0.2s ease' }), src: _Icon2.default.facebook, onClick: this.onShareFacebook }),
					_react2.default.createElement('div', { style: style.spacer }),
					_react2.default.createElement('img', { style: Object.assign({}, style.socialIcon, { opacity: this.state.embedding ? '0.75' : '1', transition: 'opacity 0.2s ease' }), src: _Icon2.default.twitter, onClick: this.onShareTwitter }),
					_react2.default.createElement('div', { style: style.spacer }),
					_react2.default.createElement('img', { style: Object.assign({}, style.socialIcon, { opacity: this.state.embedding ? '0.75' : '1', transition: 'opacity 0.2s ease' }), src: _Icon2.default.reddit, onClick: this.onShareReddit })
				)
			);
		}
	}]);

	return ShareScreen;
}(_react2.default.PureComponent);

ShareScreen.defaultProps = {
	id: 'shareScreen'
};

ShareScreen.propTypes = {
	id: _propTypes2.default.string,
	content: _propTypes2.default.object.isRequired,
	user: _propTypes2.default.object.isRequired,
	outlink: _propTypes2.default.string.isRequired,
	close: _propTypes2.default.func.isRequired,
	embedded: _propTypes2.default.bool.isRequired,
	viewer: _propTypes2.default.object
};

exports.default = ShareScreen;

// component style

var style = {
	container: {
		backgroundColor: 'rgba(13, 14, 18, 0.9)',
		transition: 'all 0.1s ease',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		pointerEvents: 'all',
		zIndex: '2'
	},
	close: {
		position: 'absolute',
		top: '26px',
		right: '26px',
		width: '18px',
		height: 'auto',
		pointerEvents: 'all',
		cursor: 'pointer'
	},
	title: {
		fontSize: '18px',
		fontWeight: '600',
		color: '#eaeaea'
	},
	description: {
		fontSize: '16px',
		fontWeight: 'normal',
		color: '#c9c9c9',
		marginBottom: '-7px'
	},
	linkContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		margin: '24px 0',
		boxShadow: '0 0 12px rgba(0, 0, 0, 0.35)'
	},
	link: {
		minHeight: '36px',
		maxHeight: '36px',
		minWidth: '225px',
		padding: '0 18px',
		backgroundColor: _Style2.default.colorGuide.quaternaryColor,
		border: '1px solid ' + _Style2.default.colorGuide.primaryColorLighter,
		borderRadius: '3px',
		borderTopRightRadius: '0px',
		borderBottomRightRadius: '0px',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		fontWeight: 'normal',
		fontSize: '16px',
		color: '#c9c9c9',
		pointerEvents: 'all',
		// cursor : 'pointer',
		transition: 'all 0.1s ease',
		textShadow: '0 0 4px rgba(0, 0, 0, 0.5)',
		overflow: 'hidden',
		whiteSpace: 'nowrap',
		textOverflow: 'ellipsis',
		userSelect: 'text',
		cursor: 'text'
	},
	linkHovered: {
		color: '#eaeaea',
		border: '1px solid #3c3d42'
	},
	linkCopied: {
		color: '#ffbf51',
		// backgroundColor : '#282017',
		border: '1px solid ' + _Style2.default.colorGuide.primaryGold
	},
	iframeCodeContainer: {
		minHeight: '36px',
		minWidth: '225px',
		maxWidth: '400px',
		padding: '6px 18px',
		backgroundColor: _Style2.default.colorGuide.quaternaryColor,
		border: '1px solid ' + _Style2.default.colorGuide.primaryColorLighter,
		borderRadius: '3px',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		fontWeight: 'normal',
		fontSize: '16px',
		color: '#c9c9c9',
		pointerEvents: 'all',
		transition: 'all 0.1s ease',
		textShadow: '0 0 4px rgba(0, 0, 0, 0.5)',
		userSelect: 'text',
		cursor: 'text'
	},
	spacer: {
		width: '16px'
	},
	button: {
		minHeight: '36px',
		maxHeight: '36px',
		minWidth: '70px',
		padding: '0 12px',
		paddingTop: '2px',
		backgroundColor: _Style2.default.colorGuide.primaryColorLighter,
		borderRadius: '3px',
		borderTopLeftRadius: '0px',
		borderBottomLeftRadius: '0px',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		fontFamily: 'Rajdhani',
		fontWeight: 'bold',
		fontSize: '16px',
		color: '#c9c9c9',
		pointerEvents: 'all',
		cursor: 'pointer',
		transition: 'all 0.1s ease',
		textTransform: 'uppercase'
	},
	buttonHovered: {
		backgroundColor: '#3c3d42',
		color: '#fff'
	},
	buttonCopied: {
		backgroundColor: _Style2.default.colorGuide.primaryGold,
		color: '#4d3612'
	},
	separator: {
		height: '1px',
		width: '200px',
		backgroundColor: _Style2.default.colorGuide.primaryColorLighterStill
	},
	socialIconContainer: {
		marginTop: '20px',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		height: '24px'
	},
	socialIcon: {
		height: '100%',
		cursor: 'pointer'
	}
};