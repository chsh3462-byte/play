"""Windows launcher for the offline edition of Neon Parlor."""
from pathlib import Path
import os
import webview

if __name__ == "__main__":
    data = Path(os.environ["LOCALAPPDATA"]) / "NeonParlor"
    data.mkdir(exist_ok=True)
    # Keep a stable local origin for the chip wallet across app updates.
    source = Path(__file__).with_name("index.html")
    page = data / "index.html"
    if not page.exists() or page.read_bytes() != source.read_bytes():
        page.write_bytes(source.read_bytes())
    webview.create_window("Neon Parlor", page.as_uri(), width=1120, height=800,
                          min_size=(560, 590), background_color="#0b0e19",
                          text_select=False)
    webview.start(gui="edgechromium", private_mode=False, storage_path=str(data / "profile"))


