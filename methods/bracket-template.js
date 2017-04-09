const bracket = require('bracket-template');

module.exports = function(text, options, callback) {
	try {
		const template = bracket.compile(text, options);

		return function(data, cb) {
			cb(false, template(data));
		};
	}
	catch(e) {
		callback(e);
	}
};