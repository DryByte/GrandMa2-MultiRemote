const TCP = require("./TCP/TCP.js");

const ws = require("ws");

let tcp = new TCP();
let wsServer = new ws.Server({port: 8080});

let conenc = null;

wsServer.on("connection", socket => {
	console.log("webscoket connected");

	socket.on("message", msg => {
		msg.writeUInt8(10, msg.length-1);
		console.log("sending:",msg);
		tcp.broadcast(msg);
	});
});

tcp.listen(3000);