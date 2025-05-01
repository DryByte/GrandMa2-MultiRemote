const TCP = require("./TCP/TCP.js");

const ws = require("ws");

let tcp = new TCP();
let wsServer = new ws.Server({port: 8080});

let conenc = null;

wsServer.on("connection", socket => {
	console.log("webscoket connected");

	socket.on("message", msg => {
		let buf = new Buffer(msg.length+2);
		buf.writeUInt8(0);
		buf.writeUInt8(msg.length, 1);
		msg.copy(buf, 2);

		console.log("sending:",buf);
		//tcp.broadcast(buf);

		let buf2 = new Buffer(1);
		buf2.writeUInt8(2);

		tcp.broadcast(buf2);
	});
});

tcp.listen(3000);