const dustjsLinkedin = require('dustjs-linkedin');

module.exports = function(text, options, callback) {
	try {
		const compiled = dustjsLinkedin.compile(text, 'compiled');

		dustjsLinkedin.loadSource(compiled);

		return function(data, cb) {
			dustjsLinkedin.render('compiled', data, function(err, out) {
				cb(err, out);
			});
		};
	}
	catch (e) {
		callback(e);
	}
};