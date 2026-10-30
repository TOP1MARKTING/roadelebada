from pathlib import Path
from PIL import Image
import numpy as np

base = Path(r"C:\Users\Eng Ahmed\.cursor\projects\d\assets")
out = Path(r"d:\الشغل\رواد الابداع\src\assets")
for name in [
    "image-5267a6fe-40f8-48ba-a935-6aad9d089d78.jpg",
    "image-c178868c-3b62-4d92-aec7-c6a9731f67f3.png",
]:
    p = base / name
    img = Image.open(p).convert("RGB")
    print(name, img.size)
    img.resize((320, 320), Image.Resampling.LANCZOS).save(
        out / f"_preview_{name[:13]}.jpg", quality=80
    )
print("saved previews")
