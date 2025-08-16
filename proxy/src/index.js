const TCP = require("./TCP/TCP.js"),
	  WebSocketServer = require("./WebSocket/server.js");

const tcp = new TCP(),
	  wss = new WebSocketServer();


tcp.on("pluginListResponse", (connectionId, pluginList) => {
	// should we change it to byte buffer????
	console.log("sending plugin list", connectionId, pluginList);
	wss.connections[connectionId].socket.send(JSON.stringify({id: 2, pluginList}));
});

wss.on("commandPacket", (connection, buffer) => {
	tcp.broadcast(buffer);
});

wss.on("pluginListRequestPacket", (connection, buffer) => {
	console.log("puta",buffer);
	tcp.broadcast(buffer);
});

tcp.listen(3000);