
define( function(require) {
	'use strict';

	var rsvp = require('rsvp');

	var overload = require('agj/function/overload');
	var sequence = require('agj/function/sequence');
	var to = require('agj/to');
	var is = require('agj/is');
	var log = require('agj/utils/log');

	function fromThenable(thenable) {
		return new rsvp.Promise( function (resolve, reject) {
			thenable.then(resolve, reject);
		});
	}

	function fromPath(path) {
		return new rsvp.Promise( function (resolve, reject) {
			path.to( function () {
				resolve(this);
			});
		});
	}

	function fromFn(fn) {
		return new rsvp.Promise( function (resolve, reject) {
			fn( function (e) {
				resolve(e);
			});
		});
	}

	var promisify = overload(
		[[sequence(to.prop('then'), is.fn)], fromThenable],
		[[sequence(to.prop('to'), is.fn)], fromPath],
		[[is.fn], fromFn]
	);

	return promisify;

});
