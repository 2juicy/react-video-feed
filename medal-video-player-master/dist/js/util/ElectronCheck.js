'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// export class
var ElectronCheck = function () {
	function ElectronCheck() {
		_classCallCheck(this, ElectronCheck);
	}

	_createClass(ElectronCheck, null, [{
		key: 'isElectron',

		/**
   * returns whether or not the code is running inside an electron app
   * @returns {boolean}
   */
		value: function isElectron() {
			// Renderer process
			if (typeof window !== 'undefined' && _typeof(window.process) === 'object' && window.process.type === 'renderer') {
				return true;
			}

			// Main process
			if (typeof process !== 'undefined' && _typeof(process.versions) === 'object' && !!process.versions.electron) {
				return true;
			}

			// Detect the user agent when the `nodeIntegration` option is set to true
			if ((typeof navigator === 'undefined' ? 'undefined' : _typeof(navigator)) === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
				return true;
			}

			return false;
		}
	}]);

	return ElectronCheck;
}();

exports.default = ElectronCheck;