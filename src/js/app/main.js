
define(function(require) {

	var $ = require('jquery');

	var toArray = require('agj/utils/toArray');
	var log = require('agj/utils/log');
	var parsePath = require('parse-svg-path');
	var first = require('agj/array/first');
	var last = require('agj/array/last');
	var tail = last(-1);

	$(document).ready( function () {
		var canvas = $('#game');

		$.get('./data/svg/04e2d.svg')
			.then( function (result) {
				$(result).find('path').each( function (i, path) {
					var parsed = parsePath($(path).attr('d'));
					log(parsed);
					parsed.forEach(draw);
				});
			});
	});

	function draw(pieces) {
		var command = first(pieces);
		var coords = tail(pieces);
	}

	
	return r.push(first(2));

});
