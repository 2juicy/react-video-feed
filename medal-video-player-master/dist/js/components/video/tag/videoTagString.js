"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var videoTagString = exports.videoTagString = function videoTagString(props) {
	var classOrClassName = props.className || props.class;
	var classString = classOrClassName ? " class=\"" + classOrClassName + "\"" : "";
	var muted = props.muted ? " muted" : "";
	var autoPlay = props.autoPlay ? " autoplay" : "";
	var playsInline = props.playsInline ? " playsinline" : "";
	var loop = props.loop ? " loop" : "";
	var poster = props.poster ? " poster=\"" + props.poster + "\"" : "";
	var id = props.id ? " id=\"" + props.id + "\"" : ""; // required
	var srcId = props.id ? " id=\"" + props.id + "-source\"" : ""; // required
	var src = props.src ? " src=\"" + props.src + "\"" : " src=\"\""; // required
	var type = props.type ? " type=\"" + props.type + "\"" : "";
	var style = props.style ? " style=\"" + props.style + "\"" : "";

	return "<video playsinline " + id + style + classString + muted + autoPlay + playsInline + loop + poster + "><source" + srcId + src + type + "></video>";
};