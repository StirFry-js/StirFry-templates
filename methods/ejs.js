const ejs = require('ejs');

module.exports = function(text, options, callback) {
	try {
		const renderer = ejs.compile(text, options);
		
		return function(data, cb) {
			cb(false, renderer(data));
		};
	}
	catch (e) {
		callback(e);
	}
};