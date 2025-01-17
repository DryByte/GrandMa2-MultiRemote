rem_table = {}
rem_table.client = nil

function LOG_INFO(str)
	le_log = "[REMOTE INFO] "..str
	gma.echo(le_log)
	gma.feedback(le_log)
end

function connect()
	local socket = require("socket.core")
	rem_table.client = socket.connect("127.0.0.1", 3000)
	rem_table.client:settimeout(1)

	LOG_INFO("Connected")

	while true do
		gma.sleep(0.5)
		LOG_INFO("waiting message...")
		if rem_table.client == nil then
			break
		end

		local msg, stat = rem_table.client:receive()

		if stat == "closed" then
			LOG_INFO("Client connection closed by the server")
			break
		end

		if stat == "timeout" then
			goto continue
		end

		LOG_INFO("Received new message, running"..msg)
		gma.cmd(msg)

		::continue:: -- what a fucked up language...
	end
end

return connect