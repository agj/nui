
define( function(require) {
	'use strict';

	var $ = require('jquery');
	var parsePath = require('parse-svg-path');
	var lazy = require('lazy');
	var λ = require('lambda-functional');
	var rsvp = require('rsvp');

	var toArray = require('agj/utils/toArray');
	var log = require('agj/utils/log');
	var partial = require('agj/function/partial');

	var when = require('app/when');
	var doDraw = require('app/doDraw');
	var parsePathInstruction = require('app/parsePathInstruction');

	rsvp.on('error', raise);

	when($(document).ready)
	.then( function () {
		return when($.get('./data/svg/04e2d.svg'));
	})
	.then( function (result) {
		return lazy(toArray($(result).find('path')))
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
