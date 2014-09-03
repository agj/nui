
define( function(require) {
	'use strict';

	var $ = require('jquery');
	var lazy = require('lazy');

	var log = require('agj/utils/log');
	var draw = require('agj/graphics/draw');
	var DrawStyle = require('agj/graphics/DrawStyle');


	var pos = { x: 0, y: 0 };

	function doDraw(instructions) {
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

				// lazy([pos]).concat(inst.coords).consecutive(2).each( function (pair) {
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
	}

	function offsetPoint(pa, pb) {
		return {
			x: pa.x + pb.x,
			y: pa.y + pb.y,
		};
	}

	return doDraw;

});
