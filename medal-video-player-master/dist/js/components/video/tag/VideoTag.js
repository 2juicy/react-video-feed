'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.VideoTag = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _videoTagString = require('./videoTagString');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var VideoTag = exports.VideoTag = function VideoTag(props) {
	return _react2.default.createElement('span', {
		dangerouslySetInnerHTML: {
			__html: (0, _videoTagString.videoTagString)(props)
		}
	});
};