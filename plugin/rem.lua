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

function loadPlugins(min, max)
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

function sendPluginList(user_id, min, max)
	local buffer = string.char(2)

	local size = 0
	local pl_list = ""
	for k,v in pairs(rem_table.plugins) do
		if k >= min and k <= max then
			size = size+1 -- thx lua, i hate ya
			pl_list = pl_list..string.char(k)..v..string.char(0)
		end
	end

	buffer = buffer..user_id
	buffer = buffer..string.char(size)..pl_list
	rem_table.client:send(buffer)
end

-- PROTOCOL HANDLER proxy->GMA
function handleCommandPacket()
	local len,e,p = rem_table.client:receive(1)
	LOG_INFO("[REMOTE MESSAGE] "..len:byte())
	local data, e, p = rem_table.client:receive(len:byte())
	LOG_INFO("[REMOTE MESSAGE] "..data)
	gma.cmd(data)
end

function handlePluginList()
	local user_id, error, partial = rem_table.client:receive(1)

	local byte_1, error, partial = rem_table.client:receive(1)
	local byte_2, error, partial = rem_table.client:receive(1)
	local byte_3, error, partial = rem_table.client:receive(1)
	local byte_4, error, partial = rem_table.client:receive(1)
	local minrange = (byte_1:byte() << 24) | (byte_2:byte() << 16) | (byte_3:byte() << 8) | byte_4:byte()

	byte_1, error, partial = rem_table.client:receive(1)
	byte_2, error, partial = rem_table.client:receive(1)
	byte_3, error, partial = rem_table.client:receive(1)
	byte_4, error, partial = rem_table.client:receive(1)
	local maxrange = (byte_1:byte() << 24) | (byte_2:byte() << 16) | (byte_3:byte() << 8) | byte_4:byte()

	loadPlugins(minrange, maxrange)
	sendPluginList(user_id, minrange, maxrange)
end

local HANDLE_PACKET_TABLE = {
	[0] = handleCommandPacket,
	[2] = handlePluginList
}

function connect()
	--loadPlugins(1, 6000)
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

		::continue:: -- what a fucked up language...
	end
end

return connect