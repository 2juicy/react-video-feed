"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var mixpanel = require('mixpanel-browser');

// live: 067b51d9c1cd8727630578ac06349a94
// test: 9004f064b0ff0bec02535ebd2eebed33
mixpanel.init("067b51d9c1cd8727630578ac06349a94");

exports.default = mixpanel;