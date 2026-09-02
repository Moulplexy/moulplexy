from pathlib import Path
import json

ROOT = Path(__file__).resolve().parent
ASSETS = ROOT / "assets"
EXTS = {".jpg",".jpeg",".png",".webp",".jfif",".mp4"}

data = {}
for key in ("plexi","wood","combo"):
    folder = ASSETS / key
    data[key] = [
        {"name": p.name, "url": f"assets/{key}/{p.name}"}
        for p in sorted(folder.iterdir())
        if p.is_file() and p.suffix.lower() in EXTS
    ]

(ROOT / "catalog.json").write_text(
    json.dumps(data, ensure_ascii=False, indent=2),
    encoding="utf-8"
)
print("catalog.json updated.")
