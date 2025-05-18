#!/usr/bin/env python3
import http.server
import socketserver
import os

PORT = 8081  # Changed from 8080 to avoid port conflict
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        return super().end_headers()
        
    def guess_type(self, path):
        # Set correct MIME types for JavaScript modules
        if path.endswith('.js'):
            return 'application/javascript'
        if path.endswith('.mjs'):
            return 'application/javascript'
        if path.endswith('.ts') or path.endswith('.tsx'):
            return 'application/javascript'
        if path.endswith('.jsx'):
            return 'application/javascript'
        return super().guess_type(path)

print(f"Starting server at http://127.0.0.1:{PORT}")
print(f"Serving files from: {DIRECTORY}")
print("Note: This is a simple static file server and won't process React/Vite properly")
print("Press Ctrl+C to stop the server")

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
