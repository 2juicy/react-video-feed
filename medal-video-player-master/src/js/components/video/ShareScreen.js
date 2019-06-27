// import global dependencies
import React from 'react';
import PropTypes from 'prop-types';
import clipboard from 'copy-to-clipboard';
import Utils from '../../util/Utils';

// import local dependencies
import Style from '../Style';
import Icon from '../Icon';

class ShareScreen extends React.PureComponent {
	constructor (props) {
		super(props);

		// set the default states
		this.state = {
			hoveredLink : false,
			copied : false,
			embedding : false,
			iframeCode : `<iframe width="640" height="360" src="${props.outlink.split('/clips/').join('/clip/')}" frameborder="0" allow="autoplay" allowfullscreen></iframe>`
		}
	}

	/**
	 * on component did mount
	 */
	componentDidMount () {
	}

	/**
	 * on component will unmount
	 */
	componentWillUnmount() {
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
	onCopy = (e) => {
		// stop propagation
		if (e) {
			e.stopPropagation();
		}

		// unselect all elements
		if (window && window !== null) {
			let sel = window.getSelection();
			sel.removeAllRanges();
		}

		// copy obj
		clipboard(this.state.embedding ? this.state.iframeCode : this.props.outlink);

		// copy link
		this.setState({ copied : true });

		// wait
		this.copyTimeout = setTimeout(() => {
			// copy link
			this.setState({ copied : false });

			// clear timeout
			clearTimeout(this.copyTimeout);

			// clear
			this.copyTimeout = undefined;
		}, 1500)

		// on copy link
		Utils.sendShareEvent(this.props.content, this.props.viewer, this.state.embedding ? 'copy-embed-code' : 'copy', this.state.embedded);
	};

	/**
	 * on close
	 * @returns {Promise<void>}
	 */
	onClose = (e) => {
		// stop propagation
		if (e) {
			e.stopPropagation();
		}

		// close
		this.props.close();
	};

	/**
	 * on embed clip click
	 * @param e
	 */
	onEmbedClip = (e) => {
		// stop propagation
		if (e) {
			e.stopPropagation();
		}

		// embedding
		let embedding = !this.state.embedding;

		// show embed view
		this.setState({ embedding : embedding });

		// if embedding
		if (embedding) {
			// on share as embed
			Utils.sendShareEvent(this.props.content, this.props.viewer, "embedClip", this.state.embedded);
		}
	};

	/**
	 * on share facebook click
	 * @param e
	 */
	onShareFacebook = (e) => {
		// stop propagation
		if (e) {
			e.stopPropagation();
		}

		// facebook share url
		const url = `https://www.facebook.com/sharer/sharer.php?p[url]=${this.props.outlink}`;

		// window params
		const w = 550;
		const h = 600;
		const left = (screen.width / 2) - (w / 2);
		const top = (screen.height / 2) - (h / 2);

		// open url
		window.open(url, 'Share clips from Medal', `top=${top},left=${left},width=${w},height=${h}`);

		// on share to facebook
		Utils.sendShareEvent(this.props.content, this.props.viewer, "postToFacebook", this.state.embedded);
	};

	/**
	 * on share twitter click
	 * @param e
	 */
	onShareTwitter = (e) => {
		// stop propagation
		if (e) {
			e.stopPropagation();
		}

		// twitter share url
		const url = `https://twitter.com/intent/tweet?source=${this.props.outlink}&text=${encodeURI(`Check out ${this.props.content.contentTitle} by ${this.props.user.userName}! ${this.props.outlink}`)}`;

		// window params
		const w = 550;
		const h = 600;
		const left = (screen.width / 2) - (w / 2);
		const top = (screen.height / 2) - (h / 2);

		// open url
		window.open(url, 'Share clips from Medal', `top=${top},left=${left},width=${w},height=${h}`);

		// on share to facebook
		Utils.sendShareEvent(this.props.content, this.props.viewer, "postToTwitter", this.state.embedded);
	};

	/**
	 * on share twitter click
	 * @param e
	 */
	onShareReddit = (e) => {
		// stop propagation
		if (e) {
			e.stopPropagation();
		}

		// twitter share url
		const url = `http://www.reddit.com/submit?url=${this.props.outlink}&title=${this.props.content.contentTitle}`;

		// window params
		const w = 550;
		const h = 600;
		const left = (screen.width / 2) - (w / 2);
		const top = (screen.height / 2) - (h / 2);

		// open url
		window.open(url, 'Share clips from Medal', `top=${top},left=${left},width=${w},height=${h}`);

		// on share to facebook
		Utils.sendShareEvent(this.props.content, this.props.viewer, "postToReddit", this.state.embedded);
	};

	/**
	 * render the share screen jsx
	 * @returns {*}
	 */
	render () {
		// render jsx
		return (
			<div style={ Object.assign({}, Style.absoluteContainer, style.container) }>
				<img
					id="videoShareClose"
					style={ style.close }
					src={ Icon.close }
					onClick={ this.onClose }
				/>
				<span style={ style.title }>
					{ this.props.content.contentTitle } by { this.props.user.userName }
				</span>
				<span style={ style.description }>
					{ this.state.embedding ? 'Embed this clip on your website using the following code:' : 'Share this clip with the world.' }
				</span>
				{
					this.state.embedding
						? <div style={ style.linkContainer }>
							<div
								style={ Object.assign({}, style.iframeCodeContainer, this.state.copied ? style.linkCopied : (this.state.hoveredLink ? style.linkHovered : {})) }
								onMouseEnter={ () => this.setState({ hoveredLink : true }) }
								onMouseLeave={ () => this.setState({ hoveredLink : false }) }
								onClick={ this.onCopy }
							>
								{ this.state.iframeCode }
							</div>
						</div>
						: <div style={ style.linkContainer }>
							<div
								style={ Object.assign({}, style.link, this.state.copied ? style.linkCopied : (this.state.hoveredLink ? style.linkHovered : {})) }
								onMouseEnter={ () => this.setState({ hoveredLink : true }) }
								onMouseLeave={ () => this.setState({ hoveredLink : false }) }
								onClick={ this.onCopy }
							>
								{ this.props.outlink }
							</div>
							<div
								style={ Object.assign({}, style.button, this.state.copied ? style.buttonCopied : (this.state.hoveredLink ? style.buttonHovered : {})) }
								onMouseEnter={ () => this.setState({ hoveredLink : true }) }
								onMouseLeave={ () => this.setState({ hoveredLink : false }) }
								onClick={ this.onCopy }
							>
								{ this.state.copied ? 'Copied!' : 'Copy' }
							</div>
						</div>
				}
				<div style={ style.separator }/>
				<div style={ style.socialIconContainer }>
					<img style={ Object.assign({}, style.socialIcon, { transition : 'all 0.1s ease' }, this.state.embedding ? { transform : 'scale(1.2)' } : {}) } src={ Icon.embed } onClick={ this.onEmbedClip }/>
					<div style={ style.spacer }/>
					<img style={ Object.assign({}, style.socialIcon, { opacity : this.state.embedding ? '0.75' : '1', transition : 'opacity 0.2s ease' }) } src={ Icon.facebook } onClick={ this.onShareFacebook }/>
					<div style={ style.spacer }/>
					<img style={ Object.assign({}, style.socialIcon, { opacity : this.state.embedding ? '0.75' : '1', transition : 'opacity 0.2s ease' }) } src={ Icon.twitter } onClick={ this.onShareTwitter }/>
					<div style={ style.spacer }/>
					<img style={ Object.assign({}, style.socialIcon, { opacity : this.state.embedding ? '0.75' : '1', transition : 'opacity 0.2s ease' }) } src={ Icon.reddit } onClick={ this.onShareReddit }/>
				</div>
			</div>
		);
	}

}

ShareScreen.defaultProps = {
	id : 'shareScreen',
};

ShareScreen.propTypes = {
	id: PropTypes.string,
	content: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired,
	outlink: PropTypes.string.isRequired,
	close : PropTypes.func.isRequired,
	embedded : PropTypes.bool.isRequired,
	viewer: PropTypes.object
};

export default ShareScreen;

// component style
const style = {
	container : {
		backgroundColor : 'rgba(13, 14, 18, 0.9)',
		transition : 'all 0.1s ease',
		display : 'flex',
		flexDirection : 'column',
		alignItems : 'center',
		justifyContent : 'center',
		pointerEvents : 'all',
		zIndex : '2'
	},
	close : {
		position : 'absolute',
		top : '26px',
		right : '26px',
		width : '18px',
		height : 'auto',
		pointerEvents : 'all',
		cursor : 'pointer'
	},
	title : {
		fontSize : '18px',
		fontWeight : '600',
		color : '#eaeaea',
	},
	description : {
		fontSize : '16px',
		fontWeight : 'normal',
		color : '#c9c9c9',
		marginBottom : '-7px'
	},
	linkContainer : {
		display : 'flex',
		flexDirection : 'row',
		alignItems : 'center',
		justifyContent : 'center',
		margin : '24px 0',
		boxShadow : '0 0 12px rgba(0, 0, 0, 0.35)'
	},
	link : {
		minHeight : '36px',
		maxHeight : '36px',
		minWidth : '225px',
		padding : '0 18px',
		backgroundColor : Style.colorGuide.quaternaryColor,
		border : '1px solid ' + Style.colorGuide.primaryColorLighter,
		borderRadius : '3px',
		borderTopRightRadius : '0px',
		borderBottomRightRadius : '0px',
		display : 'flex',
		flexDirection : 'column',
		alignItems : 'center',
		justifyContent : 'center',
		fontWeight : 'normal',
		fontSize : '16px',
		color : '#c9c9c9',
		pointerEvents : 'all',
		// cursor : 'pointer',
		transition : 'all 0.1s ease',
		textShadow : '0 0 4px rgba(0, 0, 0, 0.5)',
		overflow : 'hidden',
		whiteSpace : 'nowrap',
		textOverflow : 'ellipsis',
		userSelect : 'text',
		cursor : 'text'
	},
	linkHovered : {
		color : '#eaeaea',
		border : '1px solid #3c3d42',
	},
	linkCopied : {
		color : '#ffbf51',
		// backgroundColor : '#282017',
		border : '1px solid ' + Style.colorGuide.primaryGold,
	},
	iframeCodeContainer : {
		minHeight : '36px',
		minWidth : '225px',
		maxWidth : '400px',
		padding : '6px 18px',
		backgroundColor : Style.colorGuide.quaternaryColor,
		border : '1px solid ' + Style.colorGuide.primaryColorLighter,
		borderRadius : '3px',
		display : 'flex',
		flexDirection : 'column',
		alignItems : 'center',
		justifyContent : 'center',
		fontWeight : 'normal',
		fontSize : '16px',
		color : '#c9c9c9',
		pointerEvents : 'all',
		transition : 'all 0.1s ease',
		textShadow : '0 0 4px rgba(0, 0, 0, 0.5)',
		userSelect : 'text',
		cursor : 'text'
	},
	spacer : {
		width : '16px'
	},
	button : {
		minHeight : '36px',
		maxHeight : '36px',
		minWidth : '70px',
		padding : '0 12px',
		paddingTop : '2px',
		backgroundColor : Style.colorGuide.primaryColorLighter,
		borderRadius : '3px',
		borderTopLeftRadius : '0px',
		borderBottomLeftRadius : '0px',
		display : 'flex',
		flexDirection : 'column',
		alignItems : 'center',
		justifyContent : 'center',
		fontFamily : 'Rajdhani',
		fontWeight : 'bold',
		fontSize : '16px',
		color : '#c9c9c9',
		pointerEvents : 'all',
		cursor : 'pointer',
		transition : 'all 0.1s ease',
		textTransform : 'uppercase',
	},
	buttonHovered : {
		backgroundColor : '#3c3d42',
		color : '#fff',
	},
	buttonCopied : {
		backgroundColor : Style.colorGuide.primaryGold,
		color : '#4d3612',
	},
	separator : {
		height : '1px',
		width : '200px',
		backgroundColor : Style.colorGuide.primaryColorLighterStill
	},
	socialIconContainer : {
		marginTop : '20px',
		display : 'flex',
		flexDirection : 'row',
		alignItems : 'center',
		justifyContent : 'center',
		height : '24px'
	},
	socialIcon : {
		height : '100%',
		cursor : 'pointer'
	}
};
