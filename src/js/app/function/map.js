
define( function(require) {
	'use strict';

	var is = require('agj/is');
	var mapObj = require('agj/object/map');

	function map(fn) {
		return function (obj) {
			if (is.array(obj)) return obj.map(fn);
			else if (is.objectLiteral(obj)) return mapObj(obj, fn);
		};
	}

	return map;

});
