
define( function(require) {
	'use strict';

	require('app/addPassTo')();

	var $         = require('jquery');
	var parsePath = require('parse-svg-path');
	var lazy      = require('lazy');
	var bacon     = require('Bacon');
	var λ         = require('app/lambda');
	var rsvp      = require('rsvp');
	var path      = require('path');

	var toArray  = require('agj/utils/toArray');
	var log      = require('agj/utils/log');
	var partial  = require('agj/function/partial');
	var passThis = require('agj/function/passThis');
	var seq      = require('agj/function/sequence');
	var hex      = require('agj/number/inBase')(16);
	var to       = require('agj/to');
	var on       = require('agj/utils/eventConstants');

	var when                 = require('app/when');
	var doDraw               = require('app/draw/doDraw');
	var map                  = require('app/function/map');
	var parsePathInstruction = require('app/stroke/parsePathInstruction');

	rsvp.on('error', raise);

	when($(document).ready)
	.then(path.listen);

	path.map('#/kanji/:id')
	.to( passThis(function (path) {
		var canvas = $('#game')[0];

		var strokes;

		var kanji = path.params.id;

		when($.get('./data/svg/' + hex(kanji.charCodeAt(0), 5) + '.svg'))
		.then( function (svg) {
			return $(svg).find('path')
				.passTo(toArray)
				.passTo(lazy)
				.map(seq($, to.call('attr', ['d'])))
				.map(parsePath)
				.map(map(parsePathInstruction))
				.toArray();
		})
		.then(doDraw(canvas));

		event($('#game'), on.mouse.move)
		.map(eventToCoords(canvas))
		.onValue(log);
	}));

	function event(target, name) {
		return bacon.fromEventTarget(target, name);
	}

	var eventToCoords = function (el) {
		var pos = $(el).position();
		return function (e) {
			return {
				x: e.pageX - pos.left,
				y: e.pageY - pos.top,
			};
		};
	};


	function raise(err) {
		console.assert(false, err);
	}

});
