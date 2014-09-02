
define( function(require) {

	var $ = require('jquery');
	var parsePath = require('parse-svg-path');
	var Lazy = require('lazy');
	var λ = require('lambda-functional');
	var RSVP = require('rsvp');

	var toArray = require('agj/utils/toArray');
	var log = require('agj/utils/log');
	var first = require('agj/array/first');
	var last = require('agj/array/last');
	var tail = last(-1);
	var draw = require('agj/graphics/draw');
	var DrawStyle = require('agj/graphics/DrawStyle');

	var when = require('app/when');

	function parsePathInstruction(pieces) {
		var command = first(pieces);
		return {
			command: command.toLowerCase(),
			absolute: /[A-Z]/.test(command),
			coords: Lazy(tail(pieces)).chunk(2).map(λ('xy -> { x: xy[0], y: xy[1] }')).toArray(),
		};
	}

	var doDraw = (function () {
		var pos = { x: 0, y: 0 };

		return function (instructions) {
			log('doDraw', instructions);
			var canvas = $('#game')[0];
			var ctx = canvas.getContext('2d');
			var style = DrawStyle.makeLineStyle(0x000000, 3);
			instructions.forEach( function (inst) {
				if (inst.command === 'm') {
					pos = inst.absolute ? inst.coords[0] : offsetPoint(pos, inst.coords[0]);
				} else if (inst.command === 'c') {
					var a = pos;
					var b = inst.coords[2];
					if (!inst.absolute) b = offsetPoint(b, pos);

					draw.line(ctx, style, a.x, a.y, b.x, b.y);

					pos = b;

					// Lazy([pos]).concat(inst.coords).consecutive(2).each( function (pair) {
					// 	var a = pair[0];
					// 	var b = pair[1];
					// 	if (!inst.absolute) {
					// 		a = offsetPoint(a, pos);
					// 		b = offsetPoint(b, pos);
					// 	}
					// 	draw.line(ctx, style, a.x, a.y, b.x, b.y);
					// 	log(a, '->', b);
					// });
				}
			});
		};
	})();

	function offsetPoint(pa, pb) {
		return {
			x: pa.x + pb.x,
			y: pa.y + pb.y,
		};
	}

	/////

	when($(document).ready)
		.then( function () {
			return when($.get('./data/svg/04e2d.svg'));

		}).then( function (result) {
			return Lazy(toArray($(result).find('path')))
				.map( function (path) {
					return parsePath($(path).attr('d')).map(parsePathInstruction);
				})
				.flatten();
				
		}).then(doDraw);


});
