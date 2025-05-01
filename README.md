## Packets
### Message Packet
GMA <-> Proxy

| ID | length | Message Field |
----------------------
| 0x0 | Text length | String |

### CMD Packet
Proxy -> GMA

| ID | Command |
----------------
| 0x1| String until |

### Plugin List Packet
Proxy -> GMA

| ID |
------
| 0x2|

GMA -> Proxy

| ID | length | List |
----------------------
| 0x2| List length (index) | Plugin list splitted by \0 and ID, Name |

