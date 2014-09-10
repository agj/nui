
define( function(require) {
	'use strict';

	var absolutizeStrokes     = require('app/stroke/absolutizeStrokes');
	var strokeToBeziers       = require('app/stroke/strokeToBeziers');

	var rawToBeziers = function (strokes) {
		return strokes
			.map(absolutizeStrokes())
			.map(strokeToBeziers);
	};

	return rawToBeziers;

});
