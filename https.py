import http.server
import ssl

server_address = ('', 4443)
httpd = http.server.HTTPServer(server_address, http.server.SimpleHTTPRequestHandler)

httpd.socket = ssl.wrap_socket(
    httpd.socket,
    server_side=True,
    certfile="certificates/my_signed_cert2.pem",
    keyfile="certificates/my_private_key.pem",
    ssl_version=ssl.PROTOCOL_TLS_SERVER,
)
httpd.serve_forever()

