const TCP = require("./TCP/TCP.js"),
	  WebSocketServer = require("./WebSocket/server.js");

const tcp = new TCP(),
	  wss = new WebSocketServer();


tcp.on("pluginListResponse", (connectionId, pluginList) => {
	// should we change it to byte buffer????
	if (typeof wss.connections[connectionId] == "undefined")
		return;

	console.log("sending plugin list", connectionId, pluginList);
	wss.connections[connectionId].socket.send(JSON.stringify({id: 2, pluginList}));
});

tcp.on("macroListResponse", (connectionId, macroList) => {
	// should we change it to byte buffer????
	if (typeof wss.connections[connectionId] == "undefined")
		return;

	console.log("sending macro list", connectionId, macroList);
	wss.connections[connectionId].socket.send(JSON.stringify({id: 3, macroList}));
});

wss.on("commandPacket", (connection, buffer) => {
	tcp.broadcast(buffer);
});

wss.on("pluginListRequestPacket", (connection, buffer) => {
	tcp.broadcast(buffer);
});

wss.on("macroListRequestPacket", (connection, buffer) => {
	tcp.broadcast(buffer);
});

tcp.listen(3000);