class RemoteProtocol {
	constructor(ip, port) {
		this.ws = new WebSocket(`ws://${ip}:${port}`);

		this.ws.onmessage = this.packetHandler.bind(this);
	}

	packetHandler(event) {
		let ev_obj = JSON.parse(event.data);
		switch(ev_obj.id) {
			case 2:
				this.onPluginListResponse(ev_obj.pluginList);
				break;
			case 3:
				this.onMacroListResponse(ev_obj.macroList);
				break;
		}
	}

	onPluginListResponse(pluginList){};
	onMacroListResponse(macroList){};

	sendCommandPacket(command) {
		const cmdBuffer = new Int8Array(1+command.length);
		const txtEncoder = new TextEncoder();
		cmdBuffer[0] = 0;

		cmdBuffer.set(txtEncoder.encode(command), 1);
		this.ws.send(cmdBuffer)
	}

	sendPluginListRequest(rangemin, rangemax) {
		const plListBuffer = new Int8Array(9);
		plListBuffer[0] = 2;

		plListBuffer[1] = rangemin>>24&255
		plListBuffer[2] = rangemin>>16&255
		plListBuffer[3] = rangemin>>8&255;
		plListBuffer[4] = rangemin&255;

		plListBuffer[5] = rangemax>>24&255
		plListBuffer[6] = rangemax>>16&255
		plListBuffer[7] = rangemax>>8&255;
		plListBuffer[8] = rangemax&255;

		this.ws.send(plListBuffer);
	}

	sendMacroListRequest(rangemin, rangemax) {
		const macroListBuffer = new Int8Array(9);
		macroListBuffer[0] = 3;

		macroListBuffer[1] = rangemin>>24&255
		macroListBuffer[2] = rangemin>>16&255
		macroListBuffer[3] = rangemin>>8&255;
		macroListBuffer[4] = rangemin&255;

		macroListBuffer[5] = rangemax>>24&255
		macroListBuffer[6] = rangemax>>16&255
		macroListBuffer[7] = rangemax>>8&255;
		macroListBuffer[8] = rangemax&255;

		this.ws.send(macroListBuffer);
	}
}