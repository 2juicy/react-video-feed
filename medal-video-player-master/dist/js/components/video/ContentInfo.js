'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Utils = require('../../util/Utils');

var _Utils2 = _interopRequireDefault(_Utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // import global dependencies


// import local dependencies


var ContentInfo = function (_React$PureComponent) {
	_inherits(ContentInfo, _React$PureComponent);

	function ContentInfo(props) {
		_classCallCheck(this, ContentInfo);

		// set the default states
		var _this = _possibleConstructorReturn(this, (ContentInfo.__proto__ || Object.getPrototypeOf(ContentInfo)).call(this, props));

		_this.onUserClick = function (e) {
			// stop event propagation
			if (e) {
				e.stopPropagation();
			}

			// open user profile in new page
			window.open('https://medal.tv/users/' + _this.props.user.userId, '_blank');
		};

		_this.onActionClick = function (e) {
			// stop event propagation
			if (e) {
				e.stopPropagation();
			}

			// check donate config
			if (_this.props.donateConfig && _this.props.donateConfig.url) {
				// open user profile in new page
				window.open(_this.props.donateConfig.url, '_blank');

				// send event
				_Utils2.default.sendDonateButtonClick(_this.props.content, _this.props.viewer, _this.props.embedded);
			} else {
				// open user profile in new page
				window.open('https://medal.tv/users/' + _this.props.user.userId, '_blank');
			}
		};

		_this.renderUser = function () {
			// check if user opts exists in props
			if (!_this.props.user || _this.props.showUser === false) {
				return '';
			}

			// return jsx
			return _react2.default.createElement(
				'div',
				{
					title: 'View ' + _this.props.user.userName + '\'s Profile',
					'data-delay-show': '500',
					'data-place': 'bottom',
					style: style.userContainer,
					onClick: _this.onUserClick
				},
				_react2.default.createElement(
					'div',
					{ style: style.userThumbnail },
					_react2.default.createElement('img', {
						style: style.userThumbnailImage,
						src: _this.props.user.thumbnail
					})
				),
				_react2.default.createElement(
					'div',
					{ style: style.userInfo },
					_this.props.user.userName,
					_this.props.user.slogan && _this.props.user.slogan.length > 0 && _react2.default.createElement(
						'span',
						{ style: style.userSlogan },
						_this.props.user.slogan
					)
				)
			);
		};

		_this.renderActionButton = function () {
			// check if user opts exists in props
			if (!_this.props.user) {
				return '';
			}

			// check for donate config
			if (_this.props.donateConfig) {
				return _react2.default.createElement(
					'div',
					{
						title: 'Support ' + _this.props.user.userName,
						'data-delay-show': '500',
						'data-place': 'left',
						style: Object.assign({}, style.actionButton, _this.state.actionHovered ? style.actionButtonHovered : {}),
						onMouseEnter: function onMouseEnter() {
							return _this.setState({ actionHovered: true });
						},
						onMouseLeave: function onMouseLeave() {
							return _this.setState({ actionHovered: false });
						},
						onClick: _this.onActionClick
					},
					_this.props.donateConfig.action || 'Donate'
				);
			} else {
				return '';
			}

			// return jsx
			return _react2.default.createElement(
				'div',
				{
					title: _Utils2.default.isMobile() || !_this.props.game ? 'Follow ' + _this.props.user.userName + ' on Medal' : 'Watch more ' + _this.props.game.categoryName + ' clips',
					'data-delay-show': '500',
					'data-place': 'left',
					style: Object.assign({}, style.actionButton, _this.state.actionHovered ? style.actionButtonHovered : {}),
					onMouseEnter: function onMouseEnter() {
						return _this.setState({ actionHovered: true });
					},
					onMouseLeave: function onMouseLeave() {
						return _this.setState({ actionHovered: false });
					},
					onClick: _this.onActionClick
				},
				_Utils2.default.isMobile() ? 'Follow' : 'Watch More'
			);
		};

		_this.state = {
			actionHovered: false
		};
		return _this;
	}

	/**
  * on user thumbnail / username click
  * @param e
  */


	/**
  * on action button click
  * @param e
  */


	/**
  * render the user object on the video
  */


	/**
  * render action button on right side
  * @returns {string}
  */


	_createClass(ContentInfo, [{
		key: 'render',


		/**
   * render the button jsx
   * @returns {*}
   */
		value: function render() {
			// if not an embedded player, hide content info
			if (!this.props.embedded) {
				return '';
			}

			// render jsx
			return _react2.default.createElement(
				_react2.default.Fragment,
				null,
				_react2.default.createElement('div', { style: style.topGradientOverlay }),
				_react2.default.createElement(
					'div',
					{ style: Object.assign({}, style.topControlsContainer, { pointerEvents: this.props.show ? 'inherit' : 'none' }) },
					_react2.default.createElement(
						'div',
						{ style: style.leftControls },
						this.renderUser()
					),
					_react2.default.createElement(
						'div',
						{ style: style.rightControls },
						this.renderActionButton()
					)
				)
			);
		}
	}]);

	return ContentInfo;
}(_react2.default.PureComponent);

ContentInfo.defaultProps = {
	id: 'contentInfo',
	showUser: true
};

ContentInfo.propTypes = {
	id: _propTypes2.default.string,
	show: _propTypes2.default.bool.isRequired,
	user: _propTypes2.default.object.isRequired,
	content: _propTypes2.default.object.isRequired,
	embedded: _propTypes2.default.bool.isRequired,
	viewer: _propTypes2.default.object,
	donateConfig: _propTypes2.default.object,
	showUser: _propTypes2.default.bool
};

exports.default = ContentInfo;

// spacing between buttons, and edges of player

var spacing = '18px';

// component style
var style = {
	// bottom gradient overlay for controls
	topGradientOverlay: {
		position: 'absolute',
		left: '0',
		top: '0',
		width: '100%',
		height: '30%',
		background: 'linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5))',
		pointerEvents: 'none'
	},
	// bottom control bar
	topControlsContainer: {
		position: 'absolute',
		left: '0',
		top: '0',
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	leftControls: {
		position: 'relative',
		height: '100%',
		display: 'flex',
		flexDirection: 'row',
		flex: '1',
		justifyContent: 'flex-start',
		alignItems: 'center',
		padding: '14px 0',
		paddingLeft: spacing
	},
	rightControls: {
		position: 'relative',
		height: '100%',
		display: 'flex',
		flexDirection: 'row',
		flex: '1',
		justifyContent: 'flex-end',
		alignItems: 'center',
		padding: '14px 0',
		paddingRight: spacing
	},
	// user container
	userContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		pointerEvents: 'all',
		cursor: 'pointer'
	},
	// user thumbnail
	userThumbnail: {
		width: '42px',
		height: '42px',
		minWidth: '42px',
		minHeight: '42px',
		boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.35)',
		borderRadius: '50%',
		overflow: 'hidden',
		pointerEvents: 'none'
		// backgroundColor : '#000'
	},
	userThumbnailImage: {
		objectFit: 'cover',
		width: '100%',
		height: '100%'
	},
	// user details
	userInfo: {
		marginLeft: '8px',
		fontSize: '18px',
		fontWeight: '600',
		color: '#fff',
		textShadow: '0px 0px 4px rgba(0, 0, 0, 0.75)',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'start',
		textAlign: 'left',
		lineHeight: '18px',
		pointerEvents: 'none'
	},
	// user slogan
	userSlogan: {
		fontWeight: 'normal',
		fontSize: '14px',
		color: '#e9e9e9',
		overflow: 'hidden',
		whiteSpace: 'nowrap',
		textOverflow: 'ellipsis',
		maxWidth: '200px'
	},
	// action button
	actionButton: {
		fontFamily: 'Rajdhani',
		fontSize: '14px',
		fontWeight: 'bold',
		textTransform: 'uppercase',
		color: '#ffbf51',
		height: '28px',
		padding: '0 12px',
		paddingTop: '2px',
		borderRadius: '3px',
		border: '2px solid #ffbf51',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		textShadow: '0 0 4px rgba(0, 0, 0, 1)',
		boxShadow: '0 0 4px 0 rgba(0, 0, 0, 0.5)',
		pointerEvents: 'inherit',
		cursor: 'pointer',
		transition: 'all 0.2s ease'
	},
	actionButtonHovered: {
		border: '2px solid #ffbf51',
		backgroundColor: '#ffbf51',
		color: '#4d3612',
		textShadow: 'none'
	},
	// control button base
	controlButton: {
		maxHeight: '18px'
	},
	// horizontal spacer
	spacer: {
		width: spacing
	}
};