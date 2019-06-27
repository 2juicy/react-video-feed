'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _ControlButton = require('./ControlButton');

var _ControlButton2 = _interopRequireDefault(_ControlButton);

var _Style = require('../Style');

var _Style2 = _interopRequireDefault(_Style);

var _Icon = require('../Icon');

var _Icon2 = _interopRequireDefault(_Icon);

var _Utils = require('../../util/Utils');

var _Utils2 = _interopRequireDefault(_Utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // import global dependencies

// import ReactTooltip from 'react-tooltip';

// import local dependencies


var ControlBar = function (_React$PureComponent) {
	_inherits(ControlBar, _React$PureComponent);

	function ControlBar(props) {
		_classCallCheck(this, ControlBar);

		// mounted
		var _this = _possibleConstructorReturn(this, (ControlBar.__proto__ || Object.getPrototypeOf(ControlBar)).call(this, props));

		_this.updateState = function (state, callback) {
			if (_this.mounted) {
				_this.setState(state, callback);
			}
		};

		_this.toggleMuted = function (e) {
			// stop event propagation
			if (e) {
				e.stopPropagation();
			}

			// reset mouse
			if (_this.props.resetMouse) {
				_this.props.resetMouse();
			}

			// check mute state
			if (_this.props.muted) {
				// unmute video
				_this.props.unmute();

				// show slider + reset timer
				_this.showVolumeSlider();
			} else {
				// mute video
				_this.props.mute();
			}
		};

		_this.onBrandClick = function (e) {
			// stop event propagation
			if (e) {
				e.stopPropagation();
			}

			// reset mouse
			if (_this.props.resetMouse) {
				_this.props.resetMouse();
			}

			// open outlink in default browser
			window.open(_this.props.outlink, '_blank');
		};

		_this.onShareClick = function (e) {
			// stop event propagation
			if (e) {
				e.stopPropagation();
			}

			// reset mouse
			if (_this.props.resetMouse) {
				_this.props.resetMouse();
			}

			// enter share screen
			if (_this.props.share) {
				_this.props.share();
			}
		};

		_this.onFullScreenClick = function (e) {
			// stop event propagation
			if (e) {
				e.stopPropagation();
			}

			// reset mouse
			if (_this.props.resetMouse) {
				_this.props.resetMouse();
			}

			// check full screen method
			if (_this.props.fullscreen) {
				_this.props.fullscreen();
			}
		};

		_this.onTheaterModeClick = function (e) {
			// stop event propagation
			if (e) {
				e.stopPropagation();
			}

			// reset mouse
			if (_this.props.resetMouse) {
				_this.props.resetMouse();
			}

			// check full screen method
			if (_this.props.onTheaterModeClick) {
				_this.props.onTheaterModeClick();
			}
		};

		_this.onQualityClick = function (e) {
			// stop event propagation
			if (e) {
				e.stopPropagation();
			}

			// reset mouse
			if (_this.props.resetMouse) {
				_this.props.resetMouse();
			}

			// check full screen method
			if (_this.props.onQualityClick) {
				_this.props.onQualityClick();
			}
		};

		_this.onTimeScrubberHovered = function (e) {
			// set hovered state
			_this.updateState({ timeScrubberHovered: true });
		};

		_this.onTimeScrubberExited = function (e) {
			// set hovered state
			_this.updateState({ timeScrubberHovered: false });
		};

		_this.onTimeScrubberPressed = function (e) {
			// stop propagation
			if (e) {
				e.preventDefault();
				e.stopPropagation();
			}

			// pressed
			_this.scrubbing = true;

			// time scrubber dom element
			_this.onTimeScrubberUpdated(e);
		};

		_this.stopScrubbing = function (e) {
			// check if scrubbing
			if (_this.scrubbing) {
				// stop events from bubbling
				if (e) {}
				// e.preventDefault();
				// e.stopPropagation();


				// release
				_this.scrubbing = false;
			}
		};

		_this.onTimeScrubberMoved = function (e) {
			// check if scrubbing
			if (_this.scrubbing === true) {
				// reset mouse
				if (_this.props.resetMouse) {
					_this.props.resetMouse();
				}

				// update the scrubber
				_this.onTimeScrubberUpdated(e);
			}
		};

		_this.onTimeScrubberUpdated = function (e) {
			// time scrubber dom element
			var timeScrubber = document.getElementById(_this.props.id + '-time');

			// check if time scrubber is defined and not null
			if (timeScrubber && timeScrubber !== null) {
				// coordinates
				var width = timeScrubber.getBoundingClientRect().width;
				var x = e.pageX - timeScrubber.getBoundingClientRect().left;
				var percent = Math.floor(x / width * 100);

				// video
				var video = _this.props.video();

				// check if video exists
				if (video && video.readyState > 0) {
					// new current time
					var newTime = Math.round(video.duration * parseFloat('.' + (percent > 0 && percent < 10 ? '0' : '') + percent));

					// check if number
					if (!isNaN(newTime)) {
						// set new time
						video.currentTime = newTime;
					}
				}
			}
		};

		_this.showVolumeSlider = function () {
			// reset timeout
			_this.engageVolumeSlider();

			// show
			_this.updateState({ showVolumeSlider: true });
		};

		_this.hideVolumeSlider = function () {
			// set timeout
			_this.volumeSliderExit = setTimeout(function () {
				// hide slider
				_this.updateState({ showVolumeSlider: false });
			}, 2000);
		};

		_this.engageVolumeSlider = function () {
			if (_this.volumeSliderExit) {
				// clear timeout
				clearTimeout(_this.volumeSliderExit);

				// null it
				_this.volumeSliderExit = undefined;
			}
		};

		_this.onVolumeChange = function (event) {
			// new value
			var value = event.target.value;

			// emit value change to video player
			if (_this.props.onVolumeChange) {
				_this.props.onVolumeChange(value / 100);
			}
		};

		_this.mounted = false;

		// set the default states
		_this.state = {
			timeScrubberHovered: false,
			showVolumeSlider: false
		};
		return _this;
	}

	/**
  * on component did mount
  */


	_createClass(ControlBar, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			// mounted
			this.mounted = true;

			// on mouse up event
			window.addEventListener('mouseup', this.stopScrubbing);

			// on mouse move event
			window.addEventListener('mousemove', this.onTimeScrubberMoved);

			// on mouse up event
			window.addEventListener('mouseenter', this.stopScrubbing);
		}

		/**
   * on component will unmount
   */

	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			// mounted
			this.mounted = false;

			// on mouse up event
			window.removeEventListener('mouseup', this.stopScrubbing);

			// on mouse move event
			window.removeEventListener('mousemove', this.onTimeScrubberMoved);

			// on mouse up event
			window.removeEventListener('mouseenter', this.stopScrubbing);
		}

		/**
   * update state
   */


		/**
   * on mute button pressed
   * @param e
   */


		/**
   * on the click of the brand
   * @param e
   */


		/**
   * on share button click
   * @param e
   */


		/**
   * on full screen button click
   * @param e
   */


		/**
   * on theater mode button click
   * @param e
   */


		/**
   * on quality button click
   * @param e
   */


		/**
   * on time scrubber hovered
   */


		/**
   * on time scrubber mouse exited
   * @param e
   */


		/**
   * on time scrubber pressed
   * @param e
   */


		/**
   * on mouse up listener
   */


		/**
   * on time scrubber moved
   * @param e
   */


		/**
   * on time scrubber updated
   */


		/**
   * show volume slider
   */


		/**
   * hide volume slider
   */


		/**
   * engage the volume slider, so keep it visible
   */


		/**
   * on volume slider change
   */

	}, {
		key: 'render',


		/**
   * render the button jsx
   * @returns {*}
   */
		value: function render() {
			// scrubber width in %
			var scrubberWidth = this.props.currentTime / this.props.duration * 100 + '%';

			// spacing
			var HEIGHT_SM = 30;
			var HEIGHT_MD = 46;
			var spacing = this.props.size === 'sm' ? 12 : 18;

			// spacer style
			var spacer = {
				width: spacing + 'px'
			};

			// button style
			var controlButton = {
				maxHeight: spacing + 'px'
			};

			// render jsx
			return _react2.default.createElement(
				_react2.default.Fragment,
				null,
				_react2.default.createElement('div', { style: style.bottomGradientOverlay }),
				_react2.default.createElement(
					'div',
					{ style: Object.assign({}, style.bottomControlsContainer, { minHeight: this.props.size === 'sm' ? HEIGHT_SM + 'px' : HEIGHT_MD + 'px' }, { pointerEvents: this.props.show ? 'all' : 'none' }) },
					_react2.default.createElement(
						'div',
						{ style: Object.assign({}, style.leftControls, { paddingLeft: spacing + 'px' }) },
						_react2.default.createElement(_ControlButton2.default, {
							src: this.props.paused ? this.props.ended && this.props.currentTime === 0 ? _Icon2.default.restart : _Icon2.default.play : _Icon2.default.pause,
							style: controlButton,
							onClick: this.props.paused ? this.props.play : this.props.pause
						}),
						_react2.default.createElement('div', { style: spacer }),
						_react2.default.createElement(_ControlButton2.default, {
							src: this.props.muted ? _Icon2.default.volumeOff : _Icon2.default.volumeOn,
							style: controlButton,
							onClick: this.toggleMuted,
							onHoverEnter: this.showVolumeSlider,
							onHoverLeave: this.hideVolumeSlider
						}),
						_react2.default.createElement(
							'div',
							{
								style: {
									pointerEvents: !this.props.muted && this.state.showVolumeSlider === true ? 'all' : 'none',
									marginLeft: !this.props.muted && this.state.showVolumeSlider === true ? spacing / 2 + 'px' : '0',
									maxWidth: !this.props.muted && this.state.showVolumeSlider === true ? '75px' : '0',
									opacity: !this.props.muted && this.state.showVolumeSlider === true ? '1' : '0',
									display: 'flex',
									transition: 'all 0.2s ease'
								},
								onMouseEnter: this.engageVolumeSlider,
								onMouseLeave: this.hideVolumeSlider
							},
							_react2.default.createElement('input', {
								className: 'volume-slider',
								name: 'volume',
								type: 'range',
								min: 0,
								max: 100,
								step: 1,
								defaultValue: this.props.volumeLevel * 100,
								onChange: this.onVolumeChange,
								onMouseDown: function onMouseDown(e) {
									return e.stopPropagation();
								},
								onMouseUp: function onMouseUp(e) {
									return e.stopPropagation();
								},
								onClick: function onClick(e) {
									return e.stopPropagation();
								}
							})
						),
						!_Utils2.default.isMobile() && _react2.default.createElement(
							_react2.default.Fragment,
							null,
							_react2.default.createElement('div', { style: spacer }),
							_react2.default.createElement(
								'div',
								{ style: {
										fontSize: this.props.size !== 'sm' ? '13px' : '11px',
										textShadow: '0 0 3px rgba(0, 0, 0, 0.5)',
										color: 'rgba(255, 255, 255, 0.9)',
										flexShrink: '0'
									} },
								_Utils2.default.hhmmss(this.props.currentTime) + ' / ' + _Utils2.default.hhmmss(this.props.duration)
							)
						)
					),
					_react2.default.createElement('div', { style: { flexGrow: '2' } }),
					_react2.default.createElement(
						'div',
						{ style: Object.assign({}, style.rightControls, { paddingRight: spacing + 'px' }) },
						!_Utils2.default.isMobile() && this.props.outlink && this.props.outlink !== null && this.props.size !== 'sm' && _react2.default.createElement(
							_react2.default.Fragment,
							null,
							_react2.default.createElement(_ControlButton2.default, {
								id: 'share-clip-' + this.props.id,
								tooltip: 'Share Clip',
								src: _Icon2.default.share,
								style: controlButton,
								onClick: this.onShareClick
							})
						),
						this.props.qualityToggleEnabled && _react2.default.createElement(
							_react2.default.Fragment,
							null,
							_react2.default.createElement('div', { style: spacer }),
							_react2.default.createElement(
								'div',
								{ style: Object.assign({}, controlButton, { position: 'relative' }) },
								_react2.default.createElement(_ControlButton2.default, {
									tooltip: 'Change Quality',
									src: _Icon2.default.cog,
									style: Object.assign({}, controlButton, { transform: this.props.quality === 'high' ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s ease' }),
									onClick: this.onQualityClick
								}),
								_react2.default.createElement(
									'div',
									{ style: {
											position: 'absolute',
											top: '-2px',
											right: '-3px',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											padding: '1px 2px',
											fontSize: '8px',
											lineHeight: '9px',
											fontWeight: 'bold',
											textShadow: '0 0 2px rgba(0, 0, 0, 0.5)',
											color: '#fff',
											borderRadius: '3px',
											pointerEvents: 'none',
											backgroundColor: _Style2.default.colorGuide.primaryGold
										} },
									this.props.quality === 'high' ? 'HD' : 'SD'
								)
							)
						),
						this.props.theaterModeEnabled && _react2.default.createElement(
							_react2.default.Fragment,
							null,
							_react2.default.createElement('div', { style: spacer }),
							_react2.default.createElement(_ControlButton2.default, {
								tooltip: 'Theater Mode',
								src: _Icon2.default.theater,
								style: controlButton,
								onClick: this.onTheaterModeClick
							})
						),
						this.props.fullscreenEnabled !== false && _react2.default.createElement(
							_react2.default.Fragment,
							null,
							_react2.default.createElement('div', { style: spacer }),
							_react2.default.createElement(_ControlButton2.default, {
								tooltip: 'Toggle Fullscreen',
								src: _Icon2.default.fullscreen,
								style: controlButton,
								onClick: this.onFullScreenClick
							})
						),
						this.props.outlink && this.props.outlink !== null && this.props.size !== 'sm' && _react2.default.createElement(
							_react2.default.Fragment,
							null,
							_react2.default.createElement('div', { style: spacer }),
							_react2.default.createElement('div', { style: { width: '1px', backgroundColor: 'rgba(255, 255, 255, 0.25)', height: '16px' } }),
							_react2.default.createElement('div', { style: spacer }),
							_react2.default.createElement(_ControlButton2.default, {
								tooltip: 'Watch on Medal',
								src: _Icon2.default.brand,
								srcHovered: _Icon2.default.brandActive,
								style: { maxHeight: '30px', opacity: '1' },
								onClick: this.onBrandClick
							})
						)
					)
				),
				this.props.duration > 0 && _react2.default.createElement(
					'div',
					{
						id: this.props.id + '-time',
						style: Object.assign({}, style.timeScrubberContainer, {
							bottom: this.props.size === 'sm' ? HEIGHT_SM + 'px' : HEIGHT_MD + 'px',
							minHeight: 'calc(' + (this.state.timeScrubberHovered ? '6px' : '4px') + (_Utils2.default.isMobile() ? ' + 3px' : '') + ')',
							maxHeight: 'calc(' + (this.state.timeScrubberHovered ? '6px' : '4px') + (_Utils2.default.isMobile() ? ' + 3px' : '') + ')',
							pointerEvents: this.props.show ? 'all' : 'none',
							margin: '0 ' + spacing + 'px',
							width: 'calc(100% - ' + spacing * 2 + 'px)',
							transition: 'all 0.2s ease'
						}),
						onMouseEnter: this.onTimeScrubberHovered,
						onMouseLeave: this.onTimeScrubberExited,
						onMouseDown: this.onTimeScrubberPressed,
						onClick: function onClick(e) {
							return e.stopPropagation();
						}
					},
					_react2.default.createElement('div', { style: style.timeScrubberBackground }),
					_react2.default.createElement('div', { style: Object.assign({}, style.timeScrubberFill, { width: scrubberWidth }) })
				)
			);
		}
	}]);

	return ControlBar;
}(_react2.default.PureComponent);

ControlBar.defaultProps = {
	ended: false
};

ControlBar.propTypes = {
	id: _propTypes2.default.string.isRequired,
	currentTime: _propTypes2.default.number.isRequired,
	duration: _propTypes2.default.number.isRequired,
	video: _propTypes2.default.func.isRequired,
	paused: _propTypes2.default.bool.isRequired,
	play: _propTypes2.default.func.isRequired,
	pause: _propTypes2.default.func.isRequired,
	muted: _propTypes2.default.bool,
	mute: _propTypes2.default.func.isRequired,
	unmute: _propTypes2.default.func.isRequired,
	fullscreen: _propTypes2.default.func.isRequired,
	show: _propTypes2.default.bool.isRequired,
	share: _propTypes2.default.func.isRequired,
	fullscreenEnabled: _propTypes2.default.bool,
	theaterModeEnabled: _propTypes2.default.bool,
	onTheaterModeClick: _propTypes2.default.func,
	outlink: _propTypes2.default.string,
	ended: _propTypes2.default.bool,
	size: _propTypes2.default.string,
	qualityToggleEnabled: _propTypes2.default.bool,
	quality: _propTypes2.default.string,
	onQualityClick: _propTypes2.default.func,
	onVolumeChange: _propTypes2.default.func,
	volumeLevel: _propTypes2.default.number.isRequired
};

exports.default = ControlBar;

// component style

var style = {
	// bottom gradient overlay for controls
	bottomGradientOverlay: {
		position: 'absolute',
		left: '0',
		bottom: '0',
		width: '100%',
		height: '30%',
		background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5))',
		pointerEvents: 'none'
	},
	// bottom control bar
	bottomControlsContainer: {
		position: 'absolute',
		left: '0',
		bottom: '0',
		width: '100%',
		// minHeight : '46px',
		// backgroundColor : '#ff00ff',
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
		flexGrow: '1',
		justifyContent: 'flex-start',
		alignItems: 'center',
		padding: '8px 0'
	},
	rightControls: {
		position: 'relative',
		height: '100%',
		display: 'flex',
		flexDirection: 'row',
		flexGrow: '1',
		justifyContent: 'flex-end',
		alignItems: 'center',
		padding: '8px 0'
	},
	// big spacer
	bigSpacer: {
		width: '100%'
	},
	// time scrubber
	timeScrubberContainer: {
		position: 'absolute',
		margin: '0 16px',
		width: 'calc(100% - 32px)',
		boxShadow: '0 0 3px 0px rgba(0, 0, 0, 0.35)',
		// transition : 'all 0.2s ease',
		cursor: 'pointer'
	},
	timeScrubberBackground: {
		position: 'absolute',
		left: '0',
		bottom: '0',
		height: '100%',
		backgroundColor: 'rgba(255, 255, 255, 0.35)',
		width: '100%',
		pointerEvents: 'none'
	},
	timeScrubberFill: {
		position: 'absolute',
		left: '0',
		bottom: '0',
		height: '100%',
		backgroundColor: _Style2.default.colorGuide.primaryGold,
		pointerEvents: 'none'
		// transition : 'all 0.3s ease'
	}
};