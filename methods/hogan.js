const hogan = require('hogan');

module.exports = function(text, options, callback) {
	try {
		const compiled = hogan.compile(text);

		return function(data, cb) {
			cb(false, compiled.render(data));
		};
	}
	catch (e) {
		callback(e);
	}
};