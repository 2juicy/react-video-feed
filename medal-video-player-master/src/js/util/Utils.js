// import local dependencies
import mixpanel from './Mixpanel';
import analytics from './GoogleAnalytics';

// platform
const platform = require('platform');

export default class Utils {

	/**
	 * the ip address of the user
	 * @type {undefined}
	 */
	static ip = undefined;
	static userId = undefined;

	/**
	 * returns whether or not the platform is mobile
	 * @returns {boolean}
	 */
	static isMobile () {
		return platform.os.toString().toLowerCase().indexOf('ios') !== -1 || platform.os.toString().toLowerCase().indexOf('android') !== -1;
	}

	/**
	 * returns whether or not the platform is windows
	 * @returns {boolean}
	 */
	static isWindows () {
		return platform.os.toString().toLowerCase().indexOf('windows') !== -1 || platform.os.toString().toLowerCase().indexOf('win') !== -1;
	}

	/**
	 * returns whether or not the device is an iOS device
	 * @returns {boolean}
	 */
	static isIOS () {
		return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
	}

	/**
	 * Generate spok for clip url.
	 * @returns {string}
	 */
	static generateSpok () {
		let text = 'vp';
		let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		for (let i = 0; i < 7; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	};

	/**
	 * get string from url
	 * @param url
	 */
	static get(url) {
		// return promise
		return new Promise(async (resolve, reject) => {
			try {
				// response
				let response = await fetch(url);

				// to text
				if (response) {
					// resolve the text
					resolve(await response.text());
				} else {
					console.log('Invalid response:', response);
					resolve(undefined);
				}
			} catch (e) {
				console.log('An error occurred:', e);
				resolve();
			}
		})
	}

	/**
	 * get the user ip address
	 * @returns {Promise<*>}
	 */
	static resolveIpAddress () {
		// return promise
		return new Promise(async (resolve) => {
			// check if ip already retrieved
			if (!this.ip) {
				// get the ip
				this.ip = await this.get('https://medal.tv/includes/analytics.php');
			}

			// return the ip address
			resolve(this.ip);
		});
	}

	/**
	 * resolve the user ip address as a user id
	 */
	static resolveUser () {
		// return promise
		return new Promise(async (resolve, reject) => {
			// check if user id already resolved
			if (!this.userId) {
				try {
					// user ip
					let ip = await this.resolveIpAddress();

					// make sure we have an ip
					if (ip) {
						// try to resolve it
						let resp = await this.get(`https://api.medal.tv/users/?analytics=${ip}&offset=0&limit=1`);

						// response as json
						let users = resp ? JSON.parse(resp) : [];

						// check response
						if (users.length > 0 && users[0] && users[0].userId) {
							// set user id
							this.userId = users[0].userId;
							// resolve
							resolve(this.userId);
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
				resolve(this.userId);
			}
		});
	}

	/**
	 * perform an action only for the resolved user
	 * @param action
	 * @param unresolved
	 */
	static resolvedUserAction(action, unresolved) {
		// return promise
		return new Promise(async (resolve, reject) => {
			try {
				// get the user id of the watcher, if available
				let userId = await this.resolveUser();

				// user ip
				let ip = await this.resolveIpAddress();

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
	static async sendWatchStartEvent (content, viewer, embedded) {
		// get the content poster user id
		let posterId = content ? content.userId || (content.poster || {}).userId : 0;

		// check poster id
		if (posterId && !isNaN(posterId) && posterId > 0) {
			// send ga event
			const sendEventGA = () => {
				// return promise
				return new Promise((resolve) => {
					// send ga event
					analytics.event({
						category: 'video',
						action: 'started',
						label: (embedded ? 'embedded-' : '') + (viewer && viewer.platform ? viewer.platform : (this.isMobile() ? 'web-mobile' : 'web-desktop'))
					});

					// resolve
					resolve();
				})
			};

			// the start action
			const action = (userId, ip) => {
				// is own content?
				let isOwnContent = userId === posterId;

				// report watch start to mixpanel
				try {
					// identify user
					mixpanel.identify(userId);

					// set data for user
					if (isOwnContent) {
						// increment watch started for self content
						mixpanel.people.increment({
							'watchStarted': 1,
							'watchSelf': 1
						});
					} else {
						// increment watch started for others' content
						mixpanel.people.increment({
							'watchStarted': 1,
							'watchOther': 1
						});
					}

					// send view event
					mixpanel.track('watchStarted', {
						'watchType': isOwnContent ? 'self' : 'other',
						'categoryId': content.categoryId || 3,
						'videoSeconds': content.videoLengthSeconds,
						'platform': viewer && viewer.platform ? viewer.platform : (this.isMobile() ? 'web-mobile' : 'web-desktop'),
						'embedded': embedded,
						'$ip': ip
					});

					// set user id
					analytics.setUserId(userId);

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
				action(viewer.userId, await this.resolveIpAddress());
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
	static async sendViewCountEvent (content, viewer, embedded, submitView) {
		// get the content poster user id
		let posterId = content ? content.userId || (content.poster || {}).userId : 0;

		// check poster id
		if (posterId && !isNaN(posterId) && posterId > 0) {
			// send ga event
			const sendEventGA = () => {
				// return promise
				return new Promise((resolve) => {
					// send ga event
					analytics.event({
						category: 'video',
						action: 'viewcount',
						label: (embedded ? 'embedded-' : '') + (viewer && viewer.platform ? viewer.platform : (this.isMobile() ? 'web-mobile' : 'web-desktop'))
					});

					// resolve
					resolve();
				})
			};

			// send view event to medal API
			const sendViewEvent = () => {
				// return promise
				return new Promise(async (resolve, reject) => {
					// check if the viewer has authentication info attached
					if (viewer && viewer.userId && viewer.auth && viewer.auth.key) {
						try {
							// send the post request
							let postData = {
								method : 'POST',
								headers : {
									'X-Authentication': `${viewer.userId},${viewer.auth.key}`,
									'Accept': 'application/json',
									'Content-Type': 'application/json'
								},
								body : {
									userId : viewer.userId,
									duration : 0
								}
							};

							// make a post call to the public content views endpoint
							let resp = await fetch(`https://api-v2.medal.tv/content/${content.contentId}/views`, postData);
						} catch (e) {
							console.log('Error attributing view count:', e);
						}

						// resolve
						resolve();
					} else {
						// make a post call to the public content views endpoint
						let resp = await fetch(`https://api.medal.tv/public_content/${content.contentId}/views?contentId=${content.contentId}`);

						// json from resp
						resp = JSON.parse(await resp.text());

						// check response for success flag
						if (resp && resp.success) {
							// resolve
							resolve();
						} else {
							// reject
							resolve();
						}
					}
				})
			};

			// send events to GA and medal API
			const sendEvents = () => {
				// send GA events
				sendEventGA();

				// send API view event
				if (submitView === true) {
					sendViewEvent();
				}
			};

			// the end action
			const action = (userId, ip) => {
				// report watch start to mixpanel
				try {
					// set user id
					analytics.setUserId(userId);

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
				action(viewer.userId, await this.resolveIpAddress());
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
	static async sendWatchEndEvent (content, viewer, embedded) {
		// get the content poster user id
		let posterId = content ? content.userId || (content.poster || {}).userId : 0;

		// check poster id
		if (posterId && !isNaN(posterId) && posterId > 0) {
			// send ga event
			const sendEventGA = () => {
				// return promise
				return new Promise((resolve) => {
					// send ga event
					analytics.event({
						category: 'video',
						action: 'finished',
						label: (embedded ? 'embedded-' : '') + (viewer && viewer.platform ? viewer.platform : (this.isMobile() ? 'web-mobile' : 'web-desktop')),
					});

					// resolve
					resolve();
				})
			};

			// the end action
			const action = (userId, ip) => {
				// is own content?
				let isOwnContent = userId === posterId;

				// report watch start to mixpanel
				try {
					// identify user
					mixpanel.identify(userId);

					// set data for user
					if (isOwnContent) {
						// increment watch started for self content
						mixpanel.people.increment({
							'watchFinished': 1,
							'totalWatchTime': content.videoLengthSeconds
						});
					} else {
						// increment watch started for others' content
						mixpanel.people.increment({
							'watchFinished': 1,
							'totalWatchTime': content.videoLengthSeconds
						});
					}

					// send view event
					mixpanel.track('watchFinished', {
						'watchType': isOwnContent ? 'self' : 'other',
						'categoryId': content.categoryId || 3,
						'videoSeconds': content.videoLengthSeconds,
						'platform': viewer && viewer.platform ? viewer.platform : (this.isMobile() ? 'web-mobile' : 'web-desktop'),
						'embedded': embedded,
						'$ip': ip
					});

					// set user id
					analytics.setUserId(userId);

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
				action(viewer.userId, await this.resolveIpAddress());
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
	static async sendShareEvent (content, user, type, embedded) {
		// get the content poster user id
		let posterId = content ? content.userId || (content.poster || {}).userId : 0;

		// check poster id
		if (posterId && !isNaN(posterId) && posterId > 0) {
			// send ga event
			const sendEventGA = () => {
				// return promise
				return new Promise((resolve) => {
					// send ga event
					analytics.event({
						category: 'share',
						action: type,
						label: (embedded ? 'embedded-' : '') + (user && user.platform ? user.platform : (this.isMobile() ? 'web-mobile' : 'web-desktop'))
					});

					// resolve
					resolve();
				})
			};

			// the start action
			const action = (userId, ip) => {
				// is own content?
				let isOwnContent = userId === posterId;

				// report watch start to mixpanel
				try {
					// identify user
					mixpanel.identify(userId);

					// increment watch started for self content
					mixpanel.people.increment({
						'clipsShared': 1,
					});

					// send view event
					mixpanel.track('clipsShared', {
						'categoryId': content.categoryId || 3,
						'shareType' : type,
						'platform': user && user.platform ? user.platform : (this.isMobile() ? 'web-mobile' : 'web-desktop'),
						'embedded': embedded,
						'$ip': ip
					});

					// set user id
					analytics.setUserId(userId);

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
				action(user.userId, await this.resolveIpAddress());
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
	static getDonateConfig (userId) {
		return new Promise(async resolve => {
			// ensure user id exists
			if (!userId) {
				// log
				console.log('Invalid user id for donate config:', userId);

				// resolve tho
				resolve();
				return;
			}

			// make a post call to the public content views endpoint
			let resp = await fetch(`https://api.medal.tv/users/${userId}/donate`);

			// json from resp
			resp = JSON.parse(await resp.text());

			// check response for success flag
			if (resp) {
				// resolve
				resolve(resp);
			} else {
				// reject
				resolve()
			}
		});
	}

	/**
	 * send click donate button event
	 */
	static async sendDonateButtonClick (content, viewer, embedded) {
		// get the content poster user id
		let posterId = content ? content.userId || (content.poster || {}).userId : 0;

		// check poster id
		if (posterId && !isNaN(posterId) && posterId > 0) {
			// send ga event
			const sendEventGA = () => {
				// return promise
				return new Promise((resolve) => {
					// send ga event
					analytics.event({
						category: 'video',
						action: 'donate',
						label: (embedded ? 'embedded-' : '') + (viewer && viewer.platform ? viewer.platform : (this.isMobile() ? 'web-mobile' : 'web-desktop'))
					});

					// resolve
					resolve();
				})
			};

			// send events to GA and medal API
			const sendEvents = () => {
				sendEventGA();
			};

			// the end action
			const action = (userId, ip) => {
				// report watch start to mixpanel
				try {
					// set user id
					analytics.setUserId(userId);

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
				action(viewer.userId, await this.resolveIpAddress());
			} else {
				// resolve the user by ip and perform the action
				this.resolvedUserAction(action, sendEvents);
			}
		} else {
			console.log('Invalid content:', content);
		}
	}

	// pad the numbers
	static pad (num) {
		return ("0"+num).slice(-2);
	};

	/**
	 * Time to hh:mm:ss format
	 * @param secs
	 * @returns {string}
	 */
	static hhmmss(secs) {
		// round
		secs = Math.round(secs);

		let minutes = Math.floor(secs / 60);
		secs = secs%60;
		let hours = Math.floor(minutes/60);
		minutes = minutes%60;

		// check hours
		if (hours > 0) {
			return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(secs)}`;
		}

		// return without hours
		return `${this.pad(minutes)}:${this.pad(secs)}`;
	}

	/**
	 * append cache query string value to the url
	 * @param url
	 * @param value
	 */
	static appendCacheQueryString (url, value) {
		// regex pattern for detecting ? character
		let pattern = new RegExp(/\?+/g);

		// has query string
		let hasQueryString = pattern.test(url);

		// return new string
		return url + (hasQueryString ? '&' : '?') + `cache=${value}`
	}
}
