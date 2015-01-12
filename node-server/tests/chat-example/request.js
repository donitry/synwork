exports.request = function(path, port, p_data, callback){
	var http = require('http');
	var post_data = require('querystring').stringify(p_data);
	
	var options = {
		host: 'localhost',
		port: port,
		path: path,
		method: 'POST',
		headers: {
		    'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': post_data.length 
		}
	};
	
	var body='';
	var req = http.request(options, function(res) {
		console.log('STATUS: ' + res.statusCode);
		console.log('HEADERS: ' + JSON.stringify(res.headers));
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			//console.log('BODY: ' + chunk);
			body += chunk;
			//console.log(body);
			callback(body);
		}).on('end', function(){
		});
	});
	
	// write data to request body
	req.write(post_data + "\n");
	req.end();
};
