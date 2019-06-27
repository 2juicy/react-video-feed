'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // import react-ga


var _Cookies = require('./Cookies');

var _Cookies2 = _interopRequireDefault(_Cookies);

var _ElectronCheck = require('./ElectronCheck');

var _ElectronCheck2 = _interopRequireDefault(_ElectronCheck);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// is electron
var useUniversalAnalytics = _ElectronCheck2.default.isElectron();

// tracking id
var trackingId = 'UA-98208613-7';

// universal-analytics visitor object
var visitor = void 0;

// check if is electron
if (useUniversalAnalytics) {
	// universal analytics
	visitor = require('universal-analytics')(trackingId, _Cookies2.default.getUUID(), { strictCidFormat: false });
}

var analytics = function () {
	function analytics() {
		_classCallCheck(this, analytics);
	}

	_createClass(analytics, null, [{
		key: 'setUserId',
		value: function setUserId(userId) {
			if (useUniversalAnalytics) {
				visitor.set("userId", userId);
			} else {
				try {
					// console.log('global ga set:');
					ga('set', 'userId', userId);
				} catch (e) {
					console.log(e);
				}
			}
		}
	}, {
		key: 'event',
		value: function event(obj) {
			if (useUniversalAnalytics) {
				visitor.event(obj.category, obj.action, obj.label, obj.value).send();
			} else {
				try {
					// console.log('global ga event:');
					ga('send', {
						hitType: 'event',
						eventCategory: obj.category,
						eventAction: obj.action,
						eventLabel: obj.label,
						eventValue: obj.value
					});
				} catch (e) {
					console.log(e);
				}
			}
		}
	}]);

	return analytics;
}();

exports.default = analytics;