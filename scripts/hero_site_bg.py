"""Punch black studio bg from hero slides and place on site cream #f7f4ef."""

from pathlib import Path
import gc

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "src" / "assets"
CREAM = (247, 244, 239, 255)  # #f7f4ef

# Prefer removebg-quality sources when available; else punch black from current slides
SOURCES = [
    ("hero-slide-1.jpg", "WhatsApp Image 2026-10-27 at 5.19.49 PM.png"),
    ("hero-slide-2.jpg", "WhatsApp Image 2026-10-27 at 5.19.02 PM.png"),
    ("hero-slide-3.jpg", "WhatsApp Image 2026-10-27 at 5.18.15 PM.png"),
]


def punch_black(img: Image.Image, threshold: int = 32) -> Image.Image:
    rgba = np.asarray(img.convert("RGBA")).copy()
    r, g, b, a = rgba[..., 0], rgba[..., 1], rgba[..., 2], rgba[..., 3]
    # Near-black + dark gray studio
    dark = (r < threshold) & (g < threshold) & (b < threshold)
    darkish = (
        (r < 55)
        & (g < 55)
        & (b < 55)
        & (np.abs(r.astype(np.int16) - g) < 14)
        & (np.abs(g.astype(np.int16) - b) < 14)
    )
    rgba[..., 3] = np.where(dark | darkish, 0, a if a.min() < 250 else 255)
    return Image.fromarray(rgba, "RGBA")


def compose(src: Path, out: Path) -> None:
    cut = punch_black(Image.open(src))
    bbox = cut.getbbox()
    if bbox:
        cut = cut.crop(bbox)

    # Canvas slightly larger than product for breathing room
    pad = 48
    w, h = cut.size
    canvas = Image.new("RGBA", (w + pad * 2, h + pad * 2), CREAM)
    canvas.paste(cut, (pad, pad), cut)
    canvas.convert("RGB").save(out, "JPEG", quality=93, optimize=True)
    print(f"  {src.name} -> {out.name} ({out.stat().st_size} bytes)")


def main() -> None:
    for out_name, src_name in SOURCES:
        src = ROOT / src_name
        if not src.exists():
            # fallback to current asset
            src = ASSETS / out_name
        print(f"Processing {out_name} from {src.name}...")
        compose(src, ASSETS / out_name)
        gc.collect()
    print("Done")


if __name__ == "__main__":
    main()
