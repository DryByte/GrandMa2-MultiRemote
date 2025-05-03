## Packets
### Message Packet
GMA <-> Proxy

| ID | length | Message Field |
| 0x0 | 4byte BE Text length | String |

### CMD Packet
Proxy -> GMA

| ID | Command |
| 0x1| String until |

### Plugin List Packet
Proxy -> GMA

| ID | range min  | range max |
| 0x2|  4byte BE  | 4 byte BE |

GMA -> Proxy

| ID | length | List |
| 0x2| List length (index) | Plugin list splitted by \0 and ID, Name |

