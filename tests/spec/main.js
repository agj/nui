
requirejs.config({
	baseUrl: './spec/',
	paths: {
		'lib': '../lib',
		'agj': '../../src/agj',
		'rsvp': '../lib/rsvp',
		signals: '../lib/signals',
		jasmine: '../lib/jasmine-2.0.0/jasmine',
		jasmineHtml: '../lib/jasmine-2.0.0/jasmine-html',
		jasmineBoot: '../lib/jasmine-2.0.0/boot',
		// blanket: '../lib/blanket_jasmine',
	},
	shim: {
		jasmine: {
			exports: 'jasmine',
		},
		jasmineHtml: {
			deps: ['jasmine'],
			exports: 'jasmine',
		},
		jasmineBoot: {
			deps: ['jasmine', 'jasmineHtml'],
			exports: 'jasmine',
		},
	},
});

require(['agj/utils/requireSequentially', 'jasmineBoot'], function (requireSequentially, jasmine) {
	'use strict';

	requireSequentially(
		// specs...

	).then(window.onload);

});
