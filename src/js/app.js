
requirejs.config({
	baseUrl: 'js/lib',
	paths: {
		'app': '../app',
		'path': 'path.min',
	},
	shim: {
		'lazy': {
			exports: 'Lazy',
		},
		'path': {
			exports: 'Path',
		},
	},
});

require(['app/main']);

