import React from 'react';
import PropTypes from 'prop-types';

class Button extends React.PureComponent {
	constructor (props) {
		super(props);

		// set the default states
		this.state = {
			hovered : false
		}
	}

	/**
	 * on mouse enter
	 */
	onMouseEnter = () => {
		// set state
		this.setState({ hovered : true });

		// on hover enter
		if (this.props.onHoverEnter) {
			this.props.onHoverEnter();
		}
	};

	/**
	 * on mouse leave
	 */
	onMouseLeave = () => {
		// set state
		this.setState({ hovered : false });

		// on hover leave
		if (this.props.onHoverLeave) {
			this.props.onHoverLeave();
		}
	};

	/**
	 * render the button jsx
	 * @returns {*}
	 */
	render () {
		return (
			<img
				// data-tip={ this.props.tooltip }
				// data-delay-show="750"
				title={ this.props.tooltip }
				id={ this.props.id }
				src={ this.props.srcHovered && this.state.hovered ? this.props.srcHovered : this.props.src }
				onClick={ this.props.onClick }
				style={ Object.assign({}, style.button, this.props.style || {}, { opacity : this.state.hovered ? '1' : (this.props.style && this.props.style.opacity ? this.props.style.opacity : '0.8') }) }
				onMouseEnter={ this.onMouseEnter }
				onMouseLeave={ this.onMouseLeave }
			/>
		);
	}

}

Button.defaultProps = {
	id : 'controlButton'
};

Button.propTypes = {
	id: PropTypes.string,
	src: PropTypes.string.isRequired,
	hoveredSrc: PropTypes.string,
	onClick : PropTypes.func.isRequired,
	tooltip : PropTypes.string,
	onHoverEnter : PropTypes.func,
	onHoverLeave : PropTypes.func,
};

export default Button;

const style = {
	button : {
		height : '100%',
		width : 'auto',
		cursor : 'pointer',
		pointerEvents : 'inherit',
		transition : 'opacity 0.2s ease'
	}
};
