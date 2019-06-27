// import global dependencies
import React from 'react';
import PropTypes from 'prop-types';

// import local dependencies
import Utils from '../../util/Utils';

class ContentInfo extends React.PureComponent {
	constructor (props) {
		super(props);

		// set the default states
		this.state = {
			actionHovered : false
		}
	}

	/**
	 * on user thumbnail / username click
	 * @param e
	 */
	onUserClick = (e) => {
		// stop event propagation
		if (e) {
			e.stopPropagation();
		}

		// open user profile in new page
		window.open(`https://medal.tv/users/${this.props.user.userId}`, '_blank')
	};

	/**
	 * on action button click
	 * @param e
	 */
	onActionClick = (e) => {
		// stop event propagation
		if (e) {
			e.stopPropagation();
		}

		// check donate config
		if (this.props.donateConfig && this.props.donateConfig.url) {
			// open user profile in new page
			window.open(this.props.donateConfig.url, '_blank')

			// send event
			Utils.sendDonateButtonClick(this.props.content, this.props.viewer, this.props.embedded);
		} else {
			// open user profile in new page
			window.open(`https://medal.tv/users/${this.props.user.userId}`, '_blank')
		}
	};

	/**
	 * render the user object on the video
	 */
	renderUser = () => {
		// check if user opts exists in props
		if (!this.props.user || this.props.showUser === false) {
			return '';
		}

		// return jsx
		return (
			<div
				title={ `View ${this.props.user.userName}'s Profile` }
				data-delay-show="500"
				data-place="bottom"
				style={ style.userContainer }
				onClick={ this.onUserClick }
			>
				<div style={ style.userThumbnail }>
					<img
						style={ style.userThumbnailImage }
						src={ this.props.user.thumbnail }
					/>
				</div>
				<div style={ style.userInfo }>
					{ this.props.user.userName }
					{
						this.props.user.slogan && this.props.user.slogan.length > 0 &&
						<span style={ style.userSlogan }>{ this.props.user.slogan }</span>
					}
				</div>
			</div>
		);
	};

	/**
	 * render action button on right side
	 * @returns {string}
	 */
	renderActionButton = () => {
		// check if user opts exists in props
		if (!this.props.user) {
			return '';
		}

		// check for donate config
		if (this.props.donateConfig) {
			return (
				<div
					title={ `Support ${this.props.user.userName}` }
					data-delay-show="500"
					data-place="left"
					style={ Object.assign({}, style.actionButton, this.state.actionHovered ? style.actionButtonHovered : {}) }
					onMouseEnter={ () => this.setState({ actionHovered : true }) }
					onMouseLeave={ () => this.setState({ actionHovered : false }) }
					onClick={ this.onActionClick }
				>
					{ this.props.donateConfig.action || 'Donate' }
				</div>
			)
		} else {
			return '';
		}

		// return jsx
		return (
			<div
				title={ Utils.isMobile() || !this.props.game ? `Follow ${this.props.user.userName} on Medal` : `Watch more ${this.props.game.categoryName} clips` }
				data-delay-show="500"
				data-place="left"
				style={ Object.assign({}, style.actionButton, this.state.actionHovered ? style.actionButtonHovered : {}) }
				onMouseEnter={ () => this.setState({ actionHovered : true }) }
				onMouseLeave={ () => this.setState({ actionHovered : false }) }
				onClick={ this.onActionClick }
			>
				{
					Utils.isMobile()
						? 'Follow'
						: 'Watch More'
				}
			</div>
		);
	};

	/**
	 * render the button jsx
	 * @returns {*}
	 */
	render () {
		// if not an embedded player, hide content info
		if (!this.props.embedded) {
			return '';
		}

		// render jsx
		return (
			<React.Fragment>
				<div style={ style.topGradientOverlay }/>
				<div style={ Object.assign({}, style.topControlsContainer, { pointerEvents : this.props.show ? 'inherit' : 'none' })}>
					<div style={ style.leftControls }>
						{ this.renderUser() }
					</div>
					<div style={ style.rightControls }>
						{ this.renderActionButton() }
					</div>
				</div>
			</React.Fragment>
		);
	}

}

ContentInfo.defaultProps = {
	id : 'contentInfo',
	showUser : true
};

ContentInfo.propTypes = {
	id: PropTypes.string,
	show: PropTypes.bool.isRequired,
	user: PropTypes.object.isRequired,
	content: PropTypes.object.isRequired,
	embedded: PropTypes.bool.isRequired,
	viewer: PropTypes.object,
	donateConfig: PropTypes.object,
	showUser : PropTypes.bool
};

export default ContentInfo;

// spacing between buttons, and edges of player
const spacing = '18px';

// component style
const style = {
	// bottom gradient overlay for controls
	topGradientOverlay : {
		position : 'absolute',
		left : '0',
		top : '0',
		width : '100%',
		height : '30%',
		background : 'linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5))',
		pointerEvents : 'none'
	},
	// bottom control bar
	topControlsContainer : {
		position : 'absolute',
		left : '0',
		top : '0',
		width : '100%',
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
		flex : '1',
		justifyContent : 'flex-start',
		alignItems : 'center',
		padding : '14px 0',
		paddingLeft : spacing
	},
	rightControls : {
		position : 'relative',
		height : '100%',
		display : 'flex',
		flexDirection : 'row',
		flex : '1',
		justifyContent : 'flex-end',
		alignItems : 'center',
		padding : '14px 0',
		paddingRight : spacing
	},
	// user container
	userContainer : {
		display : 'flex',
		flexDirection : 'row',
		alignItems : 'center',
		justifyContent : 'center',
		pointerEvents : 'all',
		cursor : 'pointer'
	},
	// user thumbnail
	userThumbnail : {
		width : '42px',
		height : '42px',
		minWidth : '42px',
		minHeight : '42px',
		boxShadow : '0px 0px 4px rgba(0, 0, 0, 0.35)',
		borderRadius : '50%',
		overflow : 'hidden',
		pointerEvents : 'none'
		// backgroundColor : '#000'
	},
	userThumbnailImage : {
		objectFit : 'cover',
		width : '100%',
		height : '100%'
	},
	// user details
	userInfo : {
		marginLeft : '8px',
		fontSize : '18px',
		fontWeight : '600',
		color : '#fff',
		textShadow : '0px 0px 4px rgba(0, 0, 0, 0.75)',
		display : 'flex',
		flexDirection : 'column',
		justifyContent : 'start',
		textAlign : 'left',
		lineHeight : '18px',
		pointerEvents : 'none'
	},
	// user slogan
	userSlogan : {
		fontWeight : 'normal',
		fontSize : '14px',
		color : '#e9e9e9',
		overflow : 'hidden',
		whiteSpace : 'nowrap',
		textOverflow : 'ellipsis',
		maxWidth : '200px'
	},
	// action button
	actionButton : {
		fontFamily : 'Rajdhani',
		fontSize : '14px',
		fontWeight : 'bold',
		textTransform : 'uppercase',
		color : '#ffbf51',
		height : '28px',
		padding : '0 12px',
		paddingTop : '2px',
		borderRadius : '3px',
		border : '2px solid #ffbf51',
		display : 'flex',
		flexDirection : 'row',
		alignItems : 'center',
		justifyContent : 'center',
		textShadow : '0 0 4px rgba(0, 0, 0, 1)',
		boxShadow : '0 0 4px 0 rgba(0, 0, 0, 0.5)',
		pointerEvents : 'inherit',
		cursor : 'pointer',
		transition : 'all 0.2s ease'
	},
	actionButtonHovered : {
		border : '2px solid #ffbf51',
		backgroundColor : '#ffbf51',
		color : '#4d3612',
		textShadow : 'none'
	},
	// control button base
	controlButton : {
		maxHeight : '18px',
	},
	// horizontal spacer
	spacer : {
		width : spacing
	}
};
