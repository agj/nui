
define( function(require) {

	var RSVP = require('rsvp');

	var overload = require('agj/function/overload');
	var sequence = require('agj/function/sequence');
	var to = require('agj/to');
	var is = require('agj/is');

	function fromThenable(thenable) {
		return new RSVP.Promise( function (resolve, reject) {
			thenable.then(resolve, reject);
		});
	}

	function fromFn(fn) {
		return new RSVP.Promise( function (resolve, reject) {
			fn( function (e) {
				resolve(e);
			});
		});
	}

	var when = overload(
		[[sequence(to.prop('then'), is.fn)], fromThenable],
		[[is.fn], fromFn]
	);

	return when;

});
