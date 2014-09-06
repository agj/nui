
define( function (require) {
	'use strict';

	var lazy = require('lazy');
	var λ = require('lambda');

	var first = require('agj/array/first');
	var last = require('agj/array/last');
	var tail = last(-1);

	function parsePathInstruction(pieces) {
		var command = first(pieces);
		return {
			command: command.toLowerCase(),
			absolute: /[A-Z]/.test(command),
			coords: lazy(tail(pieces)).chunk(2).map(λ('xy -> { x: xy[0], y: xy[1] }')).toArray(),
		};
	}

	return parsePathInstruction;

});
