// import global dependencies
import React from 'react';
import PropTypes from 'prop-types';
// import ReactTooltip from 'react-tooltip';
import playerjs from 'player.js';
import { VideoTag } from './tag/VideoTag';

// import local dependencies
import ControlBar from './ControlBar';
import ContentInfo from './ContentInfo';
import ShareScreen from './ShareScreen';
import Style from '../Style';
import Utils from '../../util/Utils';
import Icon from "../Icon";
import Cookies from "../../util/Cookies";
import Image from "./Image";

// make the video player use raw html?
const useRawHTML = false;

class Video extends React.PureComponent {
	constructor (props) {
		super(props);

		// is hd?
		const isHighQuality = !Utils.isMobile() && (props.videoOpts && props.videoOpts.quality !== undefined ? props.videoOpts.quality : Cookies.getQuality()) === 'high';

		// quality
		const sources = {
			'360' : {},
			'720' : {},
			'1080' : {}
		};

		sources['360'].src = props.content ? props.content.contentUrl360p : undefined;
		sources['360'].poster = props.content ? props.content.thumbnail360p : undefined;
		sources['720'].src = props.content ? props.content.contentUrl720p : undefined;
		sources['720'].poster = props.content ? props.content.thumbnail720p : undefined;
		sources['1080'].src = props.content ? props.content.contentUrl1080p : undefined;
		sources['1080'].poster = props.content ? props.content.thumbnail1080p : undefined;

		// video props
		const videoProps = {
			// check for content obj first, then video obj
			src : (props.content && (isHighQuality ? (sources['1080'].src || sources['720'].src) : sources['360'].src) ? (isHighQuality ? (sources['1080'].src || sources['720'].src) : sources['360'].src) : (props.video && props.video.src ? props.video.src : '')),
			poster : (props.content && (isHighQuality ? (sources['1080'].poster || sources['720'].poster) : sources['360'].poster) ? (isHighQuality ? (sources['1080'].poster || sources['720'].poster) : sources['360'].poster) : (props.video && props.video.poster ? props.video.poster : '')),
			title : props.content && props.content.contentTitle ? props.content.contentTitle : (props.video && props.video.title ? props.video.title : ''),
			outlink : props.videoOpts && props.videoOpts.outlink !== undefined ? props.videoOpts.outlink : (props.content && props.content.contentId ? `https://medal.tv/clips/${props.content.contentId}/${Utils.generateSpok()}` : undefined),
			loop : props.videoOpts && props.videoOpts.loop !== undefined ? props.videoOpts.loop : false,
			preload : props.videoOpts && props.videoOpts.preload !== undefined ? props.videoOpts.preload : 'metadata',
			muted : props.videoOpts && props.videoOpts.muted !== undefined ? props.videoOpts.muted : Cookies.getMuted(),
			quality : props.videoOpts && props.videoOpts.quality !== undefined ? props.videoOpts.quality : Cookies.getQuality(),
			autoplay : props.videoOpts && props.videoOpts.autoplay !== undefined ? props.videoOpts.autoplay : false,
			embedded : props.videoOpts && props.videoOpts.embedded !== undefined ? props.videoOpts.embedded : true,
			controls : props.videoOpts && props.videoOpts.controls !== undefined ? props.videoOpts.controls : true,
			retry : props.videoOpts && props.videoOpts.retry !== undefined ? props.videoOpts.retry : true,
			size : props.videoOpts && props.videoOpts.size !== undefined ? props.videoOpts.size : 'md',
			clickToPlay : props.videoOpts && props.videoOpts.clickToPlay !== undefined ? props.videoOpts.clickToPlay : true,
		};

		// mount state
		this.mounted = false;

		// player.js adapter
		this.adapter = undefined;

		// view tracking
		this.startedViews = 0;
		this.halfwayViews = 0;
		this.completedViews = 0;

		this.onPlayingFlag = videoProps.autoplay;
		this.onPauseFlag = !videoProps.autoplay;

		// cache param
		const cacheValue = props.videoOpts.bypassCache ? (!isNaN(props.videoOpts.bypassCache) ? props.videoOpts.bypassCache : new Date().getTime()) : '';

		// set the default states
		this.state = {
			sources : sources,
			src : props.videoOpts.bypassCache ? Utils.appendCacheQueryString(videoProps.src, cacheValue) : videoProps.src,
			poster : props.videoOpts.bypassCache ? Utils.appendCacheQueryString(videoProps.poster, cacheValue) : videoProps.poster,
			loop : videoProps.loop,
			preload : videoProps.preload,
			paused : props.paused || true,
			muted : videoProps.muted,
			autoplay : videoProps.autoplay,
			embedded : videoProps.embedded,
			title : videoProps.title,
			outlink : videoProps.outlink,
			controls : videoProps.controls,
			retry : videoProps.retry,
			size : videoProps.size,
			clickToPlay : videoProps.clickToPlay,
			quality : videoProps.quality,
			volumeLevel : Cookies.getVolume(),
			loaded : false,
			sharing : false,
			ready : false,
			ended : false,
			retries : 10,
			currentTime : 0,
			duration : 0,
			donateConfig : undefined
		}
	}

	/**
	 * on component did update
	 * @param prevProps
	 * @param prevState
	 */
	componentDidUpdate (prevProps, prevState) {
		// if player is no longer engaged
		if (prevProps.engaged && !this.props.engaged) {
			// hide tooltips
			// ReactTooltip.hide();
		}

		// quality
		const quality = this.state.quality;

		// check if quality changed
		const qualityChanged = quality !== prevState.quality;

		// content changed
		const contentChanged = prevProps.content && this.props.content && prevProps.content.contentId !== this.props.content.contentId;

		// is hd?
		const isHighQuality = quality === 'high';

		// compare prev state src and poster
		if (contentChanged || qualityChanged) {
			// video props
			let video = {
				src : (this.props.content && (isHighQuality ? (this.props.content.contentUrl1080p || this.props.content.contentUrl720p) : this.props.content.contentUrl360p) ? (isHighQuality ? (this.props.content.contentUrl1080p || this.props.content.contentUrl720p) : this.props.content.contentUrl360p) : (this.props.video && this.props.video.src ? this.props.video.src : '')),
				poster : (this.props.content && (isHighQuality ? (this.props.content.thumbnail1080p || this.props.content.thumbnail720p) : this.props.content.thumbnail360p) ? (isHighQuality ? (this.props.content.thumbnail1080p || this.props.content.thumbnail720p) : this.props.content.thumbnail360p) : (this.props.video && this.props.video.poster ? this.props.video.poster : '')),
				outlink : this.props.videoOpts && this.props.videoOpts.outlink !== undefined ? this.props.videoOpts.outlink : (this.props.content && this.props.content.contentId ? `https://medal.tv/clips/${this.props.content.contentId}/${Utils.generateSpok()}` : undefined)
			};

			// check if src / poster actually changed
			if (this.state.src !== video.src || this.state.poster !== video.poster) {
				// cache value for urls
				const cacheValue = this.props.videoOpts.bypassCache ? (!isNaN(this.props.videoOpts.bypassCache) ? this.props.videoOpts.bypassCache : new Date().getTime()) : '';

				// set the default states
				this.updateState({
					src : this.props.videoOpts.bypassCache ? Utils.appendCacheQueryString(video.src, cacheValue) : video.src,
					poster : this.props.videoOpts.bypassCache ? Utils.appendCacheQueryString(video.poster, cacheValue) : video.poster,
					outlink : video.outlink
				}, () => {
					// pause the video
					this.pause();

					// current time
					let currentTime = this.video().currentTime;

					// update source attribute
					this.source().setAttribute('src', `${this.state.src}`);

					// load the video
					this.video().load();

					// check if quality changed
					if (qualityChanged) {
						// set the current time
						this.video().currentTime = currentTime;
					}

					// play the video
					this.play();

					// check video ref
					if (this.props.videoRef) {
						// update video ref
						this.props.videoRef(this.video());
					}
				});
			}
		}
	}

	/**
	 * on component did mount
	 */
	componentDidMount () {
		// set as mounted
		this.mounted = true;

		// check user
		if (this.props.user && this.props.user.userId) {
			// get donate configs
			Utils.getDonateConfig(this.props.user.userId).then(config => {
				// check config for errors
				if (config.errorMessage || !config.url || !config.action || config.url.length === 0 || config.action.length === 0) {
					return;
				}

				// set config
				this.updateState({ donateConfig : config });
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
			const video = this.video();

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
	componentWillUnmount () {
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
		if (this.adapter) {
			// this.adapter.off();
		}

		// check raw html
		if (useRawHTML) {
			// the video
			const video = this.video();

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
	updateState = (state, callback) => {
		// check if mounted
		if (this.mounted) {
			// set state if mounted
			this.setState(state, callback && callback);
		}
	};

	/**
	 * get the adapter reference
	 * @returns {function()}
	 */
	playerjs = () => {
		// check adapter is defined
		if (!this.adapter) {
			this.adapter = new playerjs.HTML5Adapter(this.video());
		}
		return this.adapter;
	};

	/**
	 * on view start. the video started playing again after a view was completed, or for the first time.
	 */
	onViewStart = () => {
		// check if content is defined
		if (!this.props.content) {
			return;
		}

		// increment the started views
		this.startedViews++;

		// report view start to mixpanel, ga, medal
		try {
			Utils.sendWatchStartEvent(this.props.content, this.props.viewer, this.state.embedded);
		} catch (e) {
			console.log('Watch start event failed to send!');
		}
	};

	/**
	 * on view halfway finished. the video was played 50% or more, or skipped to that point.
	 */
	onViewCount = (submitView) => {
		// check if content is defined
		if (!this.props.content) {
			return;
		}

		// increment halfway views
		this.halfwayViews++;

		// report view halfway to mixpanel, ga, medal
		try {
			Utils.sendViewCountEvent(this.props.content, this.props.viewer, this.state.embedded, submitView);
		} catch (e) {
			console.log('Watch halfway event failed to send!');
		}
	};

	/**
	 * on view complete. the video was played all the way through, or was skipped to the end once it started playing.
	 */
	onViewComplete = () => {
		// check if content is defined
		if (!this.props.content) {
			return;
		}

		// increment the started views
		this.completedViews++;

		// report view complete to mixpanel, ga, medal
		try {
			Utils.sendWatchEndEvent(this.props.content, this.props.viewer, this.state.embedded);
		} catch (e) {
			console.log('Watch complete event failed to send!');
		}
	};

	/**
	 * set the video as loaded
	 */
	onLoadedData = () => {
		// check if there is an onLoadComplete attached to props
		if (this.props.onLoadedData) {
			this.props.onLoadedData();
		}
	};

	/**
	 * video failed to load
	 */
	onFailed = () => {
		// check props for on error func
		if (this.props.onError) {
			this.props.onError();
		}

		// check if retry is valid and has retries left
		if (this.state.retry && this.state.retries > 0) {
			// pause the video
			this.pause();

			// re-append source to video component
			this.video().appendChild(this.source());

			// increment retries
			this.updateState({ retries : this.state.retries - 1 }, () => {
				// try playing the video again
				this.play();
			});
		}
	};

	/**
	 * get the video dom element
	 */
	video = () => {
		// get the element by id
		let element = document.getElementById(this.props.id);

		// check if element is defined and not null
		if (element && element !== null) {
			return element;
		}

		// return undefined by default
		return undefined;
	};

	/**
	 * get the video source dom element
	 * @returns {*}
	 */
	source = () => {
		// get the element by id
		let element = document.getElementById(`${this.props.id}-source`);

		// check if element is defined and not null
		if (element && element !== null) {
			return element;
		}

		// return undefined by default
		return undefined;
	};

	/**
	 * reload the video source
	 */
	reloadSrc = (bypassCache) => {
		// play required
		let playRequired = false;

		// check if playing
		if (!this.isPaused()) {
			// pause the video
			this.pause();

			// play required
			playRequired = true;
		}

		// update source attribute
		this.source().setAttribute('src', (bypassCache || this.props.videoOpts.bypassCache) ? Utils.appendCacheQueryString(this.state.src, new Date().getTime()) : this.state.src);

		// load the video
		this.video().load();

		// check if play required
		if (playRequired) {
			// play the video
			this.play();
		}

		// check video ref
		if (this.props.videoRef) {
			// update video ref
			this.props.videoRef(this.video());
		}
	};

	/**
	 * manually call the video element's play function
	 */
	play = (e) => {
		// stop event propagation
		if (e) {
			e.stopPropagation();
		}

		// video
		const video = this.video();

		// play the video
		if (video) {
			// check if playing
			if (!this.playPromise) {
				// play
				this.playPromise = () => {
					return new Promise(async (resolve) => {
						try {
							// await the play
							await Promise.resolve(video.play());
						} catch (e) {
							console.log('Playback warning:', e);
						}

						// unset
						this.playPromise = undefined;

						// resolve
						resolve();
					})
				};

				// call
				this.playPromise();
			}
		}
	};

	/**
	 * manually call the video element's pause function
	 */
	pause = (e) => {
		// stop event propagation
		if (e) {
			e.stopPropagation();
		}

		// video
		const video = this.video();

		// if the video is not paused
		if (video && !video.paused && !this.playPromise) {
			// pause the video
			this.video().pause();
		}
	};

	/**
	 * toggle the quality
	 */
	toggleQuality = (e) => {
		// stop event propagation
		if (e) {
			e.stopPropagation();
		}

		// quality
		const quality = this.state.quality === 'high' ? 'low' : 'high';

		// toggle the quality
		this.updateState({ quality : quality });

		// check props for on mute func
		if (this.props.onQualityUpdate) {
			this.props.onQualityUpdate(quality);
		}

		// set cookie
		Cookies.setQuality(quality);
	};

	/**
	 * manually mute the video element
	 */
	mute = (e) => {
		// stop event propagation
		if (e) {
			e.stopPropagation();
		}

		// mute the video
		// this.video().muted = true;
		this.updateState({ muted : true });

		// check props for on mute func
		if (this.props.onMute) {
			this.props.onMute();
		}

		// set cookie
		Cookies.setMuted(true);
	};

	/**
	 * manually unmute the video element
	 */
	unmute = (e) => {
		// stop event propagation
		if (e) {
			e.stopPropagation();
		}

		// mute the video
		// this.video().muted = false;
		this.updateState({ muted : false });

		// check props for on unmute func
		if (this.props.onUnmute) {
			this.props.onUnmute();
		}
		// set cookie
		Cookies.setMuted(false);
	};

	/**
	 * on video play event
	 */
	onPlay = () => {
		// apply mute state
		if (this.state.muted !== this.video().muted) {
			this.video().muted = this.state.muted;
		}

		// check if the video has completed it's last view or if it just never started it
		if (this.startedViews - this.completedViews === 0) {
			// increment the started views
			this.onViewStart();

			// submit view anonymously?
			let submitView = true;

			// on view count
			if (this.props.onViewCount) {
				// on view count
				this.props.onViewCount();

				// dont submit anonymous
				submitView = false;
			}

			// send view count event
			this.onViewCount(submitView);
		}

		// set paused state to false
		this.updateState({ paused : false, playing : true });

		// check props for on play func
		if (this.props.onPlay) {
			this.props.onPlay();
		}
	};

	/**
	 * on video playing event
	 */
	onPlaying = () => {
		// set flags
		this.onPlayingFlag = true;
		this.onPauseFlag = false;

		// set paused state to false
		this.updateState({ paused : this.onPauseFlag, playing : this.onPlayingFlag });

		// check props for on play func
		if (this.props.onPlaying) {
			this.props.onPlaying();
		}
	};

	/**
	 * on video pause event
	 */
	onPause = () => {
		// set flags
		this.onPlayingFlag = false;
		this.onPauseFlag = true;

		// set paused state to false
		this.updateState({ paused : this.onPauseFlag, playing : this.onPlayingFlag });

		// check props for on pause func
		if (this.props.onPause) {
			this.props.onPause();
		}
	};

	/**
	 * on video ready
	 */
	onReady = () => {
		// duration
		let duration = this.video().duration;

		// check if defined
		if (duration && duration !== this.state.duration) {
			// set duration
			this.updateState({ duration : duration });
		}

		// update ready state
		this.updateState({ ready : true });

		// check props for on ready func
		if (this.props.onReady) {
			this.props.onReady();
		}

		// emit ready event to player.js
		if (this.state.embedded) {
			this.playerjs().ready();
		}
	};

	/**
	 * on video end
	 */
	onEnd = () => {
		// check if the video has completed it's last view or if it just never started it
		if (this.startedViews - this.completedViews === 1) {
			this.onViewComplete();
		}

		// update current time to 0
		this.updateState({
			currentTime : 0,
			ended : true
		});

		// check props for on end func
		if (this.props.onEnd) {
			this.props.onEnd();
		}
	};

	/**
	 * on video time update
	 */
	onTimeUpdate = () => {
		// current time
		let currentTime = this.video().currentTime;

		// check if defined
		if (currentTime && currentTime !== this.state.currentTime) {
			// set current time state
			this.updateState({ currentTime : currentTime });

			// check if halfway viewed
			if (currentTime >= 2 && this.halfwayViews === (this.startedViews - 1)) {
				// send viewed event
				// this.onViewCount();
			}

			// check props for on end func
			if (this.props.onTimeUpdate) {
				this.props.onTimeUpdate(currentTime);
			}
		}
	};

	/**
	 * request fullscreen
	 */
	requestFullScreen = (element) => {
		// check if ios
		if (Utils.isIOS()) {
			// request fullscreen on the video element
			element = this.video();
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

	/**
	 * exit fullscreen
	 * @param element
	 */
	exitFullScreen = () => {
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

	/**
	 * toggle enter full screen
	 */
	toggleFullScreen = () => {
		// play instance
		let player = document.getElementById(`${this.props.id}-player`);

		// is fullscreen active?
		let fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
		let fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled || document.msFullscreenEnabled;

		// request based on browser
		if (fullscreenElement !== undefined && fullscreenElement !== null) {
			// exit
			this.exitFullScreen();
		} else {
			//enter
			this.requestFullScreen(player);
		}
	};

	/**
	 * enter share screen
	 */
	enterShareScreen = () => {
		// check if not already sharing
		if (!this.state.sharing) {
			// set sharing state to true
			this.updateState({sharing: true});

			// check if force engaged method exists
			if (this.props.toggleForceEngaged) {
				this.props.toggleForceEngaged();
			}
		}
	};

	/**
	 * exit share screen
	 */
	exitShareScreen = () => {
		// check if already sharing
		if (this.state.sharing) {
			// set sharing state to false
			this.updateState({sharing: false});

			// check if force engaged method exists
			if (this.props.toggleForceEngaged) {
				this.props.toggleForceEngaged();
			}
		}
	};

	/**
	 * returns true if the video is paused, straight from the video DOM element
	 */
	isPaused = () => {
		return (this.video() || this.state).paused;
	};

	/**
	 * on container click
	 * @param e
	 */
	onContainerClick = (e) => {
		if (this.state.clickToPlay) {
			if (this.isPaused()) {
				this.play();
			} else {
				this.pause();
			}
		}
	};

	/**
	 * on volume change
	 * @param volume
	 */
	onVolumeChange = (volume) => {
		// update video volume
		this.video().volume = volume;

		// persist volume level in cookies
		Cookies.setVolume(volume);

		// update the volume state
		// this.updateState({ volumeLevel : volume });
	};

	/**
	 * render custom controls
	 */
	renderControls = () => {
		// default controls disabled, render custom controls
		return (this.state.controls &&
			<React.Fragment>
				<div
					style={ Object.assign({}, Style.absoluteContainer, Style.opacityControl, { opacity : this.props.engaged ? 1 : 0 }) }
					onClick={ this.onContainerClick }
				>
					{
						this.props.user && this.state.embedded &&
							<ContentInfo
								showUser={ this.props.showUser }
								show={ this.props.engaged }
								content={ this.props.content }
								user={ this.props.user }
								viewer={ this.props.viewer }
								game={ this.props.game }
								embedded={ this.state.embedded }
								size={ this.state.size }
								donateConfig={ this.state.donateConfig }
							/>
					}
					<ControlBar
						id={ this.props.id }
						currentTime={ this.state.currentTime }
						duration={ this.state.duration }
						show={ this.props.engaged }
						video={ this.video }
						paused={ this.state.paused }
						play={ this.play }
						pause={ this.pause }
						muted={ this.state.muted }
						mute={ this.mute }
						unmute={ this.unmute }
						fullscreen={ this.toggleFullScreen }
						fullscreenEnabled={ this.props.videoOpts.fullscreenEnabled }
						outlink={ this.state.outlink }
						embedded={ this.state.embedded }
						share={ this.enterShareScreen }
						ended={ this.state.ended }
						size={ this.state.size }
						qualityToggleEnabled={ this.props.content !== undefined }
						quality={ this.state.quality }
						onQualityClick={ this.toggleQuality }
						theaterModeEnabled={ !!this.props.videoOpts.theaterModeEnabled }
						onTheaterModeClick={ this.props.videoOpts.onTheaterModeClick }
						resetMouse={ this.props.resetMouse }
						onVolumeChange={ this.onVolumeChange }
						volumeLevel={ this.state.volumeLevel }
					/>
				</div>
				{
					this.props.showPlayIcon !== false && (!this.onPlayingFlag || this.state.paused) &&
					<img style={{
						width : this.state.size === 'sm' ? '48px' : '64px',
						height : this.state.size === 'sm' ? '48px' : '64px',
						position : 'absolute',
						top : `calc(50% - ${this.state.size === 'sm' ? '24px' : '32px'})`,
						left : `calc(50% - ${this.state.size === 'sm' ? '24px' : '32px'})`,
						pointerEvents : 'none',
						opacity : this.state.paused ? '1' : '0',
						transition : 'opacity 0.2s ease',
					}} src={ Icon.playCircle } alt={ Icon.playCircle }/>
				}
				{/*<ReactTooltip className="tooltip" effect="solid"/>*/}
			</React.Fragment>
		);
	};

	/**
	 * render share screen when active
	 */
	renderShareScreen = () => {
		// render share screen jsx
		return (this.state.sharing && (this.state.outlink && this.state.outlink !== null) && this.props.user && this.props.content &&
			<ShareScreen
				user={ this.props.user }
				content={ this.props.content }
				viewer={ this.props.viewer }
				embedded={ this.state.embedded }
				outlink={ this.state.outlink }
				close={ this.exitShareScreen }
				size={ this.state.size }
			/>
		)
	};

	/**
	 * render loading spinner
	 */
	renderLoadingSpinner = () => {
		return (
			(this.onPlayingFlag || !this.state.paused) && !this.state.ready &&
			<div style={{
				display : 'flex',
				alignItems : 'center',
				justifyContent : 'center',
				position : 'absolute',
				top : '0',
				left : '0',
				bottom : '0',
				right : '0'
			}}>
				<div style={{ width : '36px', height : '36px' }}>
					<div className="lds-ring"><div/><div/><div/><div/></div>
				</div>
			</div>
		)
	};

	/**
	 * render the thumbnail jsx
	 * @returns {*}
	 */
	render () {
		return (
			<React.Fragment>
				{
					this.state.poster &&
					<Image
						src={ this.state.poster }
						fallback={ this.state.poster.includes('720p') ? this.state.poster.replace('720p', '360p') : this.state.poster.replace('360p', '720p') }
						style={{ width : '100%' }}
					/>
				}

				<div style={ Object.assign({}, Style.absoluteContainer, { display : 'flex' }) }>
					{
						useRawHTML
							? <VideoTag
								id={ this.props.id }
								src={ this.state.src }
								style={ Style.videoElementContainerCSS }
								autoPlay={ this.state.autoplay }
								loop={ this.state.loop }
								muted={ this.state.muted }
								preload={ this.state.preload }
								controls={ this.props.controls }
								poster={ this.state.poster }
							/>
							: <video
								id={ this.props.id }
								style={ this.props.videoStyle || Style.videoElementContainer }
								autoPlay={ this.state.autoplay }
								loop={ this.state.loop }
								muted={ this.state.muted }
								preload={ this.state.preload }
								controls={ this.props.controls }
								poster={ this.state.poster }
								onPlaying={ this.onPlaying }
								onPlay={ this.onPlay }
								onPause={ this.onPause }
								onLoadedMetadata={ this.onReady }
								onLoadedData={ this.onLoadedData }
								onTimeUpdate={ this.onTimeUpdate }
								onEnded={ this.onEnd }
								onError={ this.onFailed }
								playsInline
							>
								<source
									id={ `${this.props.id}-source` }
									type="video/mp4"
									src={ this.state.src }
								/>
							</video>
					}
				</div>

				{/* render custom controls */}
				{ this.renderControls() }

				{/* render share screen */}
				{ this.renderShareScreen() }

				{/* render loading spinner */}
				{ this.renderLoadingSpinner() }
			</React.Fragment>
		);
	}

}

Video.defaultProps = {
	showUser : true
};

Video.propTypes = {
	// inherited
	engaged: PropTypes.bool.isRequired,
	toggleForceEngaged: PropTypes.func,
	showPlayIcon : PropTypes.bool,
	showUser : PropTypes.bool,

	// types
	id: PropTypes.string,

	// properties
	videoOpts : PropTypes.object,
	videoStyle : PropTypes.object,
	video : PropTypes.object,
	content : PropTypes.object,
	user : PropTypes.object,
	game : PropTypes.object,

	// events
	onPlay : PropTypes.func,
	onPlaying : PropTypes.func,
	onPause : PropTypes.func,
	onEnd : PropTypes.func,
	onReplay : PropTypes.func,
	onTimeUpdate : PropTypes.func,
	onReady : PropTypes.func,
	onLoaded : PropTypes.func,
	onLoadedData : PropTypes.func,
	onError : PropTypes.func,
	onMute : PropTypes.func,
	onUnmute : PropTypes.func,
	onQualityUpdate : PropTypes.func,
	onViewCount : PropTypes.func
};

export default Video;
