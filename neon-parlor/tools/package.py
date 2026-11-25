"""Build offline web/Python downloads from the same source as GitHub Pages."""
import argparse
import base64
import gzip
import runpy
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

root = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument("destination", type=Path)
dest = parser.parse_args().destination.resolve()
dest.mkdir(parents=True, exist_ok=True)
src = root / "python" / "main.py"
html = runpy.run_path(str(src))["game_html"]()
(dest / "game.html").write_bytes(html)
with ZipFile(dest / "NeonParlor-Web.zip", "w", ZIP_DEFLATED) as archive:
    archive.writestr("index.html", html)
with ZipFile(dest / "NeonParlor-Python.zip", "w", ZIP_DEFLATED) as archive:
    archive.write(src, "main.py")
    archive.writestr("game.html", html)
    archive.write(root / "python" / "README.md", "README.md")
code = src.read_text(encoding="utf-8")
start, end = code.index("def game_html():"), code.index("def main():")
blob = base64.b64encode(gzip.compress(html, mtime=0)).decode("ascii")
embedded = 'def game_html():\n    import base64, gzip\n    return gzip.decompress(base64.b64decode(\n' + ''.join('        b"' + blob[i:i+96] + '"\n' for i in range(0,len(blob),96)) + '    ))\n\n\n'
(dest / "NeonParlor.py").write_text(code[:start]+embedded+code[end:],encoding="utf-8")

