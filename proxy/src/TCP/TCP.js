const { Server } = require("net");
const TCPConnection = require("./Connection.js");

class TCP extends Server {
	constructor(op, cl){
		super(op, cl);

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

	broadcast(msg) {
		for (let connection of this.connections) {
			if (!connection || typeof connection == "undefined")
				continue;

			connection.sendMessage(msg);
		}
	}

	sendMessage(id, msg) {
		if (id >= this.connections.length || !this.connections[id] || this.connections[id] == "undefined")
			return;

		if (this.connections[id].id != id)
			return;

		this.connections[id].sendMessage(msg);
	}

	handleNewConnection(socket) {
		let id = this.findFreeId();
		if (id < 0) {
			socket.destroy();
			return;
		}

		let soc = new TCPConnection(this, socket, id);
		this.connections[id] = soc;

		soc.on("disconnect", this.handleSocketDisconnect);
	}

	handleSocketDisconnect() {
		// our context here is a connection
		this.socket.destroy() // just to make sure its disconnected
		delete this.server.connections[this.id];
	}
}

module.exports = TCP;