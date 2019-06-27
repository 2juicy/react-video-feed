// import global dependencies
import React from 'react';
import PropTypes from 'prop-types';
// import ReactTooltip from 'react-tooltip';

// import local dependencies
import Button from './ControlButton';
import Style from '../Style';
import Icon from '../Icon';
import Utils from '../../util/Utils';

class ControlBar extends React.PureComponent {
	constructor (props) {
		super(props);

		// mounted
		this.mounted = false;

		// set the default states
		this.state = {
			timeScrubberHovered : false,
			showVolumeSlider : false
		}
	}

	/**
	 * on component did mount
	 */
	componentDidMount() {
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
	componentWillUnmount() {
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
	updateState = (state, callback) => {
		if (this.mounted) {
			this.setState(state, callback);
		}
	};

	/**
	 * on mute button pressed
	 * @param e
	 */
	toggleMuted = (e) => {
		// stop event propagation
		if (e) {
			e.stopPropagation();
		}

		// reset mouse
		if (this.props.resetMouse) {
			this.props.resetMouse();
		}

		// check mute state
		if (this.props.muted) {
			// unmute video
			this.props.unmute();

			// show slider + reset timer
			this.showVolumeSlider();
		} else {
			// mute video
			this.props.mute();
		}
	};

	/**
	 * on the click of the brand
	 * @param e
	 */
	onBrandClick = (e) => {
		// stop event propagation
		if (e) {
			e.stopPropagation();
		}

		// reset mouse
		if (this.props.resetMouse) {
			this.props.resetMouse();
		}

		// open outlink in default browser
		window.open(this.props.outlink, '_blank');
	};

	/**
	 * on share button click
	 * @param e
	 */
	onShareClick = (e) => {
		// stop event propagation
		if (e) {
			e.stopPropagation();
		}

		// reset mouse
		if (this.props.resetMouse) {
			this.props.resetMouse();
		}

		// enter share screen
		if (this.props.share) {
			this.props.share();
		}
	};

	/**
	 * on full screen button click
	 * @param e
	 */
	onFullScreenClick = (e) => {
		// stop event propagation
		if (e) {
			e.stopPropagation();
		}

		// reset mouse
		if (this.props.resetMouse) {
			this.props.resetMouse();
		}

		// check full screen method
		if (this.props.fullscreen) {
			this.props.fullscreen();
		}
	};

	/**
	 * on theater mode button click
	 * @param e
	 */
	onTheaterModeClick = (e) => {
		// stop event propagation
		if (e) {
			e.stopPropagation();
		}

		// reset mouse
		if (this.props.resetMouse) {
			this.props.resetMouse();
		}

		// check full screen method
		if (this.props.onTheaterModeClick) {
			this.props.onTheaterModeClick();
		}
	};

	/**
	 * on quality button click
	 * @param e
	 */
	onQualityClick = (e) => {
		// stop event propagation
		if (e) {
			e.stopPropagation();
		}

		// reset mouse
		if (this.props.resetMouse) {
			this.props.resetMouse();
		}

		// check full screen method
		if (this.props.onQualityClick) {
			this.props.onQualityClick();
		}
	};

	/**
	 * on time scrubber hovered
	 */
	onTimeScrubberHovered = (e) => {
		// set hovered state
		this.updateState({ timeScrubberHovered : true });
	};

	/**
	 * on time scrubber mouse exited
	 * @param e
	 */
	onTimeScrubberExited = (e) => {
		// set hovered state
		this.updateState({ timeScrubberHovered : false });
	};

	/**
	 * on time scrubber pressed
	 * @param e
	 */
	onTimeScrubberPressed = (e) => {
		// stop propagation
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		// pressed
		this.scrubbing = true;

		// time scrubber dom element
		this.onTimeScrubberUpdated(e);
	};

	/**
	 * on mouse up listener
	 */
	stopScrubbing = (e) => {
		// check if scrubbing
		if (this.scrubbing) {
			// stop events from bubbling
			if (e) {
				// e.preventDefault();
				// e.stopPropagation();
			}

			// release
			this.scrubbing = false;
		}
	};

	/**
	 * on time scrubber moved
	 * @param e
	 */
	onTimeScrubberMoved = (e) => {
		// check if scrubbing
		if (this.scrubbing === true) {
			// reset mouse
			if (this.props.resetMouse) {
				this.props.resetMouse();
			}

			// update the scrubber
			this.onTimeScrubberUpdated(e);
		}
	};

	/**
	 * on time scrubber updated
	 */
	onTimeScrubberUpdated = (e) => {
		// time scrubber dom element
		const timeScrubber = document.getElementById(`${this.props.id}-time`);

		// check if time scrubber is defined and not null
		if (timeScrubber && timeScrubber !== null) {
			// coordinates
			const width = timeScrubber.getBoundingClientRect().width;
			const x = e.pageX - timeScrubber.getBoundingClientRect().left;
			const percent = Math.floor(((x / width) * 100));

			// video
			const video = this.props.video();

			// check if video exists
			if (video && video.readyState > 0) {
				// new current time
				const newTime = Math.round(video.duration * parseFloat(`.${percent > 0 && percent < 10 ? '0' : ''}${percent}`));

				// check if number
				if (!isNaN(newTime)) {
					// set new time
					video.currentTime = newTime;
				}
			}
		}
	};

	/**
	 * show volume slider
	 */
	showVolumeSlider = () => {
		// reset timeout
		this.engageVolumeSlider();

		// show
		this.updateState({ showVolumeSlider : true });
	};

	/**
	 * hide volume slider
	 */
	hideVolumeSlider = () => {
		// set timeout
		this.volumeSliderExit = setTimeout(() => {
			// hide slider
			this.updateState({ showVolumeSlider : false });
		}, 2000)
	};

	/**
	 * engage the volume slider, so keep it visible
	 */
	engageVolumeSlider = () => {
		if (this.volumeSliderExit) {
			// clear timeout
			clearTimeout(this.volumeSliderExit);

			// null it
			this.volumeSliderExit = undefined;
		}
	};

	/**
	 * on volume slider change
	 */
	onVolumeChange = (event) => {
		// new value
		let value = event.target.value;

		// emit value change to video player
		if (this.props.onVolumeChange) {
			this.props.onVolumeChange(value / 100);
		}
	};

	/**
	 * render the button jsx
	 * @returns {*}
	 */
	render () {
		// scrubber width in %
		const scrubberWidth = `${(this.props.currentTime / this.props.duration) * 100}%`;

		// spacing
		const HEIGHT_SM = 30;
		const HEIGHT_MD = 46;
		const spacing = this.props.size === 'sm' ? 12 : 18;

		// spacer style
		const spacer = {
			width : `${spacing}px`
		};

		// button style
		const controlButton = {
			maxHeight : `${spacing}px`
		};

		// render jsx
		return (
			<React.Fragment>
				<div style={ style.bottomGradientOverlay }/>
				<div style={ Object.assign({}, style.bottomControlsContainer, { minHeight : this.props.size === 'sm' ? `${HEIGHT_SM}px` : `${HEIGHT_MD}px` }, { pointerEvents : this.props.show ? 'all' : 'none' })}>
					<div style={ Object.assign({}, style.leftControls, {  paddingLeft : `${spacing}px`}) }>
						<Button
							src={ this.props.paused ? (this.props.ended && this.props.currentTime === 0 ? Icon.restart : Icon.play) : Icon.pause }
							style={ controlButton }
							onClick={ this.props.paused ? this.props.play : this.props.pause }
						/>
						<div style={ spacer }/>
						<Button
							src={ this.props.muted ? Icon.volumeOff : Icon.volumeOn }
							style={ controlButton }
							onClick={ this.toggleMuted }
							onHoverEnter={ this.showVolumeSlider }
							onHoverLeave={ this.hideVolumeSlider }
						/>
						<div
							style={{
								pointerEvents : !this.props.muted && this.state.showVolumeSlider === true ? 'all' : 'none',
								marginLeft : !this.props.muted && this.state.showVolumeSlider === true ? `${spacing / 2}px` : '0',
								maxWidth : !this.props.muted && this.state.showVolumeSlider === true ? '75px' : '0',
								opacity : !this.props.muted && this.state.showVolumeSlider === true ? '1' : '0',
								display : 'flex',
								transition : 'all 0.2s ease'
							}}
							onMouseEnter={ this.engageVolumeSlider }
							onMouseLeave={ this.hideVolumeSlider }
						>
							<input
								className="volume-slider"
								name="volume"
								type="range"
								min={0}
								max={100}
								step={1}
								defaultValue={this.props.volumeLevel * 100}
								onChange={ this.onVolumeChange }
								onMouseDown={ (e) => e.stopPropagation() }
								onMouseUp={ (e) => e.stopPropagation() }
								onClick={ (e) => e.stopPropagation() }
							/>
						</div>
						{
							!Utils.isMobile() &&
							<React.Fragment>
								<div style={ spacer }/>
								<div style={{
									fontSize : this.props.size !== 'sm' ? '13px' : '11px',
									textShadow : '0 0 3px rgba(0, 0, 0, 0.5)',
									color : 'rgba(255, 255, 255, 0.9)',
									flexShrink : '0'
								}}>
									{ Utils.hhmmss(this.props.currentTime) + ' / ' + Utils.hhmmss(this.props.duration) }
								</div>
							</React.Fragment>
						}
					</div>
					<div style={{ flexGrow : '2' }}/>
					<div style={ Object.assign({}, style.rightControls, { paddingRight : `${spacing}px` }) }>
						{
							!Utils.isMobile() && this.props.outlink && this.props.outlink !== null && this.props.size !== 'sm' &&
							<React.Fragment>
								<Button
									id={ `share-clip-${this.props.id}` }
									tooltip={ 'Share Clip' }
									src={ Icon.share }
									style={ controlButton }
									onClick={ this.onShareClick }
								/>
							</React.Fragment>
						}

						{
							this.props.qualityToggleEnabled &&
							<React.Fragment>
								<div style={ spacer }/>
								<div style={ Object.assign({}, controlButton, { position : 'relative' }) }>
									<Button
										tooltip={ 'Change Quality' }
										src={ Icon.cog }
										style={ Object.assign({}, controlButton, { transform : this.props.quality === 'high' ? 'rotate(45deg)' : 'none', transition : 'transform 0.2s ease' }) }
										onClick={ this.onQualityClick }
									/>
									<div style={{
										position: 'absolute',
										top: '-2px',
										right: '-3px',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										padding: '1px 2px',
										fontSize: '8px',
										lineHeight : '9px',
										fontWeight: 'bold',
										textShadow : '0 0 2px rgba(0, 0, 0, 0.5)',
										color: '#fff',
										borderRadius: '3px',
										pointerEvents : 'none',
										backgroundColor : Style.colorGuide.primaryGold,
									}}>
										{ this.props.quality === 'high' ? 'HD' : 'SD' }
									</div>
								</div>
							</React.Fragment>
						}

						{
							this.props.theaterModeEnabled &&
							<React.Fragment>
								<div style={ spacer }/>
								<Button
									tooltip={ 'Theater Mode' }
									src={ Icon.theater }
									style={ controlButton }
									onClick={ this.onTheaterModeClick }
								/>
							</React.Fragment>
						}

						{
							this.props.fullscreenEnabled !== false &&
							<React.Fragment>
								<div style={ spacer }/>
								<Button
									tooltip={ 'Toggle Fullscreen' }
									src={ Icon.fullscreen }
									style={ controlButton }
									onClick={ this.onFullScreenClick }
								/>
							</React.Fragment>
						}

						{
							this.props.outlink && this.props.outlink !== null && this.props.size !== 'sm' &&
								<React.Fragment>
									<div style={ spacer }/>
									<div style={{ width : '1px', backgroundColor : 'rgba(255, 255, 255, 0.25)', height : '16px' }}/>
									<div style={ spacer }/>

									<Button
										tooltip={ 'Watch on Medal' }
										src={ Icon.brand }
										srcHovered={ Icon.brandActive }
										style={{ maxHeight : '30px', opacity : '1' }}
										onClick={ this.onBrandClick }
									/>
								</React.Fragment>
						}
					</div>
				</div>
				{
					this.props.duration > 0 &&
					<div
						id={ `${this.props.id}-time` }
						style={ Object.assign({}, style.timeScrubberContainer, {
							bottom : this.props.size === 'sm' ? `${HEIGHT_SM}px` : `${HEIGHT_MD}px`,
							minHeight : `calc(${this.state.timeScrubberHovered ? '6px' : '4px'}${ Utils.isMobile() ? ' + 3px' : '' })`,
							maxHeight : `calc(${this.state.timeScrubberHovered ? '6px' : '4px'}${ Utils.isMobile() ? ' + 3px' : '' })`,
							pointerEvents : this.props.show ? 'all' : 'none',
							margin : `0 ${spacing}px`,
							width : `calc(100% - ${spacing * 2}px)`,
							transition : 'all 0.2s ease'
						})}
						onMouseEnter={ this.onTimeScrubberHovered }
						onMouseLeave={ this.onTimeScrubberExited }
						onMouseDown={ this.onTimeScrubberPressed }
						onClick={ (e) => e.stopPropagation() }
					>
						<div style={ style.timeScrubberBackground }/>
						<div style={ Object.assign({}, style.timeScrubberFill, { width : scrubberWidth }) }/>
					</div>
				}
			</React.Fragment>
		);
	}

}

ControlBar.defaultProps = {
	ended : false
};

ControlBar.propTypes = {
	id: PropTypes.string.isRequired,
	currentTime: PropTypes.number.isRequired,
	duration: PropTypes.number.isRequired,
	video: PropTypes.func.isRequired,
	paused: PropTypes.bool.isRequired,
	play: PropTypes.func.isRequired,
	pause: PropTypes.func.isRequired,
	muted: PropTypes.bool,
	mute: PropTypes.func.isRequired,
	unmute: PropTypes.func.isRequired,
	fullscreen: PropTypes.func.isRequired,
	show: PropTypes.bool.isRequired,
	share: PropTypes.func.isRequired,
	fullscreenEnabled : PropTypes.bool,
	theaterModeEnabled : PropTypes.bool,
	onTheaterModeClick : PropTypes.func,
	outlink: PropTypes.string,
	ended: PropTypes.bool,
	size : PropTypes.string,
	qualityToggleEnabled : PropTypes.bool,
	quality : PropTypes.string,
	onQualityClick : PropTypes.func,
	onVolumeChange : PropTypes.func,
	volumeLevel : PropTypes.number.isRequired
};

export default ControlBar;

// component style
const style = {
	// bottom gradient overlay for controls
	bottomGradientOverlay : {
		position : 'absolute',
		left : '0',
		bottom : '0',
		width : '100%',
		height : '30%',
		background : 'linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5))',
		pointerEvents : 'none'
	},
	// bottom control bar
	bottomControlsContainer : {
		position : 'absolute',
		left : '0',
		bottom : '0',
		width : '100%',
		// minHeight : '46px',
		// backgroundColor : '#ff00ff',
		display : 'flex',
		flexDirection : 'row',
		justifyContent : 'flex-start',
		alignItems : 'center'
	},
	leftControls : {
		position : 'relative',
		height : '100%',
		display : 'flex',
		flexDirection : 'row',
		flexGrow : '1',
		justifyContent : 'flex-start',
		alignItems : 'center',
		padding : '8px 0'
	},
	rightControls : {
		position : 'relative',
		height : '100%',
		display : 'flex',
		flexDirection : 'row',
		flexGrow : '1',
		justifyContent : 'flex-end',
		alignItems : 'center',
		padding : '8px 0'
	},
	// big spacer
	bigSpacer : {
		width : '100%'
	},
	// time scrubber
	timeScrubberContainer : {
		position : 'absolute',
		margin : '0 16px',
		width : 'calc(100% - 32px)',
		boxShadow : '0 0 3px 0px rgba(0, 0, 0, 0.35)',
		// transition : 'all 0.2s ease',
		cursor : 'pointer'
	},
	timeScrubberBackground : {
		position : 'absolute',
		left : '0',
		bottom : '0',
		height : '100%',
		backgroundColor : 'rgba(255, 255, 255, 0.35)',
		width : '100%',
		pointerEvents : 'none'
	},
	timeScrubberFill : {
		position : 'absolute',
		left : '0',
		bottom : '0',
		height : '100%',
		backgroundColor : Style.colorGuide.primaryGold,
		pointerEvents : 'none',
		// transition : 'all 0.3s ease'
	},
};
