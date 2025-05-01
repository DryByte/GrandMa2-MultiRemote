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
		//console.log("Message received:",data.toString(), data);

		let pid = data.readUInt8();

		if (pid == 2) {
			let size = data.readUInt8(1);

			let offset = 2;
			for (let i = 0; i < size; i++) {
				let plugin_id = data.readUInt8(offset);

				let str = "";
				for (;;) {
					if (data[offset] == 0)
						break;

					offset += 1;

					str += String.fromCharCode(data[offset]);
				}

				offset += 1;
				console.log("Plugin: ", plugin_id, str);
			}
		} else {
			console.log("hmm");
		}
	}

	sendMessage(msg) {
		console.log("sending???")
		this.socket.write(msg);
	}
}

module.exports = Connection;