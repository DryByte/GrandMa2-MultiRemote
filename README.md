## Packets
### Command Packet
GMA <-> Proxy

| ID | length | Message Field |
|----|---------|---------------|
| 0x0 | 4byte BE Text length | String |

### Plugin List Packet
Websocket -> Proxy
| ID |range min  | range max |
|----|------------|-----------|
| 0x2|  4byte BE  | 4 byte BE |

Proxy -> GMA
| ID | WsId |range min  | range max |
|----|--------|------------|-----------|
| 0x2|  uint8 |  4byte BE  | 4 byte BE |

GMA -> Proxy
| ID | WsId |length | List |
|----|--------|--------|--------|
| 0x2| uint8  |List length (index) | Plugin list splitted by \0 and ID, Name |


Proxy -> WebSocket
```json
{
	"id": 2,
	"pluginList": []
}
```