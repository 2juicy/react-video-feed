'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Video = require('./Video');

var _Video2 = _interopRequireDefault(_Video);

var _Style = require('../Style');

var _Style2 = _interopRequireDefault(_Style);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // import global dependencies


// import local dependencies


/**
 * MedalPlayer is for rendering a Medal video. It supports all basic video controls,
 * plus more advanced properties specific to Medal.
 */
var MedalPlayer = function (_React$Component) {
	_inherits(MedalPlayer, _React$Component);

	function MedalPlayer(props) {
		_classCallCheck(this, MedalPlayer);

		// mouse timeout
		var _this = _possibleConstructorReturn(this, (MedalPlayer.__proto__ || Object.getPrototypeOf(MedalPlayer)).call(this, props));

		_this.updateState = function (state) {
			// check if mounted
			if (_this.mounted) {
				// set state if mounted
				_this.setState(state);
			}
		};

		_this.setEngaged = function (engaged) {
			// set engaged state
			_this.updateState({ engaged: engaged });
		};

		_this.onMouseMove = function () {
			// set the state to hovered
			_this.setEngaged(true);

			// reset the mouse timeout
			_this.resetMouseTimeout();

			// check props
			if (_this.props.onMouseMove) {
				// on click
				_this.props.onMouseMove();
			}
		};

		_this.onMouseEnter = function () {
			// set the state to hovered
			_this.setEngaged(true);

			// reset the mouse timeout
			_this.resetMouseTimeout();

			// check props
			if (_this.props.onMouseEnter) {
				// on click
				_this.props.onMouseEnter();
			}
		};

		_this.onMouseLeave = function () {
			// set the state to not hovered
			_this.setEngaged(false);

			// reset the mouse timeout
			_this.clearMouseTimeout();

			// check props
			if (_this.props.onMouseLeave) {
				// on click
				_this.props.onMouseLeave();
			}
		};

		_this.onClick = function (e) {
			// check props
			if (_this.props.onClick) {
				// on click
				_this.props.onClick(e);
			}
		};

		_this.resetMouseTimeout = function () {
			// clear the timeout
			_this.clearMouseTimeout();

			// start a new timeout
			_this.mouseTimeout = setTimeout(function () {
				// set the state to not engaged
				_this.setEngaged(false);

				// clear timeout
				_this.clearMouseTimeout();
			}, 2500);
		};

		_this.clearMouseTimeout = function () {
			// check defined
			if (_this.mouseTimeout !== undefined) {
				// clear timeout
				clearTimeout(_this.mouseTimeout);

				// set mouse timeout to undefined
				_this.mouseTimeout = undefined;
			}
		};

		_this.toggleForceEngaged = function () {
			_this.updateState({ forceEngaged: !_this.state.forceEngaged });
		};

		_this.isEngaged = function () {
			return _this.state.engaged || _this.state.forceEngaged;
		};

		_this.mouseTimeout = undefined;

		// mount state
		_this.mounted = false;

		// set default state
		_this.state = {
			engaged: false,
			forceEngaged: false
		};
		return _this;
	}

	/**
  * on component did mount
  */


	_createClass(MedalPlayer, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			// update the mounted state
			this.mounted = true;
		}

		/**
   * on component will unmount
   */

	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			this.mounted = false;

			// clear all timeouts
			this.clearMouseTimeout();
		}

		/**
   * on component will receive props
   * @param nextProps
   */

	}, {
		key: 'shouldComponentUpdate',
		value: function shouldComponentUpdate(nextProps, nextState) {
			// is update required?
			var updateRequired = false;

			// compare video opts
			if (this.props.videoOpts && nextProps.videoOpts) {
				// check autoplay
				if (this.props.videoOpts.autoplay !== nextProps.videoOpts.autoplay) {
					updateRequired = true;
				}
				// check loop
				else if (this.props.videoOpts.loop !== nextProps.videoOpts.loop) {
						updateRequired = true;
					}
					// check muted
					else if (this.props.videoOpts.muted !== nextProps.videoOpts.muted) {
							updateRequired = true;
						}
						// check controls
						else if (this.props.videoOpts.controls !== nextProps.videoOpts.controls) {
								updateRequired = true;
							}
							// check preload
							else if (this.props.videoOpts.preload !== nextProps.videoOpts.preload) {
									updateRequired = true;
								}
								// check embedded
								else if (this.props.videoOpts.embedded !== nextProps.videoOpts.embedded) {
										updateRequired = true;
									}
									// check quality
									else if (this.props.videoOpts.quality !== nextProps.videoOpts.quality) {
											updateRequired = true;
										}
										// check retry
										else if (this.props.videoOpts.retry !== nextProps.videoOpts.retry) {
												updateRequired = true;
											}
											// check size
											else if (this.props.videoOpts.size !== nextProps.videoOpts.size) {
													updateRequired = true;
												}
			}

			// content id changed, update component
			if (this.props.content && nextProps.content && this.props.content.contentId !== nextProps.content.contentId) {
				updateRequired = true;
			}

			// check if update is required
			if (updateRequired) {
				// update is required
				return true;
			}

			return this.state.engaged !== nextState.engaged || this.state.forceEngaged !== nextState.forceEngaged || this.props.user !== nextProps.user || this.props.content !== nextProps.content || this.props.video !== nextProps.video;
		}

		/**
   * override set state
   */


		/**
   * set the engaged state
   * @param engaged
   */


		/**
   * on mouse move
   */


		/**
   * on mouse enter event
   */


		/**
   * on mouse leave event
   */


		/**
   * on click event
   * @param e
   */


		/**
   * resets the mouse timeout, when the timeout ends the controls are hidden
   */


		/**
   * clears the mouse timeout
   */


		/**
   * set force engaged state
   * @param engaged
   */


		/**
   * is the container engaged
   */

	}, {
		key: 'render',


		/**
   * render the medal video player component jsx
   * @returns {*}
   */
		value: function render() {
			// click to play
			var clickToPlay = (this.props.videoOpts || {}).clickToPlay !== undefined ? this.props.videoOpts.clickToPlay : true;

			// render jsx
			return _react2.default.createElement(
				'div',
				{
					id: (this.props.id.startsWith('mvp-') && this.props.content && this.props.content.contentId ? this.props.id + '-' + this.props.content.contentId : this.props.id) + '-player',
					style: Object.assign({}, _Style2.default.medalPlayerContainer, style.engagementContainer, clickToPlay ? { pointerEvents: 'all' } : {}, this.props.wrapperStyle || {}),
					onMouseMove: this.onMouseMove,
					onMouseEnter: this.onMouseEnter,
					onMouseLeave: this.onMouseLeave,
					onClick: this.onClick
				},
				_react2.default.createElement(_Video2.default
				// id
				, { id: this.props.id.startsWith('mvp-') && this.props.content && this.props.content.contentId ? this.props.id + '-' + this.props.content.contentId : this.props.id

					// custom
					, showUser: this.props.showUser,
					showPlayIcon: this.props.showPlayIcon,
					toggleForceEngaged: this.toggleForceEngaged,
					engaged: this.isEngaged(),
					videoRef: this.props.videoRef,
					componentRef: this.props.componentRef,
					videoStyle: this.props.videoStyle

					// generic properties
					, videoOpts: this.props.videoOpts,
					video: this.props.video,
					content: this.props.content,
					user: this.props.user,
					game: this.props.game,
					viewer: this.props.viewer

					// video events
					, onPlay: this.props.onPlay,
					onPlaying: this.props.onPlaying,
					onPause: this.props.onPause,
					onEnd: this.props.onEnd,
					onReplay: this.props.onReplay,
					onTimeUpdate: this.props.onTimeUpdate,
					onReady: this.props.onReady,
					onLoaded: this.props.onLoaded,
					onLoadedData: this.props.onLoadedData,
					onError: this.props.onError,
					onMute: this.props.onMute,
					onUnmute: this.props.onUnmute,
					onViewCount: this.props.onViewCount

					// mouse events
					, resetMouse: this.onMouseMove
				})
			);
		}
	}]);

	return MedalPlayer;
}(_react2.default.Component);

exports.default = MedalPlayer;


MedalPlayer.defaultProps = {
	id: 'mvp-video-' + new Date().getTime(),
	showPlayIcon: true,
	showUser: true
};

/**
 * prop types for the medal player
 */
MedalPlayer.propTypes = {
	// id
	id: _propTypes2.default.string,
	showPlayIcon: _propTypes2.default.bool,
	showUser: _propTypes2.default.bool,

	// properties
	videoOpts: _propTypes2.default.object,
	video: _propTypes2.default.object,
	content: _propTypes2.default.object,
	user: _propTypes2.default.object,
	game: _propTypes2.default.object,
	viewer: _propTypes2.default.object,
	videoStyle: _propTypes2.default.object,

	// style
	wrapperStyle: _propTypes2.default.object,

	// events
	onPlay: _propTypes2.default.func,
	onPlaying: _propTypes2.default.func,
	onPause: _propTypes2.default.func,
	onEnd: _propTypes2.default.func,
	onReplay: _propTypes2.default.func,
	onTimeUpdate: _propTypes2.default.func,
	onReady: _propTypes2.default.func,
	onLoaded: _propTypes2.default.func,
	onLoadedData: _propTypes2.default.func,
	onError: _propTypes2.default.func,
	onMute: _propTypes2.default.func,
	onUnmute: _propTypes2.default.func,
	onViewCount: _propTypes2.default.func,

	// engagement layer
	onMouseEnter: _propTypes2.default.func,
	onMouseLeave: _propTypes2.default.func,
	onMouseMove: _propTypes2.default.func,
	onClick: _propTypes2.default.func,

	// set video ref callback
	videoRef: _propTypes2.default.func,
	componentRef: _propTypes2.default.func
};

var style = {
	engagementContainer: {
		userSelect: 'none',
		WebkitUserSelect: 'none',
		msUserSelect: 'none',
		display: 'flex',
		alignItems: 'center'
	}
};