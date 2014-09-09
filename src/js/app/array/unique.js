
define( function(require) {
	'use strict';

	function unique(array) {
		return array.filter( function (item, i) {
			return array.indexOf(item) === i;
		});
	}

	return unique;

});
