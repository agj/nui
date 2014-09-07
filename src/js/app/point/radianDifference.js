
define( function(require) {
	'use strict';

	var tau = Math.PI * 2;

	function radianDifference(ra, rb) {
		var diff = ra > rb ? ra - rb : rb - ra;
		while (diff > Math.PI) diff = Math.abs(diff - tau);
		return diff;
	}

	return radianDifference;

});
