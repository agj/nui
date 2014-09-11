
define( function (require) {
	'use strict';

	var $            = require('jquery');
	var lazy = require('lazy');
	var parseSVGPath = require('parse-svg-path');

	var toArray = require('agj/utils/toArray');
	var map     = require('app/function/map');
	var seq     = require('agj/function/sequence');
	var to      = require('agj/to');

	var parsePathInstruction = require('app/stroke/parsePathInstruction');

	function svgToStrokes(svg) {
		return $(svg).find('path')
			.passTo(toArray)
			.passTo(lazy)
			.map(seq($, to.call('attr', ['d'])))
			.map(parseSVGPath)
			.map(map(parsePathInstruction))
			.toArray();
	}

	return svgToStrokes;

});
