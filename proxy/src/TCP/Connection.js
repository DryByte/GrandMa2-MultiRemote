const EventEmitter = require("events");

class Connection extends EventEmitter {
	constructor(server, socket, id) {
		super();

		this.server = server;
		this.socket = socket;
		this.id = id;

		this.socket.on("data", this.onMessage);
		this.socket.on("close", this.emit.bind(this, "disconnect"));
		this.socket.on("timeout", this.emit.bind(this, "disconnect"));
		this.socket.on("end", this.emit.bind(this, "disconnect"));
	}

	onMessage(data) {
		;;
	}
}

module.exports = Connection;