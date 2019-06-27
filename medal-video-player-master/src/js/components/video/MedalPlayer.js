// import global dependencies
import React from 'react';
import PropTypes from 'prop-types';

// import local dependencies
import Video from './Video';
import Style from '../Style';

/**
 * MedalPlayer is for rendering a Medal video. It supports all basic video controls,
 * plus more advanced properties specific to Medal.
 */
export default class MedalPlayer extends React.Component {
	constructor (props) {
		super(props);

		// mouse timeout
		this.mouseTimeout = undefined;

		// mount state
		this.mounted = false;

		// set default state
		this.state = {
			engaged : false,
			forceEngaged : false
		}
	}

	/**
	 * on component did mount
	 */
	componentDidMount () {
		// update the mounted state
		this.mounted = true;
	}

	/**
	 * on component will unmount
	 */
	componentWillUnmount () {
		this.mounted = false;

		// clear all timeouts
		this.clearMouseTimeout();
	}

	/**
	 * on component will receive props
	 * @param nextProps
	 */
	shouldComponentUpdate (nextProps, nextState) {
		// is update required?
		let updateRequired = false;

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
	updateState = (state) => {
		// check if mounted
		if (this.mounted) {
			// set state if mounted
			this.setState(state);
		}
	};

	/**
	 * set the engaged state
	 * @param engaged
	 */
	setEngaged = (engaged) => {
		// set engaged state
		this.updateState({ engaged : engaged })
	};

	/**
	 * on mouse move
	 */
	onMouseMove = () => {
		// set the state to hovered
		this.setEngaged(true);

		// reset the mouse timeout
		this.resetMouseTimeout();

		// check props
		if (this.props.onMouseMove) {
			// on click
			this.props.onMouseMove();
		}
	};

	/**
	 * on mouse enter event
	 */
	onMouseEnter = () => {
		// set the state to hovered
		this.setEngaged(true);

		// reset the mouse timeout
		this.resetMouseTimeout();

		// check props
		if (this.props.onMouseEnter) {
			// on click
			this.props.onMouseEnter();
		}
	};

	/**
	 * on mouse leave event
	 */
	onMouseLeave = () => {
		// set the state to not hovered
		this.setEngaged(false);

		// reset the mouse timeout
		this.clearMouseTimeout();

		// check props
		if (this.props.onMouseLeave) {
			// on click
			this.props.onMouseLeave();
		}
	};

	/**
	 * on click event
	 * @param e
	 */
	onClick = (e) => {
		// check props
		if (this.props.onClick) {
			// on click
			this.props.onClick(e);
		}
	};

	/**
	 * resets the mouse timeout, when the timeout ends the controls are hidden
	 */
	resetMouseTimeout = () => {
		// clear the timeout
		this.clearMouseTimeout();

		// start a new timeout
		this.mouseTimeout = setTimeout(() => {
			// set the state to not engaged
			this.setEngaged(false);

			// clear timeout
			this.clearMouseTimeout();
		}, 2500);
	};

	/**
	 * clears the mouse timeout
	 */
	clearMouseTimeout = () => {
		// check defined
		if (this.mouseTimeout !== undefined) {
			// clear timeout
			clearTimeout(this.mouseTimeout);

			// set mouse timeout to undefined
			this.mouseTimeout = undefined;
		}
	};

	/**
	 * set force engaged state
	 * @param engaged
	 */
	toggleForceEngaged = () => {
		this.updateState({ forceEngaged : !this.state.forceEngaged });
	};

	/**
	 * is the container engaged
	 */
	isEngaged = () => {
		return this.state.engaged || this.state.forceEngaged;
	};

	/**
	 * render the medal video player component jsx
	 * @returns {*}
	 */
	render () {
		// click to play
		const clickToPlay = (this.props.videoOpts || {}).clickToPlay !== undefined ? this.props.videoOpts.clickToPlay : true;

		// render jsx
		return (
			<div
				id={ (this.props.id.startsWith('mvp-') && this.props.content && this.props.content.contentId ? `${this.props.id}-${this.props.content.contentId}` : this.props.id) + '-player' }
				style={ Object.assign({}, Style.medalPlayerContainer, style.engagementContainer, clickToPlay ? { pointerEvents : 'all' } : {}, this.props.wrapperStyle || {}) }
				onMouseMove={ this.onMouseMove }
				onMouseEnter={ this.onMouseEnter }
				onMouseLeave={ this.onMouseLeave }
			  	onClick={ this.onClick }
			>
				<Video
					// id
					id={ this.props.id.startsWith('mvp-') && this.props.content && this.props.content.contentId ? `${this.props.id}-${this.props.content.contentId}` : this.props.id }

					// custom
					showUser={ this.props.showUser }
					showPlayIcon={ this.props.showPlayIcon }
					toggleForceEngaged={ this.toggleForceEngaged }
					engaged={ this.isEngaged() }
					videoRef={ this.props.videoRef }
					componentRef={ this.props.componentRef }
					videoStyle={ this.props.videoStyle }

					// generic properties
					videoOpts={ this.props.videoOpts }
					video={ this.props.video }
					content={ this.props.content }
					user={ this.props.user }
					game={ this.props.game }
					viewer={ this.props.viewer }

					// video events
					onPlay={ this.props.onPlay }
					onPlaying={ this.props.onPlaying }
					onPause={ this.props.onPause }
					onEnd={ this.props.onEnd }
					onReplay={ this.props.onReplay }
					onTimeUpdate={ this.props.onTimeUpdate }
					onReady={ this.props.onReady }
					onLoaded={ this.props.onLoaded }
					onLoadedData={ this.props.onLoadedData }
					onError={ this.props.onError }
					onMute={ this.props.onMute }
					onUnmute={ this.props.onUnmute }
					onViewCount={ this.props.onViewCount }

					// mouse events
					resetMouse={ this.onMouseMove }
				/>
			</div>
		);
	}

}

MedalPlayer.defaultProps = {
	id : `mvp-video-${new Date().getTime()}`,
	showPlayIcon : true,
	showUser : true
};

/**
 * prop types for the medal player
 */
MedalPlayer.propTypes = {
	// id
	id : PropTypes.string,
	showPlayIcon : PropTypes.bool,
	showUser : PropTypes.bool,

	// properties
	videoOpts : PropTypes.object,
	video : PropTypes.object,
	content : PropTypes.object,
	user : PropTypes.object,
	game : PropTypes.object,
	viewer : PropTypes.object,
	videoStyle : PropTypes.object,

	// style
	wrapperStyle : PropTypes.object,

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
	onViewCount : PropTypes.func,

	// engagement layer
	onMouseEnter : PropTypes.func,
	onMouseLeave : PropTypes.func,
	onMouseMove : PropTypes.func,
	onClick : PropTypes.func,

	// set video ref callback
	videoRef : PropTypes.func,
	componentRef : PropTypes.func
};

const style = {
	engagementContainer : {
		userSelect : 'none',
		WebkitUserSelect : 'none',
		msUserSelect : 'none',
		display : 'flex',
		alignItems : 'center',
	}
};
