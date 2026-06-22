#!/usr/bin/env python3
"""Receives canvas screenshots and gameplay clips from the running game
and writes them to report/report-assets/. Body: "filename|<base64 or data-URI>".
If the name has an extension it is used as-is, else .jpg is appended."""
import base64, os
from http.server import BaseHTTPRequestHandler, HTTPServer

OUT = os.path.join(os.path.dirname(__file__), "..", "report", "report-assets")
os.makedirs(OUT, exist_ok=True)

class H(BaseHTTPRequestHandler):
    def _cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "*")

    def do_OPTIONS(self):
        self.send_response(200); self._cors(); self.end_headers()

    def do_POST(self):
        n = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(n).decode("utf-8", "replace")
        name, _, data = raw.partition("|")
        if "," in data and data[:5] == "data:":
            data = data.split(",", 1)[1]
        fname = name if "." in os.path.basename(name) else name + ".jpg"
        path = os.path.join(OUT, fname)
        with open(path, "wb") as f:
            f.write(base64.b64decode(data))
        self.send_response(200); self._cors(); self.end_headers()
        self.wfile.write(b"ok")
        print("saved", fname, len(data))

    def log_message(self, *a):
        pass

if __name__ == "__main__":
    HTTPServer(("127.0.0.1", 8000), H).serve_forever()
