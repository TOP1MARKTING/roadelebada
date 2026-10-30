"""Remove solid orange studio backgrounds via corner flood-fill + orange floor eat."""

from collections import deque
from pathlib import Path
import gc

import numpy as np
from PIL import Image, ImageFilter

assets = Path(__file__).resolve().parents[1] / "src" / "assets"
files = [
    "cat-print.jpg",
    "cat-stickers.jpg",
    "cat-gifts.jpg",
    "cat-signage.jpg",
    "cat-displays.jpg",
    "cat-occasions.jpg",
    "cat-awards.jpg",
]


def is_orange(r, g, b):
    return (r > 125) & (r > g + 12) & (r > b + 28) & (g > 25) & (b < g + 45) & ((r + g + b) > 160)


def flood_bg_mask(rgb: np.ndarray, tol: float = 55.0) -> np.ndarray:
    h, w, _ = rgb.shape
    visited = np.zeros((h, w), dtype=bool)
    bg = np.zeros((h, w), dtype=bool)
    patches = np.concatenate(
        [
            rgb[:16, :16].reshape(-1, 3),
            rgb[:16, -16:].reshape(-1, 3),
            rgb[-16:, :16].reshape(-1, 3),
            rgb[-16:, -16:].reshape(-1, 3),
        ],
        axis=0,
    )
    ref = np.median(patches, axis=0).astype(np.float32)

    q: deque[tuple[int, int]] = deque()
    for x in range(0, w, max(1, w // 20)):
        for y in (0, h - 1):
            if np.linalg.norm(rgb[y, x] - ref) <= tol + 10:
                visited[y, x] = True
                bg[y, x] = True
                q.append((y, x))
    for y in range(0, h, max(1, h // 20)):
        for x in (0, w - 1):
            if visited[y, x]:
                continue
            if np.linalg.norm(rgb[y, x] - ref) <= tol + 10:
                visited[y, x] = True
                bg[y, x] = True
                q.append((y, x))

    while q:
        y, x = q.popleft()
        for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx]:
                visited[ny, nx] = True
                if np.linalg.norm(rgb[ny, nx] - ref) <= tol:
                    bg[ny, nx] = True
                    q.append((ny, nx))
    return bg


def eat_orange_floor(rgb: np.ndarray, bg: np.ndarray, rounds: int = 20) -> np.ndarray:
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    orange = is_orange(r, g, b)
    mask = bg.copy()
    for _ in range(rounds):
        n = np.zeros_like(mask)
        n[:-1] |= mask[1:]
        n[1:] |= mask[:-1]
        n[:, :-1] |= mask[:, 1:]
        n[:, 1:] |= mask[:, :-1]
        grow = n & orange & ~mask
        if not grow.any():
            break
        mask |= grow
    return mask


def remove_orange_bg(img: Image.Image) -> Image.Image:
    rgb_img = img.convert("RGB")
    # Cap size to save memory
    max_side = 900
    if max(rgb_img.size) > max_side:
        rgb_img.thumbnail((max_side, max_side), Image.Resampling.LANCZOS)

    small = rgb_img.resize(
        (max(1, rgb_img.width // 2), max(1, rgb_img.height // 2)),
        Image.Resampling.BILINEAR,
    )
    rgb_s = np.asarray(small, dtype=np.float32)
    mask_s = eat_orange_floor(rgb_s, flood_bg_mask(rgb_s), rounds=20)
    del rgb_s
    gc.collect()

    mask_img = Image.fromarray((mask_s.astype(np.uint8) * 255), mode="L")
    del mask_s
    mask_img = mask_img.resize(rgb_img.size, Image.Resampling.BILINEAR)
    mask_img = mask_img.filter(ImageFilter.GaussianBlur(radius=1.2))
    mask = np.asarray(mask_img, dtype=np.float32) / 255.0
    del mask_img

    rgba = np.asarray(rgb_img.convert("RGBA"), dtype=np.float32)
    r, g, b = rgba[..., 0], rgba[..., 1], rgba[..., 2]
    orangeish = is_orange(r, g, b)
    alpha = (1.0 - mask) * 255.0
    alpha = np.where(orangeish & (alpha < 230), alpha * 0.1, alpha)
    alpha = np.where(orangeish & (mask > 0.18), 0.0, alpha)
    rgba[..., 3] = np.clip(alpha, 0, 255)
    del mask, alpha
    out = Image.fromarray(rgba.astype(np.uint8), "RGBA")
    del rgba
    gc.collect()
    return out


def main() -> None:
    for name in files:
        src = assets / name
        out = assets / f"{src.stem}.png"
        print(f"Processing {name}...")
        result = remove_orange_bg(Image.open(src))
        bbox = result.getbbox()
        if bbox:
            result = result.crop(bbox)
            pad = 28
            canvas = Image.new("RGBA", (result.width + pad * 2, result.height + pad * 2), (0, 0, 0, 0))
            canvas.paste(result, (pad, pad), result)
            result = canvas
        result.save(out, "PNG", optimize=True)
        print(f"  -> {out.name} ({out.stat().st_size} bytes)")
        del result
        gc.collect()
    print("Done")


if __name__ == "__main__":
    main()
