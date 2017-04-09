const handlebars = require('handlebars');

module.exports = function(text, options, callback) {
	try {
		const compiled = handlebars.compile(text, options);

		return function(data, cb) {
			cb(false, compiled(data));
		};
	}
	catch (e) {
		callback(e);
	}
};