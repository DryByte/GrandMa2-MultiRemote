function disconnect()
	rem_table.client:close()
	rem_table.client = nil

	LOG_INFO("Connection closed by the client")
end

return disconnect