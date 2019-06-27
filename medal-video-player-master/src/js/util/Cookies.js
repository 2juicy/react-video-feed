// uuid cookie key
const uuidKey = 'mvp-ua-uuid';
const mutedKey = 'mvp-volume-muted';
const qualityKey = 'mvp-quality';
const volumeKey = 'mvp-volume';

export default class Cookies {

	/**
	 * local vars
	 */
	static uuid = undefined;
	static muted = undefined;
	static quality = undefined;
	static volume = undefined;

	/**
	 * get the cookie for the specified name
	 * @param cname
	 */
	static getCookie (cname) {
		let name = cname + "=";
		let decodedCookie = decodeURIComponent(document.cookie);
		let ca = decodedCookie.split(';');
		for(let i = 0; i <ca.length; i++) {
			let c = ca[i];
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
	static generate () {
		//// return uuid of form xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
		let uuid = '', ii;
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
	static setVolume (volume) {
		// set the cookie
		document.cookie = `${volumeKey}=${volume}`;

		// set the local var
		this.volume = volume;

		// return the value
		return volume;
	}

	/**
	 * get the volume from cookies if exists
	 */
	static getVolume (defaultValue = 0.5) {
		// cookie
		const cookie = this.getCookie(volumeKey);

		// stored uuid
		let value = cookie !== undefined ? cookie : this.volume;

		// check if cookie is defined
		if (value === undefined) {
			// set the uuid
			value = defaultValue;

			// set the cookie
			document.cookie = `${volumeKey}=${value}`;
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
	static setMuted (muted) {
		// set the cookie
		document.cookie = `${mutedKey}=${muted}`;

		// set the local var
		this.muted = muted;

		// return the value
		return muted;
	}

	/**
	 * get the volume from cookies if exists
	 */
	static getMuted (defaultValue = true) {
		// cookie
		const cookie = this.getCookie(mutedKey);

		// stored uuid
		let value = cookie !== undefined ? cookie : this.muted;

		// check if cookie is defined
		if (value === undefined) {
			// set the uuid
			value = defaultValue;

			// set the cookie
			document.cookie = `${mutedKey}=${value}`;
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
	static setQuality (quality) {
		// set the cookie
		document.cookie = `${qualityKey}=${quality}`;

		// set the local var
		this.quality = quality;

		// return the value
		return quality;
	}

	/**
	 * get the volume from cookies if exists
	 */
	static getQuality (defaultValue = 'high') {
		// cookie
		const cookie = this.getCookie(qualityKey);

		// stored uuid
		let value = cookie !== undefined ? cookie : this.quality;

		// check if cookie is defined
		if (value === undefined) {
			// set the uuid
			value = defaultValue;

			// set the cookie
			document.cookie = `${qualityKey}=${value}`;
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
	static getUUID () {
		// cookie
		const cookie = this.getCookie(uuidKey);

		// stored uuid
		let uuid = cookie !== undefined ? cookie : this.uuid;

		// check if cookie is defined
		if (uuid === undefined) {
			// set the uuid
			uuid = this.generate();

			// set the cookie
			document.cookie = `${uuidKey}=${uuid}`;
		}

		// if local uuid not set
		if (this.uuid === undefined || this.uuid !== uuid) {
			// set uuid
			this.uuid = uuid;
		}

		// return the uuid
		return uuid;
	}

}
