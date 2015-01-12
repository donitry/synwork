var http = require('http');   
function start() {  
      http.createServer(function(request, response) {  
	  console.log('request received');  
	  response.writeHead(200, {'Content-Type' : 'text/plain'});  
	  response.write('hello node');  
	  response.end();  
 }).listen(8888);  
}  
exports.start = start;  
console.log('server has started'); 
