// import react-ga
import Cookies from './Cookies';
import ElectronCheck from './ElectronCheck';

// is electron
const useUniversalAnalytics = ElectronCheck.isElectron();

// tracking id
const trackingId = 'UA-98208613-7';

// universal-analytics visitor object
let visitor;

// check if is electron
if (useUniversalAnalytics) {
	// universal analytics
	visitor = require('universal-analytics')(trackingId, Cookies.getUUID(), { strictCidFormat : false });
}

export default class analytics {
	static setUserId (userId) {
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
	};

	static event (obj) {
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
	};
}

