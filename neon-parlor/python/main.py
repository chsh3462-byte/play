"""Run MiniGames offline with Python 3.8+. No packages required for browser mode."""
import os
import sys
import webbrowser
from pathlib import Path


def game_html():
    here = Path(__file__).resolve().parent
    bundled = here / "game.html"
    if bundled.exists():
        return bundled.read_bytes()
    source = here.parent / "web"
    html = (source / "index.html").read_text(encoding="utf-8")
    css = (source / "salon.css").read_text(encoding="utf-8")
    html = html.replace('<link rel="stylesheet" href="salon.css">', "<style>" + css + "</style>")
    for name in ("art", "game", "salon"):
        js = (source / (name + ".js")).read_text(encoding="utf-8")
        html = html.replace(f'<script src="{name}.js"></script>', "<script>" + js + "</script>")
    return html.encode("utf-8")


def main():
    data = Path(os.environ.get("LOCALAPPDATA") or Path.home() / ".local" / "share") / "NeonParlor"
    data.mkdir(parents=True, exist_ok=True)
    page = data / "index.html"
    payload = game_html()
    if not page.exists() or page.read_bytes() != payload:
        temp = page.with_name(f"index-{os.getpid()}.tmp")
        temp.write_bytes(payload)
        temp.replace(page)
    if getattr(sys, "frozen", False):
        import webview
        webview.create_window("미니게임", page.as_uri(), width=1120, height=800,
                              min_size=(540, 560), background_color="#14271f", text_select=False)
        webview.start(gui="edgechromium", private_mode=False, storage_path=str(data / "profile"))
    else:
        if not webbrowser.open(page.as_uri()):
            print("Open this game file in your browser:", page)


if __name__ == "__main__":
    main()

