'use strict';

const engineNames = {
	"bracket": "bracket-template",
	"dot": "dot",
	"dust": "dust",
	"dustjs-linkedin": "dustjs-linkedin",
	"ect": "ect",
	"ejs": "ejs",
	"haml": "haml",
	"hamlet": "hamlet",
	"handlebars": "handlebars",
	"hogan": "hogan",
	"jade": "jade",
	"jsrender": "jsrender",
	"jtemplate": "jtemplate",
	"marked": "marked",
	"marko": "marko",
	"markup-js": "markup-js",
	"mote": "mote",
	"mustache": "mustache",
	"nunjucks": "nunjucks",
	"plates": "plates",
	"pope": "pope",
	"pug": "pug",
	"pure": "pure",
	"rendy": "rendy",
	"riot-tmpl": "riot-tmpl",
	"shaven": "shaven",
	"shopify-liquid": "shopify-liquid",
	"sizlate": "sizlate",
	"swig": "swig",
	"template7": "template7",
	"transparency": "transparency",
	"underscore": "underscore",
	"xtemplate": "xtemplate"
};

/**
 * The base class for Rendered.
 * @param {string|array} type - The types that are included in this rendering engine.
 * @class
 */
function Rendered(type = 'html') {
	this.types = {};
	if (Array.isArray(type)) {
		for (let i = 0; i < type.length; i++) {
			this.addType(type[i]);
		}
		this.defaultType = type[0] || 'html';
	}
	else {
		this.addType(type);
		this.defaultType = type || 'html';
	}
}

function levenshteinDistance(s, t) {
	if (!s.length) return t.length;
	if (!t.length) return s.length;

	return Math.min(
		levenshteinDistance(s.substr(1), t) + 1,
		levenshteinDistance(t.substr(1), s) + 1,
		levenshteinDistance(s.substr(1), t.substr(1)) + (s[0] !== t[0] ? 1 : 0)
    ) + 1;
}

/**
 * The function to use when adding a type, does spell checking and loads files for templating engines.
 * 
 * @param {string} type - The name of the templating engine to use
 * @param {function} method - The method to use if it is a custom templating engine
 * @param {boolean} custom - Optional, whether or not it is custom. It should automatically detect by whether or not there is a method though.
 * @returns {void}
 */
Rendered.prototype.addType = function(type, method, custom = false) {
	if (!custom && engineNames[type] && method == undefined) {
		try {
			require.resolve(engineNames[type]);
		}
		catch(e) {
			throw new Error(type + " is not installed. Run `npm install --save " + engineNames[type] + " to install it");
		}

		this.types[type] = require('methods/' + type);
	}
	else if (!engineNames[type] && !custom && method == undefined) {
		let output = 'There is no engine of the name ' + type + ' did you mean ';
		let min = Infinity;
		let minName = '';

		for (const i in engineNames) {
			const dist = levenshteinDistance(i);

			if (dist < min) {
				minName = i;
				min = dist;
			}
		}
		output += minName;
		throw output;
	}
	else {
		this.types[type] = method;
	}
};

/**
 * Renders the inputted text with the given renderer. If there is none it will use the default renderer.
 * @param {string} renderer - The name of the renderer to use
 * @param {string} text - The text to render it with
 * @param {object} data - The data to render with
 * @param {callback} callback - The callback, gets called with (err, text) where err is an error, and text is the rendered text.
 * @param {object} options - The options to use with the renderer.
 * 
 * @returns {Promise} Only returns this if no callback is specified
 */
Rendered.prototype.render = function(renderer, text, data, callback, options) {
	if (typeof text == 'object' || renderer == undefined || typeof renderer != 'string') {
		callback = data;
		data = text;
		text = renderer;
		renderer = this.defaultType;
	}
	if (callback == undefined || typeof callback == "object") {
		return new Promise(function(resolve, reject) {
			this.renderer(text, data, function(err, text) {
				if (err) return reject(err);
				resolve(text);
			}, options);
		});
	}
	else {
		this.renderer(text, data, callback, options);
	}
};

/**
 * Renders the inputted text with the given renderer. If there is none it will use the default renderer.
 * @param {string} renderer - The name of the renderer to use
 * @param {object} text - The data to render with
 * @param {object} options - The options to use with the renderer.
 * 
 * @returns {Promise} Only returns this if no callback is specified
 */
Rendered.prototype.compile = function(renderer, text, options) {
	if (text == undefined || typeof text != 'string') {
		text = renderer;
		options = text;
		renderer = this.defaultType;
	}
	this.renderer = this.types[renderer](text, options);
	return this.renderer;
};

module.exports = Rendered;