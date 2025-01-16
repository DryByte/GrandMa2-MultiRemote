const { Server } = require("net");
const TCPConnection = require("./Connection.js");

class TCP extends Server {
	constructor(op, cl){
		super(op, cl);

		this.connections = [];

		this.on("connection", this.handleNewConnection);
	}

	handleNewConnection(socket) {
		let soc = new TCPConnection(this, socket);
		this.connections.push(soc);

		soc.on("disconnect", this.handleSocketDisconnect);
	}

	handleSocketDisconnect() {
		console.log(this);
	}
}

module.exports = TCP;