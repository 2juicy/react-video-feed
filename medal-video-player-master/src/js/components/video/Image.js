// import dependencies
import React from 'react';
import PropTypes from 'prop-types';

/**
 * create horizontal line
 *
 * @extends React
 */
class Image extends React.PureComponent {
    /**
     * construct horizontal line
     *
     * @param  {Object} props
     */
    constructor (props) {
        // run super
        super(props);

        // state
        this.state = {
            src : props.src,
            loaded : false,
            timestamp : new Date().getTime()
        };
    }

    /**
     * on component will receive props
     * @param prevProps
     * @param prevState
     */
    componentDidUpdate (prevProps, prevState) {
        // check if src changed
        if (this.props.src !== prevProps.src) {
            // update timestamp
            this.setState({
                src : this.props.src,
                loaded : false,
                timestamp : new Date().getTime()
            });
        }
    }

    /**
     * on image load
     */
    onLoad = () => {
        // check if we need to update the loaded state
        if (this.props.loader && !this.state.loaded) {
            // set state to loaded
            this.setState({ loaded : true });
        }

        // check props onload
        if (this.props.onLoad) {
            this.props.onLoad();
        }
    };

    /**
     * on image load fail
     */
    onError = () => {
        // check fallback options
        if (this.props.fallback && this.state.src !== this.props.fallback) {
            // update src to fallback option
            this.setState({ src : this.props.fallback });
        }

        // check props onerror
        if (this.props.onError) {
            this.props.onError();
        }
    };

    /**
     * return JSX
     *
     * @return {JSX}
     */
    render () {
        // loader component
        let loader = '';

        // check if loader element exists and if not yet loaded
        if (this.props.loader && !this.state.loaded) {
            // render loader element
            loader = <div style={ Object.assign({}, { width : '100%', height : 'auto' }, this.props.style ? this.props.style : {}) }>
                { this.props.loader }
            </div>;
        }
        return (
            <React.Fragment>
                { loader }
                <img
                    { ...this.props }
                    src={ `${this.state.src}#t=${this.state.timestamp}` }
                    style={ Object.assign({}, this.props.style ? this.props.style : {}, this.props.loader && !this.state.loaded ? { width : '0', height : '0', opacity : '0' } : {}) }
                    onLoad={ this.onLoad }
                    onError={ this.onError }
                />
            </React.Fragment>
        );
    }
}

// prop types
Image.propTypes = {
    src : PropTypes.string.isRequired,
    fallback : PropTypes.string,
    style : PropTypes.object,
    onLoad : PropTypes.func,
    onError : PropTypes.func,
    loader : PropTypes.object
};

/**
 * export default
 */
export default Image;
