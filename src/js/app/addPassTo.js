
define( function(require) {
	'use strict';

	return function () {
		Object.defineProperty(Object.prototype, 'passTo', {
			value: function (actor) {
				return actor(this);
			}
		});
	};

});
