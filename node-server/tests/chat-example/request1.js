var http = require('http');
var post_data = {user:"hello",password:"world"};
var opt = {
	host:'localhost',
	port:'80',
	method:'POST',
	path:'/test.php',
	headers:{
		"Content-Type": 'application/x-www-form-urlencoded',  
		"Content-Length": post_data.length 
	}
}

var body = '';
var req = http.request(opt, function(res) {
	console.log("Got response: " + res.statusCode);
	res.on('data',function(d){
		body += d;
	}).on('end', function(){
		console.log(res.headers)
		console.log(body)
	});
}).on('error', function(e) {
	console.log("Got error: " + e.message);
})

req.write(require('querystring').stringify(post_data));
req.end();
