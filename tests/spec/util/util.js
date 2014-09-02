
define( function (require) {

	var is = require('agj/is');
	var toArray = require('agj/utils/toArray');
	var mergeInto = require('agj/object/mergeInto');
	var objMap = require('agj/object/map');

	function checkMethods(methods, checkFn) {
		Object.keys(methods).forEach( function (methodName) {
			var args = methods[methodName];
			describe(methodName, function() {
				if (!is.array(args)) args = [args];
				args.forEach( function (theseArgs) {
					it(theseArgs.description || '(no description)', function () {
						checkFn(methodName, theseArgs);
					});
				});
			});
		});
	}

	function declarator(argsFactory) {
		argsFactory = argsFactory || function () { return {}; };

		var methods = {
			taking: function taking(object) {
				this.object = object;
				return this;
			},
			pass: function pass() {
				this.args = this.args || [];
				this.args = this.args.concat(toArray(arguments));
				return this;
			},
			checkWith: function checkWith(checker) {
				this.checker = checker;
				return this;
			},
			get: function get(result) {
				this.result = result;
				if (is.array(result) || is.objectLiteral(result)) this.loose = true;
				return this;
			},
			becauseIt: function becauseIt(description) {
				this.description = description;
				return this;
			},
		};

		return objMap(generateArgs(), function (fn) {
			if (!is.fn(fn)) return fn;
			return wrapFirst(fn);
		});

		function generateArgs() {
			var params = argsFactory();
			Object.keys(methods).forEach( function (name) {
				if (!params[name]) params[name] = methods[name];
			});
			return params;
		}
		function wrapFirst(fn) {
			return function () {
				return fn.apply(generateArgs(), arguments);
			};
		}
	}

	function pass(argsFactory, chainObjectModifier) {
		chainObjectModifier = chainObjectModifier || function (o) { return o; };
		return function () {
			var params = argsFactory ? argsFactory() : {};
			params.args = (params.args || []).concat( toArray(arguments) );
			return chainObjectModifier({
				params: params,
				get: function (result) {
					params.result = result;
					if (is.array(result) || is.objectLiteral(result)) params.loose = true;
					return params;
				},
				checkWith: function (checker) {
					params.checker = checker;
					return this;
				}
			});
		};
	}

	return {
		checkMethods: checkMethods,
		pass: pass,
		declarator: declarator
	};

});
