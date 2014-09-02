/**
 * Code by agj - http://www.agj.cl/
 */

requirejs.config({
	baseUrl: 'js/lib',
	paths: {
		'app': '../app',
	},
	shim: {
		'lazy': {
			exports: 'Lazy',
		},
	},
});

require(['app/main']);

