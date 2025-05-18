#!/usr/bin/env python3
from http.server import BaseHTTPRequestHandler, HTTPServer

class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'text/plain')
        self.end_headers()
        self.wfile.write(b'Hello World!\n')

def run_server():
    server_address = ('127.0.0.1', 3000)
    httpd = HTTPServer(server_address, SimpleHTTPRequestHandler)
    print('Listening on 127.0.0.1:3000')
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()
