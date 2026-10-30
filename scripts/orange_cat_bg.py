"""Composite category cutouts onto brand-orange backgrounds."""

from pathlib import Path
import gc

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "src" / "assets"
ORANGE = (224, 101, 46, 255)  # brand #E0652E
SIZE = 1024

# Map → source filename in project root
MAPPING = {
    "cat-print.png": "WhatsApp_Image_2026-10-27_at_5.11.32_PM-removebg-preview.png",
    "cat-displays.png": "WhatsApp_Image_2026-10-27_at_5.12.32_PM-removebg-preview.png",
    "cat-awards.png": "WhatsApp_Image_2026-10-27_at_5.12.37_PM-removebg-preview.png",
    "cat-signage.png": "WhatsApp_Image_2026-10-27_at_5.13.26_PM-removebg-preview.png",
    "cat-gifts.png": "WhatsApp Image 2026-10-27 at 5.19.49 PM.png",
    "cat-stickers.png": "WhatsApp_Image_2026-10-27_at_5.14.17_PM-removebg-preview.png",
    # occasions: stationery/gift set with ribbon box (from the 7 tagged set)
    "cat-occasions.png": "WhatsApp_Image_2026-10-27_at_5.14.10_PM-removebg-preview.png",
}


def punch_black(img: Image.Image, threshold: int = 28) -> Image.Image:
    """Treat near-black studio bg as transparent if alpha is fully opaque."""
    rgba = img.convert("RGBA")
    arr = np.asarray(rgba).copy()
    r, g, b, a = arr[..., 0], arr[..., 1], arr[..., 2], arr[..., 3]
    # If image already has useful transparency, keep it; only punch solid black
    if a.min() < 250:
        # Soften leftover black fringe
        blackish = (r < threshold) & (g < threshold) & (b < threshold)
        arr[..., 3] = np.where(blackish & (a > 0), 0, a)
        return Image.fromarray(arr, "RGBA")

    blackish = (r < threshold) & (g < threshold) & (b < threshold)
    # Also dark gray studio (slightly above pure black)
    dark = (r < 45) & (g < 45) & (b < 45) & ((r.astype(np.int16) - g) < 12) & ((g.astype(np.int16) - b) < 12)
    arr[..., 3] = np.where(blackish | dark, 0, 255)
    return Image.fromarray(arr, "RGBA")


def compose(src: Path, out: Path) -> None:
    cut = punch_black(Image.open(src))
    # Trim transparent margins
    bbox = cut.getbbox()
    if bbox:
        cut = cut.crop(bbox)

    canvas = Image.new("RGBA", (SIZE, SIZE), ORANGE)
    # Fit product inside with padding
    pad = int(SIZE * 0.08)
    max_w = SIZE - pad * 2
    max_h = SIZE - pad * 2
    cut.thumbnail((max_w, max_h), Image.Resampling.LANCZOS)
    x = (SIZE - cut.width) // 2
    y = (SIZE - cut.height) // 2
    canvas.paste(cut, (x, y), cut)
    canvas.convert("RGB").save(out, "JPEG", quality=92, optimize=True)
    # Also keep PNG with orange for crisp edges in circles
    png_out = out.with_suffix(".png")
    canvas.save(png_out, "PNG", optimize=True)
    print(f"  {src.name} -> {png_out.name} ({png_out.stat().st_size} bytes)")


def main() -> None:
    ASSETS.mkdir(parents=True, exist_ok=True)
    for out_name, src_name in MAPPING.items():
        src = ROOT / src_name
        if not src.exists():
            print(f"MISSING: {src_name}")
            continue
        print(f"Processing {out_name}...")
        # Write PNG as primary cat asset
        compose(src, ASSETS / out_name.replace(".png", ".jpg"))
        gc.collect()
    print("Done")


if __name__ == "__main__":
    main()
