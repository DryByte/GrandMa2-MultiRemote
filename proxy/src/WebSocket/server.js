const ws = require("ws");
const Connection = require("./Connection.js");

class WebSocketServer extends ws.Server {
	constructor() {
		super({
			port: 8080,
		});
		this.connections = new Array(64);

		this.on("connection", this.handleNewConnection);
	}

	findFreeId() {
		let id = 0
		for (let e of this.connections) {
			if (typeof e == "undefined")
				break;
			id += 1;
		}

		if (id >= this.connections.length)
			id = -1;

		return id;
	}

	handleNewConnection(socket) {
		console.log("a")

		let id = this.findFreeId();
		if (id < 0) {
			console.log("az")
			socket.terminate();
			return;
		}

		this.connections[id] = new Connection(id, socket);

		this.connections[id].on("commandPacket", this.emit.bind(this, "commandPacket"));
		this.connections[id].on("pluginListRequestPacket", this.emit.bind(this, "pluginListRequestPacket"));
	}
}

module.exports = WebSocketServer;