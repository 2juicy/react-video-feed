'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _player = require('player.js');

var _player2 = _interopRequireDefault(_player);

var _VideoTag = require('./tag/VideoTag');

var _ControlBar = require('./ControlBar');

var _ControlBar2 = _interopRequireDefault(_ControlBar);

var _ContentInfo = require('./ContentInfo');

var _ContentInfo2 = _interopRequireDefault(_ContentInfo);

var _ShareScreen = require('./ShareScreen');

var _ShareScreen2 = _interopRequireDefault(_ShareScreen);

var _Style = require('../Style');

var _Style2 = _interopRequireDefault(_Style);

var _Utils = require('../../util/Utils');

var _Utils2 = _interopRequireDefault(_Utils);

var _Icon = require('../Icon');

var _Icon2 = _interopRequireDefault(_Icon);

var _Cookies = require('../../util/Cookies');

var _Cookies2 = _interopRequireDefault(_Cookies);

var _Image = require('./Image');

var _Image2 = _interopRequireDefault(_Image);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // import global dependencies

// import ReactTooltip from 'react-tooltip';


// import local dependencies


// make the video player use raw html?
var useRawHTML = false;

var Video = function (_React$PureComponent) {
	_inherits(Video, _React$PureComponent);

	function Video(props) {
		_classCallCheck(this, Video);

		// is hd?
		var _this = _possibleConstructorReturn(this, (Video.__proto__ || Object.getPrototypeOf(Video)).call(this, props));

		_this.updateState = function (state, callback) {
			// check if mounted
			if (_this.mounted) {
				// set state if mounted
				_this.setState(state, callback && callback);
			}
		};

		_this.playerjs = function () {
			// check adapter is defined
			if (!_this.adapter) {
				_this.adapter = new _player2.default.HTML5Adapter(_this.video());
			}
			return _this.adapter;
		};

		_this.onViewStart = function () {
			// check if content is defined
			if (!_this.props.content) {
				return;
			}

			// increment the started views
			_this.startedViews++;

			// report view start to mixpanel, ga, medal
			try {
				_Utils2.default.sendWatchStartEvent(_this.props.content, _this.props.viewer, _this.state.embedded);
			} catch (e) {
				console.log('Watch start event failed to send!');
			}
		};

		_this.onViewCount = function (submitView) {
			// check if content is defined
			if (!_this.props.content) {
				return;
			}

			// increment halfway views
			_this.halfwayViews++;

			// report view halfway to mixpanel, ga, medal
			try {
				_Utils2.default.sendViewCountEvent(_this.props.content, _this.props.viewer, _this.state.embedded, submitView);
			} catch (e) {
				console.log('Watch halfway event failed to send!');
			}
		};

		_this.onViewComplete = function () {
			// check if content is defined
			if (!_this.props.content) {
				return;
			}

			// increment the started views
			_this.completedViews++;

			// report view complete to mixpanel, ga, medal
			try {
				_Utils2.default.sendWatchEndEvent(_this.props.content, _this.props.viewer, _this.state.embedded);
			} catch (e) {
				console.log('Watch complete event failed to send!');
			}
		};

		_this.onLoadedData = function () {
			// check if there is an onLoadComplete attached to props
			if (_this.props.onLoadedData) {
				_this.props.onLoadedData();
			}
		};

		_this.onFailed = function () {
			// check props for on error func
			if (_this.props.onError) {
				_this.props.onError();
			}

			// check if retry is valid and has retries left
			if (_this.state.retry && _this.state.retries > 0) {
				// pause the video
				_this.pause();

				// re-append source to video component
				_this.video().appendChild(_this.source());

				// increment retries
				_this.updateState({ retries: _this.state.retries - 1 }, function () {
					// try playing the video again
					_this.play();
				});
			}
		};

		_this.video = function () {
			// get the element by id
			var element = document.getElementById(_this.props.id);

			// check if element is defined and not null
			if (element && element !== null) {
				return element;
			}

			// return undefined by default
			return undefined;
		};

		_this.source = function () {
			// get the element by id
			var element = document.getElementById(_this.props.id + '-source');

			// check if element is defined and not null
			if (element && element !== null) {
				return element;
			}

			// return undefined by default
			return undefined;
		};

		_this.reloadSrc = function (bypassCache) {
			// play required
			var playRequired = false;

			// check if playing
			if (!_this.isPaused()) {
				// pause the video
				_this.pause();

				// play required
				playRequired = true;
			}

			// update source attribute
			_this.source().setAttribute('src', bypassCache || _this.props.videoOpts.bypassCache ? _Utils2.default.appendCacheQueryString(_this.state.src, new Date().getTime()) : _this.state.src);

			// load the video
			_this.video().load();

			// check if play required
			if (playRequired) {
				// play the video
				_this.play();
			}

			// check video ref
			if (_this.props.videoRef) {
				// update video ref
				_this.props.videoRef(_this.video());
			}
		};

		_this.play = function (e) {
			// stop event propagation
			if (e) {
				e.stopPropagation();
			}

			// video
			var video = _this.video();

			// play the video
			if (video) {
				// check if playing
				if (!_this.playPromise) {
					// play
					_this.playPromise = function () {
						return new Promise(async function (resolve) {
							try {
								// await the play
								await Promise.resolve(video.play());
							} catch (e) {
								console.log('Playback warning:', e);
							}

							// unset
							_this.playPromise = undefined;

							// resolve
							resolve();
						});
					};

					// call
					_this.playPromise();
				}
			}
		};

		_this.pause = function (e) {
			// stop event propagation
			if (e) {
				e.stopPropagation();
			}

			// video
			var video = _this.video();

			// if the video is not paused
			if (video && !video.paused && !_this.playPromise) {
				// pause the video
				_this.video().pause();
			}
		};

		_this.toggleQuality = function (e) {
			// stop event propagation
			if (e) {
				e.stopPropagation();
			}

			// quality
			var quality = _this.state.quality === 'high' ? 'low' : 'high';

			// toggle the quality
			_this.updateState({ quality: quality });

			// check props for on mute func
			if (_this.props.onQualityUpdate) {
				_this.props.onQualityUpdate(quality);
			}

			// set cookie
			_Cookies2.default.setQuality(quality);
		};

		_this.mute = function (e) {
			// stop event propagation
			if (e) {
				e.stopPropagation();
			}

			// mute the video
			// this.video().muted = true;
			_this.updateState({ muted: true });

			// check props for on mute func
			if (_this.props.onMute) {
				_this.props.onMute();
			}

			// set cookie
			_Cookies2.default.setMuted(true);
		};

		_this.unmute = function (e) {
			// stop event propagation
			if (e) {
				e.stopPropagation();
			}

			// mute the video
			// this.video().muted = false;
			_this.updateState({ muted: false });

			// check props for on unmute func
			if (_this.props.onUnmute) {
				_this.props.onUnmute();
			}
			// set cookie
			_Cookies2.default.setMuted(false);
		};

		_this.onPlay = function () {
			// apply mute state
			if (_this.state.muted !== _this.video().muted) {
				_this.video().muted = _this.state.muted;
			}

			// check if the video has completed it's last view or if it just never started it
			if (_this.startedViews - _this.completedViews === 0) {
				// increment the started views
				_this.onViewStart();

				// submit view anonymously?
				var submitView = true;

				// on view count
				if (_this.props.onViewCount) {
					// on view count
					_this.props.onViewCount();

					// dont submit anonymous
					submitView = false;
				}

				// send view count event
				_this.onViewCount(submitView);
			}

			// set paused state to false
			_this.updateState({ paused: false, playing: true });

			// check props for on play func
			if (_this.props.onPlay) {
				_this.props.onPlay();
			}
		};

		_this.onPlaying = function () {
			// set flags
			_this.onPlayingFlag = true;
			_this.onPauseFlag = false;

			// set paused state to false
			_this.updateState({ paused: _this.onPauseFlag, playing: _this.onPlayingFlag });

			// check props for on play func
			if (_this.props.onPlaying) {
				_this.props.onPlaying();
			}
		};

		_this.onPause = function () {
			// set flags
			_this.onPlayingFlag = false;
			_this.onPauseFlag = true;

			// set paused state to false
			_this.updateState({ paused: _this.onPauseFlag, playing: _this.onPlayingFlag });

			// check props for on pause func
			if (_this.props.onPause) {
				_this.props.onPause();
			}
		};

		_this.onReady = function () {
			// duration
			var duration = _this.video().duration;

			// check if defined
			if (duration && duration !== _this.state.duration) {
				// set duration
				_this.updateState({ duration: duration });
			}

			// update ready state
			_this.updateState({ ready: true });

			// check props for on ready func
			if (_this.props.onReady) {
				_this.props.onReady();
			}

			// emit ready event to player.js
			if (_this.state.embedded) {
				_this.playerjs().ready();
			}
		};

		_this.onEnd = function () {
			// check if the video has completed it's last view or if it just never started it
			if (_this.startedViews - _this.completedViews === 1) {
				_this.onViewComplete();
			}

			// update current time to 0
			_this.updateState({
				currentTime: 0,
				ended: true
			});

			// check props for on end func
			if (_this.props.onEnd) {
				_this.props.onEnd();
			}
		};

		_this.onTimeUpdate = function () {
			// current time
			var currentTime = _this.video().currentTime;

			// check if defined
			if (currentTime && currentTime !== _this.state.currentTime) {
				// set current time state
				_this.updateState({ currentTime: currentTime });

				// check if halfway viewed
				if (currentTime >= 2 && _this.halfwayViews === _this.startedViews - 1) {}
				// send viewed event
				// this.onViewCount();


				// check props for on end func
				if (_this.props.onTimeUpdate) {
					_this.props.onTimeUpdate(currentTime);
				}
			}
		};

		_this.requestFullScreen = function (element) {
			// check if ios
			if (_Utils2.default.isIOS()) {
				// request fullscreen on the video element
				element = _this.video();
			}

			// request based on browser
			if (element.requestFullscreen) {
				element.requestFullscreen();
			} else if (element.msRequestFullscreen) {
				element.msRequestFullscreen();
			} else if (element.mozRequestFullScreen) {
				element.mozRequestFullScreen();
			} else if (element.webkitRequestFullscreen) {
				element.webkitRequestFullscreen();
			} else if (element.webkitEnterFullScreen) {
				element.webkitEnterFullScreen();
			} else {
				console.error('Unrecognized fullscreen device!');
			}
		};

		_this.exitFullScreen = function () {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			} else if (document.cancelFullScreen) {
				document.cancelFullScreen();
			} else if (document.webkitCancelFullScreen) {
				document.webkitCancelFullScreen();
			} else {
				console.error('Unrecognized fullscreen device!');
			}
		};

		_this.toggleFullScreen = function () {
			// play instance
			var player = document.getElementById(_this.props.id + '-player');

			// is fullscreen active?
			var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
			var fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled || document.msFullscreenEnabled;

			// request based on browser
			if (fullscreenElement !== undefined && fullscreenElement !== null) {
				// exit
				_this.exitFullScreen();
			} else {
				//enter
				_this.requestFullScreen(player);
			}
		};

		_this.enterShareScreen = function () {
			// check if not already sharing
			if (!_this.state.sharing) {
				// set sharing state to true
				_this.updateState({ sharing: true });

				// check if force engaged method exists
				if (_this.props.toggleForceEngaged) {
					_this.props.toggleForceEngaged();
				}
			}
		};

		_this.exitShareScreen = function () {
			// check if already sharing
			if (_this.state.sharing) {
				// set sharing state to false
				_this.updateState({ sharing: false });

				// check if force engaged method exists
				if (_this.props.toggleForceEngaged) {
					_this.props.toggleForceEngaged();
				}
			}
		};

		_this.isPaused = function () {
			return (_this.video() || _this.state).paused;
		};

		_this.onContainerClick = function (e) {
			if (_this.state.clickToPlay) {
				if (_this.isPaused()) {
					_this.play();
				} else {
					_this.pause();
				}
			}
		};

		_this.onVolumeChange = function (volume) {
			// update video volume
			_this.video().volume = volume;

			// persist volume level in cookies
			_Cookies2.default.setVolume(volume);

			// update the volume state
			// this.updateState({ volumeLevel : volume });
		};

		_this.renderControls = function () {
			// default controls disabled, render custom controls
			return _this.state.controls && _react2.default.createElement(
				_react2.default.Fragment,
				null,
				_react2.default.createElement(
					'div',
					{
						style: Object.assign({}, _Style2.default.absoluteContainer, _Style2.default.opacityControl, { opacity: _this.props.engaged ? 1 : 0 }),
						onClick: _this.onContainerClick
					},
					_this.props.user && _this.state.embedded && _react2.default.createElement(_ContentInfo2.default, {
						showUser: _this.props.showUser,
						show: _this.props.engaged,
						content: _this.props.content,
						user: _this.props.user,
						viewer: _this.props.viewer,
						game: _this.props.game,
						embedded: _this.state.embedded,
						size: _this.state.size,
						donateConfig: _this.state.donateConfig
					}),
					_react2.default.createElement(_ControlBar2.default, {
						id: _this.props.id,
						currentTime: _this.state.currentTime,
						duration: _this.state.duration,
						show: _this.props.engaged,
						video: _this.video,
						paused: _this.state.paused,
						play: _this.play,
						pause: _this.pause,
						muted: _this.state.muted,
						mute: _this.mute,
						unmute: _this.unmute,
						fullscreen: _this.toggleFullScreen,
						fullscreenEnabled: _this.props.videoOpts.fullscreenEnabled,
						outlink: _this.state.outlink,
						embedded: _this.state.embedded,
						share: _this.enterShareScreen,
						ended: _this.state.ended,
						size: _this.state.size,
						qualityToggleEnabled: _this.props.content !== undefined,
						quality: _this.state.quality,
						onQualityClick: _this.toggleQuality,
						theaterModeEnabled: !!_this.props.videoOpts.theaterModeEnabled,
						onTheaterModeClick: _this.props.videoOpts.onTheaterModeClick,
						resetMouse: _this.props.resetMouse,
						onVolumeChange: _this.onVolumeChange,
						volumeLevel: _this.state.volumeLevel
					})
				),
				_this.props.showPlayIcon !== false && (!_this.onPlayingFlag || _this.state.paused) && _react2.default.createElement('img', { style: {
						width: _this.state.size === 'sm' ? '48px' : '64px',
						height: _this.state.size === 'sm' ? '48px' : '64px',
						position: 'absolute',
						top: 'calc(50% - ' + (_this.state.size === 'sm' ? '24px' : '32px') + ')',
						left: 'calc(50% - ' + (_this.state.size === 'sm' ? '24px' : '32px') + ')',
						pointerEvents: 'none',
						opacity: _this.state.paused ? '1' : '0',
						transition: 'opacity 0.2s ease'
					}, src: _Icon2.default.playCircle, alt: _Icon2.default.playCircle })
			);
		};

		_this.renderShareScreen = function () {
			// render share screen jsx
			return _this.state.sharing && _this.state.outlink && _this.state.outlink !== null && _this.props.user && _this.props.content && _react2.default.createElement(_ShareScreen2.default, {
				user: _this.props.user,
				content: _this.props.content,
				viewer: _this.props.viewer,
				embedded: _this.state.embedded,
				outlink: _this.state.outlink,
				close: _this.exitShareScreen,
				size: _this.state.size
			});
		};

		_this.renderLoadingSpinner = function () {
			return (_this.onPlayingFlag || !_this.state.paused) && !_this.state.ready && _react2.default.createElement(
				'div',
				{ style: {
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						position: 'absolute',
						top: '0',
						left: '0',
						bottom: '0',
						right: '0'
					} },
				_react2.default.createElement(
					'div',
					{ style: { width: '36px', height: '36px' } },
					_react2.default.createElement(
						'div',
						{ className: 'lds-ring' },
						_react2.default.createElement('div', null),
						_react2.default.createElement('div', null),
						_react2.default.createElement('div', null),
						_react2.default.createElement('div', null)
					)
				)
			);
		};

		var isHighQuality = !_Utils2.default.isMobile() && (props.videoOpts && props.videoOpts.quality !== undefined ? props.videoOpts.quality : _Cookies2.default.getQuality()) === 'high';

		// quality
		var sources = {
			'360': {},
			'720': {},
			'1080': {}
		};

		sources['360'].src = props.content ? props.content.contentUrl360p : undefined;
		sources['360'].poster = props.content ? props.content.thumbnail360p : undefined;
		sources['720'].src = props.content ? props.content.contentUrl720p : undefined;
		sources['720'].poster = props.content ? props.content.thumbnail720p : undefined;
		sources['1080'].src = props.content ? props.content.contentUrl1080p : undefined;
		sources['1080'].poster = props.content ? props.content.thumbnail1080p : undefined;

		// video props
		var videoProps = {
			// check for content obj first, then video obj
			src: props.content && (isHighQuality ? sources['1080'].src || sources['720'].src : sources['360'].src) ? isHighQuality ? sources['1080'].src || sources['720'].src : sources['360'].src : props.video && props.video.src ? props.video.src : '',
			poster: props.content && (isHighQuality ? sources['1080'].poster || sources['720'].poster : sources['360'].poster) ? isHighQuality ? sources['1080'].poster || sources['720'].poster : sources['360'].poster : props.video && props.video.poster ? props.video.poster : '',
			title: props.content && props.content.contentTitle ? props.content.contentTitle : props.video && props.video.title ? props.video.title : '',
			outlink: props.videoOpts && props.videoOpts.outlink !== undefined ? props.videoOpts.outlink : props.content && props.content.contentId ? 'https://medal.tv/clips/' + props.content.contentId + '/' + _Utils2.default.generateSpok() : undefined,
			loop: props.videoOpts && props.videoOpts.loop !== undefined ? props.videoOpts.loop : false,
			preload: props.videoOpts && props.videoOpts.preload !== undefined ? props.videoOpts.preload : 'metadata',
			muted: props.videoOpts && props.videoOpts.muted !== undefined ? props.videoOpts.muted : _Cookies2.default.getMuted(),
			quality: props.videoOpts && props.videoOpts.quality !== undefined ? props.videoOpts.quality : _Cookies2.default.getQuality(),
			autoplay: props.videoOpts && props.videoOpts.autoplay !== undefined ? props.videoOpts.autoplay : false,
			embedded: props.videoOpts && props.videoOpts.embedded !== undefined ? props.videoOpts.embedded : true,
			controls: props.videoOpts && props.videoOpts.controls !== undefined ? props.videoOpts.controls : true,
			retry: props.videoOpts && props.videoOpts.retry !== undefined ? props.videoOpts.retry : true,
			size: props.videoOpts && props.videoOpts.size !== undefined ? props.videoOpts.size : 'md',
			clickToPlay: props.videoOpts && props.videoOpts.clickToPlay !== undefined ? props.videoOpts.clickToPlay : true
		};

		// mount state
		_this.mounted = false;

		// player.js adapter
		_this.adapter = undefined;

		// view tracking
		_this.startedViews = 0;
		_this.halfwayViews = 0;
		_this.completedViews = 0;

		_this.onPlayingFlag = videoProps.autoplay;
		_this.onPauseFlag = !videoProps.autoplay;

		// cache param
		var cacheValue = props.videoOpts.bypassCache ? !isNaN(props.videoOpts.bypassCache) ? props.videoOpts.bypassCache : new Date().getTime() : '';

		// set the default states
		_this.state = {
			sources: sources,
			src: props.videoOpts.bypassCache ? _Utils2.default.appendCacheQueryString(videoProps.src, cacheValue) : videoProps.src,
			poster: props.videoOpts.bypassCache ? _Utils2.default.appendCacheQueryString(videoProps.poster, cacheValue) : videoProps.poster,
			loop: videoProps.loop,
			preload: videoProps.preload,
			paused: props.paused || true,
			muted: videoProps.muted,
			autoplay: videoProps.autoplay,
			embedded: videoProps.embedded,
			title: videoProps.title,
			outlink: videoProps.outlink,
			controls: videoProps.controls,
			retry: videoProps.retry,
			size: videoProps.size,
			clickToPlay: videoProps.clickToPlay,
			quality: videoProps.quality,
			volumeLevel: _Cookies2.default.getVolume(),
			loaded: false,
			sharing: false,
			ready: false,
			ended: false,
			retries: 10,
			currentTime: 0,
			duration: 0,
			donateConfig: undefined
		};
		return _this;
	}

	/**
  * on component did update
  * @param prevProps
  * @param prevState
  */


	_createClass(Video, [{
		key: 'componentDidUpdate',
		value: function componentDidUpdate(prevProps, prevState) {
			var _this2 = this;

			// if player is no longer engaged
			if (prevProps.engaged && !this.props.engaged) {}
			// hide tooltips
			// ReactTooltip.hide();


			// quality
			var quality = this.state.quality;

			// check if quality changed
			var qualityChanged = quality !== prevState.quality;

			// content changed
			var contentChanged = prevProps.content && this.props.content && prevProps.content.contentId !== this.props.content.contentId;

			// is hd?
			var isHighQuality = quality === 'high';

			// compare prev state src and poster
			if (contentChanged || qualityChanged) {
				// video props
				var video = {
					src: this.props.content && (isHighQuality ? this.props.content.contentUrl1080p || this.props.content.contentUrl720p : this.props.content.contentUrl360p) ? isHighQuality ? this.props.content.contentUrl1080p || this.props.content.contentUrl720p : this.props.content.contentUrl360p : this.props.video && this.props.video.src ? this.props.video.src : '',
					poster: this.props.content && (isHighQuality ? this.props.content.thumbnail1080p || this.props.content.thumbnail720p : this.props.content.thumbnail360p) ? isHighQuality ? this.props.content.thumbnail1080p || this.props.content.thumbnail720p : this.props.content.thumbnail360p : this.props.video && this.props.video.poster ? this.props.video.poster : '',
					outlink: this.props.videoOpts && this.props.videoOpts.outlink !== undefined ? this.props.videoOpts.outlink : this.props.content && this.props.content.contentId ? 'https://medal.tv/clips/' + this.props.content.contentId + '/' + _Utils2.default.generateSpok() : undefined
				};

				// check if src / poster actually changed
				if (this.state.src !== video.src || this.state.poster !== video.poster) {
					// cache value for urls
					var cacheValue = this.props.videoOpts.bypassCache ? !isNaN(this.props.videoOpts.bypassCache) ? this.props.videoOpts.bypassCache : new Date().getTime() : '';

					// set the default states
					this.updateState({
						src: this.props.videoOpts.bypassCache ? _Utils2.default.appendCacheQueryString(video.src, cacheValue) : video.src,
						poster: this.props.videoOpts.bypassCache ? _Utils2.default.appendCacheQueryString(video.poster, cacheValue) : video.poster,
						outlink: video.outlink
					}, function () {
						// pause the video
						_this2.pause();

						// current time
						var currentTime = _this2.video().currentTime;

						// update source attribute
						_this2.source().setAttribute('src', '' + _this2.state.src);

						// load the video
						_this2.video().load();

						// check if quality changed
						if (qualityChanged) {
							// set the current time
							_this2.video().currentTime = currentTime;
						}

						// play the video
						_this2.play();

						// check video ref
						if (_this2.props.videoRef) {
							// update video ref
							_this2.props.videoRef(_this2.video());
						}
					});
				}
			}
		}

		/**
   * on component did mount
   */

	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this3 = this;

			// set as mounted
			this.mounted = true;

			// check user
			if (this.props.user && this.props.user.userId) {
				// get donate configs
				_Utils2.default.getDonateConfig(this.props.user.userId).then(function (config) {
					// check config for errors
					if (config.errorMessage || !config.url || !config.action || config.url.length === 0 || config.action.length === 0) {
						return;
					}

					// set config
					_this3.updateState({ donateConfig: config });
				});
			}

			// check if component ref is set
			if (this.props.componentRef) {
				// set the component ref to this Video component
				this.props.componentRef(this);
			}

			// initialize the adapter
			if (this.state.embedded) {
				this.playerjs();
			}

			// check raw html
			if (useRawHTML) {
				// the video
				var video = this.video();

				/// attach video events
				video.addEventListener('loadedmetadata', this.onReady);
				video.addEventListener('loadeddata', this.onLoadedData);
				video.addEventListener('playing', this.onPlay);
				video.addEventListener('pause', this.onPause);
				video.addEventListener('ended', this.onEnd);
				video.addEventListener('timeupdate', this.onTimeUpdate);
				video.addEventListener('error', this.onFailed);
			}

			// set the volume level
			this.video().volume = this.state.volumeLevel;
		}

		/**
   * on component will unmount
   */

	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			// unmounted
			this.mounted = false;

			// clear previous play timeout
			if (this.playTimeout) {
				// clear timeout
				clearTimeout(this.playTimeout);
				this.playTimeout = undefined;
			}

			// check if component ref is set
			if (this.props.componentRef) {
				// set the component ref to this undefined, this unmounts now
				this.props.componentRef(undefined);
			}

			// check adapter is defined
			if (this.adapter) {}
			// this.adapter.off();


			// check raw html
			if (useRawHTML) {
				// the video
				var video = this.video();

				/// attach video events
				video.removeEventListener('loadedmetadata', this.onReady);
				video.removeEventListener('loadeddata', this.onLoadedData);
				video.removeEventListener('playing', this.onPlay);
				video.removeEventListener('pause', this.onPause);
				video.removeEventListener('ended', this.onEnd);
				video.removeEventListener('timeupdate', this.onTimeUpdate);
				video.removeEventListener('error', this.onFailed);
			}
		}

		/**
   * override set state
   */


		/**
   * get the adapter reference
   * @returns {function()}
   */


		/**
   * on view start. the video started playing again after a view was completed, or for the first time.
   */


		/**
   * on view halfway finished. the video was played 50% or more, or skipped to that point.
   */


		/**
   * on view complete. the video was played all the way through, or was skipped to the end once it started playing.
   */


		/**
   * set the video as loaded
   */


		/**
   * video failed to load
   */


		/**
   * get the video dom element
   */


		/**
   * get the video source dom element
   * @returns {*}
   */


		/**
   * reload the video source
   */


		/**
   * manually call the video element's play function
   */


		/**
   * manually call the video element's pause function
   */


		/**
   * toggle the quality
   */


		/**
   * manually mute the video element
   */


		/**
   * manually unmute the video element
   */


		/**
   * on video play event
   */


		/**
   * on video playing event
   */


		/**
   * on video pause event
   */


		/**
   * on video ready
   */


		/**
   * on video end
   */


		/**
   * on video time update
   */


		/**
   * request fullscreen
   */


		/**
   * exit fullscreen
   * @param element
   */


		/**
   * toggle enter full screen
   */


		/**
   * enter share screen
   */


		/**
   * exit share screen
   */


		/**
   * returns true if the video is paused, straight from the video DOM element
   */


		/**
   * on container click
   * @param e
   */


		/**
   * on volume change
   * @param volume
   */


		/**
   * render custom controls
   */


		/**
   * render share screen when active
   */


		/**
   * render loading spinner
   */

	}, {
		key: 'render',


		/**
   * render the thumbnail jsx
   * @returns {*}
   */
		value: function render() {
			return _react2.default.createElement(
				_react2.default.Fragment,
				null,
				this.state.poster && _react2.default.createElement(_Image2.default, {
					src: this.state.poster,
					fallback: this.state.poster.includes('720p') ? this.state.poster.replace('720p', '360p') : this.state.poster.replace('360p', '720p'),
					style: { width: '100%' }
				}),
				_react2.default.createElement(
					'div',
					{ style: Object.assign({}, _Style2.default.absoluteContainer, { display: 'flex' }) },
					useRawHTML ? _react2.default.createElement(_VideoTag.VideoTag, {
						id: this.props.id,
						src: this.state.src,
						style: _Style2.default.videoElementContainerCSS,
						autoPlay: this.state.autoplay,
						loop: this.state.loop,
						muted: this.state.muted,
						preload: this.state.preload,
						controls: this.props.controls,
						poster: this.state.poster
					}) : _react2.default.createElement(
						'video',
						{
							id: this.props.id,
							style: this.props.videoStyle || _Style2.default.videoElementContainer,
							autoPlay: this.state.autoplay,
							loop: this.state.loop,
							muted: this.state.muted,
							preload: this.state.preload,
							controls: this.props.controls,
							poster: this.state.poster,
							onPlaying: this.onPlaying,
							onPlay: this.onPlay,
							onPause: this.onPause,
							onLoadedMetadata: this.onReady,
							onLoadedData: this.onLoadedData,
							onTimeUpdate: this.onTimeUpdate,
							onEnded: this.onEnd,
							onError: this.onFailed,
							playsInline: true
						},
						_react2.default.createElement('source', {
							id: this.props.id + '-source',
							type: 'video/mp4',
							src: this.state.src
						})
					)
				),
				this.renderControls(),
				this.renderShareScreen(),
				this.renderLoadingSpinner()
			);
		}
	}]);

	return Video;
}(_react2.default.PureComponent);

Video.defaultProps = {
	showUser: true
};

Video.propTypes = {
	// inherited
	engaged: _propTypes2.default.bool.isRequired,
	toggleForceEngaged: _propTypes2.default.func,
	showPlayIcon: _propTypes2.default.bool,
	showUser: _propTypes2.default.bool,

	// types
	id: _propTypes2.default.string,

	// properties
	videoOpts: _propTypes2.default.object,
	videoStyle: _propTypes2.default.object,
	video: _propTypes2.default.object,
	content: _propTypes2.default.object,
	user: _propTypes2.default.object,
	game: _propTypes2.default.object,

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
	onQualityUpdate: _propTypes2.default.func,
	onViewCount: _propTypes2.default.func
};

exports.default = Video;