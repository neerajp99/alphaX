import socket
import json

abc = ["c", "b"]

HOST, PORT = "127.0.0.1", 9090
data = " ".join(abc)

# Create a socket (SOCK_STREAM means a TCP socket)
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
    sock.connect((HOST, PORT))
    tosend = {"no_legs": 4,
              "Legs": [
                  {'underlying': 'banknifty', 'expiry': '26dec2019', 'quantity': 1,
                      'opt_type': 'C', 'strike': 32200, 'price': 300.85},
                  {'underlying': 'banknifty', 'expiry': '26dec2019', 'quantity': 1,
                      'opt_type': 'P', 'strike': 32200, 'price': 167.90},
                  {'underlying': 'banknifty', 'expiry': '26dec2019', 'quantity': 2,
                      'opt_type': 'P', 'strike': 31300, 'price': 18.20},
                  {'underlying': 'banknifty', 'expiry': '26dec2019', 'quantity': -
                      3, 'opt_type': 'P', 'strike': 30900, 'price': 10.00},
              ],
              "net_credit_debit": 0
              }
    print("Example JSON sent : \n", json.dumps(tosend), "\n----")
    sock.sendall(bytes(json.dumps(tosend), "utf-8"))
    received = ""
    while(True):
        try:
            curr = str(sock.recv(1024), "utf-8")
            received = received + curr
            if(curr == ""):
                break
        except:
            break
    print(json.loads(received))
