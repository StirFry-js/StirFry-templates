const dot = require('dot');

module.exports = function(text, options, callback) {
	dot.templateSettings = options;
	
	try {
		const template = dot.template(text);
	
		return function(data, cb) {
			cb(false, template(data));
		};
	}
	catch(e) {
		callback(e);
	}
};