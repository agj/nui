
define( function(require) {
	'use strict';

	var $ = require('jquery');
	var parsePath = require('parse-svg-path');
	var lazy = require('lazy');
	var λ = require('lambda-functional');
	var rsvp = require('rsvp');
	var path = require('path');

	var toArray = require('agj/utils/toArray');
	var log = require('agj/utils/log');
	var partial = require('agj/function/partial');
	var hex = require('agj/number/inBase')(16);

	var when = require('app/when');
	var doDraw = require('app/doDraw');
	var parsePathInstruction = require('app/parsePathInstruction');

	rsvp.on('error', raise);

	when($(document).ready)
	.then(path.listen);

	when(path.map('#/kanji/:id'))
	.then( function (path) {
		var kanji = path.params.id;
		return when($.get('./data/svg/' + hex(kanji.charCodeAt(0), 5) + '.svg'));
	})
	.then( function (svg) {
		return lazy(toArray($(svg).find('path')))
			.map( function (path) {
				return parsePath($(path).attr('d')).map(parsePathInstruction);
			})
			.toArray();
	})
	.then(doDraw($('#game')[0]));

	function raise(err) {
		console.assert(false, err);
	}

});
