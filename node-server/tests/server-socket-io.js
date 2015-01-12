const redis = require('redis');
var io = require('socket.io').listen(8082);

io.sockets.on('connection',function(socket){
	const redis_obj = redis.createClient(),
	msg_sender = redis.createClient();
	var t_id = 0;

	redis_obj.on("message", function(t_id, message){
		console.log('send one message to ' + t_id);
		socket.emit('message', message);
	});

	socket.on('s_message', function(){
		var get_t_id = this.t_id;
		redis_obj.subscribe(get_t_id);
		console.log('subscribe to ' + get_t_id);
	});

	socket.on('u_s_message', function(){
		var get_t_id = this.t_id;
		redis_obj.unsubscribe(get_t_id);
		console.log('Unsubscribe to ' + get_t_id);
	});

	socket.on('on_load', function(t_id){
		this.t_id = t_id;
		msg_sender.get(t_id, function(err, value){
			if(value != '' && value != null && value != false){
				console.log('On_load get_msg to ' + t_id);
				socket.emit('get_msg', value);
			}
		});
	});

	socket.on('chat', function(msg){
		var get_t_id = this.t_id;
		msg_sender.publish(get_t_id, msg);
		msg_sender.get(get_t_id, function(err, value){
			var all_msg;
			if(value != '' && value != null && value != false){
				all_msg = value + '<br>' + msg;
			}else{
				all_msg = msg;
			}
			msg_sender.set(get_t_id, all_msg, redis.print);
			console.log('Send all msg to ' + get_t_id);
		});
	});

	socket.on('disconnect', function(){
		var get_t_id = this.t_id;
		redis_obj.unsubscribe(get_t_id);
		console.log('When close,unsubscribe to ' + get_t_id);
	});
});
