from pathlib import Path
import json

ROOT = Path(__file__).resolve().parent
ASSETS = ROOT / "assets"
EXTS = {".jpg",".jpeg",".png",".webp",".jfif"}
FOLDERS = {"plexy":"plexy catalog","wood":"3od catalog","combo":"plexy+3od catalog"}

data = {}
for key, folder_name in FOLDERS.items():
    folder = ASSETS / folder_name
    data[key] = [
        {"name": p.name, "url": f"assets/{folder_name}/{p.name}"}
        for p in sorted(folder.iterdir())
        if p.is_file() and p.suffix.lower() in EXTS
    ]

(ROOT / "catalog.json").write_text(
    json.dumps(data, ensure_ascii=False, indent=2),
    encoding="utf-8"
)
print("catalog.json updated.")
