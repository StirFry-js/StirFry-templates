const dust = require('dust');

module.exports = function(text, options, callback) {
	try {
		const compiled = dust.compile(text, 'compiled');

		dust.loadSource(compiled);

		return function(data, cb) {
			dust.render('compiled', data, function(err, out) {
				cb(err, out);
			});
		};
	}
	catch(e) {
		callback(e);
	}
};