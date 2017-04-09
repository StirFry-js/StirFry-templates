const hamlet = require('hamlet').hamlet;

module.exports = function(text, options, callback) {
	try {
		const compiled = hamlet(text);

		return function(data, cb) {
			cb(false, compiled(data));
		};
	}
	catch (e) {
		callback(e);
	}
};