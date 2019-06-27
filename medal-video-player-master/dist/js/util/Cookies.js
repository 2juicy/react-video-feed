'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// uuid cookie key
var uuidKey = 'mvp-ua-uuid';
var mutedKey = 'mvp-volume-muted';
var qualityKey = 'mvp-quality';
var volumeKey = 'mvp-volume';

var Cookies = function () {
	function Cookies() {
		_classCallCheck(this, Cookies);
	}

	_createClass(Cookies, null, [{
		key: 'getCookie',


		/**
   * get the cookie for the specified name
   * @param cname
   */


		/**
   * local vars
   */
		value: function getCookie(cname) {
			var name = cname + "=";
			var decodedCookie = decodeURIComponent(document.cookie);
			var ca = decodedCookie.split(';');
			for (var i = 0; i < ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) == ' ') {
					c = c.substring(1);
				}
				if (c.indexOf(name) == 0) {
					return c.substring(name.length, c.length);
				}
			}
			return undefined;
		}

		/**
   * generate a uuid v4 string
   * @returns {string}
   */

	}, {
		key: 'generate',
		value: function generate() {
			//// return uuid of form xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
			var uuid = '',
			    ii = void 0;
			for (ii = 0; ii < 32; ii += 1) {
				switch (ii) {
					case 8:
					case 20:
						uuid += '-';
						uuid += (Math.random() * 16 | 0).toString(16);
						break;
					case 12:
						uuid += '-';
						uuid += '4';
						break;
					case 16:
						uuid += '-';
						uuid += (Math.random() * 4 | 8).toString(16);
						break;
					default:
						uuid += (Math.random() * 16 | 0).toString(16);
				}
			}
			return uuid;
		}

		/**
   * set the volume cookie
   */

	}, {
		key: 'setVolume',
		value: function setVolume(volume) {
			// set the cookie
			document.cookie = volumeKey + '=' + volume;

			// set the local var
			this.volume = volume;

			// return the value
			return volume;
		}

		/**
   * get the volume from cookies if exists
   */

	}, {
		key: 'getVolume',
		value: function getVolume() {
			var defaultValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.5;

			// cookie
			var cookie = this.getCookie(volumeKey);

			// stored uuid
			var value = cookie !== undefined ? cookie : this.volume;

			// check if cookie is defined
			if (value === undefined) {
				// set the uuid
				value = defaultValue;

				// set the cookie
				document.cookie = volumeKey + '=' + value;
			}

			// if local quality not set
			if (this.volume === undefined || this.volume !== value) {
				// set uuid
				this.volume = value;
			}

			// return the uuid
			return parseFloat(this.volume);
		}

		/**
   * set the muted cookie
   */

	}, {
		key: 'setMuted',
		value: function setMuted(muted) {
			// set the cookie
			document.cookie = mutedKey + '=' + muted;

			// set the local var
			this.muted = muted;

			// return the value
			return muted;
		}

		/**
   * get the volume from cookies if exists
   */

	}, {
		key: 'getMuted',
		value: function getMuted() {
			var defaultValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

			// cookie
			var cookie = this.getCookie(mutedKey);

			// stored uuid
			var value = cookie !== undefined ? cookie : this.muted;

			// check if cookie is defined
			if (value === undefined) {
				// set the uuid
				value = defaultValue;

				// set the cookie
				document.cookie = mutedKey + '=' + value;
			}

			// if local quality not set
			if (this.muted === undefined || this.muted !== value) {
				// set uuid
				this.muted = value;
			}

			// return the uuid
			return this.muted === true || this.muted === 'true';
		}

		/**
   * set the quality cookie
   */

	}, {
		key: 'setQuality',
		value: function setQuality(quality) {
			// set the cookie
			document.cookie = qualityKey + '=' + quality;

			// set the local var
			this.quality = quality;

			// return the value
			return quality;
		}

		/**
   * get the volume from cookies if exists
   */

	}, {
		key: 'getQuality',
		value: function getQuality() {
			var defaultValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'high';

			// cookie
			var cookie = this.getCookie(qualityKey);

			// stored uuid
			var value = cookie !== undefined ? cookie : this.quality;

			// check if cookie is defined
			if (value === undefined) {
				// set the uuid
				value = defaultValue;

				// set the cookie
				document.cookie = qualityKey + '=' + value;
			}

			// if local quality not set
			if (this.quality === undefined || this.quality !== value) {
				// set uuid
				this.quality = value;
			}

			// return the uuid
			return value;
		}

		/**
   * get the uuid from cookies if exists, otherwise generate and set cookie
   */

	}, {
		key: 'getUUID',
		value: function getUUID() {
			// cookie
			var cookie = this.getCookie(uuidKey);

			// stored uuid
			var uuid = cookie !== undefined ? cookie : this.uuid;

			// check if cookie is defined
			if (uuid === undefined) {
				// set the uuid
				uuid = this.generate();

				// set the cookie
				document.cookie = uuidKey + '=' + uuid;
			}

			// if local uuid not set
			if (this.uuid === undefined || this.uuid !== uuid) {
				// set uuid
				this.uuid = uuid;
			}

			// return the uuid
			return uuid;
		}
	}]);

	return Cookies;
}();

Cookies.uuid = undefined;
Cookies.muted = undefined;
Cookies.quality = undefined;
Cookies.volume = undefined;
exports.default = Cookies;