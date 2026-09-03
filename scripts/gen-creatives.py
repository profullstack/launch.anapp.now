import json, os, base64, urllib.request, sys
key = os.environ["OPENAI_API_KEY"]
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "marketing", "launch-anapp-now")
os.makedirs(OUT, exist_ok=True)
STYLE = ("Premium editorial tech campaign poster, flat vector illustration, bold geometric sans-serif typography, "
         "clean composition, high contrast, no watermark, no extra text beyond what is specified. The mascot is Chovy, "
         "a friendly cartoon anchovy fish in bright orange with a big eye and small fins.")
SPECS = {
  "creative-a-fish-builder.png": (
    "Warm off-white (#f6f2ea) background. Left side, large navy (#0a1230) uppercase headline on four lines exactly: "
    "'YOU DESCRIBE THE IDEA.' then 'WE HANDLE THE BUILD.' Right side: the orange Chovy anchovy fish sitting at a laptop, "
    "typing, with floating app UI cards (a login form, a dashboard chart, a mobile screen) around it in navy, blue (#2b6fe0) and orange. "
    "Bottom left small lowercase text exactly: 'launch.anapp.now'."),
  "creative-b-phone-rocket.png": (
    "Bright yellow (#ffd23f) to orange gradient background, very high energy. Center-right: a large smartphone with a white screen, "
    "a white rocket launching upward out of the screen with a small flame and motion lines. Left side, large charcoal (#111214) uppercase "
    "headline on three lines exactly: 'SHIP YOUR APP IDEA.' Bottom left small uppercase text exactly: 'LAUNCH.ANAPP.NOW'."),
  "creative-c-fish-no-code.png": (
    "Dark charcoal (#111214) background, editorial and moody with a subtle navy glow. Right side: a laptop showing a code editor window "
    "with colorful code lines, and the orange Chovy anchovy fish beside it looking at the viewer, relaxed. Left side, large off-white "
    "uppercase headline on five lines exactly: 'FROM IDEA TO APP —' 'WITHOUT LEARNING TO CODE.' Bottom left small lowercase text exactly: "
    "'launch.anapp.now' in blue (#2b6fe0)."),
}
for name, prompt in SPECS.items():
    body = json.dumps({"model": "gpt-image-2", "prompt": STYLE + " " + prompt, "size": "1536x1024", "quality": "high", "n": 1, "output_format": "png"}).encode()
    req = urllib.request.Request("https://api.openai.com/v1/images/generations", data=body, headers={"authorization": f"Bearer {key}", "content-type": "application/json"})
    try:
        r = json.load(urllib.request.urlopen(req, timeout=600))
        open(f"{OUT}/{name}", "wb").write(base64.b64decode(r["data"][0]["b64_json"]))
        print("ok", name, r.get("usage"), flush=True)
    except urllib.error.HTTPError as e:
        print("fail", name, e.code, e.read()[:300], flush=True)
