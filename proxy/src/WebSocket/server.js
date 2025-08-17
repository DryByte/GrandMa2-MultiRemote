const ws = require("ws");
const Connection = require("./Connection.js");

class WebSocketServer extends ws.Server {
	constructor() {
		super({
			port: 8080,
		});
		this.connections = new Array(64);

		this.on("connection", this.handleNewConnection);

		this.checkAliveInterval = setInterval(this.pingAll.bind(this), 5000);
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

	pingAll() {
		console.log("Sending websocket ping...");
		for (let connection of this.connections) {
			if (typeof connection == "undefined")
				continue;

			if (connection.isAlive == false) {
				this.handleDisconnect(connection);
				continue;
			}

			console.log("Sending ping to socket:", connection.id);

			connection.isAlive = false;
			connection.socket.ping();
		}
	}

	handleDisconnect(connection) {
		if (typeof connection == "undefined")
			return;

		console.log("Disconnecting socket:", connection.id);

		connection.socket.terminate();
		delete this.connections[connection.id];
	}

	handleNewConnection(socket) {
		console.log("a")

		let id = this.findFreeId();
		if (id < 0) {
			socket.terminate();
			return;
		}

		console.log(`New websocket connection: ${id}`);
		this.connections[id] = new Connection(id, socket);

		this.connections[id].on("commandPacket", this.emit.bind(this, "commandPacket"));
		this.connections[id].on("pluginListRequestPacket", this.emit.bind(this, "pluginListRequestPacket"));
		this.connections[id].on("macroListRequestPacket", this.emit.bind(this, "macroListRequestPacket"));
	}
}

module.exports = WebSocketServer;