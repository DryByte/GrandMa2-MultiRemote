const EventEmitter = require("events");

class Connection extends EventEmitter {
	constructor(server, socket, id) {
		super();

		this.server = server;
		this.socket = socket;
		this.id = id;

		this.socket.on("data", this.onMessage.bind(this));
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
					let userId = data.readUInt8(1);
					let length = data.readUInt8(2);
					let offset = 3;
					let pluginList = [];
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

						pluginList.push({id: plugin_id, name: str});
					}

					this.emit("pluginListResponse", userId, pluginList);
				}

				break;

			case 3:
				{
					let userId = data.readUInt8(1);
					let length = data.readUInt8(2);
					let offset = 3;
					let macroList = [];
					for (let i = 0; i < length; i++) {
						let macro_id = data.readUInt8(offset);

						let str = "";
						for (;;) {
							if (data[offset] == 0)
								break;

							offset += 1;

							str += String.fromCharCode(data[offset]);
						}

						offset += 1;
						console.log("Macro: ", macro_id, str);

						macroList.push({id: macro_id, name: str});
					}

					this.emit("macroListResponse", userId, macroList);
				}

				break;
		}
	}

	sendMessage(msg) {
		this.socket.write(msg);
	}
}

module.exports = Connection;