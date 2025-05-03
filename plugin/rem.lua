rem_table = {}
rem_table.client = nil
rem_table.plugins = {}

ori_feed = gma.feedback

gma.feedback = function (str)
	ori_feed(str)

	if rem_table.client ~= nil then
		sendMessagePacket(str)
	end
end

function LOG_INFO(str)
	le_log = "[REMOTE INFO] "..str
	gma.echo(le_log)
	gma.feedback(le_log)
end

function loadAllPlugins(min, max)
	local o = gma.show.getobj
	for i=min,max do
		LOG_INFO("Checking Plugin: "..i)
		local handle = o.handle("Plugin "..i);
		if handle ~= nil then
			rem_table.plugins[i] = o.name(handle)
		end
	end
end

function byteToInt(inp)
	local byte1 = string.char(inp >> 24 & 0xff)
	local byte2 = string.char(inp >> 16 & 0xff)
	local byte3 = string.char(inp >> 8 & 0xff)
	local byte4 = string.char(inp & 0xff)

	return byte1..byte2..byte3..byte4
end

-- PROTOCOL PACKETS GMA->proxy
function sendMessagePacket(str)
	local id = string.char(0)

	local size = byteToInt(#str)

	rem_table.client:send(id..size..str..string.char(0))
end

function sendPluginList()
	local buffer = string.char(2)

	local size = 0
	local pl_list = ""
	for k,v in pairs(rem_table.plugins) do
		size = size+1 -- thx lua, i hate ya
		pl_list = pl_list..string.char(k)..v..string.char(0)
	end

	buffer = buffer..string.char(size)..pl_list
	rem_table.client:send(buffer)
end

-- PROTOCOL HANDLER proxy->GMA
function handleMessagePacket()
	local len,e,p = rem_table.client:receive(1)
	LOG_INFO("[REMOTE MESSAGE] "..len:byte())
	local data, e, p = rem_table.client:receive(len:byte())
	LOG_INFO("[REMOTE MESSAGE] "..data)
end

function handlePluginList()
	local byte_1, error, partial = rem_table.client:receive(1)
	local byte_2, error, partial = rem_table.client:receive(1)
	local byte_3, error, partial = rem_table.client:receive(1)
	local byte_4, error, partial = rem_table.client:receive(1)

	local byte1, error, partial = rem_table.client:receive(1)
	local byte2, error, partial = rem_table.client:receive(1)
	local byte3, error, partial = rem_table.client:receive(1)
	local byte4, error, partial = rem_table.client:receive(1)
	loadAllPlugins(byte_1:byte()+byte_2:byte()+byte_3:byte()+byte_4:byte(), byte1:byte()+byte2:byte()+byte3:byte()+byte4:byte())
	sendPluginList()
end

local HANDLE_PACKET_TABLE = {
	[0] = handleMessagePacket,
	[2] = handlePluginList
}

function connect()
	loadAllPlugins(1, 6000)
	local socket = require("socket.core")
	rem_table.client = socket.connect("127.0.0.1", 3000)
	rem_table.client:settimeout(1)

	rem_table.messages_queue = {}

	LOG_INFO("Connected")

	while true do
		gma.sleep(0.5)
		LOG_INFO("waiting message...")
		if rem_table.client == nil then
			break
		end

		local p_id, error, partial = rem_table.client:receive(1)

		if error == "closed" then
			LOG_INFO("Client connection closed by the server")
			break
		end

		if error == "timeout" then
			goto continue
		end

		p_id = p_id:byte()
		gma.echo(HANDLE_PACKET_TABLE[p_id])
		HANDLE_PACKET_TABLE[p_id]()

		--LOG_INFO("Received new message, running"..msg)
		--gma.cmd(msg)

		::continue:: -- what a fucked up language...
	end
end

return connect