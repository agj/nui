
define( function(require) {
	'use strict';

	function add(pa, pb) {
		return {
			x: pa.x + pb.x,
			y: pa.y + pb.y,
		};
	}

	return add;

});
