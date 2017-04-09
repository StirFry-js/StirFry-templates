const ect = require('ect');

module.exports = function(text, options, callback) {
	try {
		const renderer = ect({root: {page: text} });
		
		return function(data, cb) {
			cb(false, renderer.render('page', data));
		};
	}
	catch (e) {
		callback(e);
	}
};