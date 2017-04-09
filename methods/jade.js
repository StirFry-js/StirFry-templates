const jade = require('jade');

module.exports = function(text, options, callback) {
	try {
		const compiled = jade.compile(text, options);
		
		return function(data, cb) {
			cb(false, compiled.render(data));
		};
	}
	catch (e) {
		callback(e);
	}
};