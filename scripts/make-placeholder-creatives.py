#!/usr/bin/env python3
"""Stand-in hero creatives.

The PRD's three supplied campaign images were not available when the site was
built. This renders labelled placeholders with the same filenames, sizes and
visible campaign copy so the experiment, layout, and loading behaviour can be
verified. Drop the real PNGs over these files; nothing else changes.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "marketing" / "launch-anapp-now"
FONTS = ROOT / "node_modules" / "geist" / "dist" / "fonts" / "geist-sans"
W, H = 1600, 1200

NAVY, BLUE, YELLOW, ORANGE, PAPER, CHAR = "#0a1230", "#2b6fe0", "#ffd23f", "#ff7a1a", "#f6f2ea", "#141414"

CREATIVES = [
    ("creative-a-fish-builder.png", PAPER, NAVY, ORANGE, ["YOU DESCRIBE", "THE IDEA.", "WE HANDLE", "THE BUILD."], "launch.anapp.now", "A · fish builder"),
    ("creative-b-phone-rocket.png", YELLOW, CHAR, "#ffffff", ["SHIP", "YOUR APP", "IDEA."], "LAUNCH.ANAPP.NOW", "B · phone + rocket"),
    ("creative-c-fish-no-code.png", CHAR, PAPER, BLUE, ["FROM IDEA", "TO APP —", "WITHOUT", "LEARNING", "TO CODE."], "launch.anapp.now", "C · fish, no code"),
]


def font(name, size):
    return ImageFont.truetype(str(FONTS / name), size)


def fish(draw, cx, cy, r, body, eye):
    # Simple anchovy silhouette so the placeholder reads as the mascot slot.
    draw.ellipse((cx - r * 1.6, cy - r * 0.8, cx + r * 1.2, cy + r * 0.8), fill=body)
    draw.polygon([(cx + r * 1.0, cy), (cx + r * 1.9, cy - r * 0.9), (cx + r * 1.9, cy + r * 0.9)], fill=body)
    draw.ellipse((cx - r * 1.1, cy - r * 0.35, cx - r * 0.7, cy + r * 0.05), fill="white")
    draw.ellipse((cx - r * 1.0, cy - r * 0.28, cx - r * 0.78, cy - r * 0.06), fill=eye)


def rocket(draw, cx, top, h, body, flame):
    w = h * 0.28
    draw.rounded_rectangle((cx - w / 2, top + h * 0.2, cx + w / 2, top + h * 0.85), radius=int(w * 0.3), fill=body)
    draw.polygon([(cx - w / 2, top + h * 0.22), (cx, top), (cx + w / 2, top + h * 0.22)], fill=body)
    draw.polygon([(cx - w * 0.9, top + h * 0.95), (cx - w / 2, top + h * 0.6), (cx - w / 2, top + h * 0.9)], fill=body)
    draw.polygon([(cx + w * 0.9, top + h * 0.95), (cx + w / 2, top + h * 0.6), (cx + w / 2, top + h * 0.9)], fill=body)
    draw.polygon([(cx - w * 0.3, top + h * 0.85), (cx, top + h * 1.15), (cx + w * 0.3, top + h * 0.85)], fill=flame)


def render(filename, bg, ink, accent, lines, domain, label):
    img = Image.new("RGB", (W, H), bg)
    d = ImageDraw.Draw(img)
    big = font("Geist-Black.ttf", 118)
    small = font("Geist-Medium.ttf", 34)
    tiny = font("Geist-Medium.ttf", 26)
    y = 110
    for line in lines:
        d.text((90, y), line, font=big, fill=ink)
        y += 128
    # Art slot
    if "rocket" in filename:
        d.rounded_rectangle((1000, 260, 1400, 1040), radius=70, fill=CHAR)
        d.rounded_rectangle((1030, 300, 1370, 1000), radius=48, fill=ORANGE)
        rocket(d, 1200, 330, 520, "white", YELLOW)
    else:
        d.rounded_rectangle((980, 520, 1480, 900), radius=28, fill="white" if bg != PAPER else NAVY)
        d.text((1010, 550), "</>  app.tsx", font=small, fill=BLUE)
        for i in range(6):
            d.rounded_rectangle((1010, 610 + i * 42, 1010 + 140 + (i * 53) % 260, 634 + i * 42), radius=8, fill=accent if i % 3 == 0 else "#9aa4b8")
        fish(d, 1130, 1010, 90, ORANGE, NAVY)
    d.text((90, H - 150), domain, font=small, fill=ink)
    d.text((90, H - 80), f"STAND-IN CREATIVE {label} · replace with the supplied artwork", font=tiny, fill=accent)
    OUT.mkdir(parents=True, exist_ok=True)
    img.save(OUT / filename, optimize=True)
    print("wrote", OUT / filename)


if __name__ == "__main__":
    for spec in CREATIVES:
        render(*spec)
