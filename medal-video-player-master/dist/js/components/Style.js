'use strict';

// fills parent container but sits absolutely within it
var absoluteContainer = {
	position: 'absolute',
	top: '0',
	left: '0',
	bottom: '0',
	right: '0'
};
var videoElementContainer = {
	width: '100%',
	verticalAlign: 'middle'
};

// video element
var videoElementContainerCSS = 'width: 100%; vertical-align: middle;';

// fills parent container but declares position as relative, usually for holding an absolute container within
var relativeContainer = {
	position: 'relative',
	width: '100%',
	height: '100%'
};
var medalPlayerContainer = {
	position: 'relative'
};

// opacity controller for element fade in/out
var opacityControl = {
	transition: 'opacity 0.25s ease'
};

// color guide
var colorGuide = {
	primaryColorLighterStill: '#343539',
	primaryColorLighter: '#2e2f33',
	primaryColor: '#292b2f',
	secondaryColor: '#212226',
	tertiaryColor: '#1d1e21',
	quaternaryColor: '#18191c',
	quinaryColor: '#16171a',
	primaryGold: '#ffbf51',
	primaryGreen: '#538E59',
	primaryRed: '#cf413a',
	warningText: '#ec423b'
};

// global style references
module.exports = {
	absoluteContainer: absoluteContainer,
	relativeContainer: relativeContainer,
	opacityControl: opacityControl,
	colorGuide: colorGuide,
	videoElementContainer: videoElementContainer,
	medalPlayerContainer: medalPlayerContainer,
	videoElementContainerCSS: videoElementContainerCSS
};