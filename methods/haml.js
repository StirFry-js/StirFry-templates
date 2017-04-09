const haml = require('haml');

module.exports = function(text, options, callback) {
	try {
		let compiled;
		
		if (options.optimized) {
			compiled = haml.optimize(text);
		}
		else {
			compiled = haml(text);
		}
		return function(options, cb) {
			cb(false, compiled(options));
		};
	}
	catch (e) {
		callback(e);
	}
};