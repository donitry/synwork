//index.js
//
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var reqs = require('./request.js');

var redis = require("redis"),
	client_pub = redis.createClient(),
	client_sub = redis.createClient();

client_sub.on("error", function(err){
	console.log("Error " + err);
});

var rPubSub = require('rpsc');
rPubSub.init(client_sub);

var socketUser = {};

app.get('/bar/', function(req,res){
	res.sendfile('index.html');
});

//function isEmptyObject(obj) {
//  return !Object.keys(obj).length;
//}

// This should work both there and elsewhere.
function isEmptyObject(obj) {
	for (var key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
	        return false;
		}
    }
	return true;
}

//console.log(client_pub.connected);

io.on('connection', function(socket){
    var cps = rPubSub.createClient();
	cps.onMessage(function(channel, message){
		socket.emit('message', message);
	});
	
	socket.emit('alive', {text:'socketId:'+socket.id});
	socket.on('verify', function(u_verify){
		if(u_verify != ''){
			var post_data = {cookie:u_verify};
			reqs.request('/decrypt-cookie',8081,post_data,function(result){
				if(isEmptyObject(result)){
					socket.join('cool_channel');
					console.log('join cool_channel');
				}else{
					var json = JSON.parse(result);
					socketUser[socket.id] = {'c_id':socket.id,'c_name':json.guestName,'c_channel':json.guestChannel};
					console.log(json.guestName + " In " + socketUser[socket.id].c_channel);
					socket.join(socketUser[socket.id].c_channel);
				}
			});
		}else{
			socket.join('cool_channel');
		}socket.emit('ready', {text:'socketId:'+socket.id});
		client_pub.lrange('chat-msg', 0, 5, function (err,reply){
			console.log(reply.toString());
		});
	});

	console.log('a user connected : ' + socket.id);
//	socket.broadcast.emit('hi');
//	
//	socket.emit('conn',{text:'socketId:'+socket.id});
//
//	socket.on('login', function(data,fn){
//		socketUser[socket.id] = {'c_id':data.c_id,'c_name':data.c_name};
//	});
//
//	client.hgetall("cid:" + cid, function(err,obj){
//		if(obj != null)
//			socket.emit('chat message', JSON.stringify(obj));
//	});
//	
//	socket.on('get chat', function(msg){
//		clien.hgetall('channel
//	}
//
	socket.on('chat message', function(msg){
		var channel = {},
			message = {};

		console.log('message:' + msg);
		if(!isEmptyObject(socketUser)){
			channel = socketUser[socket.id].c_channel;
			message = socketUser[socket.id].c_name + 'Say: ' + msg;
		}else{
			channel = 'cool_channel';
			message = 'Guest[' + socket.id + ']Say: ' + msg;
		}client_pub.lpush('chat-msg', message);
		io.to(channel).emit('chat message', message);
	});

	socket.on('disconnect', function(){
		if(!isEmptyObject(socketUser)){
			socket.leave(socketUser[socket.id].c_channel);
			delete socketUser[socket.id];
			//console.log('socketUser:' + socketUser[socket.id].c_channel);
			console.log('user disconnected : ' + socket.id);
		}else{
			socket.leave('cool_channel');
			console.log('leave cool_channel');
		}
		cps.unsubscribe('cool_channel');
		cps.end();
	});
	cps.subscribe('cool_channel');
});

setTimeout(function(){
	//console.log(client_pub.connected);
	client_pub.publish('cool_channel', 'sweet message!');
},5000);

http.listen(8082, function(){
	console.log('listening on *:8082');
});

