var http = require('http'),
	director = require('director'),
	fs = require('fs'),
	url = require('url'),
	path = require('path'),
	mime = require('mime'),
	sendFileNotFound = function(res){
		res.writeHead(404, {
			'Content-Type': 'text/plain'
		});
		res.write('404 - File Not Found\n');
		res.end();
		return;
	};
var index = function () {
    this.res.writeHead(200, { 'Content-Type': 'text/html' });

	fs.readFile('./public/index.html', 'binary', function (err, file) {
		if (err) {
			this.res.writeHead(500, {
				'Content-Type': 'text/plain'
			});
			this.res.write(err + '\n');
			this.res.end();
			return;
		}

 
		this.res.write(file, 'binary');
		this.res.end();
	}.bind(this));
};
var noRoute = function () {
	var uri = url.parse(this.req.url).pathname;
	console.log(uri);
	var filename = path.join('public', uri); 
	fs.exists(filename, function (exists) { 
		if (!exists) {
			console.log('no exist');
			return sendFileNotFound(this.res);
		}
		if (fs.statSync(filename).isDirectory()) {
			filename = path.join(filename, config.filename);
			if(!fs.existsSync(filename)){
				return sendFileNotFound(this.res);
			}
		}

		fs.readFile(filename, 'binary', function (err, file) {
			if (err) {
				this.res.writeHead(500, {
					'Content-Type': 'text/plain'
				});
				this.res.write(err + '\n');
				this.res.end();
				return;
			}

			var type = mime.lookup(filename);
			this.res.writeHead(200, {
				'Content-Type': type
			});
			this.res.write(file, 'binary');
			this.res.end();
		}.bind(this));
	}.bind(this));
}
var router = new director.http.Router({
    '/': {
      get: index
    }
}).configure({notfound: noRoute});


var server = http.createServer(function (req, res) {
	router.dispatch(req, res, function (err) {
		if (err) {
			res.writeHead(404);
			res.end();
		}
	});
});

  //
  // You can also do ad-hoc routing, similar to `journey` or `express`.
  // This can be done with a string or a regexp.
  //
  //router.get('/bonjour', helloWorld);
  //router.get(/hola/, helloWorld);

  //
  // set the server to listen on port `8080`.
  //
  server.listen(4567);