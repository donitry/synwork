//socket.io.client.js
//
var socket = io.connect('http://localhost', {port:8082});
var t_id = '10046';
socket.on('message', function(data){
	data = document.getElementById("message").innerHTML + "<br>" + data;
	document.getElementById("message").innerHTML = data;
}

socket.on('get_msg', function(data){
	document.getElementById("message").innerHTML = data;
}

function on_load(){
	socket.emit('on_load', t_id);
}

function sub_message(){
	var c = document.getElementById("is_send_message").checked;

	if(c){
		socket.emit('s_message');
	}else{
		socket.emit('u_s_message');
	}
}

function send(){
	var d = new Date();
	var t = '<font color=red>' + d.getTime() + '</font>Say :' + document.getElementById("content").value;
	socket.emit('chat', t);
}



