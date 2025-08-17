const EventEmitter = require("events");

class Connection extends EventEmitter {
	constructor(id, socket) {
		super();

		this.socket = socket;
		this.id = id;

		this.isAlive = true;

		this.socket.on("message", this.handleMessage.bind(this));
		this.socket.on("pong", this.handlePong.bind(this));
	}

	handlePong() {
		this.isAlive = true;
	}

	handleMessage(msg) {
		switch (msg[0]) {
			case 0: // command
				{
					let buf = new Buffer(msg.length+2);
					buf.writeUInt8(0);
					buf.writeUInt8(msg.length, 1);
					msg.copy(buf, 2, 1);

					console.log(msg);
					console.log("sending:",buf);

					//tcp.broadcast(buf);
					this.emit("commandPacket", this, buf);
				}

				break;

			case 2: // plugin list
				let buf2 = new Buffer(10);
				buf2.writeUInt8(2);
				buf2.writeUInt8(this.id, 1);
				buf2.writeInt32BE(msg.readInt32BE(1), 2);
				buf2.writeInt32BE(msg.readInt32BE(5), 6);

				this.emit("pluginListRequestPacket", this, buf2);
				break;

			case 3: // macro list
				let buf3 = new Buffer(10);
				buf3.writeUInt8(3);
				buf3.writeUInt8(this.id, 1);
				buf3.writeInt32BE(msg.readInt32BE(1), 2);
				buf3.writeInt32BE(msg.readInt32BE(5), 6);

				this.emit("macroListRequestPacket", this, buf3);
				break;
		}
	}
}

module.exports = Connection;