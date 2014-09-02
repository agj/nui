var through = require("through2"),
    jsdom = require("jsdom")

module.exports = function (modules) {

	function replaceModuleP (name) {
		return !modules || (modules.indexOf(name) != -1) 
	}

	function doReplace (html, next) {
		jsdom.env(
			html,
			{
				FetchExternalResources: false,
				ProcessExternalResources: false
			},
			function (err, window) {
				var scripts = window.document.querySelectorAll('script[data-main]')
				;[].slice.call(scripts).forEach(function (s) {
					var module = s.getAttribute('data-main')
					
					if (replaceModuleP(module)) {
						s.src = module + '.js'
						s.removeAttribute('data-main')
					}

				})

				var ret = window.document.innerHTML
				window.close()
				return next(ret)
			}
		)
	}
		
	
	function replaceScripts(file, enc, next) {

		// Do nothing if no contents
		if (file.isNull()) {
			this.push(file)
			return next()
		}

		
		if (file.isStream()) {
			var html = ""
			file.contents.on('data', function (d) {
				html += d
			})
			return file.contents.on('end', function () {
				doReplace(html, function (res) {
					file.contents = through()
					this.push(file)
					file.contents.write(res)
					file.contents.end()
					return next()
				}.bind(this))
			}.bind(this))
		}

		if (file.isBuffer()) {
			return doReplace(file.contents.toString(), function (res) {
				file.contents = new Buffer(res)
				this.push(file)
				return next()
			}.bind(this))
		}
		return next()
	}

	return through.obj(replaceScripts)
};
