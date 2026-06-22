#!/usr/bin/env python3
"""Build report/PawPaw-World-Report.html with all report media inlined."""
import base64, os, re

ROOT = os.path.join(os.path.dirname(__file__), "..")
REPORT = os.path.join(ROOT, "report")
SRC = os.path.join(REPORT, "index.html")
OUT = os.path.join(REPORT, "PawPaw-World-Report.html")

with open(SRC, encoding="utf-8") as f:
    html = f.read()

MIME = {".jpg": "image/jpeg", ".webm": "video/webm"}

def repl(m):
    rel = m.group(1)
    ext = os.path.splitext(rel)[1].lower()
    with open(os.path.join(REPORT, rel), "rb") as fh:
        b64 = base64.b64encode(fh.read()).decode("ascii")
    return 'src="data:' + MIME[ext] + ';base64,' + b64 + '"'

html = re.sub(r'src="(report-assets/[^"]+\.(?:jpg|webm))"', repl, html)
with open(OUT, "w", encoding="utf-8") as f:
    f.write(html)
print("wrote", OUT, "size", round(len(html)/1024/1024, 2), "MB")
