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
		let pid = data.readUInt8();

		switch (pid) {
			case 0:
				{
					let length = data.readInt32BE(1);
					console.log(data);
					console.log("Received message: ", data.toString("utf8", 5, length+5), length);
				}
				break;
			case 2:
				{
					let length = data.readUInt8(1);

					let offset = 2;
					for (let i = 0; i < length; i++) {
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
				}

				break;
		}
	}

	sendMessage(msg) {
		console.log("sending???")
		this.socket.write(msg);
	}
}

module.exports = Connection;