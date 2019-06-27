'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // import local dependencies


var _Mixpanel = require('./Mixpanel');

var _Mixpanel2 = _interopRequireDefault(_Mixpanel);

var _GoogleAnalytics = require('./GoogleAnalytics');

var _GoogleAnalytics2 = _interopRequireDefault(_GoogleAnalytics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// platform
var platform = require('platform');

var Utils = function () {
	function Utils() {
		_classCallCheck(this, Utils);
	}

	_createClass(Utils, null, [{
		key: 'isMobile',


		/**
   * returns whether or not the platform is mobile
   * @returns {boolean}
   */


		/**
   * the ip address of the user
   * @type {undefined}
   */
		value: function isMobile() {
			return platform.os.toString().toLowerCase().indexOf('ios') !== -1 || platform.os.toString().toLowerCase().indexOf('android') !== -1;
		}

		/**
   * returns whether or not the platform is windows
   * @returns {boolean}
   */

	}, {
		key: 'isWindows',
		value: function isWindows() {
			return platform.os.toString().toLowerCase().indexOf('windows') !== -1 || platform.os.toString().toLowerCase().indexOf('win') !== -1;
		}

		/**
   * returns whether or not the device is an iOS device
   * @returns {boolean}
   */

	}, {
		key: 'isIOS',
		value: function isIOS() {
			return (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
			);
		}

		/**
   * Generate spok for clip url.
   * @returns {string}
   */

	}, {
		key: 'generateSpok',
		value: function generateSpok() {
			var text = 'vp';
			var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			for (var i = 0; i < 7; i++) {
				text += possible.charAt(Math.floor(Math.random() * possible.length));
			}
			return text;
		}
	}, {
		key: 'get',


		/**
   * get string from url
   * @param url
   */
		value: function get(url) {
			// return promise
			return new Promise(async function (resolve, reject) {
				try {
					// response
					var response = await fetch(url);

					// to text
					if (response) {
						// resolve the text
						resolve((await response.text()));
					} else {
						console.log('Invalid response:', response);
						resolve(undefined);
					}
				} catch (e) {
					console.log('An error occurred:', e);
					resolve();
				}
			});
		}

		/**
   * get the user ip address
   * @returns {Promise<*>}
   */

	}, {
		key: 'resolveIpAddress',
		value: function resolveIpAddress() {
			var _this = this;

			// return promise
			return new Promise(async function (resolve) {
				// check if ip already retrieved
				if (!_this.ip) {
					// get the ip
					_this.ip = await _this.get('https://medal.tv/includes/analytics.php');
				}

				// return the ip address
				resolve(_this.ip);
			});
		}

		/**
   * resolve the user ip address as a user id
   */

	}, {
		key: 'resolveUser',
		value: function resolveUser() {
			var _this2 = this;

			// return promise
			return new Promise(async function (resolve, reject) {
				// check if user id already resolved
				if (!_this2.userId) {
					try {
						// user ip
						var ip = await _this2.resolveIpAddress();

						// make sure we have an ip
						if (ip) {
							// try to resolve it
							var resp = await _this2.get('https://api.medal.tv/users/?analytics=' + ip + '&offset=0&limit=1');

							// response as json
							var users = resp ? JSON.parse(resp) : [];

							// check response
							if (users.length > 0 && users[0] && users[0].userId) {
								// set user id
								_this2.userId = users[0].userId;
								// resolve
								resolve(_this2.userId);
								return;
							}
						}

						// reject
						resolve(undefined);
					} catch (e) {
						console.log('Error resolving user:', e);
						// reject
						resolve();
					}
				} else {
					resolve(_this2.userId);
				}
			});
		}

		/**
   * perform an action only for the resolved user
   * @param action
   * @param unresolved
   */

	}, {
		key: 'resolvedUserAction',
		value: function resolvedUserAction(action, unresolved) {
			var _this3 = this;

			// return promise
			return new Promise(async function (resolve, reject) {
				try {
					// get the user id of the watcher, if available
					var userId = await _this3.resolveUser();

					// user ip
					var ip = await _this3.resolveIpAddress();

					// check user id
					if (userId && userId > 0) {
						// resolve the action
						resolve(action(userId, ip));
					} else {
						// check for unresolved callback
						if (unresolved) {
							unresolved();
						}
						// reject
						resolve();
					}
				} catch (e) {
					resolve();
				}
			});
		}

		/**
   * send the video watch start event
   */

	}, {
		key: 'sendWatchStartEvent',
		value: async function sendWatchStartEvent(content, viewer, embedded) {
			var _this4 = this;

			// get the content poster user id
			var posterId = content ? content.userId || (content.poster || {}).userId : 0;

			// check poster id
			if (posterId && !isNaN(posterId) && posterId > 0) {
				// send ga event
				var sendEventGA = function sendEventGA() {
					// return promise
					return new Promise(function (resolve) {
						// send ga event
						_GoogleAnalytics2.default.event({
							category: 'video',
							action: 'started',
							label: (embedded ? 'embedded-' : '') + (viewer && viewer.platform ? viewer.platform : _this4.isMobile() ? 'web-mobile' : 'web-desktop')
						});

						// resolve
						resolve();
					});
				};

				// the start action
				var action = function action(userId, ip) {
					// is own content?
					var isOwnContent = userId === posterId;

					// report watch start to mixpanel
					try {
						// identify user
						_Mixpanel2.default.identify(userId);

						// set data for user
						if (isOwnContent) {
							// increment watch started for self content
							_Mixpanel2.default.people.increment({
								'watchStarted': 1,
								'watchSelf': 1
							});
						} else {
							// increment watch started for others' content
							_Mixpanel2.default.people.increment({
								'watchStarted': 1,
								'watchOther': 1
							});
						}

						// send view event
						_Mixpanel2.default.track('watchStarted', {
							'watchType': isOwnContent ? 'self' : 'other',
							'categoryId': content.categoryId || 3,
							'videoSeconds': content.videoLengthSeconds,
							'platform': viewer && viewer.platform ? viewer.platform : _this4.isMobile() ? 'web-mobile' : 'web-desktop',
							'embedded': embedded,
							'$ip': ip
						});

						// set user id
						_GoogleAnalytics2.default.setUserId(userId);

						// send ga event
						sendEventGA();
					} catch (e) {
						console.log('Event error:');
						console.log(e);
					}
				};

				// check if viewer is defined
				if (viewer && viewer.userId) {
					// perform the action for the defined viewer and resolve the ip address
					action(viewer.userId, (await this.resolveIpAddress()));
				} else {
					// resolve the user by ip and perform the action
					this.resolvedUserAction(action, sendEventGA);
				}
			} else {
				console.log('Invalid content:', content);
			}
		}

		/**
   * send watch view count event
   */

	}, {
		key: 'sendViewCountEvent',
		value: async function sendViewCountEvent(content, viewer, embedded, submitView) {
			var _this5 = this;

			// get the content poster user id
			var posterId = content ? content.userId || (content.poster || {}).userId : 0;

			// check poster id
			if (posterId && !isNaN(posterId) && posterId > 0) {
				// send ga event
				var sendEventGA = function sendEventGA() {
					// return promise
					return new Promise(function (resolve) {
						// send ga event
						_GoogleAnalytics2.default.event({
							category: 'video',
							action: 'viewcount',
							label: (embedded ? 'embedded-' : '') + (viewer && viewer.platform ? viewer.platform : _this5.isMobile() ? 'web-mobile' : 'web-desktop')
						});

						// resolve
						resolve();
					});
				};

				// send view event to medal API
				var sendViewEvent = function sendViewEvent() {
					// return promise
					return new Promise(async function (resolve, reject) {
						// check if the viewer has authentication info attached
						if (viewer && viewer.userId && viewer.auth && viewer.auth.key) {
							try {
								// send the post request
								var postData = {
									method: 'POST',
									headers: {
										'X-Authentication': viewer.userId + ',' + viewer.auth.key,
										'Accept': 'application/json',
										'Content-Type': 'application/json'
									},
									body: {
										userId: viewer.userId,
										duration: 0
									}
								};

								// make a post call to the public content views endpoint
								var resp = await fetch('https://api-v2.medal.tv/content/' + content.contentId + '/views', postData);
							} catch (e) {
								console.log('Error attributing view count:', e);
							}

							// resolve
							resolve();
						} else {
							// make a post call to the public content views endpoint
							var _resp = await fetch('https://api.medal.tv/public_content/' + content.contentId + '/views?contentId=' + content.contentId);

							// json from resp
							_resp = JSON.parse((await _resp.text()));

							// check response for success flag
							if (_resp && _resp.success) {
								// resolve
								resolve();
							} else {
								// reject
								resolve();
							}
						}
					});
				};

				// send events to GA and medal API
				var sendEvents = function sendEvents() {
					// send GA events
					sendEventGA();

					// send API view event
					if (submitView === true) {
						sendViewEvent();
					}
				};

				// the end action
				var action = function action(userId, ip) {
					// report watch start to mixpanel
					try {
						// set user id
						_GoogleAnalytics2.default.setUserId(userId);

						// send ga event
						sendEvents();
					} catch (e) {
						console.log('Event error:');
						console.log(e);
					}
				};

				// check if viewer is defined
				if (viewer && viewer.userId) {
					// perform the action for the defined viewer and resolve the ip address
					action(viewer.userId, (await this.resolveIpAddress()));
				} else {
					// resolve the user by ip and perform the action
					this.resolvedUserAction(action, sendEvents);
				}
			} else {
				console.log('Invalid content:', content);
			}
		}

		/**
   * send the video watch end event
   */

	}, {
		key: 'sendWatchEndEvent',
		value: async function sendWatchEndEvent(content, viewer, embedded) {
			var _this6 = this;

			// get the content poster user id
			var posterId = content ? content.userId || (content.poster || {}).userId : 0;

			// check poster id
			if (posterId && !isNaN(posterId) && posterId > 0) {
				// send ga event
				var sendEventGA = function sendEventGA() {
					// return promise
					return new Promise(function (resolve) {
						// send ga event
						_GoogleAnalytics2.default.event({
							category: 'video',
							action: 'finished',
							label: (embedded ? 'embedded-' : '') + (viewer && viewer.platform ? viewer.platform : _this6.isMobile() ? 'web-mobile' : 'web-desktop')
						});

						// resolve
						resolve();
					});
				};

				// the end action
				var action = function action(userId, ip) {
					// is own content?
					var isOwnContent = userId === posterId;

					// report watch start to mixpanel
					try {
						// identify user
						_Mixpanel2.default.identify(userId);

						// set data for user
						if (isOwnContent) {
							// increment watch started for self content
							_Mixpanel2.default.people.increment({
								'watchFinished': 1,
								'totalWatchTime': content.videoLengthSeconds
							});
						} else {
							// increment watch started for others' content
							_Mixpanel2.default.people.increment({
								'watchFinished': 1,
								'totalWatchTime': content.videoLengthSeconds
							});
						}

						// send view event
						_Mixpanel2.default.track('watchFinished', {
							'watchType': isOwnContent ? 'self' : 'other',
							'categoryId': content.categoryId || 3,
							'videoSeconds': content.videoLengthSeconds,
							'platform': viewer && viewer.platform ? viewer.platform : _this6.isMobile() ? 'web-mobile' : 'web-desktop',
							'embedded': embedded,
							'$ip': ip
						});

						// set user id
						_GoogleAnalytics2.default.setUserId(userId);

						// send ga event
						sendEventGA();
					} catch (e) {
						console.log('Event error:');
						console.log(e);
					}
				};

				// check if viewer is defined
				if (viewer && viewer.userId) {
					// perform the action for the defined viewer and resolve the ip address
					action(viewer.userId, (await this.resolveIpAddress()));
				} else {
					// resolve the user by ip and perform the action
					this.resolvedUserAction(action, sendEventGA);
				}
			} else {
				console.log('Invalid content:', content);
			}
		}

		/**
   * send the video watch start event
   */

	}, {
		key: 'sendShareEvent',
		value: async function sendShareEvent(content, user, type, embedded) {
			var _this7 = this;

			// get the content poster user id
			var posterId = content ? content.userId || (content.poster || {}).userId : 0;

			// check poster id
			if (posterId && !isNaN(posterId) && posterId > 0) {
				// send ga event
				var sendEventGA = function sendEventGA() {
					// return promise
					return new Promise(function (resolve) {
						// send ga event
						_GoogleAnalytics2.default.event({
							category: 'share',
							action: type,
							label: (embedded ? 'embedded-' : '') + (user && user.platform ? user.platform : _this7.isMobile() ? 'web-mobile' : 'web-desktop')
						});

						// resolve
						resolve();
					});
				};

				// the start action
				var action = function action(userId, ip) {
					// is own content?
					var isOwnContent = userId === posterId;

					// report watch start to mixpanel
					try {
						// identify user
						_Mixpanel2.default.identify(userId);

						// increment watch started for self content
						_Mixpanel2.default.people.increment({
							'clipsShared': 1
						});

						// send view event
						_Mixpanel2.default.track('clipsShared', {
							'categoryId': content.categoryId || 3,
							'shareType': type,
							'platform': user && user.platform ? user.platform : _this7.isMobile() ? 'web-mobile' : 'web-desktop',
							'embedded': embedded,
							'$ip': ip
						});

						// set user id
						_GoogleAnalytics2.default.setUserId(userId);

						// send ga event
						sendEventGA();
					} catch (e) {
						console.log('Event error:');
						console.log(e);
					}
				};

				// check if viewer is defined
				if (user && user.userId) {
					// perform the action for the defined viewer and resolve the ip address
					action(user.userId, (await this.resolveIpAddress()));
				} else {
					// resolve the user by ip and perform the action
					this.resolvedUserAction(action, sendEventGA);
				}
			} else {
				console.log('Invalid content:', content);
			}
		}

		/**
   * Get the donate config for the specified user id.
   * @param userId
   * @returns {Promise<void>}
   */

	}, {
		key: 'getDonateConfig',
		value: function getDonateConfig(userId) {
			return new Promise(async function (resolve) {
				// ensure user id exists
				if (!userId) {
					// log
					console.log('Invalid user id for donate config:', userId);

					// resolve tho
					resolve();
					return;
				}

				// make a post call to the public content views endpoint
				var resp = await fetch('https://api.medal.tv/users/' + userId + '/donate');

				// json from resp
				resp = JSON.parse((await resp.text()));

				// check response for success flag
				if (resp) {
					// resolve
					resolve(resp);
				} else {
					// reject
					resolve();
				}
			});
		}

		/**
   * send click donate button event
   */

	}, {
		key: 'sendDonateButtonClick',
		value: async function sendDonateButtonClick(content, viewer, embedded) {
			var _this8 = this;

			// get the content poster user id
			var posterId = content ? content.userId || (content.poster || {}).userId : 0;

			// check poster id
			if (posterId && !isNaN(posterId) && posterId > 0) {
				// send ga event
				var sendEventGA = function sendEventGA() {
					// return promise
					return new Promise(function (resolve) {
						// send ga event
						_GoogleAnalytics2.default.event({
							category: 'video',
							action: 'donate',
							label: (embedded ? 'embedded-' : '') + (viewer && viewer.platform ? viewer.platform : _this8.isMobile() ? 'web-mobile' : 'web-desktop')
						});

						// resolve
						resolve();
					});
				};

				// send events to GA and medal API
				var sendEvents = function sendEvents() {
					sendEventGA();
				};

				// the end action
				var action = function action(userId, ip) {
					// report watch start to mixpanel
					try {
						// set user id
						_GoogleAnalytics2.default.setUserId(userId);

						// send ga event
						sendEvents();
					} catch (e) {
						console.log('Event error:');
						console.log(e);
					}
				};

				// check if viewer is defined
				if (viewer && viewer.userId) {
					// perform the action for the defined viewer and resolve the ip address
					action(viewer.userId, (await this.resolveIpAddress()));
				} else {
					// resolve the user by ip and perform the action
					this.resolvedUserAction(action, sendEvents);
				}
			} else {
				console.log('Invalid content:', content);
			}
		}

		// pad the numbers

	}, {
		key: 'pad',
		value: function pad(num) {
			return ("0" + num).slice(-2);
		}
	}, {
		key: 'hhmmss',


		/**
   * Time to hh:mm:ss format
   * @param secs
   * @returns {string}
   */
		value: function hhmmss(secs) {
			// round
			secs = Math.round(secs);

			var minutes = Math.floor(secs / 60);
			secs = secs % 60;
			var hours = Math.floor(minutes / 60);
			minutes = minutes % 60;

			// check hours
			if (hours > 0) {
				return this.pad(hours) + ':' + this.pad(minutes) + ':' + this.pad(secs);
			}

			// return without hours
			return this.pad(minutes) + ':' + this.pad(secs);
		}

		/**
   * append cache query string value to the url
   * @param url
   * @param value
   */

	}, {
		key: 'appendCacheQueryString',
		value: function appendCacheQueryString(url, value) {
			// regex pattern for detecting ? character
			var pattern = new RegExp(/\?+/g);

			// has query string
			var hasQueryString = pattern.test(url);

			// return new string
			return url + (hasQueryString ? '&' : '?') + ('cache=' + value);
		}
	}]);

	return Utils;
}();

Utils.ip = undefined;
Utils.userId = undefined;
exports.default = Utils;